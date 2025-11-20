/**
 * Generador unificado de PDFs con códigos QR para órdenes
 *
 * Este módulo centraliza toda la lógica compartida entre los generadores
 * individual y bulk, eliminando código duplicado y facilitando el mantenimiento.
 */
import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'
import { pdfLogger } from './logger'

/**
 * Datos básicos de una orden para generar PDF
 */
export interface OrderQRData {
  id: number
  pedido: string
  cliente: string
  status: string
  createdAt: string
}

/**
 * Opciones de configuración para la generación de PDFs
 */
export interface PDFGeneratorOptions {
  baseUrl?: string
}

/**
 * Configuración del documento PDF
 */
interface PDFConfig {
  pageWidth: number
  pageHeight: number
  margin: number
  fontSize: {
    title: number
    info: number
    pageNumber: number
  }
  qr: {
    size: number
    imageWidth: number
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  }
}

/**
 * Clase que encapsula la lógica de generación de PDFs con códigos QR
 */
class UnifiedPDFGenerator {
  private readonly config: PDFConfig

  constructor() {
    this.config = {
      pageWidth: 100, // mm
      pageHeight: 150, // mm
      margin: 10, // mm
      fontSize: {
        title: 12,
        info: 8,
        pageNumber: 7,
      },
      qr: {
        size: 40, // mm (tamaño en el PDF)
        imageWidth: 120, // px (tamaño de la imagen QR)
        errorCorrectionLevel: 'L', // Nivel de corrección más bajo = menos datos
      },
    }
  }

  /**
   * Crea una nueva instancia de jsPDF con la configuración estándar
   */
  private createPDFDocument(): jsPDF {
    return new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [this.config.pageWidth, this.config.pageHeight],
      compress: true, // Activar compresión
    })
  }

  /**
   * Valida y resuelve la URL base para los códigos QR
   */
  private resolveBaseUrl(options: PDFGeneratorOptions): string {
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
    }
    else {
      baseDomain = options.baseUrl || productionDomain
      // Validar que el dominio esté en la lista de permitidos
      if (!allowedDomains.includes(baseDomain)) {
        baseDomain = productionDomain // Fallback seguro
      }
    }

    return baseDomain
  }

  /**
   * Genera un código QR como Data URL para una orden
   */
  private async generateQRCode(orderURL: string): Promise<string> {
    return await QRCode.toDataURL(orderURL, {
      width: this.config.qr.imageWidth,
      margin: 1,
      errorCorrectionLevel: this.config.qr.errorCorrectionLevel,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
  }

  /**
   * Trunca el nombre del cliente si es muy largo
   */
  private truncateClientName(clientName: string, maxLength: number = 25): string {
    if (clientName.length > maxLength) {
      return `${clientName.substring(0, maxLength)}...`
    }
    return clientName
  }

  /**
   * Renderiza una orden en una página del PDF
   *
   * @param doc - Documento jsPDF
   * @param orderData - Datos de la orden
   * @param orderURL - URL completa de la orden
   * @param pageInfo - Información de paginación (opcional)
   */
  private async renderOrderPage(
    doc: jsPDF,
    orderData: OrderQRData,
    orderURL: string,
    pageInfo?: { current: number; total: number }
  ): Promise<void> {
    let yPosition = this.config.margin + 10

    // Título del documento
    doc.setFontSize(this.config.fontSize.title)
    doc.setFont('helvetica', 'bold')
    doc.text('Orden de liberación', this.config.pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 10

    // Información básica de la orden
    doc.setFontSize(this.config.fontSize.info)
    doc.setFont('helvetica', 'normal')

    const orderInfo = [
      `Pedido: ${orderData.pedido}`,
      `Cliente: ${this.truncateClientName(orderData.cliente)}`,
      `Estado: ${orderData.status}`,
    ]

    orderInfo.forEach((info) => {
      doc.text(info, this.config.pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 6
    })

    yPosition += 8

    // Generar y agregar código QR
    const qrCodeDataURL = await this.generateQRCode(orderURL)
    const qrX = (this.config.pageWidth - this.config.qr.size) / 2
    doc.addImage(qrCodeDataURL, 'PNG', qrX, yPosition, this.config.qr.size, this.config.qr.size)

    // Agregar número de página si se proporciona
    if (pageInfo) {
      doc.setFontSize(this.config.fontSize.pageNumber)
      doc.setFont('helvetica', 'italic')
      doc.text(
        `Página ${pageInfo.current} de ${pageInfo.total}`,
        this.config.pageWidth / 2,
        this.config.pageHeight - 5,
        { align: 'center' }
      )
    }
  }

  /**
   * Genera un PDF con una única orden
   */
  async generateSingle(orderData: OrderQRData, options: PDFGeneratorOptions = {}): Promise<Buffer> {
    try {
      const baseDomain = this.resolveBaseUrl(options)
      const orderURL = `${baseDomain}/orders/${orderData.id}`

      const doc = this.createPDFDocument()
      await this.renderOrderPage(doc, orderData, orderURL)

      const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

      pdfLogger.info(
        {
          orderId: orderData.id,
          pedido: orderData.pedido,
          bufferSize: pdfBuffer.length,
        },
        'PDF generado exitosamente'
      )

      return pdfBuffer
    }
    catch (error) {
      pdfLogger.error(
        {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          orderId: orderData.id,
          pedido: orderData.pedido,
        },
        'Error al generar PDF con código QR'
      )
      throw new Error('Error al generar el PDF con código QR')
    }
  }

  /**
   * Genera un PDF con múltiples órdenes (una por página)
   */
  async generateBulk(ordersData: OrderQRData[], options: PDFGeneratorOptions = {}): Promise<Buffer> {
    try {
      if (!ordersData || ordersData.length === 0) {
        throw new Error('No se proporcionaron órdenes para generar el PDF')
      }

      const baseDomain = this.resolveBaseUrl(options)
      const doc = this.createPDFDocument()

      for (let i = 0; i < ordersData.length; i++) {
        const orderData = ordersData[i]

        // Verificar que orderData exista
        if (!orderData) {
          pdfLogger.warn({ index: i }, 'Orden no válida en la posición, omitiendo')
          continue
        }

        // Si no es la primera página, agregar una nueva
        if (i > 0) {
          doc.addPage()
        }

        const orderURL = `${baseDomain}/orders/${orderData.id}`
        await this.renderOrderPage(doc, orderData, orderURL, {
          current: i + 1,
          total: ordersData.length,
        })
      }

      const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

      pdfLogger.info(
        {
          orderCount: ordersData.length,
          bufferSize: pdfBuffer.length,
        },
        'PDF bulk generado exitosamente'
      )

      return pdfBuffer
    }
    catch (error) {
      pdfLogger.error(
        {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          orderCount: ordersData?.length || 0,
        },
        'Error al generar PDF con múltiples códigos QR'
      )
      throw new Error('Error al generar el PDF con múltiples códigos QR')
    }
  }
}

/**
 * Instancia singleton del generador unificado
 */
const pdfGenerator = new UnifiedPDFGenerator()

/**
 * Genera un PDF optimizado con código QR para una orden
 *
 * @param orderData - Datos de la orden
 * @param options - Opciones de configuración
 * @returns Buffer con el PDF generado
 */
export async function generateOrderQRPDF(
  orderData: OrderQRData,
  options: PDFGeneratorOptions = {}
): Promise<Buffer> {
  return pdfGenerator.generateSingle(orderData, options)
}

/**
 * Genera un PDF optimizado con múltiples códigos QR para varias órdenes
 * Cada orden se muestra en su propia página
 *
 * @param ordersData - Array de datos de órdenes
 * @param options - Opciones de configuración
 * @returns Buffer con el PDF generado
 */
export async function generateBulkOrderQRPDF(
  ordersData: OrderQRData[],
  options: PDFGeneratorOptions = {}
): Promise<Buffer> {
  return pdfGenerator.generateBulk(ordersData, options)
}
