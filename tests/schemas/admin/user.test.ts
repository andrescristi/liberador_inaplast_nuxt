import { describe, it, expect } from 'vitest'
import { createUserSchema } from '~/app/schemas/admin/user'

describe('User Schema Password Validation', () => {
  describe('Password regex validation fix', () => {
    const validBaseData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      userRole: 'Admin' as const
    }

    it('debe validar contraseña con carácter especial al inicio', () => {
      const userData = {
        ...validBaseData,
        password: '@TestPass123'
      }

      const result = createUserSchema.safeParse(userData)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.password).toBe('@TestPass123')
      }
    })

    it('debe validar contraseña con carácter especial en el medio', () => {
      const userData = {
        ...validBaseData,
        password: 'Test@Pass123'
      }

      const result = createUserSchema.safeParse(userData)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.password).toBe('Test@Pass123')
      }
    })

    it('debe validar contraseña con carácter especial al final', () => {
      const userData = {
        ...validBaseData,
        password: 'TestPass123@'
      }

      const result = createUserSchema.safeParse(userData)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.password).toBe('TestPass123@')
      }
    })

    it('debe validar contraseña con múltiples caracteres especiales en diferentes posiciones', () => {
      const userData = {
        ...validBaseData,
        password: '@Test$Pass123!'
      }

      const result = createUserSchema.safeParse(userData)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.password).toBe('@Test$Pass123!')
      }
    })

    it('debe rechazar contraseña sin carácter especial', () => {
      const userData = {
        ...validBaseData,
        password: 'TestPass123'
      }

      const result = createUserSchema.safeParse(userData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['password'],
              message: 'La contraseña debe contener al menos: una minúscula, una mayúscula, un número y un carácter especial'
            })
          ])
        )
      }
    })

    it('debe rechazar contraseña sin minúscula', () => {
      const userData = {
        ...validBaseData,
        password: 'TESTPASS123@'
      }

      const result = createUserSchema.safeParse(userData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['password'],
              message: 'La contraseña debe contener al menos: una minúscula, una mayúscula, un número y un carácter especial'
            })
          ])
        )
      }
    })

    it('debe rechazar contraseña sin mayúscula', () => {
      const userData = {
        ...validBaseData,
        password: 'testpass123@'
      }

      const result = createUserSchema.safeParse(userData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['password'],
              message: 'La contraseña debe contener al menos: una minúscula, una mayúscula, un número y un carácter especial'
            })
          ])
        )
      }
    })

    it('debe rechazar contraseña sin número', () => {
      const userData = {
        ...validBaseData,
        password: 'TestPass@'
      }

      const result = createUserSchema.safeParse(userData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['password'],
              message: 'La contraseña debe contener al menos: una minúscula, una mayúscula, un número y un carácter especial'
            })
          ])
        )
      }
    })

    it('debe rechazar contraseña muy corta', () => {
      const userData = {
        ...validBaseData,
        password: 'Tp1@'
      }

      const result = createUserSchema.safeParse(userData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['password'],
              message: 'La contraseña debe tener al menos 8 caracteres'
            })
          ])
        )
      }
    })

    it('debe rechazar contraseña muy larga', () => {
      const userData = {
        ...validBaseData,
        password: 'A'.repeat(45) + 'test123@ABC' // 56 caracteres total
      }

      const result = createUserSchema.safeParse(userData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['password'],
              message: 'La contraseña no puede tener más de 50 caracteres'
            })
          ])
        )
      }
    })

    it('debe validar todos los caracteres especiales permitidos', () => {
      const specialChars = ['@', '$', '!', '%', '*', '?', '&']

      specialChars.forEach(char => {
        const userData = {
          ...validBaseData,
          password: `TestPass123${char}`
        }

        const result = createUserSchema.safeParse(userData)

        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.password).toBe(`TestPass123${char}`)
        }
      })
    })
  })

  describe('Complete user validation', () => {
    it('debe validar un usuario completo con datos válidos', () => {
      const userData = {
        firstName: 'María',
        lastName: 'González',
        email: 'maria.gonzalez@inaplast.com',
        password: 'SecurePass123@',
        userRole: 'Supervisor' as const
      }

      const result = createUserSchema.safeParse(userData)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(userData)
      }
    })

    it('debe rechazar usuario con email inválido', () => {
      const userData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'email-invalido',
        password: 'TestPass123@',
        userRole: 'Admin' as const
      }

      const result = createUserSchema.safeParse(userData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['email'],
              message: 'Formato de email inválido'
            })
          ])
        )
      }
    })

    it('debe rechazar usuario con rol inválido', () => {
      const userData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        password: 'TestPass123@',
        userRole: 'InvalidRole' as any
      }

      const result = createUserSchema.safeParse(userData)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['userRole']
            })
          ])
        )
      }
    })
  })
})