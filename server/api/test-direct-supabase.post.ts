// Test directo con cliente Supabase sin framework
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, first_name, last_name, user_role: _user_role } = body
  
  console.log('🧪 Testing DIRECT Supabase client:', { email })

  try {
    // Crear cliente Supabase directamente
    const supabaseUrl = 'https://ohgyqnxrtvjjambumksj.supabase.co'
    const serviceRoleKey = process.env.SUPABASE_SERVICE_KEY
    
    if (!serviceRoleKey) {
      throw new Error('Service Role Key not found')
    }
    
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    console.log('🔑 Direct Supabase client created')
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email || `test-direct-${Date.now()}@example.com`,
      password: password || 'TestPassword123!',
      email_confirm: true,
      user_metadata: {
        first_name: first_name || 'Direct',
        last_name: last_name || 'Test',
        admin_created: true
      }
    })

    if (authError) {
      console.error('❌ Direct client error:', authError)
      return { 
        success: false, 
        error: authError.message,
        code: authError.code,
        status: authError.status,
        details: authError
      }
    }

    console.log('✅ Direct client success:', authData.user.id)

    return { 
      success: true, 
      user: {
        id: authData.user.id,
        email: authData.user.email
      },
      message: 'User created successfully with direct client'
    }
    
  } catch (error: unknown) {
    console.error('💥 Error in direct test:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
})