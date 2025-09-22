import { verifyHybridAuth } from '../../../server/utils/hybrid-auth'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

/**
 * Endpoint para obtener la información del usuario autenticado actual
 * Usa sistema híbrido JWT + Session con fallback a Supabase Auth
 *
 * @returns Usuario con información de perfil o null si no está autenticado
 */
export default defineEventHandler(async (event) => {
  try {
    // Intentar verificación híbrida primero (JWT + Session)
    try {
      const auth = await verifyHybridAuth(event)

      if (auth) {
        // Obtener información completa del perfil usando service role
        const supabaseServiceRole = serverSupabaseServiceRole(event)
        const { data: profile, error: profileError } = await supabaseServiceRole
          .from('profiles')
          .select('first_name, last_name, user_role, created_at, updated_at')
          .eq('user_id', auth.userId)
          .single()

        if (profileError || !profile) {
          // Warning: No se pudo obtener perfil completo, retornando datos básicos
          return {
            user: {
              id: auth.userId,
              email: auth.email,
              role: auth.role
            },
            authenticated: true
          }
        }

        // Retornar información completa del usuario
        return {
          user: {
            id: auth.userId,
            email: auth.email,
            role: profile.user_role, // Usar el rol desde el perfil de la base de datos
            first_name: profile.first_name,
            last_name: profile.last_name,
            full_name: `${profile.first_name} ${profile.last_name}`,
            created_at: profile.created_at,
            updated_at: profile.updated_at
          },
          authenticated: true
        }
      }
    } catch (hybridAuthError) {
      // Si falla autenticación híbrida, intentar con Supabase como fallback
      // eslint-disable-next-line no-console
      console.log('Hybrid auth failed, trying Supabase fallback:', hybridAuthError)
    }

    // FALLBACK: Usar autenticación de Supabase directamente
    const supabaseUser = await serverSupabaseUser(event)

    if (!supabaseUser) {
      return {
        user: null,
        authenticated: false
      }
    }

    // Obtener información completa del perfil usando service role
    const supabaseServiceRole = serverSupabaseServiceRole(event)
    const { data: profile, error: profileError } = await supabaseServiceRole
      .from('profiles')
      .select('first_name, last_name, user_role, created_at, updated_at')
      .eq('user_id', supabaseUser.id)
      .single()

    if (profileError || !profile) {
      // Warning: No se pudo obtener perfil completo, retornando datos básicos
      return {
        user: {
          id: supabaseUser.id,
          email: supabaseUser.email,
          role: 'Inspector' // Rol por defecto si no se encuentra perfil
        },
        authenticated: true
      }
    }

    // Retornar información completa del usuario con datos de Supabase
    return {
      user: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        role: profile.user_role,
        first_name: profile.first_name,
        last_name: profile.last_name,
        full_name: `${profile.first_name} ${profile.last_name}`,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      },
      authenticated: true
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

    // Para cualquier otro error, retornar no autenticado
    // eslint-disable-next-line no-console
    console.error('Error en /api/auth/user:', error)
    return {
      user: null,
      authenticated: false
    }
  }
})