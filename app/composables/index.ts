/**
 * Índice principal de composables
 * Re-exporta todos los composables organizados por dominio
 * 
 * Esto asegura que el auto-import de Nuxt pueda encontrar
 * todos los composables sin importar su ubicación en subdirectorios
 * 
 * ## ESTRUCTURA DE COMPOSABLES:
 * 
 * ### 🔐 Autenticación (`./auth`)
 * - `useAuth()` - Composable principal que unifica toda la funcionalidad de autenticación
 * - `useAuthLogin()` - Manejo de login/logout y sesiones de usuario
 * - `useAuthProfile()` - Gestión de perfiles de usuario y roles
 * - `useAuthPassword()` - Funciones para resetear y cambiar contraseñas
 * - `useAuthState()` - Estado reactivo de autenticación (usuario actual, estado de carga)
 * 
 * ### 🎨 Interfaz de Usuario (`./ui`)  
 * - `useToast()` - Sistema de notificaciones toast (success, error, info, warning)
 * - `useModalForm()` - Utilidad para formularios modales reutilizables
 * 
 * ### 👥 Administración (`./admin`)
 * - `useAdminUserSystem()` - Sistema completo de administración de usuarios
 * - `useAdminUserAuth()` - Autenticación específica para administradores
 * - `useAdminUserValidation()` - Validaciones con Zod para datos de usuarios
 * - `useAdminUserRepository()` - Capa de acceso a datos con patrón Repository
 * - `useAdminUserState()` - Estado reactivo de usuarios administrativos
 * - `useAdminUserCRUD()` - Operaciones CRUD de usuarios (crear, leer, actualizar, eliminar)
 * - `useAdminUserAPI()` - Llamadas HTTP para administración de usuarios
 * - `useAdminProfileManager()` - Gestión de perfiles de terceros (cualquier usuario)
 * 
 * ### 📋 Órdenes (`./orders`)
 * - `useOrderState()` - Estado reactivo de órdenes (filtros, búsqueda, orden actual)
 * - `useOrderAPI()` - Operaciones CRUD y API para gestión de órdenes
 * 
 * ### 🔬 Muestreo (`./muestreo`)
 * - `useMuestreoAPI()` - API para planes de muestreo, grupos y recomendaciones de calidad
 * 
 * ### 📊 Dashboard (`./dashboard`)
 * - `useDashboardMetrics()` - Métricas del dashboard por rol, estadísticas de inspecciones
 * 
 * ### 🔧 Herramientas (`./tools`)
 * - `useDebounce()` - Utilidad para debounce de funciones e inputs
 * - `useImageCompression()` - Compresión de imágenes antes de subir
 * - `useOCRConfig()` - Configuración para reconocimiento óptico de caracteres
 * - `useLogger()` - Sistema de logging con pino para debugging y monitoreo
 */

// ============================================================================
// COMPOSABLES DE AUTENTICACIÓN
// ============================================================================
export * from './auth'

// ============================================================================
// COMPOSABLES DE INTERFAZ DE USUARIO
// ============================================================================
export * from './ui'

// ============================================================================
// COMPOSABLES DE ADMINISTRACIÓN
// ============================================================================
export * from './admin'

// ============================================================================
// COMPOSABLES DE ÓRDENES
// ============================================================================
export * from './orders'

// ============================================================================
// COMPOSABLES DE MUESTREO
// ============================================================================
export * from './muestreo'

// ============================================================================
// COMPOSABLES DE DASHBOARD
// ============================================================================
export * from './dashboard'

// ============================================================================
// COMPOSABLES DE HERRAMIENTAS
// ============================================================================
export * from './tools'

