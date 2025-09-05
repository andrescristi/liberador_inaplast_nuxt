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
    const supabase = serverSupabaseClient(event)

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

    // Obtener perfil completo desde la base de datos
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
        statusCode: 404,
        statusMessage: 'Perfil de usuario no encontrado'
      })
    }

    // Configurar sesión usando nuxt-auth-utils
    await setUserSession(event, {
      user: {
        id: data.user.id,
        email: data.user.email!,
        user_role: profile.user_role as 'Admin' | 'Supervisor' | 'Inspector',
        first_name: profile.first_name,
        last_name: profile.last_name
      },
      loggedInAt: new Date().toISOString(),
      profileLoaded: true
    }, {
      // Datos seguros solo en servidor
      secure: {
        supabaseAccessToken: data.session?.access_token,
        supabaseRefreshToken: data.session?.refresh_token
      }
    })

    return {
      success: true,
      message: 'Login exitoso',
      user: {
        id: data.user.id,
        email: data.user.email,
        user_role: profile.user_role,
        first_name: profile.first_name,
        last_name: profile.last_name
      }
    }
  } catch (error: unknown) {
    // Manejar errores de validación de Zod
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: error.errors[0]?.message || 'Datos inválidos'
      })
    }

    // Re-lanzar errores de createError
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Error genérico
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    throw createError({
      statusCode: 500,
      statusMessage: `Error interno: ${errorMessage}`
    })
  }
})