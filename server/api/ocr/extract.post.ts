import { GoogleGenAI } from '@google/genai'

interface OCRRequest {
  imageData: string
  mimeType: string
  filename?: string
}

interface ProductionData {
  lote?: string
  cliente?: string
  producto?: string
  pedido?: string
  fechaFabricacion?: Date | string
  codigoProducto?: string
  turno?: string
  unidades?: string
  jefeTurno?: string
  ordenCompra?: string
  numeroOperario?: string
  maquina?: string
  inspectorCalidad?: string
}

interface OCRResponse {
  text: string
  productionData?: ProductionData
  success: boolean
  error?: string
  metadata?: {
    filename?: string
    processedAt: string
    model: string
  }
}

export default defineEventHandler(async (event): Promise<OCRResponse> => {
  try {
    // Solo acepta métodos POST
    if (event.node.req.method !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Método no permitido'
      })
    }

    // Leer el cuerpo de la petición
    const body = await readBody<OCRRequest>(event)

    // Validar los datos requeridos
    if (!body.imageData || !body.mimeType) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Faltan datos requeridos: imageData y mimeType'
      })
    }

    // Verificar que la API key esté configurada
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'API key de Gemini no configurada'
      })
    }

    // Validar tipo de imagen
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/gif']
    if (!validMimeTypes.includes(body.mimeType)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tipo de archivo no soportado. Use JPG, PNG, WEBP, BMP o GIF'
      })
    }

    // Inicializar el cliente de Gemini
    const ai = new GoogleGenAI({ apiKey })

    // Crear el objeto Part para la imagen
    const imagePart = {
      inlineData: {
        data: body.imageData.replace(/^data:image\/[a-z]+;base64,/, ''), // Remover el prefijo data URL si existe
        mimeType: body.mimeType,
      },
    }

    // Prompt optimizado para OCR de etiquetas de producción
    const prompt = `
Analiza esta imagen que contiene una etiqueta o documento de producción industrial y extrae la información estructurada.

Busca y extrae los siguientes campos específicos:
- Lote
- Cliente  
- Producto
- Pedido
- Fecha Fabricación (o Fecha de Fabricación)
- Código Producto (o Código de Producto)
- Turno
- Unidades
- Jefe de Turno (o Jefe Turno)
- Orden de Compra (o Orden Compra)
- N° Operario (o Número Operario, Operario)
- Máquina
- Inspector de Calidad (o Inspector Calidad)

Devuelve el resultado en formato JSON estricto con esta estructura:
{
  "productionData": {
    "lote": "valor encontrado o null",
    "cliente": "valor encontrado o null",
    "producto": "valor encontrado o null",
    "pedido": "valor encontrado o null",
    "fechaFabricacion": "fecha en formato ISO (YYYY-MM-DD) o null",
    "codigoProducto": "valor encontrado o null",
    "turno": "valor encontrado o null",
    "unidades": "valor encontrado o null",
    "jefeTurno": "valor encontrado o null",
    "ordenCompra": "valor encontrado o null",
    "numeroOperario": "valor encontrado o null",
    "maquina": "valor encontrado o null",
    "inspectorCalidad": "valor encontrado o null"
  },
  "rawText": "todo el texto extraído concatenado"
}

Instrucciones:
- Si no encuentras un campo específico, asigna null
- Extrae solo el valor, no incluyas la etiqueta del campo
- Para fechas, devuelve en formato ISO (YYYY-MM-DD)
- Reconoce variaciones en los nombres de campos
- Solo devuelve el JSON, sin explicaciones adicionales

JSON:
`

    // Llamar a la API de Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp', // Usando el modelo más reciente disponible
      contents: [imagePart, prompt],
    })

    // Extraer el texto de la respuesta
    const rawResponse = response.text?.trim() || ''

    if (!rawResponse) {
      return {
        text: '',
        success: false,
        error: 'No se pudo extraer texto de la imagen',
        metadata: {
          filename: body.filename,
          processedAt: new Date().toISOString(),
          model: 'gemini-2.0-flash-exp'
        }
      }
    }

    try {
      // Intentar parsear el JSON de la respuesta
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        // Si no hay JSON, usar el texto tal como está
        return {
          text: rawResponse,
          success: true,
          metadata: {
            filename: body.filename,
            processedAt: new Date().toISOString(),
            model: 'gemini-2.0-flash-exp'
          }
        }
      }

      const parsedData = JSON.parse(jsonMatch[0])
      
      // Validar estructura del JSON
      if (parsedData.productionData) {
        const productionData: ProductionData = {
          lote: parsedData.productionData.lote || null,
          cliente: parsedData.productionData.cliente || null,
          producto: parsedData.productionData.producto || null,
          pedido: parsedData.productionData.pedido || null,
          fechaFabricacion: parsedData.productionData.fechaFabricacion || null,
          codigoProducto: parsedData.productionData.codigoProducto || null,
          turno: parsedData.productionData.turno || null,
          unidades: parsedData.productionData.unidades || null,
          jefeTurno: parsedData.productionData.jefeTurno || null,
          ordenCompra: parsedData.productionData.ordenCompra || null,
          numeroOperario: parsedData.productionData.numeroOperario || null,
          maquina: parsedData.productionData.maquina || null,
          inspectorCalidad: parsedData.productionData.inspectorCalidad || null
        }

        return {
          text: parsedData.rawText || '',
          productionData,
          success: true,
          metadata: {
            filename: body.filename,
            processedAt: new Date().toISOString(),
            model: 'gemini-2.0-flash-exp'
          }
        }
      }
    } catch {
      // Si hay error parseando JSON, usar el texto raw
    }

    return {
      text: rawResponse,
      success: true,
      metadata: {
        filename: body.filename,
        processedAt: new Date().toISOString(),
        model: 'gemini-2.0-flash-exp'
      }
    }

  } catch (error: unknown) {

    // Manejar errores específicos de la API de Gemini
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as { status: number }).status
      throw createError({
        statusCode: status,
        statusMessage: `Error de Gemini API: ${error && typeof error === 'object' && 'message' in error ? (error as { message: string }).message : 'Error desconocido'}`
      })
    }

    // Error genérico
    throw createError({
      statusCode: 500,
      statusMessage: `Error procesando la imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`
    })
  }
})