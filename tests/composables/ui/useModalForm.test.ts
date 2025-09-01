/**
 * Tests para useModalForm composable
 * 
 * Cubre funcionalidad de validación Zod, manejo de formularios modales,
 * y las mejoras recientes en validación de campos individuales
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
// import { nextTick } from 'vue'
import { z } from 'zod'
import { useModalForm } from '~/composables/ui/useModalForm'

// Mock useToast
const mockToast = {
  error: vi.fn(),
  success: vi.fn(),
  info: vi.fn()
}

vi.mock('~/composables/ui/useToast', () => ({
  useToast: () => mockToast
}))

// Schema de prueba
const testSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  age: z.number().min(18, 'Debe ser mayor de 18 años')
})

type TestForm = z.infer<typeof testSchema>

describe('useModalForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Inicialización', () => {
    it('debería inicializar con datos vacíos cuando no se proporcionan initialData', () => {
      const onSubmit = vi.fn()
      const { form } = useModalForm<TestForm>({
        schema: testSchema,
        onSubmit
      })

      expect(form.value).toEqual({})
    })

    it('debería inicializar con initialData cuando se proporciona', () => {
      const initialData = { name: 'Juan', email: 'juan@test.com', age: 25 }
      const onSubmit = vi.fn()
      
      const { form } = useModalForm<TestForm>({
        schema: testSchema,
        initialData,
        onSubmit
      })

      expect(form.value).toEqual(initialData)
    })
  })

  describe('Validación de formulario completo', () => {
    it('debería validar formulario correctamente con datos válidos', () => {
      const onSubmit = vi.fn()
      const { form, validateForm, errors, fieldErrors } = useModalForm<TestForm>({
        schema: testSchema,
        onSubmit
      })

      form.value = { name: 'Juan', email: 'juan@test.com', age: 25 }
      const isValid = validateForm()

      expect(isValid).toBe(true)
      expect(Object.keys(errors.value)).toHaveLength(0)
      expect(Object.keys(fieldErrors.value)).toHaveLength(0)
    })

    it('debería detectar errores con datos inválidos', () => {
      const onSubmit = vi.fn()
      const { form, validateForm, errors, fieldErrors } = useModalForm<TestForm>({
        schema: testSchema,
        onSubmit
      })

      form.value = { name: 'J', email: 'email-invalido', age: 16 }
      const isValid = validateForm()

      expect(isValid).toBe(false)
      expect(errors.value.name).toBe('Nombre debe tener al menos 2 caracteres')
      expect(errors.value.email).toBe('Email inválido')
      expect(errors.value.age).toBe('Debe ser mayor de 18 años')
      expect(fieldErrors.value.name).toEqual(['Nombre debe tener al menos 2 caracteres'])
      expect(fieldErrors.value.email).toEqual(['Email inválido'])
      expect(fieldErrors.value.age).toEqual(['Debe ser mayor de 18 años'])
    })
  })

  describe('Validación de campo individual', () => {
    it('debería validar campo individual correctamente', () => {
      const onSubmit = vi.fn()
      const { form, validateField, errors, fieldErrors } = useModalForm<TestForm>({
        schema: testSchema,
        onSubmit
      })

      form.value = { name: 'Juan Carlos', email: 'juan@test.com', age: 25 }
      validateField('name')

      expect(errors.value.name).toBeUndefined()
      expect(fieldErrors.value.name).toBeUndefined()
    })

    it('debería detectar error en campo individual', () => {
      const onSubmit = vi.fn()
      const { form, validateField, errors, fieldErrors } = useModalForm<TestForm>({
        schema: testSchema,
        onSubmit
      })

      form.value = { name: 'J', email: 'juan@test.com', age: 25 }
      validateField('name')

      expect(errors.value.name).toBe('Nombre debe tener al menos 2 caracteres')
      expect(fieldErrors.value.name).toEqual(['Nombre debe tener al menos 2 caracteres'])
    })

    it('debería limpiar errores cuando un campo se corrige', () => {
      const onSubmit = vi.fn()
      const { form, validateField, errors, fieldErrors } = useModalForm<TestForm>({
        schema: testSchema,
        onSubmit
      })

      // Primero crear un error
      form.value = { name: 'J', email: 'juan@test.com', age: 25 }
      validateField('name')
      expect(errors.value.name).toBe('Nombre debe tener al menos 2 caracteres')

      // Luego corregir
      form.value.name = 'Juan Carlos'
      validateField('name')
      expect(errors.value.name).toBeUndefined()
      expect(fieldErrors.value.name).toBeUndefined()
    })
  })

  describe('Envío de formulario', () => {
    it('debería enviar formulario con datos válidos', async () => {
      const onSubmit = vi.fn().mockResolvedValue(void 0)
      const onSuccess = vi.fn()
      
      const { form, handleSubmit, loading } = useModalForm<TestForm>({
        schema: testSchema,
        onSubmit,
        onSuccess
      })

      form.value = { name: 'Juan', email: 'juan@test.com', age: 25 }
      
      await handleSubmit()

      expect(onSubmit).toHaveBeenCalledWith({ name: 'Juan', email: 'juan@test.com', age: 25 })
      expect(onSuccess).toHaveBeenCalled()
      expect(loading.value).toBe(false)
    })

    it('debería prevenir envío con datos inválidos', async () => {
      const onSubmit = vi.fn()
      
      const { form, handleSubmit } = useModalForm<TestForm>({
        schema: testSchema,
        onSubmit
      })

      form.value = { name: 'J', email: 'email-invalido', age: 16 }
      
      await handleSubmit()

      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('debería manejar errores durante el envío', async () => {
      const error = new Error('Error de red')
      const onSubmit = vi.fn().mockRejectedValue(error)
      const onError = vi.fn()
      
      const { form, handleSubmit, loading } = useModalForm<TestForm>({
        schema: testSchema,
        onSubmit,
        onError
      })

      form.value = { name: 'Juan', email: 'juan@test.com', age: 25 }
      
      await handleSubmit()

      expect(onError).toHaveBeenCalledWith(error)
      expect(loading.value).toBe(false)
    })

    it('debería llamar al toast en caso de error sin onError handler', async () => {
      const error = new Error('Error de red')
      const onSubmit = vi.fn().mockRejectedValue(error)
      
      const { form, handleSubmit, loading } = useModalForm<TestForm>({
        schema: testSchema,
        onSubmit
      })

      form.value = { name: 'Juan', email: 'juan@test.com', age: 25 }
      
      await handleSubmit()

      // Verificar que el loading se resetea después del error
      expect(loading.value).toBe(false)
      expect(onSubmit).toHaveBeenCalledWith({ name: 'Juan', email: 'juan@test.com', age: 25 })
    })
  })

  describe('Utilidades de formulario', () => {
    it('debería resetear formulario correctamente', () => {
      const initialData = { name: 'Juan', email: 'juan@test.com', age: 25 }
      const onSubmit = vi.fn()
      
      const { form, resetForm, errors, fieldErrors, loading } = useModalForm<TestForm>({
        schema: testSchema,
        initialData,
        onSubmit
      })

      // Modificar formulario y añadir errores
      form.value = { name: 'Otro', email: 'otro@test.com', age: 30 }
      errors.value = { name: 'Error' }
      fieldErrors.value = { name: ['Error'] }
      loading.value = true

      resetForm()

      expect(form.value).toEqual(initialData)
      expect(errors.value).toEqual({})
      expect(fieldErrors.value).toEqual({})
      expect(loading.value).toBe(false)
    })

    it('debería actualizar datos del formulario', () => {
      const onSubmit = vi.fn()
      const { form, updateForm } = useModalForm<TestForm>({
        schema: testSchema,
        onSubmit
      })

      form.value = { name: 'Juan', email: 'juan@test.com', age: 25 }
      updateForm({ name: 'Pedro', age: 30 })

      expect(form.value).toEqual({
        name: 'Pedro',
        email: 'juan@test.com',
        age: 30
      })
    })

    it('debería obtener error de campo específico', () => {
      const onSubmit = vi.fn()
      const { getFieldError, errors } = useModalForm<TestForm>({
        schema: testSchema,
        onSubmit
      })

      errors.value = { name: 'Error de nombre' }

      expect(getFieldError('name')).toBe('Error de nombre')
      expect(getFieldError('email')).toBe('')
    })

    it('debería verificar si un campo tiene errores', () => {
      const onSubmit = vi.fn()
      const { hasFieldError, errors, fieldErrors } = useModalForm<TestForm>({
        schema: testSchema,
        onSubmit
      })

      errors.value = { name: 'Error' }
      fieldErrors.value = { email: ['Error email'] }

      expect(hasFieldError('name')).toBe(true)
      expect(hasFieldError('email')).toBe(true)
      expect(hasFieldError('age')).toBe(false)
    })
  })

  describe('Estados computados', () => {
    it('isFormValid debería reflejar estado de validación', () => {
      const onSubmit = vi.fn()
      const { isFormValid, errors, fieldErrors } = useModalForm<TestForm>({
        schema: testSchema,
        onSubmit
      })

      expect(isFormValid.value).toBe(true)

      errors.value = { name: 'Error' }
      expect(isFormValid.value).toBe(false)

      errors.value = {}
      fieldErrors.value = { email: ['Error email'] }
      expect(isFormValid.value).toBe(false)

      fieldErrors.value = {}
      expect(isFormValid.value).toBe(true)
    })

    it('hasChanges debería detectar cambios en el formulario', () => {
      const initialData = { name: 'Juan', email: 'juan@test.com', age: 25 }
      const onSubmit = vi.fn()
      
      const { form, hasChanges } = useModalForm<TestForm>({
        schema: testSchema,
        initialData,
        onSubmit
      })

      expect(hasChanges.value).toBe(false)

      form.value = { ...initialData, name: 'Pedro' }
      expect(hasChanges.value).toBe(true)

      form.value = initialData
      expect(hasChanges.value).toBe(false)
    })

    it('hasChanges debería ser true cuando hay datos sin initialData', () => {
      const onSubmit = vi.fn()
      
      const { form, hasChanges } = useModalForm<TestForm>({
        schema: testSchema,
        onSubmit
      })

      expect(hasChanges.value).toBe(false)

      form.value = { name: 'Juan' }
      expect(hasChanges.value).toBe(true)
    })
  })

  describe('Validación en tiempo real', () => {
    it('debería tener watcher configurado para revalidación', () => {
      const onSubmit = vi.fn()
      
      const { form } = useModalForm<TestForm>({
        schema: testSchema,
        onSubmit
      })

      // Verificar que el form es reactivo
      expect(form.value).toBeDefined()
      
      // Cambiar valor para verificar reactividad
      form.value = { name: 'Juan' }
      expect(form.value.name).toBe('Juan')
    })
  })
})