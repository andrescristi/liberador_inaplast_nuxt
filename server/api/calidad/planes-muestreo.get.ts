/**
 * API Endpoint: GET /api/calidad/planes-muestreo
 * 
 * Consulta planes de muestreo basados en el tamaño del lote para control de calidad.
 * Realiza cruce entre tablas grupos_muestreo y planes_de_muestreo siguiendo la lógica:
 * 1. Filtrar grupos_muestreo por rango de tamaño de lote
 * 2. Seleccionar nivel de inspección S1
 * 3. Obtener plan de muestreo con AQL 1.5
 * 
 * @route GET /api/calidad/planes-muestreo
 * @access Public - No requiere autenticación
 * 
 * @param {QueryParams} query - Parámetros de consulta
 * @param {number} query.tamano_lote - Tamaño del lote a inspeccionar (requerido)
 * 
 * @returns {PlanMuestreoResponse} Datos del plan de muestreo encontrado
 * @returns {number} tamano_muestra - Tamaño de la muestra a tomar
 * @returns {number} numero_maximo_fallas - Número máximo de fallas permitidas
 * @returns {string} tipo_inspeccion - Tipo de inspección a realizar
 * @returns {number} tamano_lote_desde - Rango mínimo del tamaño de lote
 * @returns {number} tamano_lote_hasta - Rango máximo del tamaño de lote
 * @returns {string} nivel_inspeccion - Nivel de inspección (S1)
 * @returns {string} codigo_plan_muestreo - Código del plan de muestreo
 * 
 * @throws {400} Input inválido - tamano_lote no válido o faltante
 * @throws {404} No encontrado - No existe plan para el tamaño de lote
 * @throws {500} Error de base de datos - Problemas con consultas o conexión
 * 
 * @example
 * ```
 * // Consultar plan para lote de 500 unidades
 * GET /api/calidad/planes-muestreo?tamano_lote=500
 * 
 * // Respuesta exitosa:
 * {
 *   "tamano_muestra": 32,
 *   "numero_maximo_fallas": 2,
 *   "tipo_inspeccion": "Normal",
 *   "tamano_lote_desde": 281,
 *   "tamano_lote_hasta": 500,
 *   "nivel_inspeccion": "S1",
 *   "codigo_plan_muestreo": "C"
 * }
 * 
 * // Error por lote no válido:
 * {
 *   "error": "El tamaño del lote debe ser un número positivo",
 *   "code": "INVALID_LOTE_SIZE"
 * }
 * 
 * // Error por plan no encontrado:
 * {
 *   "error": "No se encontró un plan de muestreo para el tamaño de lote especificado",
 *   "code": "PLAN_NOT_FOUND"
 * }
 * ```
 * 
 * @since v1.0.0
 */

interface PlanMuestreoResponse {
  tamano_muestra: number
  numero_maximo_fallas: number
  tipo_inspeccion: string
  tamano_lote_desde: number
  tamano_lote_hasta: number
  nivel_inspeccion: string
  codigo_plan_muestreo: string
}

interface ErrorResponse {
  error: string
  code: string
}

export default defineEventHandler(async (event): Promise<PlanMuestreoResponse | ErrorResponse> => {
  try {
    // Extraer parámetros de query
    const query = getQuery(event)
    const { tamano_lote } = query

    // Validar que el parámetro tamano_lote esté presente
    if (!tamano_lote) {
      throw createError({
        statusCode: 400,
        statusMessage: JSON.stringify({
          error: "El parámetro 'tamano_lote' es requerido",
          code: "MISSING_LOTE_SIZE"
        })
      })
    }

    // Convertir a número y validar
    const tamanoLoteNumber = Number(tamano_lote)
    
    if (isNaN(tamanoLoteNumber) || tamanoLoteNumber <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: JSON.stringify({
          error: "El tamaño del lote debe ser un número positivo",
          code: "INVALID_LOTE_SIZE"
        })
      })
    }

    // Obtener cliente de Supabase
    const { serverSupabaseServiceRole } = await import('#supabase/server')
    const supabase = serverSupabaseServiceRole(event)
    
    // PASO 1: Buscar en grupos_muestreo por rango de tamaño y nivel S1
    const { data: grupoMuestreo, error: grupoError } = await supabase
      .from('grupos_muestreo')
      .select('*')
      .lte('tamano_lote_desde', tamanoLoteNumber)
      .gte('tamano_lote_hasta', tamanoLoteNumber)
      .eq('nivel_inspeccion', 'S1')
      .single()

    if (grupoError || !grupoMuestreo) {
      // Si hay error SQL específico, lo registramos pero devolvemos mensaje genérico
      console.error('Error consultando grupos_muestreo:', grupoError)
      
      throw createError({
        statusCode: 404,
        statusMessage: JSON.stringify({
          error: "No se encontró un grupo de muestreo para el tamaño de lote especificado con nivel de inspección S1",
          code: "GRUPO_NOT_FOUND"
        })
      })
    }
    
    // PASO 2: Buscar en planes_de_muestreo usando el código obtenido y AQL 1.5
    const { data: planMuestreo, error: planError } = await supabase
      .from('planes_de_muestreo')
      .select('*')
      .eq('codigo', grupoMuestreo.codigo_plan_muestreo)
      .eq('aql', '1,5')
      .single()

    if (planError || !planMuestreo) {
      // Si hay error SQL específico, lo registramos pero devolvemos mensaje genérico
      console.error('Error consultando planes_de_muestreo:', planError)
      
      throw createError({
        statusCode: 404,
        statusMessage: JSON.stringify({
          error: "No se encontró un plan de muestreo con AQL 1.5 para el código de plan especificado",
          code: "PLAN_NOT_FOUND"
        })
      })
    }

    // PASO 3: Construir respuesta exitosa
    const response: PlanMuestreoResponse = {
      tamano_muestra: planMuestreo.tamano_muestra,
      numero_maximo_fallas: planMuestreo.numero_maximo_fallas,
      tipo_inspeccion: grupoMuestreo.tipo_de_inspeccion || 'Normal',
      tamano_lote_desde: grupoMuestreo.tamano_lote_desde,
      tamano_lote_hasta: grupoMuestreo.tamano_lote_hasta,
      nivel_inspeccion: grupoMuestreo.nivel_inspeccion,
      codigo_plan_muestreo: grupoMuestreo.codigo_plan_muestreo
    }

    return response

  } catch (error: unknown) {
    // Si el error ya fue creado por nosotros (con createError), lo re-lanzamos
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Para errores inesperados, registrar y devolver error genérico
    console.error('Error inesperado en planes-muestreo endpoint:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: JSON.stringify({
        error: "Error interno del servidor al consultar planes de muestreo",
        code: "INTERNAL_SERVER_ERROR"
      })
    })
  }
})