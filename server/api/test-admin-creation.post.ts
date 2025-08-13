// Endpoint de prueba que copia la lógica de admin pero sin autenticación
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, first_name, last_name, user_role } = body
  
  console.log('🧪 Testing admin creation logic:', { email, first_name, last_name, user_role })

  // Validación estricta de campos requeridos
  if (!email || !password || !first_name || !last_name || !user_role) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Faltan campos requeridos: email, password, first_name, last_name, user_role'
    })
  }

  // Validación de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email inválido'
    })
  }

  // Validación de contraseña
  if (password.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: 'La contraseña debe tener al menos 8 caracteres'
    })
  }

  if (!['Admin', 'Supervisor', 'Inspector'].includes(user_role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Rol de usuario inválido. Debe ser Admin, Supervisor o Inspector'
    })
  }

  try {
    const { serverSupabaseServiceRole } = await import('#supabase/server')
    const supabase = serverSupabaseServiceRole(event)
    
    console.log('👤 Creando usuario en Auth...')
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
      console.error('❌ Error al crear usuario Auth:', authError)
      throw createError({
        statusCode: 400,
        statusMessage: `Error de autenticación: ${authError.message}`
      })
    }

    if (!authData.user) {
      console.error('❌ No se creó el usuario Auth')
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al crear cuenta de usuario'
      })
    }

    console.log('✅ Usuario Auth creado:', authData.user.id)

    // Esperar un poco para que se ejecute el trigger
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Verificar si se creó el perfil
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single()

    return { 
      success: true, 
      user: {
        id: authData.user.id,
        email: authData.user.email
      },
      profile: profile,
      message: 'User created successfully via admin logic'
    }
    
  } catch (error: unknown) {
    console.error('💥 Error en test admin creation:', error)
    const statusCode = error && typeof error === 'object' && 'statusCode' in error ? (error.statusCode as number) : 500
    const statusMessage = error && typeof error === 'object' && 'statusMessage' in error ? (error.statusMessage as string) : 'Error al crear usuario'
    throw createError({
      statusCode,
      statusMessage
    })
  }
})