import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)
    const user = await serverSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Autenticación requerida'
      })
    }

    // Get current user's profile
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

    // Get profiles with auth user data for last login info
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_role, user_id, first_name, last_name')

    if (profilesError) {
      throw createError({
        statusCode: 500,
        statusMessage: `Error de base de datos: ${profilesError.message}`
      })
    }

    // Get auth users data for last sign in info
    const userIds = profiles.map(p => p.user_id)
    const authUsersPromises = userIds.map(id => 
      supabase.auth.admin.getUserById(id)
    )
    
    const authUsersResults = await Promise.all(authUsersPromises)
    const authUsers = authUsersResults
      .filter(result => result.data.user)
      .map(result => result.data.user!)

    // Get inspector activity data for the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const inspectorProfiles = profiles.filter(p => p.user_role === 'Inspector')
    
    // Get orders created by inspectors in the last 7 days (assuming orders represent inspections)
    const { data: recentOrders, error: ordersError } = await supabase
      .from('orders')
      .select('created_by, created_at')
      .gte('created_at', sevenDaysAgo.toISOString())

    if (ordersError) {
      // Could not fetch recent orders - using empty array
    }

    // Count inspections per inspector
    const inspectorActivity = inspectorProfiles.map(inspector => {
      const authUser = authUsers.find(u => u.id === inspector.user_id)
      const inspections = recentOrders ? recentOrders.filter(order => order.created_by === inspector.user_id).length : 0
      
      return {
        user_id: inspector.user_id,
        full_name: `${inspector.first_name} ${inspector.last_name}`,
        last_sign_in_at: authUser?.last_sign_in_at,
        inspections_last_7_days: inspections
      }
    })

    // Calculate statistics
    const stats = {
      total: profiles.length,
      admins: profiles.filter(p => p.user_role === 'Admin').length,
      supervisors: profiles.filter(p => p.user_role === 'Supervisor').length,
      inspectors: profiles.filter(p => p.user_role === 'Inspector').length,
      last_login_stats: {
        users_with_login_data: authUsers.filter(u => u.last_sign_in_at).length,
        most_recent_login: authUsers
          .filter(u => u.last_sign_in_at)
          .sort((a, b) => new Date(b.last_sign_in_at!).getTime() - new Date(a.last_sign_in_at!).getTime())[0]?.last_sign_in_at,
        users_never_logged_in: authUsers.filter(u => !u.last_sign_in_at).length
      },
      inspector_activity: {
        total_inspections_last_7_days: inspectorActivity.reduce((sum, inspector) => sum + inspector.inspections_last_7_days, 0),
        most_active_inspector: inspectorActivity.sort((a, b) => b.inspections_last_7_days - a.inspections_last_7_days)[0],
        inspectors_detail: inspectorActivity.sort((a, b) => b.inspections_last_7_days - a.inspections_last_7_days)
      }
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