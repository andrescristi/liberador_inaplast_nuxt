import { z } from 'zod'

/**
 * Esquema de validación para datos extraídos por OCR
 * Campos opcionales ya que la extracción puede fallar
 */
export const ocrDataSchema = z.object({
  customerName: z.string().optional(),
  customerCode: z.string().optional(),
  productName: z.string().optional(),
  productCode: z.string().optional(),
  lotNumber: z.string().optional(),
  expirationDate: z.string().optional(),
  productionDate: z.string().optional(),
  orderNumber: z.string().optional(),
})

/**
 * Esquema para datos OCR validados (campos requeridos)
 * Usado cuando el usuario confirma/corrige los datos OCR
 */
export const ocrValidatedSchema = z.object({
  customerName: z.string().min(1, 'El nombre del cliente es requerido'),
  customerCode: z.string().min(1, 'El código del cliente es requerido'),
  productName: z.string().min(1, 'El nombre del producto es requerido'),
  productCode: z.string().min(1, 'El código del producto es requerido'),
  lotNumber: z.string().min(1, 'El número de lote es requerido'),
  expirationDate: z.string().min(1, 'La fecha de expiración es requerida'),
  productionDate: z.string().min(1, 'La fecha de producción es requerida'),
})

// Tipos derivados de los esquemas
export type OCRData = z.infer<typeof ocrDataSchema>
export type OCRValidatedData = z.infer<typeof ocrValidatedSchema>