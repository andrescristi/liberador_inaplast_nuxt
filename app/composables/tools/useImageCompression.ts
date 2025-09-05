import { ref } from 'vue'

interface CompressionOptions {
  targetSizeKB?: number
  maxWidth?: number
  maxHeight?: number
  quality?: number
  mimeType?: string
  maxFileSizeMB?: number
}

interface ImageValidationResult {
  isValid: boolean
  error?: string
}

const MAX_FILE_SIZE_MB = 50
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_DIMENSION = 4096

interface CompressionResult {
  compressedFile: File
  originalSize: number
  compressedSize: number
  compressionRatio: number
}

export const useImageCompression = () => {
  const isCompressing = ref(false)
  const compressionProgress = ref(0)
  const canvasRefs = new Set<HTMLCanvasElement>()
  const imageUrls = new Set<string>()

  /**
   * Valida archivo de imagen antes del procesamiento
   */
  const validateImageFile = (file: File, maxFileSizeMB: number = MAX_FILE_SIZE_MB): ImageValidationResult => {
    try {
      // Validar tipo de archivo
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return {
          isValid: false,
          error: `Tipo de archivo no soportado. Permitidos: ${ALLOWED_MIME_TYPES.join(', ')}`
        }
      }

      // Validar tamaño
      const maxSizeBytes = maxFileSizeMB * 1024 * 1024
      if (file.size > maxSizeBytes) {
        return {
          isValid: false,
          error: `Archivo demasiado grande. Máximo ${maxFileSizeMB}MB`
        }
      }

      // Validar que el archivo no esté corrupto
      if (file.size === 0) {
        return {
          isValid: false,
          error: 'Archivo está vacío o corrupto'
        }
      }

      return { isValid: true }
    } catch (error) {
      return {
        isValid: false,
        error: `Error al validar archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`
      }
    }
  }

  /**
   * Limpia recursos de canvas para evitar memory leaks
   */
  const cleanupCanvas = (canvas: HTMLCanvasElement) => {
    try {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
      canvas.width = 0
      canvas.height = 0
      canvasRefs.delete(canvas)
    } catch {
      // Error silencioso en cleanup
    }
  }

  /**
   * Limpia URLs de objetos para evitar memory leaks
   */
  const cleanupImageUrl = (url: string) => {
    try {
      if (imageUrls.has(url)) {
        URL.revokeObjectURL(url)
        imageUrls.delete(url)
      }
    } catch {
      // Error silencioso en cleanup
    }
  }

  /**
   * Redimensiona una imagen a las dimensiones especificadas
   */
  const resizeImage = (
    canvas: HTMLCanvasElement, 
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } => {
    let { width, height } = img

    // Calcular nuevas dimensiones manteniendo la proporción
    if (width > height) {
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
    } else {
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }
    }

    // Validar dimensiones
    const clampedWidth = Math.min(Math.max(width, 1), MAX_DIMENSION)
    const clampedHeight = Math.min(Math.max(height, 1), MAX_DIMENSION)

    // Configurar canvas
    canvas.width = clampedWidth
    canvas.height = clampedHeight

    // Dibujar imagen redimensionada con mejor calidad
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, 0, 0, clampedWidth, clampedHeight)

    return { width: clampedWidth, height: clampedHeight }
  }

  /**
   * Convierte un canvas a Blob con calidad específica y timeout
   */
  const canvasToBlob = (canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout al convertir canvas a blob'))
      }, 30000) // 30 segundos timeout

      canvas.toBlob(
        (blob) => {
          clearTimeout(timeout)
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Error al convertir canvas a blob'))
          }
        },
        mimeType,
        Math.max(0.1, Math.min(1, quality)) // Clamp quality entre 0.1 y 1
      )
    })
  }

  /**
   * Comprime una imagen hasta alcanzar el tamaño objetivo
   */
  const compressImage = async (
    file: File,
    options: CompressionOptions = {}
  ): Promise<CompressionResult> => {
    const {
      targetSizeKB = 50,
      maxWidth = 1920,
      maxHeight = 1080,
      quality: initialQuality = 0.8,
      mimeType = 'image/jpeg',
      maxFileSizeMB = MAX_FILE_SIZE_MB
    } = options

    // Validar archivo antes de procesar
    const validation = validateImageFile(file, maxFileSizeMB)
    if (!validation.isValid) {
      throw new Error(validation.error)
    }

    isCompressing.value = true
    compressionProgress.value = 0

    let canvas: HTMLCanvasElement | null = null
    let imageUrl: string | null = null

    try {
      // Crear elementos necesarios
      canvas = document.createElement('canvas')
      canvasRefs.add(canvas) // Trackear para cleanup
      
      const ctx = canvas.getContext('2d', { willReadFrequently: false })
      if (!ctx) {
        throw new Error('No se pudo obtener el contexto del canvas')
      }

      // Cargar la imagen con timeout
      const img = new Image()
      imageUrl = URL.createObjectURL(file)
      imageUrls.add(imageUrl) // Trackear para cleanup
      
      await Promise.race([
        new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = () => reject(new Error('Error al cargar la imagen'))
          img.src = imageUrl!
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout al cargar imagen')), 15000)
        )
      ])

      compressionProgress.value = 25

      // Redimensionar imagen
      resizeImage(canvas, ctx, img, maxWidth, maxHeight)
      compressionProgress.value = 50

      // Comprimir iterativamente hasta alcanzar el tamaño objetivo
      let quality = initialQuality
      let blob: Blob
      let attempts = 0
      const maxAttempts = 10
      const targetSizeBytes = targetSizeKB * 1024

      do {
        blob = await canvasToBlob(canvas, mimeType, quality)
        attempts++
        
        if (blob.size <= targetSizeBytes) {
          break
        }

        // Reducir calidad progresivamente
        quality = Math.max(0.1, quality - 0.1)
        compressionProgress.value = 50 + (attempts / maxAttempts) * 40
        
      } while (attempts < maxAttempts && blob.size > targetSizeBytes)

      compressionProgress.value = 90

      // Si aún es muy grande, reducir dimensiones
      if (blob.size > targetSizeBytes && attempts >= maxAttempts) {
        const reductionFactor = Math.sqrt(targetSizeBytes / blob.size)
        const newWidth = Math.floor(canvas.width * reductionFactor)
        const newHeight = Math.floor(canvas.height * reductionFactor)
        
        resizeImage(canvas, ctx, img, newWidth, newHeight)
        blob = await canvasToBlob(canvas, mimeType, 0.8)
      }

      compressionProgress.value = 100

      // Crear archivo comprimido
      const compressedFile = new File([blob], file.name, {
        type: mimeType,
        lastModified: Date.now()
      })

      const result: CompressionResult = {
        compressedFile,
        originalSize: file.size,
        compressedSize: compressedFile.size,
        compressionRatio: Math.round(((file.size - compressedFile.size) / file.size) * 100)
      }

      return result

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      throw new Error(`Error al comprimir imagen: ${errorMessage}`)
    } finally {
      // Limpiar recursos siempre
      if (canvas) {
        cleanupCanvas(canvas)
      }
      if (imageUrl) {
        cleanupImageUrl(imageUrl)
      }
      isCompressing.value = false
      compressionProgress.value = 0
    }
  }

  /**
   * Valida si un archivo necesita compresión
   */
  const needsCompression = (file: File, targetSizeKB: number = 50): boolean => {
    const targetSizeBytes = targetSizeKB * 1024
    return file.size > targetSizeBytes
  }

  /**
   * Formatea el tamaño de archivo para mostrar al usuario
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * Limpia todos los recursos cuando el composable se desmonta
   */
  const cleanup = () => {
    try {
      // Limpiar todos los canvas
      for (const canvas of canvasRefs) {
        cleanupCanvas(canvas)
      }
      canvasRefs.clear()

      // Limpiar todas las URLs
      for (const url of imageUrls) {
        cleanupImageUrl(url)
      }
      imageUrls.clear()
    } catch {
      // Error silencioso en cleanup
    }
  }

  // IMPORTANTE: Para auto-cleanup, llamar cleanup() manualmente desde onUnmounted en componentes
  // Los lifecycle hooks no pueden estar en composables para evitar problemas

  return {
    isCompressing: readonly(isCompressing),
    compressionProgress: readonly(compressionProgress),
    compressImage,
    needsCompression,
    formatFileSize,
    validateImageFile,
    cleanup
  }
}