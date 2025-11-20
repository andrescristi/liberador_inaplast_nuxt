/**
 * Utilidad del servidor para generar PDFs con códigos QR de órdenes
 *
 * Este módulo mantiene la misma interfaz pública pero delega la implementación
 * al generador unificado para evitar duplicación de código.
 *
 * @deprecated Usar directamente el generador unificado para nuevos desarrollos
 * @see unified-pdf-generator.ts
 */

// Re-exportar tipos e implementación del generador unificado
export type {
  OrderQRData,
  PDFGeneratorOptions as QRPDFOptions,
} from './unified-pdf-generator'

export { generateOrderQRPDF } from './unified-pdf-generator'