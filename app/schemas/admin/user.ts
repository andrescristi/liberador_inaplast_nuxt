import { z } from 'zod'

/**
 * Roles disponibles para usuarios
 */
export const userRoleSchema = z.enum(['Admin', 'Supervisor', 'Inspector'])

/**
 * Esquema de validación para crear usuario
 */
export const createUserSchema = z.object({
  first_name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  
  last_name: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras y espacios'),
  
  email: z.string()
    .email('Formato de email inválido')
    .max(100, 'El email no puede tener más de 100 caracteres'),
  
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(50, 'La contraseña no puede tener más de 50 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'La contraseña debe contener al menos: una minúscula, una mayúscula, un número y un carácter especial'
    ),
  
  user_role: userRoleSchema,
})

/**
 * Esquema de validación para actualizar usuario
 */
export const updateUserSchema = z.object({
  first_name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios')
    .optional(),
  
  last_name: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras y espacios')
    .optional(),
  
  email: z.string()
    .email('Formato de email inválido')
    .max(100, 'El email no puede tener más de 100 caracteres')
    .optional(),
  
  user_role: userRoleSchema.optional(),
})

// Tipos derivados de los esquemas
export type UserRole = z.infer<typeof userRoleSchema>
export type CreateUserForm = z.infer<typeof createUserSchema>
export type UpdateUserForm = z.infer<typeof updateUserSchema>