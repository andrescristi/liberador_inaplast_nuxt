import { z } from 'zod'
import { ocrValidatedSchema } from './ocr'

/**
 * Esquema de validación para datos del Paso 1 del wizard de nueva orden
 */
export const orderStep1Schema = z.object({
  labelImage: z.instanceof(File).nullable(),
  labelImagePreview: z.string(),
  boxQuantity: z.number()
    .min(1, 'La cantidad debe ser mayor a 0')
    .max(1000, 'La cantidad no puede ser mayor a 1000')
    .int('La cantidad debe ser un número entero'),
})

/**
 * Esquema de validación completo para crear una nueva orden
 * Combina datos OCR validados + imágenes + cantidad
 */
export const newOrderSchema = z.object({
  // Datos extraídos y validados por OCR
  ...ocrValidatedSchema.shape,
  
  // Archivos de imagen con preview
  packageImage: z.instanceof(File).nullable(),
  packageImagePreview: z.string(),
  labelImage: z.instanceof(File).nullable(),
  labelImagePreview: z.string(),
  
  // Cantidad de cajas
  boxQuantity: z.number()
    .min(1, 'La cantidad debe ser mayor a 0')
    .max(1000, 'La cantidad no puede ser mayor a 1000')
    .int('La cantidad debe ser un número entero'),
})

/**
 * Esquema para datos del formulario de nueva orden (sin archivos)
 * Útil para persistencia y validación de datos textuales
 */
export const newOrderDataSchema = newOrderSchema.omit({
  packageImage: true,
  labelImage: true,
})

// Tipos derivados de los esquemas
export type OrderStep1Data = z.infer<typeof orderStep1Schema>
export type NewOrderData = z.infer<typeof newOrderSchema>
export type NewOrderFormData = z.infer<typeof newOrderDataSchema>