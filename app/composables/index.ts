/**
 * Índice principal de composables
 * Re-exporta todos los composables organizados por dominio
 * 
 * Esto asegura que el auto-import de Nuxt pueda encontrar
 * todos los composables sin importar su ubicación en subdirectorios
 */

// Composables de autenticación
export * from './auth'

// Composables de UI
export * from './ui'

// Composables de administración
export * from './admin'

// Composables de órdenes
export * from './orders'

// Composables de muestreo
export * from './muestreo'

// Composables de dashboard
export * from './dashboard'

