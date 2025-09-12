import { z } from 'zod'

/**
 * Esquema de validación para datos del Paso 1 del wizard de nueva orden
 */
export const orderStep1Schema = z.object({
  labelImage: z.instanceof(File).nullable(),
  labelImagePreview: z.string(),
  cantidadEmbalajes: z.number()
    .min(1, 'La cantidad debe ser mayor a 0')
    .max(1000, 'La cantidad no puede ser mayor a 1000')
    .int('La cantidad debe ser un número entero'),
  unidadesPorEmbalaje: z.number()
    .min(1, 'Las unidades por embalaje deben ser mayor a 0')
    .int('Las unidades deben ser un número entero')
    .optional(),
})

/**
 * Esquema de validación para datos del Paso 2 del wizard de nueva orden
 * Campos requeridos para continuar al siguiente paso
 */
export const orderStep2Schema = z.object({
  // Campos requeridos
  cliente: z.string().min(1, 'El nombre del cliente es requerido'),
  producto: z.string().min(1, 'El nombre del producto es requerido'),
  codigoProducto: z.string().min(1, 'El código del producto es requerido'),
  pedido: z.string().min(1, 'El número de pedido es requerido'),
  fechaFabricacion: z.string().min(1, 'La fecha de fabricación es requerida'),
  turno: z.enum(['mañana', 'tarde', 'noche'], {
    errorMap: () => ({ message: 'Selecciona un turno válido' })
  }),
  numeroOperario: z.string().min(1, 'El número de operario es requerido'),
  maquina: z.string().min(1, 'La máquina es requerida'),
  inspectorCalidad: z.string().min(1, 'El inspector de calidad es requerido'),
  // Campos opcionales
  lote: z.string().optional(),
  jefeDeTurno: z.string().optional(),
  ordenDeCompra: z.string().optional(),
  unidadesPorEmbalaje: z.number().int().positive().optional().nullable(),
})

/**
 * Esquema de validación para datos del Paso 3 del wizard de nueva orden
 * Tests de calidad y observaciones
 */
export const orderStep3Schema = z.object({
  cantidadMuestra: z.number()
    .min(1, 'La cantidad de muestra debe ser mayor a 0')
    .int('La cantidad debe ser un número entero')
    .optional(),
  ordersTests: z.array(z.object({
    testId: z.number(),
    aprobado: z.boolean(),
    cantidad_unidades_con_falla: z.number().min(0).optional()
  })).optional(),
  qualityNotes: z.string().optional(),
  // Mantener compatibilidad
  testResults: z.record(z.string(), z.boolean()).optional(),
})

/**
 * Esquema de validación completo para crear una nueva orden
 * Combina todos los pasos del wizard
 */
export const newOrderSchema = z.object({
  // Step 1
  labelImage: z.instanceof(File).nullable(),
  labelImagePreview: z.string(),
  packageImage: z.instanceof(File).nullable().optional(),
  packageImagePreview: z.string().optional(),
  cantidadEmbalajes: z.number()
    .min(1, 'La cantidad debe ser mayor a 0')
    .max(1000, 'La cantidad no puede ser mayor a 1000')
    .int('La cantidad debe ser un número entero'),
  unidadesPorEmbalaje: z.number()
    .min(1, 'Las unidades por embalaje deben ser mayor a 0')
    .int('Las unidades deben ser un número entero')
    .optional(),
  
  // Step 2 - Datos del producto y cliente
  cliente: z.string().min(1, 'El nombre del cliente es requerido'),
  producto: z.string().min(1, 'El nombre del producto es requerido'),
  codigoProducto: z.string().min(1, 'El código del producto es requerido'),
  pedido: z.string().min(1, 'El número de pedido es requerido'),
  fechaFabricacion: z.string().min(1, 'La fecha de fabricación es requerida'),
  turno: z.enum(['mañana', 'tarde', 'noche'], {
    errorMap: () => ({ message: 'Selecciona un turno válido' })
  }),
  numeroOperario: z.string().min(1, 'El número de operario es requerido'),
  maquina: z.string().min(1, 'La máquina es requerida'),
  inspectorCalidad: z.string().min(1, 'El inspector de calidad es requerido'),
  lote: z.string().optional(),
  jefeDeTurno: z.string().optional(),
  ordenDeCompra: z.string().optional(),
  
  // Step 3 - Tests de calidad
  cantidadMuestra: z.number()
    .min(1, 'La cantidad de muestra debe ser mayor a 0')
    .int('La cantidad debe ser un número entero')
    .optional(),
  ordersTests: z.array(z.object({
    testId: z.number(),
    aprobado: z.boolean(),
    cantidad_unidades_con_falla: z.number().min(0).optional()
  })).optional(),
  qualityNotes: z.string().optional(),
  testResults: z.record(z.number(), z.boolean()).optional(),
  
  // Step 4 - Resultados finales (opcionales para el wizard)
  finalResult: z.enum(['approved', 'rejected', 'conditional']).optional(),
  rejectionReason: z.string().optional(),
  recommendations: z.string().optional(),
})

/**
 * Esquema para datos del formulario de nueva orden (sin archivos)
 * Útil para persistencia y validación de datos textuales
 */
export const newOrderDataSchema = newOrderSchema.omit({
  packageImage: true,
  labelImage: true,
})

/**
 * Esquema para validar datos antes de enviar a la API
 * Solo campos requeridos por el backend
 */
export const orderAPISchema = z.object({
  lote: z.string().optional(),
  cliente: z.string().min(1, 'El nombre del cliente es requerido'),
  producto: z.string().min(1, 'El nombre del producto es requerido'),
  pedido: z.string().min(1, 'El número de pedido es requerido'),
  fechaFabricacion: z.string().min(1, 'La fecha de fabricación es requerida'),
  codigoProducto: z.string().min(1, 'El código del producto es requerido'),
  turno: z.enum(['mañana', 'tarde', 'noche']),
  cantidadEmbalajes: z.number()
    .min(1, 'La cantidad debe ser mayor a 0')
    .int('La cantidad debe ser un número entero'),
  unidadesPorEmbalaje: z.number()
    .min(1, 'Las unidades por embalaje deben ser mayor a 0')
    .int('Las unidades deben ser un número entero')
    .optional(),
  jefeDeTurno: z.string().optional(),
  ordenDeCompra: z.string().optional(),
  numeroOperario: z.string().min(1, 'El número de operario es requerido'),
  maquina: z.string().min(1, 'La máquina es requerida'),
  inspectorCalidad: z.string().min(1, 'El inspector de calidad es requerido'),
  ordersTests: z.array(z.object({
    testId: z.number(),
    aprobado: z.boolean(),
    cantidad_unidades_con_falla: z.number().min(0).optional()
  })).min(1, 'Debe incluir al menos un test')
})

// Tipos derivados de los esquemas
export type OrderStep1Data = z.infer<typeof orderStep1Schema>
export type OrderStep2Data = z.infer<typeof orderStep2Schema>
export type OrderStep3Data = z.infer<typeof orderStep3Schema>
export type NewOrderData = z.infer<typeof newOrderSchema>
export type NewOrderFormData = z.infer<typeof newOrderDataSchema>
export type OrderAPIData = z.infer<typeof orderAPISchema>

// Tipo específico para el estado local de Step3 (más específico que el esquema)
export type OrderStep3LocalData = {
  testResults: Record<number, number> // Cambiar de boolean a number (cantidad de rechazos)
  qualityNotes: string
  cantidadMuestra: number
}

// Tipo para resultados de test con cantidad de rechazos
export type TestResult = {
  testId: number
  cantidadRechazos: number // Cantidad de unidades que fallaron este test
}