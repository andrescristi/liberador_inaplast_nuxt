import { z } from 'zod'

/**
 * Esquema de validación para datos extraídos por OCR
 * Campos opcionales ya que la extracción puede fallar
 */
export const ocrDataSchema = z.object({
  // Campos opcionales - OCR puede o no extraerlos
  cliente: z.string().optional(),
  producto: z.string().optional(),
  codigoProducto: z.string().optional(),
  lote: z.string().optional(),
  fechaFabricacion: z.string().optional(),
  pedido: z.string().optional(),
  turno: z.string().optional(),
  numeroOperario: z.string().optional(),
  maquina: z.string().optional(),
  inspectorCalidad: z.string().optional(),
  jefeDeTurno: z.string().optional(),
  ordenDeCompra: z.string().optional(),
})

/**
 * Esquema para datos OCR validados (campos requeridos)
 * Usado cuando el usuario confirma/corrige los datos OCR
 */
export const ocrValidatedSchema = z.object({
  // Campos requeridos por la API
  cliente: z.string().min(1, 'El nombre del cliente es requerido'),
  producto: z.string().min(1, 'El nombre del producto es requerido'),
  codigoProducto: z.string().min(1, 'El código del producto es requerido'),
  pedido: z.string().min(1, 'El número de pedido es requerido'),
  fechaFabricacion: z.string().min(1, 'La fecha de fabricación es requerida'),
  turno: z.string().min(1, 'El turno es requerido'),
  numeroOperario: z.string().min(1, 'El número de operario es requerido'),
  maquina: z.string().min(1, 'La máquina es requerida'),
  inspectorCalidad: z.string().min(1, 'El inspector de calidad es requerido'),
  // Campos opcionales
  lote: z.string().optional(),
  jefeDeTurno: z.string().optional(),
  ordenDeCompra: z.string().optional(),
})

// Tipos derivados de los esquemas
export type OCRData = z.infer<typeof ocrDataSchema>
export type OCRValidatedData = z.infer<typeof ocrValidatedSchema>