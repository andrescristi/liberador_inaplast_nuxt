import { z } from 'zod'
import { authenticateUser } from '../../utils/hybrid-auth'
import { checkRateLimit, notifySuccessfulLogin } from '../../utils/rate-limiter'
import { authLogger, sanitizeForLog } from '../../utils/logger'
import { setupCSRF } from '../../utils/csrf'

/**
 * Endpoint de login con sistema híbrido JWT + Session
 *
 * POST /api/auth/login
 *
 * Autentica al usuario y devuelve:
 * - JWT para el cliente (almacenamiento local)
 * - Session ID como cookie (automático)
 *
 * Protecciones implementadas:
 * - Rate limiting por IP (20 intentos/15min)
 * - Rate limiting por email (5 intentos/15min)
 * - Validación de entrada con Zod
 */

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida')
})

export default defineEventHandler(async (event) => {
  // Solo permitir POST
  assertMethod(event, 'POST')

  try {
    // Validar datos de entrada
    const body = await readBody(event)
    const { email, password } = loginSchema.parse(body)

    // Verificar rate limiting antes de intentar autenticación
    await checkRateLimit(event, email)

    authLogger.info(
      sanitizeForLog({ email, method: event.method, path: event.path }),
      'Intento de login',
    )

    // Autenticar usuario
    const authData = await authenticateUser(event, email, password)

    // Resetear contador de rate limiting tras login exitoso
    notifySuccessfulLogin(email)

    authLogger.info(
      { email, userId: authData.user.id },
      'Login exitoso',
    )

    // Configurar protección CSRF para requests subsecuentes
    const csrfData = setupCSRF(event)

    // Configurar headers para compatibilidad
    setHeader(event, 'Cache-Control', 'private, no-cache, no-store, must-revalidate')
    setHeader(event, 'Expires', '0')
    setHeader(event, 'Pragma', 'no-cache')
    setHeader(event, 'Vary', 'User-Agent')

    // Responder con JWT y token CSRF (cookie se configura automáticamente)
    return {
      success: true,
      jwt: authData.jwt,
      user: authData.user,
      csrf_token: csrfData.csrf_token,
      message: 'Autenticación exitosa'
    }
    
  } catch (error) {
    authLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        path: event.path,
      },
      'Login falló',
    )

    // Si es un error de validación de Zod
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Datos inválidos',
        data: error.errors
      })
    }

    // Re-throw otros errores (como los de authenticateUser)
    throw error
  }
})