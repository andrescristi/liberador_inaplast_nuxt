import { z } from 'zod'

/**
 * Esquema para validar archivos de imagen
 * Reutilizable en toda la aplicación
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
 * Esquema para preview de imagen (base64 string)
 */
export const imagePreviewSchema = z.string().url('Debe ser una URL válida')

/**
 * Esquema combinado para imagen con preview
 */
export const imageWithPreviewSchema = z.object({
  file: imageFileSchema.nullable(),
  preview: z.string()
})

// Tipos derivados
export type ImageFile = z.infer<typeof imageFileSchema>
export type ImagePreview = z.infer<typeof imagePreviewSchema>
export type ImageWithPreview = z.infer<typeof imageWithPreviewSchema>