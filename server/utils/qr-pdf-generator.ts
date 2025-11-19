/**
 * Utilidad del servidor para generar PDFs con códigos QR de órdenes
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

interface QRPDFOptions {
  baseUrl?: string
}

/**
 * Genera un PDF optimizado con código QR para una orden
 */
export async function generateOrderQRPDF(
  orderData: OrderQRData,
  options: QRPDFOptions = {}
): Promise<Buffer> {
  try {
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
      if (!allowedDomains.some(allowedDomain => baseDomain.includes('localhost') || allowedDomains.includes(baseDomain))) {
        baseDomain = 'http://localhost:3000' // Fallback seguro
      }
    } else {
      baseDomain = options.baseUrl || productionDomain
      // Validar que el dominio esté en la lista de permitidos
      if (!allowedDomains.includes(baseDomain)) {
        baseDomain = productionDomain // Fallback seguro
      }
    }

    // Generar la URL completa de la orden
    const orderURL = `${baseDomain}/orders/${orderData.id}`

    // Crear un nuevo documento PDF optimizado
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [100, 150], // Tamaño personalizado más pequeño (10cm x 15cm)
      compress: true // Activar compresión
    })

    // Configuración optimizada del documento
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 10 // Márgenes más pequeños
    let yPosition = margin + 10

    // Título del documento más compacto
    doc.setFontSize(12) // Fuente más pequeña
    doc.setFont('helvetica', 'bold')
    doc.text('Registro de inspección', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 10

    // Información básica de la orden más compacta
    doc.setFontSize(8) // Fuente más pequeña
    doc.setFont('helvetica', 'normal')

    // Solo información esencial
    const orderInfo = [
      `Pedido: ${orderData.pedido}`,
      `Cliente: ${orderData.cliente.length > 25 ? orderData.cliente.substring(0, 25) + '...' : orderData.cliente}`,
      `Estado: ${orderData.status}`
    ]

    orderInfo.forEach(info => {
      
      doc.text(info, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 6
    })

    yPosition += 8

    // Generar código QR más pequeño y optimizado
    const qrCodeDataURL = await QRCode.toDataURL(orderURL, {
      width: 120, // Reducir tamaño del QR
      margin: 1, // Márgenes más pequeños
      errorCorrectionLevel: 'L', // Nivel de corrección más bajo = menos datos
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    // Agregar código QR al PDF más pequeño
    const qrSize = 40 // QR más pequeño
    const qrX = (pageWidth - qrSize) / 2
    doc.addImage(qrCodeDataURL, 'PNG', qrX, yPosition, qrSize, qrSize)

    // Convertir a Buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    return pdfBuffer

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error al generar el PDF con código QR:', error)
    throw new Error('Error al generar el PDF con código QR')
  }
}

/**
 * Formatea una fecha a string legible en español
 */
function formatDate(dateString: string): string {
  if (!dateString) {
    return 'Fecha no disponible'
  }

  const date = new Date(dateString)

  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) {
    return 'Fecha inválida'
  }

  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}