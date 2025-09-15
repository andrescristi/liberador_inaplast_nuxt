/**
 * API endpoint helper para limpiar datos de prueba
 * Solo para uso en tests E2E
 */
import { serverSupabaseServiceRole } from '#supabase/server'

interface CleanupRequest {
  table: string
  condition: Record<string, any>
}

const ALLOWED_TABLES = ['orders_tests', 'orders'] // Solo tablas permitidas para limpieza

export default defineEventHandler(async (event) => {
  try {
    // Validar método
    assertMethod(event, 'DELETE')
    
    // Solo permitir en desarrollo/testing
    if (process.env.NODE_ENV === 'production') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Endpoint de limpieza no disponible en producción'
      })
    }
    
    // Obtener datos del body
    const body = await readBody<CleanupRequest>(event)
    
    // Validar datos requeridos
    if (!body.table || !body.condition) {
      throw createError({
        statusCode: 400,
        statusMessage: 'table y condition son requeridos'
      })
    }
    
    // Validar tabla permitida
    if (!ALLOWED_TABLES.includes(body.table)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Tabla '${body.table}' no permitida. Tablas permitidas: ${ALLOWED_TABLES.join(', ')}`
      })
    }
    
    // Obtener cliente de Supabase con permisos de servicio
    const supabase = serverSupabaseServiceRole(event)
    
    // Construir query de eliminación
    let query = supabase.from(body.table).delete()
    
    // Aplicar condiciones
    for (const [key, value] of Object.entries(body.condition)) {
      query = query.eq(key, value)
    }
    
    const { error, count } = await query
    
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Error al limpiar datos de ${body.table}: ${error.message}`
      })
    }
    
    return {
      success: true,
      message: `${count || 0} registros eliminados de ${body.table}`,
      table: body.table,
      deletedCount: count || 0
    }
    
  } catch (error) {
    // Si es un error de createError, re-lanzarlo
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    // Error genérico
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor en limpieza'
    })
  }
})