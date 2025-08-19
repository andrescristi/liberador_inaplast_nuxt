import { ref } from 'vue'

interface CompressionOptions {
  targetSizeKB?: number
  maxWidth?: number
  maxHeight?: number
  quality?: number
  mimeType?: string
}

interface CompressionResult {
  compressedFile: File
  originalSize: number
  compressedSize: number
  compressionRatio: number
}

export const useImageCompression = () => {
  const isCompressing = ref(false)
  const compressionProgress = ref(0)

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

    // Configurar canvas
    canvas.width = width
    canvas.height = height

    // Dibujar imagen redimensionada
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, width, height)

    return { width, height }
  }

  /**
   * Convierte un canvas a Blob con calidad específica
   */
  const canvasToBlob = (canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Error al convertir canvas a blob'))
          }
        },
        mimeType,
        quality
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
      mimeType = 'image/jpeg'
    } = options

    isCompressing.value = true
    compressionProgress.value = 0

    try {
      // Crear elementos necesarios
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('No se pudo obtener el contexto del canvas')
      }

      // Cargar la imagen
      const img = new Image()
      const imageUrl = URL.createObjectURL(file)
      
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = imageUrl
      })

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

      // Limpiar recursos
      URL.revokeObjectURL(imageUrl)

      const result: CompressionResult = {
        compressedFile,
        originalSize: file.size,
        compressedSize: compressedFile.size,
        compressionRatio: Math.round(((file.size - compressedFile.size) / file.size) * 100)
      }

      return result

    } catch (error) {
      throw new Error(`Error al comprimir imagen: ${error}`)
    } finally {
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

  return {
    isCompressing: readonly(isCompressing),
    compressionProgress: readonly(compressionProgress),
    compressImage,
    needsCompression,
    formatFileSize
  }
}