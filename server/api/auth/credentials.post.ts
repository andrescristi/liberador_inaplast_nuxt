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
  console.log('[DEBUG] credentials.post.ts - Inicio del handler')
  try {
    const body = await readBody(event)
    console.log('[DEBUG] credentials.post.ts - Body recibido:', { email: body.email, password: '[HIDDEN]' })
    
    // Validar entrada
    const { email, password } = credentialsSchema.parse(body)
    console.log('[DEBUG] credentials.post.ts - Validación exitosa')

    // Inicializar Supabase
    const supabase = await serverSupabaseClient(event)
    console.log('[DEBUG] credentials.post.ts - Supabase client inicializado')

    // Autenticar con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })
    console.log('[DEBUG] credentials.post.ts - Respuesta Supabase:', { success: !error, error: error?.message })

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
    console.log('[DEBUG] credentials.post.ts - Obteniendo perfil para user_id:', data.user.id)
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

    console.log('[DEBUG] credentials.post.ts - Respuesta perfil:', { success: !profileError, error: profileError?.message })

    if (profileError || !profile) {
      console.log('[DEBUG] credentials.post.ts - Error: Perfil no encontrado')
      throw createError({
        statusCode: 404,
        statusMessage: 'Perfil de usuario no encontrado'
      })
    }

    // Configurar sesión usando nuxt-auth-utils
    console.log('[DEBUG] credentials.post.ts - Configurando sesión de usuario')
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
    })
    console.log('[DEBUG] credentials.post.ts - Sesión configurada exitosamente')

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
    console.log('[DEBUG] credentials.post.ts - Error capturado:', error)
    
    // Manejar errores de validación de Zod
    if (error instanceof z.ZodError) {
      console.log('[DEBUG] credentials.post.ts - Error de validación Zod:', error.errors)
      throw createError({
        statusCode: 400,
        statusMessage: error.errors[0]?.message || 'Datos inválidos'
      })
    }

    // Re-lanzar errores de createError
    if (error && typeof error === 'object' && 'statusCode' in error) {
      console.log('[DEBUG] credentials.post.ts - Re-lanzando error de createError')
      throw error
    }

    // Error genérico
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    console.log('[DEBUG] credentials.post.ts - Error genérico:', errorMessage)
    throw createError({
      statusCode: 500,
      statusMessage: `Error interno: ${errorMessage}`
    })
  }
})