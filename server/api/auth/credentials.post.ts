import { serverSupabaseClient } from '#supabase/server'
import { z } from 'zod'

// Schema para validación de credenciales
const credentialsSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña muy corta')
})

/**
 * Endpoint personalizado para autenticación con credenciales
 * Integra Supabase con nuxt-auth-utils para mantener compatibilidad
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validar entrada
    const { email, password } = credentialsSchema.parse(body)

    // Inicializar Supabase
    const supabase = await serverSupabaseClient(event)

    // Autenticar con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })

    if (error) {
      throw createError({
        statusCode: 401,
        statusMessage: error.message.includes('Invalid login credentials')
          ? 'Credenciales incorrectas'
          : 'Error de autenticación'
      })
    }

    if (!data.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No se pudo obtener información del usuario'
      })
    }

    // Obtener perfil del usuario desde la tabla profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        id,
        user_id,
        first_name,
        last_name,
        user_role,
        created_at,
        updated_at
      `)
      .eq('user_id', data.user.id)
      .single()

    if (profileError || !profile) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Perfil de usuario no encontrado'
      })
    }

    // Configurar sesión de usuario con nuxt-auth-utils
    await setUserSession(event, {
      user: {
        id: data.user.id,
        email: data.user.email!,
        first_name: profile.first_name,
        last_name: profile.last_name,
        user_role: profile.user_role,
        full_name: `${profile.first_name} ${profile.last_name}`.trim()
      }
    })

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email!,
        first_name: profile.first_name,
        last_name: profile.last_name,
        user_role: profile.user_role,
        full_name: `${profile.first_name} ${profile.last_name}`.trim()
      }
    }

  } catch (error) {
    // Manejo de diferentes tipos de errores
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Datos de entrada inválidos: ' + error.errors.map(e => e.message).join(', ')
      })
    }

    // Si es un error de createError, re-lanzarlo
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Error genérico
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor: ' + errorMessage
    })
  }
})