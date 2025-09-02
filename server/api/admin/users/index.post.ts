import { requireAdminAuth as _requireAdminAuth } from '../../../utils/auth'
import { serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // POST /api/admin/users - Iniciando creación de usuario
  
  const body = await readBody(event)
  const { email, password, first_name, last_name, user_role } = body
  // Datos recibidos para validación

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
    // Verificar autenticación del usuario
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No autorizado. Se requiere autenticación.'
      })
    }
    // Usuario autenticado
    
    // Usar cliente de servicio del módulo Nuxt Supabase
    const supabase = serverSupabaseServiceRole(event)
    // Cliente Supabase de servicio inicializado
    
    // Verificar permisos de admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      // Error verificando perfil
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
    // Permisos de admin verificados

    // Creando usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name,
        admin_created: true  // Marker para el hook de auth
      }
    })

    if (authError) {
      // Error al crear usuario Auth
      throw createError({
        statusCode: 400,
        statusMessage: `Error de autenticación: ${authError.message}`
      })
    }

    if (!authData.user) {
      // No se creó el usuario Auth
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al crear cuenta de usuario'
      })
    }

    // Usuario Auth creado exitosamente

    // Primero verificar si ya existe el perfil
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', authData.user.id)
      .single()

    let profileData
    if (existingProfile) {
      // Actualizando perfil existente
      const { data: updateData, error: profileError } = await supabase
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
        // Error al actualizar perfil
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw createError({
          statusCode: 500,
          statusMessage: `Error al actualizar perfil: ${profileError.message}`
        })
      }
      profileData = updateData
    } else {
      // Creando nuevo perfil
      const { data: insertData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          first_name,
          last_name,
          user_role
        })
        .select()
        .single()

      if (profileError) {
        // Error al crear perfil
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw createError({
          statusCode: 500,
          statusMessage: `Error al crear perfil: ${profileError.message}`
        })
      }
      profileData = insertData
    }

    // Perfil procesado exitosamente

    const result = {
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
    
    // Usuario creado exitosamente
    return result
  } catch (error: unknown) {
    // Error en creación de usuario
    const statusCode = error && typeof error === 'object' && 'statusCode' in error ? (error.statusCode as number) : 500
    const statusMessage = error && typeof error === 'object' && 'statusMessage' in error ? (error.statusMessage as string) : 'Error al crear usuario'
    throw createError({
      statusCode,
      statusMessage
    })
  }
})