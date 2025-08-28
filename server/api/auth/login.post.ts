import { serverSupabaseClient } from '#supabase/server'

/**
 * Endpoint para manejar el inicio de sesión del usuario
 * Procesa la autenticación con Supabase desde el servidor
 * 
 * @returns Confirmación de login exitoso con datos del usuario
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email y contraseña son requeridos'
      })
    }

    const supabase = await serverSupabaseClient(event)

    // Realizar login con Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })

    if (error) {
      // Mapear errores comunes de Supabase a mensajes en español
      let errorMessage = error.message
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.'
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor confirma tu email antes de iniciar sesión.'
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Demasiados intentos. Intenta de nuevo en unos minutos.'
      }

      throw createError({
        statusCode: 400,
        statusMessage: errorMessage
      })
    }

    // Opcional: Log del evento para auditoría
    if (import.meta.server && data.user) {
      try {
        const logger = event.context.logger
        if (logger && typeof logger.info === 'function') {
          logger.info({
            userId: data.user.id,
            userEmail: data.user.email,
            timestamp: new Date().toISOString(),
            context: 'auth/login.post'
          }, 'User logged in successfully')
        }
      } catch {
        // Error silencioso en logging - no debe afectar el login
      }
    }

    return {
      success: true,
      message: 'Inicio de sesión exitoso',
      user: data.user,
      session: data.session
    }
  } catch (error: unknown) {
    // Si es un error de createError, re-lanzarlo
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Para otros errores, crear error genérico
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    throw createError({
      statusCode: 500,
      statusMessage: `Error interno durante login: ${errorMessage}`
    })
  }
})