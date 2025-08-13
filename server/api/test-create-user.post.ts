// Endpoint de prueba para crear usuario sin autenticación previa
export default defineEventHandler(async (event) => {
  try {
    console.log('🧪 Testing user creation directly...')
    
    const { serverSupabaseServiceRole } = await import('#supabase/server')
    const supabase = serverSupabaseServiceRole(event)
    
    const testEmail = `test${Date.now()}@example.com`
    
    console.log('👤 Attempting to create user:', testEmail)
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: "TestPass123.*",
      email_confirm: true,
      user_metadata: {
        first_name: "Test",
        last_name: "User",
        admin_created: true
      }
    })
    
    if (authError) {
      console.error('❌ Auth error:', authError)
      return { 
        success: false, 
        error: authError.message,
        code: authError.code,
        status: authError.status
      }
    }
    
    console.log('✅ User created successfully:', authData.user.id)
    
    // Verificar si se creó el perfil
    await new Promise(resolve => setTimeout(resolve, 500))
    
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
      message: 'User created successfully'
    }
    
  } catch (error) {
    console.error('💥 Error in test:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
})