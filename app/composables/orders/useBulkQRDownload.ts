import { ref } from 'vue'

interface BulkQRDownloadResponse {
  success: boolean
  data: {
    downloadUrl: string
    totalOrders: number
    successfulDownloads: number
    failedOrders?: string[]
  }
}

/**
 * Composable para manejar la descarga masiva de PDFs con códigos QR
 */
export function useBulkQRDownload() {
  const isDownloading = ref(false)
  const downloadProgress = ref(0)
  const toast = useToast()

  /**
   * Descarga un PDF combinado con los códigos QR de las órdenes seleccionadas
   * @param orderIds Array de IDs de órdenes a descargar
   */
  const downloadBulkQRPDF = async (orderIds: string[]): Promise<void> => {
    if (!orderIds || orderIds.length === 0) {
      toast.warning('No hay órdenes seleccionadas')
      return
    }

    if (orderIds.length > 100) {
      toast.warning('No puedes descargar más de 100 órdenes a la vez')
      return
    }

    isDownloading.value = true
    downloadProgress.value = 0

    try {
      // Simular progreso inicial
      downloadProgress.value = 10

      // Realizar la petición al endpoint
      const response = await $fetch<BulkQRDownloadResponse>('/api/orders/bulk-qr-pdf', {
        method: 'POST',
        body: {
          orderIds
        }
      })

      downloadProgress.value = 80

      if (response.success && response.data.downloadUrl) {
        // Crear un enlace temporal para descargar el archivo
        const link = document.createElement('a')
        link.href = response.data.downloadUrl
        link.download = `qr-codes-${new Date().toISOString().split('T')[0]}.pdf`
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        downloadProgress.value = 100

        // Mostrar mensaje de éxito
        let message = `Se descargaron ${response.data.successfulDownloads} códigos QR correctamente`

        if (response.data.failedOrders && response.data.failedOrders.length > 0) {
          message += `. ${response.data.failedOrders.length} órdenes fallaron: ${response.data.failedOrders.join(', ')}`
          toast.warning(message)
        } else {
          toast.success(message)
        }
      } else {
        throw new Error('No se pudo obtener la URL de descarga')
      }
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Error al descargar PDFs con códigos QR:', error)

      let errorMessage = 'Error al descargar los PDFs con códigos QR'

      if (error && typeof error === 'object' && 'data' in error) {
        const errorData = error.data as { message?: string }
        if (errorData && errorData.message) {
          errorMessage = errorData.message
        }
      }

      toast.error(errorMessage)
    } finally {
      isDownloading.value = false
      downloadProgress.value = 0
    }
  }

  return {
    isDownloading,
    downloadProgress,
    downloadBulkQRPDF
  }
}
