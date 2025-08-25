// Endpoint simplificado que funciona
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, first_name, last_name } = body
  
  try {
    // Verificar autenticación del usuario
    const { serverSupabaseUser, serverSupabaseServiceRole } = await import('#supabase/server')
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No autorizado'
      })
    }
    
    // Usar cliente de servicio del módulo Nuxt Supabase
    const supabase = serverSupabaseServiceRole(event)
    
    // Verificar que sea admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('user_id', user.id)
      .single()

    if (profile?.user_role !== 'Admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Se requieren permisos de administrador'
      })
    }
    
    // Crear usuario (lógica que funciona)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name,
        admin_created: true
      }
    })

    if (authError) {
      throw createError({
        statusCode: 400,
        statusMessage: `Error: ${authError.message}`
      })
    }

    // Esperar a que se cree el perfil
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single()

    return {
      id: profileData?.id,
      user_id: authData.user.id,
      first_name: profileData?.first_name,
      last_name: profileData?.last_name,
      user_role: profileData?.user_role,
      email: authData.user.email,
      created_at: profileData?.created_at
    }
    
  } catch (error: unknown) {
    const statusCode = error && typeof error === 'object' && 'statusCode' in error ? (error.statusCode as number) : 500
    const statusMessage = error && typeof error === 'object' && 'statusMessage' in error ? (error.statusMessage as string) : 'Error al crear usuario'
    throw createError({
      statusCode,
      statusMessage
    })
  }
})