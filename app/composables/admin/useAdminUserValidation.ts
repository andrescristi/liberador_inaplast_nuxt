/**
 * Composable para validaciones de usuarios administrativos
 * 
 * Centraliza todas las validaciones relacionadas con la gestión de usuarios,
 * usando Zod para garantizar type safety y validaciones consistentes.
 * 
 * @author Inaplast Development Team
 * @since v2.5.0
 */

import { z } from 'zod'
import type { ProfileRole } from '~/types'
import { useLogger } from '~/composables/tools/useLogger'

/**
 * Schema de validación para creación de usuarios
 */
const createUserSchema = z.object({
  email: z
    .string()
    .email('El email debe ser válido')
    .min(5, 'El email debe tener al menos 5 caracteres')
    .max(254, 'El email no puede exceder 254 caracteres')
    .toLowerCase(),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(128, 'La contraseña no puede exceder 128 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial'
    ),
  first_name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[A-Za-záéíóúñüÁÉÍÓÚÑÜ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  last_name: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(/^[A-Za-záéíóúñüÁÉÍÓÚÑÜ\s]+$/, 'El apellido solo puede contener letras y espacios'),
  user_role: z.enum(['Admin', 'Supervisor', 'Inspector'], {
    errorMap: () => ({ message: 'El rol debe ser Admin, Supervisor o Inspector' })
  })
})

/**
 * Schema de validación para actualización de usuarios
 */
const updateUserSchema = z.object({
  first_name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[A-Za-záéíóúñüÁÉÍÓÚÑÜ\s]+$/, 'El nombre solo puede contener letras y espacios')
    .optional(),
  last_name: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(/^[A-Za-záéíóúñüÁÉÍÓÚÑÜ\s]+$/, 'El apellido solo puede contener letras y espacios')
    .optional(),
  user_role: z.enum(['Admin', 'Supervisor', 'Inspector'], {
    errorMap: () => ({ message: 'El rol debe ser Admin, Supervisor o Inspector' })
  }).optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Debe proporcionar al menos un campo para actualizar' }
)

/**
 * Schema de validación para email
 */
const emailSchema = z
  .string()
  .email('El email debe ser válido')
  .min(5, 'El email debe tener al menos 5 caracteres')
  .max(254, 'El email no puede exceder 254 caracteres')
  .toLowerCase()

/**
 * Schema de validación para UUID
 */
const uuidSchema = z
  .string()
  .uuid('El ID debe ser un UUID válido')

/**
 * Schema de validación para filtros de usuarios
 */
const userFiltersSchema = z.object({
  search: z
    .string()
    .min(2, 'La búsqueda debe tener al menos 2 caracteres')
    .max(100, 'La búsqueda no puede exceder 100 caracteres')
    .optional(),
  role_filter: z.enum(['Admin', 'Supervisor', 'Inspector']).optional()
}).optional()

/**
 * Schema de validación para paginación
 */
const paginationSchema = z.object({
  page: z
    .number()
    .int('La página debe ser un número entero')
    .min(1, 'La página debe ser mayor a 0')
    .max(10000, 'La página no puede exceder 10,000'),
  pageSize: z
    .number()
    .int('El tamaño de página debe ser un número entero')
    .min(1, 'El tamaño de página debe ser mayor a 0')
    .max(100, 'El tamaño de página no puede exceder 100')
})

export const useAdminUserValidation = () => {
  const logger = useLogger()

  /**
   * Valida datos para crear un nuevo usuario
   */
  const validateCreateUser = (data: unknown) => {
    try {
      return createUserSchema.parse(data)
    } catch (error) {
      logger.warn('Validación fallida para crear usuario', {
        error: error instanceof Error ? error.message : 'Error de validación',
        data: typeof data === 'object' ? Object.keys(data || {}) : typeof data
      })
      throw error
    }
  }

  /**
   * Valida datos para actualizar un usuario existente
   */
  const validateUpdateUser = (data: unknown) => {
    try {
      return updateUserSchema.parse(data)
    } catch (error) {
      logger.warn('Validación fallida para actualizar usuario', {
        error: error instanceof Error ? error.message : 'Error de validación',
        data: typeof data === 'object' ? Object.keys(data || {}) : typeof data
      })
      throw error
    }
  }

  /**
   * Valida un email
   */
  const validateEmail = (email: unknown): string => {
    try {
      return emailSchema.parse(email)
    } catch (error) {
      logger.warn('Validación fallida para email', {
        error: error instanceof Error ? error.message : 'Error de validación',
        email: typeof email === 'string' ? email.substring(0, 50) : typeof email
      })
      throw error
    }
  }

  /**
   * Valida un UUID
   */
  const validateUUID = (id: unknown): string => {
    try {
      return uuidSchema.parse(id)
    } catch (error) {
      logger.warn('Validación fallida para UUID', {
        error: error instanceof Error ? error.message : 'Error de validación',
        id: typeof id === 'string' ? id.substring(0, 50) : typeof id
      })
      throw error
    }
  }

  /**
   * Valida filtros de búsqueda de usuarios
   */
  const validateUserFilters = (filters: unknown) => {
    try {
      return userFiltersSchema.parse(filters)
    } catch (error) {
      logger.warn('Validación fallida para filtros de usuario', {
        error: error instanceof Error ? error.message : 'Error de validación'
      })
      throw error
    }
  }

  /**
   * Valida parámetros de paginación
   */
  const validatePagination = (page: unknown, pageSize: unknown) => {
    try {
      return paginationSchema.parse({ page, pageSize })
    } catch (error) {
      logger.warn('Validación fallida para paginación', {
        error: error instanceof Error ? error.message : 'Error de validación',
        page,
        pageSize
      })
      throw error
    }
  }

  /**
   * Valida que un rol sea válido
   */
  const validateRole = (role: unknown): ProfileRole => {
    try {
      const roleSchema = z.enum(['Admin', 'Supervisor', 'Inspector'])
      return roleSchema.parse(role)
    } catch (error) {
      logger.warn('Validación fallida para rol', {
        error: error instanceof Error ? error.message : 'Error de validación',
        role
      })
      throw error
    }
  }

  /**
   * Sanitiza y valida texto de búsqueda
   */
  const sanitizeSearchText = (search: string): string => {
    // Remover caracteres especiales peligrosos para SQL injection
    const sanitized = search
      .trim()
      .replace(/[<>'%;()&+]/g, '') // Remover caracteres peligrosos
      .substring(0, 100) // Limitar longitud
    
    if (sanitized.length < 2) {
      throw new Error('El término de búsqueda debe tener al menos 2 caracteres')
    }
    
    return sanitized
  }

  return {
    validateCreateUser,
    validateUpdateUser,
    validateEmail,
    validateUUID,
    validateUserFilters,
    validatePagination,
    validateRole,
    sanitizeSearchText,
    
    // Schemas exportados para uso externo
    schemas: {
      createUser: createUserSchema,
      updateUser: updateUserSchema,
      email: emailSchema,
      uuid: uuidSchema,
      userFilters: userFiltersSchema,
      pagination: paginationSchema
    }
  }
}