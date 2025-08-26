import { z } from 'zod'

/**
 * Esquema de validación para datos de OCR extraídos
 */
export const ocrDataSchema = z.object({
  customerName: z.string().optional(),
  customerCode: z.string().optional(),
  productName: z.string().optional(),
  productCode: z.string().optional(),
  lotNumber: z.string().optional(),
  expirationDate: z.string().optional(),
  productionDate: z.string().optional(),
})

/**
 * Esquema de validación para datos del Paso 1 del wizard
 */
export const stepDataSchema = z.object({
  labelImage: z.instanceof(File).nullable(),
  labelImagePreview: z.string(),
  boxQuantity: z.number()
    .min(1, 'La cantidad debe ser mayor a 0')
    .max(1000, 'La cantidad no puede ser mayor a 1000')
    .int('La cantidad debe ser un número entero'),
})

/**
 * Esquema de validación completo para datos de orden
 */
export const orderDataSchema = z.object({
  // Datos extraídos por OCR
  customerName: z.string().min(1, 'El nombre del cliente es requerido'),
  customerCode: z.string().min(1, 'El código del cliente es requerido'),
  productName: z.string().min(1, 'El nombre del producto es requerido'),
  productCode: z.string().min(1, 'El código del producto es requerido'),
  lotNumber: z.string().min(1, 'El número de lote es requerido'),
  expirationDate: z.string().min(1, 'La fecha de expiración es requerida'),
  productionDate: z.string().min(1, 'La fecha de producción es requerida'),
  
  // Archivos de imagen
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
 * Esquema para validar archivos de imagen
 */
export const imageFileSchema = z.instanceof(File)
  .refine(
    (file) => file.size <= 10 * 1024 * 1024, // 10MB
    'El archivo debe ser menor a 10MB'
  )
  .refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    'El archivo debe ser una imagen válida (JPEG, PNG o WebP)'
  )

// Tipos derivados de los esquemas
export type OCRData = z.infer<typeof ocrDataSchema>
export type StepData = z.infer<typeof stepDataSchema>
export type OrderData = z.infer<typeof orderDataSchema>