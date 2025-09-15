import { z } from 'zod'
import { authenticateUser } from '../../utils/hybrid-auth'

/**
 * Endpoint de login con sistema híbrido JWT + Session
 * 
 * POST /api/auth/login
 * 
 * Autentica al usuario y devuelve:
 * - JWT para el cliente (almacenamiento local)
 * - Session ID como cookie (automático)
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
    
    // Login attempt logged
    
    // Autenticar usuario
    const authData = await authenticateUser(event, email, password)
    
    // Configurar headers para compatibilidad
    setHeader(event, 'Cache-Control', 'private, no-cache, no-store, must-revalidate')
    setHeader(event, 'Expires', '0')
    setHeader(event, 'Pragma', 'no-cache')
    setHeader(event, 'Vary', 'User-Agent')
    
    // Login successful
    
    // Responder con JWT (cookie se configura automáticamente)
    return {
      success: true,
      jwt: authData.jwt,
      user: authData.user,
      message: 'Autenticación exitosa'
    }
    
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Login failed:', error)
    
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