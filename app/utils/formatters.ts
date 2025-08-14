/**
 * Utilidades de formateo centralizadas para la aplicación Liberador Inaplast
 * 
 * Usa APIs nativas de Intl para garantizar:
 * - Compatibilidad cross-browser
 * - Soporte de localización nativo
 * - Sin dependencias externas
 * - Formateo consistente en toda la aplicación
 * 
 * NOTA: Aunque el UI está en español, algunos formateos usan 'en-US'
 * para mantener estándares internacionales (e.g., currency, fechas ISO)
 */

/**
 * Formatea número como moneda en formato USD
 * 
 * Usado para:
 * - Montos de órdenes de liberación
 * - Costos de productos en reportes
 * - Dashboard de métricas financieras
 * 
 * @param amount - Número a formatear (puede ser decimal)
 * @returns String formateado como "$1,234.56"
 * 
 * @example
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(0) // "$0.00"
 * formatCurrency(-500) // "-$500.00"
 */
export function formatCurrency(amount: number): string {
  // Usar locale en-US para formato USD estándar internacional
  // Separadores de miles y decimales consistentes
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

/**
 * Formatea string de fecha ISO a formato legible largo
 * 
 * Convierte fechas de base de datos (ISO 8601) a formato
 * amigable para usuarios en interfaces de liberaciones.
 * 
 * @param dateString - Fecha en formato ISO (2023-12-31T23:59:59Z)
 * @returns Fecha formateada como "December 31, 2023"
 * 
 * @example
 * formatDate("2023-12-31T10:30:00Z") // "December 31, 2023"
 * formatDate("2023-01-15") // "January 15, 2023"
 * 
 * @throws Retorna "Invalid Date" si dateString no es válido
 */
export function formatDate(dateString: string): string {
  // Formato largo para legibilidad en reportes y vistas detalladas
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',    // "January" en lugar de "Jan" para claridad
    day: 'numeric'    // Sin ceros a la izquierda
  })
}

/**
 * Formatea string de fecha ISO a formato con fecha y hora
 * 
 * Usado para timestamps críticos como:
 * - Creación de liberaciones
 * - Logs de actividad de usuario
 * - Histórico de cambios de estado
 * 
 * @param dateString - Fecha en formato ISO con timezone
 * @returns Fecha y hora formateadas como "Dec 31, 2023, 6:30 PM"
 * 
 * @example
 * formatDateTime("2023-12-31T18:30:00Z") // "Dec 31, 2023, 6:30 PM"
 * formatDateTime("2023-01-15T09:15:00Z") // "Jan 15, 2023, 9:15 AM"
 * 
 * @throws Retorna "Invalid Date" si dateString no es válido
 */
export function formatDateTime(dateString: string): string {
  // Formato compacto para timestamps donde el espacio es limitado
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',   // "Dec" en lugar de "December" para compactar
    day: 'numeric',
    hour: 'numeric',  // Con AM/PM automático
    minute: 'numeric' // Sin segundos para simplicidad
  })
}