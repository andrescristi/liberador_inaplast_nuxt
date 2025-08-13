import type { H3Event } from 'h3'

export async function requireAdminAuth(event: H3Event) {
  const { serverSupabaseUser, serverSupabaseServiceRole } = await import('#supabase/server')
  
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autorizado. Se requiere autenticación.'
    })
  }

  const supabase = serverSupabaseServiceRole(event)
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('user_role')
    .eq('user_id', user.id)
    .single()

  if (error || !profile) {
    throw createError({
      statusCode: 403,
      statusMessage: 'No se pudo verificar el perfil del usuario.'
    })
  }

  if (profile.user_role !== 'Admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Acceso denegado. Se requieren permisos de administrador.'
    })
  }

  return user
}