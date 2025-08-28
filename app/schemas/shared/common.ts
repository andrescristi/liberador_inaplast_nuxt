import { z } from 'zod'

/**
 * Esquemas base reutilizables para validaciones comunes
 */

/**
 * Esquema para nombres (aplicable a nombres de personas, productos, etc.)
 */
export const nameSchema = z.string()
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(50, 'El nombre no puede tener más de 50 caracteres')
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios')

/**
 * Esquema para códigos (aplicable a códigos de cliente, producto, etc.)
 */
export const codeSchema = z.string()
  .min(1, 'El código es requerido')
  .max(20, 'El código no puede tener más de 20 caracteres')
  .regex(/^[a-zA-Z0-9_-]+$/, 'El código solo puede contener letras, números, guiones y guiones bajos')

/**
 * Esquema para emails
 */
export const emailSchema = z.string()
  .email('Formato de email inválido')
  .max(100, 'El email no puede tener más de 100 caracteres')

/**
 * Esquema para contraseñas seguras
 */
export const passwordSchema = z.string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(50, 'La contraseña no puede tener más de 50 caracteres')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'La contraseña debe contener al menos: una minúscula, una mayúscula, un número y un carácter especial'
  )

/**
 * Esquema para cantidades positivas
 */
export const quantitySchema = z.number()
  .min(1, 'La cantidad debe ser mayor a 0')
  .max(1000, 'La cantidad no puede ser mayor a 1000')
  .int('La cantidad debe ser un número entero')

/**
 * Esquema para fechas en formato string
 */
export const dateStringSchema = z.string()
  .min(1, 'La fecha es requerida')
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe estar en formato YYYY-MM-DD')

/**
 * Esquema para URLs de vista previa de imágenes
 */
export const imagePreviewSchema = z.string()
  .url('La URL de vista previa debe ser válida')
  .or(z.literal(''))