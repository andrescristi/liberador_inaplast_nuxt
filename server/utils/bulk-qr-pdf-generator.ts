/**
 * Utilidad del servidor para generar PDFs con múltiples códigos QR de órdenes
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
  PDFGeneratorOptions as BulkQRPDFOptions,
} from './unified-pdf-generator'

export { generateBulkOrderQRPDF } from './unified-pdf-generator'
