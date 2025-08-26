import { z } from 'zod'
import type { ZodObject, ZodRawShape } from 'zod'

interface UseModalFormOptions<T extends Record<string, unknown>> {
  schema: ZodObject<ZodRawShape, 'strip', z.ZodTypeAny, T>
  initialData?: Partial<T>
  onSubmit: (data: T) => Promise<void>
  onSuccess?: () => void
  onError?: (error: Error) => void
}

/**
 * Composable para manejar formularios en modales con validación Zod
 * Reutilizable para todos los modales de crear/editar
 */
export function useModalForm<T extends Record<string, unknown>>(
  options: UseModalFormOptions<T>
) {
  const { schema, initialData, onSubmit, onSuccess, onError } = options
  const toast = useToast()

  // Estado del formulario
  const form = ref<Partial<T>>(initialData ? { ...initialData } : {} as Partial<T>)
  const errors = ref<Record<string, string>>({})
  const loading = ref(false)
  const fieldErrors = ref<Record<string, string[]>>({})

  /**
   * Valida el formulario usando el esquema Zod
   */
  const validateForm = (): boolean => {
    errors.value = {}
    fieldErrors.value = {}

    try {
      schema.parse(form.value)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Mapear errores de Zod a formato utilizable
        error.errors.forEach((err) => {
          const fieldName = err.path.join('.')
          if (!fieldErrors.value[fieldName]) {
            fieldErrors.value[fieldName] = []
          }
          fieldErrors.value[fieldName].push(err.message)
          
          // También mantener compatibilidad con formato anterior
          if (!errors.value[fieldName]) {
            errors.value[fieldName] = err.message
          }
        })
      }
      return false
    }
  }

  /**
   * Valida un campo específico
   */
  const validateField = (fieldName: keyof T): void => {
    try {
      // Crear un objeto temporal con solo el campo a validar
      const testData = {
        ...form.value,
        [fieldName]: form.value[fieldName]
      } as T
      
      // Validar todo el objeto pero solo reportar errores del campo específico
      schema.parse(testData)
      
      // Limpiar errores del campo si la validación pasa
      const fieldKey = fieldName as string
      if (fieldKey in errors.value) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete errors.value[fieldKey]
      }
      if (fieldKey in fieldErrors.value) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete fieldErrors.value[fieldKey]
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Buscar errores específicos del campo
        const fieldErrors_ = error.errors.filter(err => 
          err.path.length > 0 && err.path[0] === fieldName
        )
        
        if (fieldErrors_.length > 0) {
          const fieldName_ = fieldName as string
          errors.value[fieldName_] = fieldErrors_[0]?.message || 'Error de validación'
          fieldErrors.value[fieldName_] = fieldErrors_.map(e => e.message)
        }
      }
    }
  }

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return
    }

    loading.value = true
    try {
      // Validar que tenemos todos los datos necesarios
      const validatedData = schema.parse(form.value)
      await onSubmit(validatedData)
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado'
      
      if (onError) {
        onError(error as Error)
      } else {
        toast.error('Error', errorMessage)
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Resetea el formulario
   */
  const resetForm = (): void => {
    form.value = initialData ? { ...initialData } : {} as Partial<T>
    errors.value = {}
    fieldErrors.value = {}
    loading.value = false
  }

  /**
   * Actualiza datos del formulario
   */
  const updateForm = (data: Partial<T>): void => {
    form.value = { ...form.value, ...data }
  }

  /**
   * Obtiene el error de un campo específico
   */
  const getFieldError = (fieldName: keyof T): string => {
    return errors.value[fieldName as string] || ''
  }

  /**
   * Obtiene todos los errores de un campo específico
   */
  const getFieldErrors = (fieldName: keyof T): string[] => {
    return fieldErrors.value[fieldName as string] || []
  }

  /**
   * Verifica si un campo tiene errores
   */
  const hasFieldError = (fieldName: keyof T): boolean => {
    return !!(errors.value[fieldName as string] || fieldErrors.value[fieldName as string]?.length)
  }

  /**
   * Verifica si el formulario es válido
   */
  const isFormValid = computed((): boolean => {
    return Object.keys(errors.value).length === 0 && Object.keys(fieldErrors.value).length === 0
  })

  /**
   * Verifica si hay cambios en el formulario
   */
  const hasChanges = computed((): boolean => {
    if (!initialData) return Object.keys(form.value).length > 0
    
    return JSON.stringify(form.value) !== JSON.stringify(initialData)
  })

  // Limpiar errores cuando se cambia un campo
  watch(
    form, 
    (newForm) => {
      // Validar campos en tiempo real (debounced)
      Object.keys(newForm).forEach(key => {
        if (errors.value[key] || fieldErrors.value[key]) {
          // Esperar un poco antes de revalidar para evitar spam
          setTimeout(() => validateField(key as keyof T), 500)
        }
      })
    },
    { deep: true }
  )

  return {
    form,
    errors: readonly(errors),
    fieldErrors: readonly(fieldErrors),
    loading: readonly(loading),
    isFormValid,
    hasChanges,
    validateForm,
    validateField,
    handleSubmit,
    resetForm,
    updateForm,
    getFieldError,
    getFieldErrors,
    hasFieldError
  }
}