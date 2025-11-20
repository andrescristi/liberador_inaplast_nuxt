import { PDFDocument } from 'pdf-lib'

/**
 * Combina múltiples buffers de PDFs en un solo documento PDF
 * @param pdfBuffers Array de buffers de PDFs a combinar
 * @returns Buffer del PDF combinado
 */
export async function mergePDFs(pdfBuffers: Uint8Array[]): Promise<Uint8Array> {
  if (!pdfBuffers || pdfBuffers.length === 0) {
    throw new Error('No se proporcionaron PDFs para combinar')
  }

  // Crear un nuevo documento PDF
  const mergedPdf = await PDFDocument.create()

  // Procesar cada PDF
  for (const pdfBuffer of pdfBuffers) {
    try {
      // Cargar el PDF
      const pdf = await PDFDocument.load(pdfBuffer)

      // Copiar todas las páginas del PDF
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())

      // Agregar las páginas copiadas al PDF combinado
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page)
      })
    } catch (error) {
      console.error('Error al procesar un PDF:', error)
      // Continuar con el siguiente PDF en caso de error
      continue
    }
  }

  // Guardar el PDF combinado
  const mergedPdfBytes = await mergedPdf.save()

  return mergedPdfBytes
}
