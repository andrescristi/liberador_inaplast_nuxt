import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { z } from 'zod'

const updatePasswordSchema = z.object({
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient(event)
    const user = await serverSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Autenticación requerida'
      })
    }

    const body = await readBody(event)
    
    // Validar los datos de entrada
    const validationResult = updatePasswordSchema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message).join(', ')
      throw createError({
        statusCode: 400,
        statusMessage: errors
      })
    }

    const { password } = validationResult.data

    // Actualizar la contraseña del usuario autenticado
    const { error } = await supabase.auth.updateUser({
      password
    })

    if (error) {
      // Mapear errores específicos de Supabase
      if (error.message.includes('password')) {
        throw createError({
          statusCode: 400,
          statusMessage: `Error en la contraseña: ${error.message}`
        })
      }
      
      if (error.message.includes('rate_limit') || error.message.includes('rate limit')) {
        throw createError({
          statusCode: 429,
          statusMessage: 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.'
        })
      }

      if (error.message.includes('session')) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Sesión expirada. Por favor, inicia sesión nuevamente.'
        })
      }

      throw createError({
        statusCode: 500,
        statusMessage: `Error actualizando contraseña: ${error.message}`
      })
    }

    return { 
      success: true, 
      message: 'Contraseña actualizada exitosamente' 
    }
  } catch (error: unknown) {
    // Si ya es un error creado por nosotros, re-lanzarlo
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    // Para cualquier otro error inesperado
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})