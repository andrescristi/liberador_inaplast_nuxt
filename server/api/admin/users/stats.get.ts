import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '../../../../types/database.types'

export default defineEventHandler(async (event) => {
  try {
    // Create service role client for all operations (bypasses RLS)
    const supabase = serverSupabaseServiceRole<Database>(event)
    const user = await serverSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Autenticación requerida'
      })
    }

    // Check if user is admin using service role client
    const { data: currentUserProfile, error: currentUserError } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('user_id', user.id)
      .single()

    if (currentUserError || !currentUserProfile) {
      throw createError({
        statusCode: 403,
        statusMessage: 'No se pueden verificar los permisos del usuario'
      })
    }

    // Only admins can view user statistics
    if (currentUserProfile.user_role !== 'Admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Solo los administradores pueden ver las estadísticas de usuarios'
      })
    }

    // Get user role counts using service role client (bypasses RLS)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_role')

    if (profilesError) {
      throw createError({
        statusCode: 500,
        statusMessage: `Error de base de datos: ${profilesError.message}`
      })
    }
    
    // Count users by role
    const stats = {
      total: profiles.length,
      admins: profiles.filter(p => p.user_role === 'Admin').length,
      supervisors: profiles.filter(p => p.user_role === 'Supervisor').length,
      inspectors: profiles.filter(p => p.user_role === 'Inspector').length
    }

    return stats
  } catch (error: unknown) {
    const statusCode = error && typeof error === 'object' && 'statusCode' in error ? (error.statusCode as number) : 500
    const statusMessage = error && typeof error === 'object' && 'statusMessage' in error ? (error.statusMessage as string) : 'Error al obtener estadísticas de usuarios'
    throw createError({
      statusCode,
      statusMessage
    })
  }
})