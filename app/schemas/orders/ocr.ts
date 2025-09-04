import { z } from 'zod'

/**
 * Esquema de validación para datos extraídos por OCR
 * Campos opcionales ya que la extracción puede fallar
 */
export const ocrDataSchema = z.object({
  // Campos opcionales - OCR puede o no extraerlos
  cliente: z.string().optional(),
  producto: z.string().optional(),
  codigo_producto: z.string().optional(),
  lote: z.string().optional(),
  fecha_fabricacion: z.string().optional(),
  pedido: z.string().optional(),
  turno: z.string().optional(),
  numero_operario: z.string().optional(),
  maquina: z.string().optional(),
  inspector_calidad: z.string().optional(),
  jefe_de_turno: z.string().optional(),
  orden_de_compra: z.string().optional(),
})

/**
 * Esquema para datos OCR validados (campos requeridos)
 * Usado cuando el usuario confirma/corrige los datos OCR
 */
export const ocrValidatedSchema = z.object({
  // Campos requeridos por la API
  cliente: z.string().min(1, 'El nombre del cliente es requerido'),
  producto: z.string().min(1, 'El nombre del producto es requerido'),
  codigo_producto: z.string().min(1, 'El código del producto es requerido'),
  pedido: z.string().min(1, 'El número de pedido es requerido'),
  fecha_fabricacion: z.string().min(1, 'La fecha de fabricación es requerida'),
  turno: z.string().min(1, 'El turno es requerido'),
  numero_operario: z.string().min(1, 'El número de operario es requerido'),
  maquina: z.string().min(1, 'La máquina es requerida'),
  inspector_calidad: z.string().min(1, 'El inspector de calidad es requerido'),
  // Campos opcionales
  lote: z.string().optional(),
  jefe_de_turno: z.string().optional(),
  orden_de_compra: z.string().optional(),
})

// Tipos derivados de los esquemas
export type OCRData = z.infer<typeof ocrDataSchema>
export type OCRValidatedData = z.infer<typeof ocrValidatedSchema>