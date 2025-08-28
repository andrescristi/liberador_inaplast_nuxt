// Esquemas compartidos
export * from './shared/image'

// Esquemas de administración
export * from './admin/user'

// Esquemas de órdenes
export * from './orders/ocr'
export * from './orders/new_order'

// Re-exports específicos para compatibilidad con nombres antiguos
export { newOrderSchema as orderDataSchema } from './orders/new_order'