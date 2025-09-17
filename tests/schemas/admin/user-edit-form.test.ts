/**
 * Tests para validación de schemas en UserEditModal
 *
 * Verifica que el schema updateUserSchema funcione correctamente
 * con los datos del UserEditModal y que la validación sea consistente
 * con las correcciones aplicadas.
 */
import { describe, it, expect } from 'vitest'
import { updateUserSchema, type UpdateUserForm } from '~/schemas/admin/user'
import type { Profile } from '~/types'

describe('updateUserSchema - Validación para UserEditModal', () => {
  const mockUser: Profile = {
    id: 'profile-123',
    user_id: 'auth-user-456',
    first_name: 'Juan',
    last_name: 'Pérez',
    user_role: 'Inspector',
    email: 'juan.perez@test.com',
    created_at: '2023-01-01T12:00:00Z',
    updated_at: '2023-06-01T15:30:00Z'
  }

  describe('Validación de datos válidos', () => {
    it('debe validar correctamente datos completos válidos', () => {
      const validData: UpdateUserForm = {
        firstName: 'Juan Carlos',
        lastName: 'Pérez García',
        email: 'juan.carlos@test.com',
        userRole: 'Supervisor'
      }

      const result = updateUserSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('debe validar correctamente datos parciales (solo firstName)', () => {
      const partialData: UpdateUserForm = {
        firstName: 'Juan Carlos'
      }

      const result = updateUserSchema.safeParse(partialData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(partialData)
      }
    })

    it('debe validar correctamente datos parciales (solo email)', () => {
      const partialData: UpdateUserForm = {
        email: 'nuevo.email@test.com'
      }

      const result = updateUserSchema.safeParse(partialData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(partialData)
      }
    })

    it('debe validar correctamente datos parciales (solo userRole)', () => {
      const partialData: UpdateUserForm = {
        userRole: 'Admin'
      }

      const result = updateUserSchema.safeParse(partialData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(partialData)
      }
    })

    it('debe permitir objeto vacío (todos los campos son opcionales)', () => {
      const emptyData: UpdateUserForm = {}

      const result = updateUserSchema.safeParse(emptyData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({})
      }
    })
  })

  describe('Validación de firstName', () => {
    it('debe rechazar firstName muy corto (< 2 caracteres)', () => {
      const invalidData: UpdateUserForm = {
        firstName: 'J'
      }

      const result = updateUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El nombre debe tener al menos 2 caracteres')
      }
    })

    it('debe rechazar firstName muy largo (> 50 caracteres)', () => {
      const invalidData: UpdateUserForm = {
        firstName: 'A'.repeat(51)
      }

      const result = updateUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El nombre no puede tener más de 50 caracteres')
      }
    })

    it('debe rechazar firstName con caracteres inválidos', () => {
      const invalidData: UpdateUserForm = {
        firstName: 'Juan123'
      }

      const result = updateUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El nombre solo puede contener letras y espacios')
      }
    })

    it('debe aceptar firstName con tildes y espacios', () => {
      const validData: UpdateUserForm = {
        firstName: 'José María'
      }

      const result = updateUserSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('debe aceptar firstName con ñ', () => {
      const validData: UpdateUserForm = {
        firstName: 'Niño'
      }

      const result = updateUserSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('Validación de lastName', () => {
    it('debe rechazar lastName muy corto (< 2 caracteres)', () => {
      const invalidData: UpdateUserForm = {
        lastName: 'P'
      }

      const result = updateUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El apellido debe tener al menos 2 caracteres')
      }
    })

    it('debe rechazar lastName muy largo (> 50 caracteres)', () => {
      const invalidData: UpdateUserForm = {
        lastName: 'A'.repeat(51)
      }

      const result = updateUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El apellido no puede tener más de 50 caracteres')
      }
    })

    it('debe rechazar lastName con caracteres inválidos', () => {
      const invalidData: UpdateUserForm = {
        lastName: 'Pérez123'
      }

      const result = updateUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El apellido solo puede contener letras y espacios')
      }
    })

    it('debe aceptar lastName con tildes y espacios', () => {
      const validData: UpdateUserForm = {
        lastName: 'García López'
      }

      const result = updateUserSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('Validación de email', () => {
    it('debe rechazar email con formato inválido', () => {
      const invalidData: UpdateUserForm = {
        email: 'email-invalido'
      }

      const result = updateUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Formato de email inválido')
      }
    })

    it('debe rechazar email muy largo (> 100 caracteres)', () => {
      const longEmail = 'a'.repeat(90) + '@test.com'
      const invalidData: UpdateUserForm = {
        email: longEmail
      }

      const result = updateUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El email no puede tener más de 100 caracteres')
      }
    })

    it('debe aceptar emails válidos', () => {
      const validEmails = [
        'test@test.com',
        'user.name@example.org',
        'usuario+tag@dominio.es',
        'name123@test-domain.com'
      ]

      validEmails.forEach(email => {
        const validData: UpdateUserForm = { email }
        const result = updateUserSchema.safeParse(validData)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('Validación de userRole', () => {
    it('debe aceptar roles válidos', () => {
      const validRoles = ['Admin', 'Supervisor', 'Inspector'] as const

      validRoles.forEach(role => {
        const validData: UpdateUserForm = { userRole: role }
        const result = updateUserSchema.safeParse(validData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.userRole).toBe(role)
        }
      })
    })

    it('debe rechazar roles inválidos', () => {
      const invalidData: UpdateUserForm = {
        userRole: 'RolInvalido' as any
      }

      const result = updateUserSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Casos de uso específicos del UserEditModal', () => {
    it('debe validar datos que vienen del mapeo snake_case -> camelCase', () => {
      // Simular datos que vienen del mapeo del usuario original
      const mappedData: UpdateUserForm = {
        firstName: mockUser.first_name,    // 'Juan'
        lastName: mockUser.last_name,      // 'Pérez'
        email: mockUser.email,             // 'juan.perez@test.com'
        userRole: mockUser.user_role       // 'Inspector'
      }

      const result = updateUserSchema.safeParse(mappedData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(mappedData)
      }
    })

    it('debe validar cambios parciales típicos del modal', () => {
      // Solo cambiar nombre
      const onlyNameChange: UpdateUserForm = {
        firstName: 'Juan Carlos'
      }

      // Solo cambiar email
      const onlyEmailChange: UpdateUserForm = {
        email: 'nuevo.email@test.com'
      }

      // Solo cambiar rol
      const onlyRoleChange: UpdateUserForm = {
        userRole: 'Supervisor'
      }

      const results = [
        updateUserSchema.safeParse(onlyNameChange),
        updateUserSchema.safeParse(onlyEmailChange),
        updateUserSchema.safeParse(onlyRoleChange)
      ]

      results.forEach(result => {
        expect(result.success).toBe(true)
      })
    })

    it('debe manejar correctamente el caso donde email es null/undefined', () => {
      // El modal convierte null a string vacío, pero el schema debe manejarlo
      const dataWithUndefinedEmail: UpdateUserForm = {
        firstName: 'Juan',
        lastName: 'Pérez',
        // email: undefined (omitido)
        userRole: 'Inspector'
      }

      const result = updateUserSchema.safeParse(dataWithUndefinedEmail)
      expect(result.success).toBe(true)
    })

    it('debe validar datos complejos con nombres que contienen tildes y ñ (casos reales)', () => {
      const realWorldData: UpdateUserForm = {
        firstName: 'José María',
        lastName: 'Fernández Muñoz',
        email: 'jose.maria@empresa.es',
        userRole: 'Supervisor'
      }

      const result = updateUserSchema.safeParse(realWorldData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(realWorldData)
      }
    })

    it('debe fallar correctamente con datos que podrían venir del bug de comparación', () => {
      // Datos que podrían generarse por error en la comparación
      const buggyData: UpdateUserForm = {
        firstName: '',  // String vacío por error
        lastName: undefined as any,  // undefined por error
        email: null as any,  // null por error
        userRole: '' as any  // String vacío por error
      }

      const result = updateUserSchema.safeParse(buggyData)
      expect(result.success).toBe(false)

      // Debe tener errores para todos los campos problemáticos
      if (!result.success) {
        const errorMessages = result.error.issues.map(issue => issue.message)
        expect(errorMessages).toContain('El nombre debe tener al menos 2 caracteres')
        expect(errorMessages).toContain('Formato de email inválido')
      }
    })
  })

  describe('Verificación de tipos TypeScript', () => {
    it('debe mantener los tipos correctos para UpdateUserForm', () => {
      // Test de tipo: verificar que los tipos son consistentes
      const typedData: UpdateUserForm = {
        firstName: 'string',
        lastName: 'string',
        email: 'string@email.com',
        userRole: 'Admin'
      }

      // Si este código compila, los tipos son correctos
      expect(typeof typedData.firstName).toBe('string')
      expect(typeof typedData.userRole).toBe('string')
    })

    it('debe permitir undefined en todos los campos opcionales', () => {
      // Test de tipo: todos los campos deben ser opcionales
      const emptyForm: UpdateUserForm = {}
      const partialForm: UpdateUserForm = {
        firstName: 'Juan'
        // otros campos omitidos intencionalmente
      }

      expect(emptyForm).toBeDefined()
      expect(partialForm).toBeDefined()
    })
  })
})