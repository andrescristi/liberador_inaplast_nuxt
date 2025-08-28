import { z } from 'zod'

/**
 * Utilidades de validación reutilizables
 */

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

/**
 * Esquema para archivos de imagen opcionales
 */
export const optionalImageFileSchema = z.instanceof(File).nullable()

/**
 * Función helper para crear esquemas opcionales
 */
export function makeOptional<T extends z.ZodTypeAny>(schema: T) {
  return schema.optional()
}

/**
 * Función helper para crear esquemas de string que pueden estar vacíos o ser opcionales
 */
export function optionalString(_message?: string) {
  return z.string().optional().or(z.literal(''))
}

/**
 * Función helper para crear esquemas de string requeridos con mensaje personalizado
 */
export function requiredString(message: string) {
  return z.string().min(1, message)
}