// Endpoint de prueba para verificar serverSupabaseServiceRole
export default defineEventHandler(async (event) => {
  try {
    console.log('🧪 Testing serverSupabaseServiceRole...')
    
    const { serverSupabaseServiceRole } = await import('#supabase/server')
    const supabase = serverSupabaseServiceRole(event)
    
    console.log('✅ Service role client created')
    
    // Test simple: intentar leer usuarios de auth
    const { data: users, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('❌ Error listando usuarios:', error)
      return { 
        success: false, 
        error: error.message,
        code: error.code 
      }
    }
    
    console.log('✅ Successfully listed users:', users.users.length)
    
    return { 
      success: true, 
      userCount: users.users.length,
      message: 'Service role working correctly'
    }
    
  } catch (error) {
    console.error('💥 Error in test:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
})