export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, first_name, last_name, user_role } = body

  if (!email || !password || !first_name || !last_name || !user_role) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: email, password, first_name, last_name, user_role'
    })
  }

  if (!['Admin', 'Supervisor', 'Inspector'].includes(user_role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user role. Must be Admin, Supervisor, or Inspector'
    })
  }

  try {
    const supabase = serverSupabaseServiceRole(event)

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name
      }
    })

    if (authError) {
      throw createError({
        statusCode: 400,
        statusMessage: `Authentication error: ${authError.message}`
      })
    }

    if (!authData.user) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create user account'
      })
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name,
        last_name,
        user_role
      })
      .eq('user_id', authData.user.id)
      .select()
      .single()

    if (profileError) {
      await supabase.auth.admin.deleteUser(authData.user.id)
      throw createError({
        statusCode: 500,
        statusMessage: `Profile creation error: ${profileError.message}`
      })
    }

    return {
      id: profileData.id,
      user_id: profileData.user_id,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      user_role: profileData.user_role,
      created_at: profileData.created_at,
      updated_at: profileData.updated_at,
      full_name: `${profileData.first_name} ${profileData.last_name}`,
      email: authData.user.email
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to create user'
    })
  }
})