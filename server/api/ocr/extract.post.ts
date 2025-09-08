import { GoogleGenAI } from '@google/genai'
import sharp from 'sharp'

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
  jefe_de_turno?: string
  orden_de_compra?: string
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
    processingTimeMs?: number
    originalSizeKB?: number
    finalSizeKB?: number
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
    
    // Configurar headers específicos para este endpoint
    setHeader(event, 'Access-Control-Max-Age', '3600')
    setHeader(event, 'X-Content-Type-Options', 'nosniff')
    
    // Log de inicio de procesamiento
    const startTime = Date.now()
    console.log('🔍 Iniciando procesamiento OCR...')

    // Leer el cuerpo de la petición con timeout y límite de tamaño
    const body = await readBody<OCRRequest>(event)
    
    // Log del tamaño de payload recibido
    const payloadSize = JSON.stringify(body).length
    console.log(`📊 Payload recibido: ${(payloadSize / 1024 / 1024).toFixed(2)}MB`)

    // Validar los datos requeridos
    if (!body.imageData || !body.mimeType) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Faltan datos requeridos: imageData y mimeType'
      })
    }

    // Verificar que la API key esté configurada
    const apiKey = process.env.NUXT_GEMINI_API_KEY
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

    // Función para comprimir imagen usando Sharp
    const compressImage = async (base64Data: string): Promise<{ data: string, size: number }> => {
      try {
        // Convertir base64 a buffer
        const imageBuffer = Buffer.from(base64Data, 'base64')
        
        // Comprimir imagen con Sharp
        const compressedBuffer = await sharp(imageBuffer)
          .jpeg({ 
            quality: 80, 
            progressive: true,
            mozjpeg: true 
          })
          .resize(1920, 1080, { 
            fit: 'inside', 
            withoutEnlargement: true 
          })
          .toBuffer()

        // Si la imagen comprimida sigue siendo > 300KB, reducir calidad
        let finalBuffer = compressedBuffer
        if (compressedBuffer.length > 300 * 1024) {
          finalBuffer = await sharp(imageBuffer)
            .jpeg({ 
              quality: 60, 
              progressive: true,
              mozjpeg: true 
            })
            .resize(1280, 720, { 
              fit: 'inside', 
              withoutEnlargement: true 
            })
            .toBuffer()
        }

        // Si aún es muy grande, aplicar compresión más agresiva
        if (finalBuffer.length > 300 * 1024) {
          finalBuffer = await sharp(imageBuffer)
            .jpeg({ 
              quality: 40, 
              progressive: true,
              mozjpeg: true 
            })
            .resize(800, 600, { 
              fit: 'inside', 
              withoutEnlargement: true 
            })
            .toBuffer()
        }

        return {
          data: finalBuffer.toString('base64'),
          size: finalBuffer.length
        }
      } catch (error) {
        console.log('Error comprimiendo imagen:', error)
        // Fallback: devolver imagen original
        return {
          data: base64Data,
          size: Buffer.from(base64Data, 'base64').length
        }
      }
    }

    // Comprimir la imagen recibida
    const cleanImageData = body.imageData.replace(/^data:image\/[a-z]+;base64,/, '')
    const originalSize = Buffer.from(cleanImageData, 'base64').length
    
    console.log(`📷 Imagen original: ${(originalSize / 1024).toFixed(2)}KB`)
    
    // Si la imagen ya es pequeña, evitar compresión innecesaria
    let finalImageData = cleanImageData
    let finalSize = originalSize
    
    if (originalSize > 200 * 1024) { // Solo comprimir si es > 200KB
      const { data: compressedImageData, size: compressedSize } = await compressImage(cleanImageData)
      finalImageData = compressedImageData
      finalSize = compressedSize
      console.log(`⚙️ Imagen comprimida: ${(finalSize / 1024).toFixed(2)}KB`)
    } else {
      console.log('✅ Imagen ya optimizada, omitiendo compresión')
    }

    // Inicializar el cliente de Gemini
    const ai = new GoogleGenAI({ apiKey })

    // Crear el objeto Part para la imagen final
    const imagePart = {
      inlineData: {
        data: finalImageData,
        mimeType: originalSize > 200 * 1024 ? 'image/jpeg' : body.mimeType, // Mantener tipo original si no se comprimió
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
    "jefe_de_turno": "valor encontrado o null",
    "orden_de_compra": "valor encontrado o null",
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

    // Log antes de llamar a Gemini
    console.log(`🤖 Enviando a Gemini API - Tamaño final: ${(finalSize / 1024).toFixed(2)}KB`)
    
    // Llamar a la API de Gemini con timeout
    const response = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-2.0-flash-exp', // Usando el modelo más reciente disponible
        contents: [imagePart, prompt],
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout en Gemini API')), 60000) // 60 segundos timeout
      )
    ]) as any

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
          jefe_de_turno: parsedData.productionData.jefe_de_turno || null,
          orden_de_compra: parsedData.productionData.orden_de_compra || null,
          numeroOperario: parsedData.productionData.numeroOperario || null,
          maquina: parsedData.productionData.maquina || null,
          inspectorCalidad: parsedData.productionData.inspectorCalidad || null
        }

        // Log de tiempo de procesamiento
        const processingTime = Date.now() - startTime
        console.log(`✅ OCR con datos estructurados completado en ${processingTime}ms`)
        
        return {
          text: parsedData.rawText || '',
          productionData,
          success: true,
          metadata: {
            filename: body.filename,
            processedAt: new Date().toISOString(),
            model: 'gemini-2.0-flash-exp',
            processingTimeMs: processingTime,
            originalSizeKB: Math.round(originalSize / 1024),
            finalSizeKB: Math.round(finalSize / 1024)
          }
        }
      }
    } catch {
      // Si hay error parseando JSON, usar el texto raw
    }

    // Log de tiempo de procesamiento
    const processingTime = Date.now() - startTime
    console.log(`✅ OCR completado en ${processingTime}ms`)
    
    return {
      text: rawResponse,
      success: true,
      metadata: {
        filename: body.filename,
        processedAt: new Date().toISOString(),
        model: 'gemini-2.0-flash-exp',
        processingTimeMs: processingTime,
        originalSizeKB: Math.round(originalSize / 1024),
        finalSizeKB: Math.round(finalSize / 1024)
      }
    }

  } catch (error: unknown) {
    console.error('❌ Error en OCR:', error)

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