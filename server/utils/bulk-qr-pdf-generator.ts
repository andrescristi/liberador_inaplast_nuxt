/**
 * Utilidad del servidor para generar PDFs con múltiples códigos QR de órdenes
 */
import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'

interface OrderQRData {
  id: number
  pedido: string
  cliente: string
  status: string
  createdAt: string
}

interface BulkQRPDFOptions {
  baseUrl?: string
}

/**
 * Genera un PDF optimizado con múltiples códigos QR para varias órdenes
 * Cada orden se muestra en su propia página
 */
export async function generateBulkOrderQRPDF(
  ordersData: OrderQRData[],
  options: BulkQRPDFOptions = {}
): Promise<Buffer> {
  try {
    if (!ordersData || ordersData.length === 0) {
      throw new Error('No se proporcionaron órdenes para generar el PDF')
    }

    // Configurar URL base
    const runtimeConfig = useRuntimeConfig()
    const isDevelopment = process.env.NODE_ENV === 'development'

    // Obtener dominios permitidos desde variables de entorno
    const allowedDomains = (runtimeConfig.public.allowedDomains as string)?.split(',') || ['http://localhost:3000']
    const productionDomain = (runtimeConfig.public.productionDomain as string) || 'https://liberador-inaplast-nuxt.vercel.app'

    let baseDomain: string
    if (isDevelopment) {
      baseDomain = options.baseUrl || 'http://localhost:3000'
      // Validar que el dominio esté permitido
      if (!allowedDomains.some(_allowedDomain => baseDomain.includes('localhost') || allowedDomains.includes(baseDomain))) {
        baseDomain = 'http://localhost:3000' // Fallback seguro
      }
    }
    else {
      baseDomain = options.baseUrl || productionDomain
      // Validar que el dominio esté en la lista de permitidos
      if (!allowedDomains.includes(baseDomain)) {
        baseDomain = productionDomain // Fallback seguro
      }
    }

    // Crear un nuevo documento PDF optimizado
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [100, 150], // Tamaño personalizado (10cm x 15cm)
      compress: true, // Activar compresión
    })

    // Configuración del documento
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 10

    // Iterar sobre cada orden y crear una página
    for (let i = 0; i < ordersData.length; i++) {
      const orderData = ordersData[i]

      // Verificar que orderData exista
      if (!orderData) {
        continue
      }

      // Si no es la primera página, agregar una nueva
      if (i > 0) {
        doc.addPage()
      }

      let yPosition = margin + 10

      // Título del documento
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('Orden de liberación', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 10

      // Información básica de la orden
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')

      // Solo información esencial
      const orderInfo = [
        `Pedido: ${orderData.pedido}`,
        `Cliente: ${orderData.cliente.length > 25 ? orderData.cliente.substring(0, 25) + '...' : orderData.cliente}`,
        `Estado: ${orderData.status}`,
      ]

      orderInfo.forEach((info) => {
        doc.text(info, pageWidth / 2, yPosition, { align: 'center' })
        yPosition += 6
      })

      yPosition += 8

      // Generar URL de la orden
      const orderURL = `${baseDomain}/orders/${orderData.id}`

      // Generar código QR optimizado
      const qrCodeDataURL = await QRCode.toDataURL(orderURL, {
        width: 120,
        margin: 1,
        errorCorrectionLevel: 'L', // Nivel de corrección más bajo = menos datos
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })

      // Agregar código QR al PDF
      const qrSize = 40
      const qrX = (pageWidth - qrSize) / 2
      doc.addImage(qrCodeDataURL, 'PNG', qrX, yPosition, qrSize, qrSize)

      // Agregar número de página
      doc.setFontSize(7)
      doc.setFont('helvetica', 'italic')
      doc.text(
        `Página ${i + 1} de ${ordersData.length}`,
        pageWidth / 2,
        pageHeight - 5,
        { align: 'center' }
      )
    }

    // Convertir a Buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    return pdfBuffer
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error al generar el PDF con múltiples códigos QR:', error)
    throw new Error('Error al generar el PDF con múltiples códigos QR')
  }
}
