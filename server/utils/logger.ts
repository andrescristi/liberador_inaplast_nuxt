import pino from 'pino'
import type { H3Event } from 'h3'

/**
 * Sistema de logging estructurado usando Pino
 *
 * Reemplaza console.log/error con logs estructurados que incluyen:
 * - Niveles de severidad (debug, info, warn, error, fatal)
 * - Contexto automático (timestamp, hostname, pid)
 * - Metadata estructurada en JSON
 * - Performance mejorada vs console.log
 *
 * En producción, los logs se envían en formato JSON para integración
 * con sistemas de observabilidad (Vercel Logs, Datadog, etc.)
 */

// Configuración según entorno
const isDevelopment = process.env.NODE_ENV !== 'production'

// Crear instancia de logger con configuración optimizada
export const logger = pino({
  level: isDevelopment ? 'debug' : 'info',

  // En desarrollo, usar formato legible con colores
  // En producción, usar JSON estructurado
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
          singleLine: false,
        },
      }
    : undefined,

  // Configuración base
  base: {
    env: process.env.NODE_ENV,
  },

  // Formatear errores correctamente
  formatters: {
    level: (label) => {
      return { level: label }
    },
  },

  // Serializar errores con stack trace completo
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
})

/**
 * Crea un logger hijo con contexto específico
 *
 * Útil para logs de un módulo o feature específico
 *
 * @example
 * const authLogger = createLogger('auth')
 * authLogger.info({ userId: 123 }, 'Usuario autenticado')
 */
export function createLogger(name: string) {
  return logger.child({ module: name })
}

/**
 * Extrae información relevante del evento HTTP para logging
 */
function extractEventContext(event: H3Event) {
  const headers = getHeaders(event)

  return {
    method: event.method,
    path: event.path,
    ip: headers['x-forwarded-for'] || headers['x-real-ip'] || 'unknown',
    userAgent: headers['user-agent'],
    requestId: headers['x-request-id'],
  }
}

/**
 * Logger específico para requests HTTP con contexto automático
 *
 * @example
 * logRequest(event, 'info', { orderId: 123 }, 'Orden procesada')
 */
export function logRequest(
  event: H3Event,
  level: 'debug' | 'info' | 'warn' | 'error',
  data: object,
  message: string,
) {
  const context = extractEventContext(event)

  logger[level](
    {
      ...context,
      ...data,
    },
    message,
  )
}

/**
 * Logger específico para autenticación con contexto de seguridad
 */
export const authLogger = createLogger('auth')

/**
 * Logger específico para base de datos
 */
export const dbLogger = createLogger('database')

/**
 * Logger específico para OCR
 */
export const ocrLogger = createLogger('ocr')

/**
 * Logger específico para generación de PDFs
 */
export const pdfLogger = createLogger('pdf')

/**
 * Logger específico para órdenes y muestreo
 */
export const orderLogger = createLogger('orders')

/**
 * Utilidad para medir tiempo de ejecución
 *
 * @example
 * const timer = startTimer()
 * await someOperation()
 * logger.info({ duration: timer() }, 'Operación completada')
 */
export function startTimer() {
  const start = Date.now()
  return () => Date.now() - start
}

/**
 * Wrapper para operaciones async con logging automático
 *
 * @example
 * const result = await loggedOperation(
 *   'generarPDF',
 *   async () => await generatePDF(),
 *   { orderId: 123 }
 * )
 */
export async function loggedOperation<T>(
  operationName: string,
  operation: () => Promise<T>,
  context?: object,
): Promise<T> {
  const timer = startTimer()

  try {
    logger.debug({ operation: operationName, ...context }, `Iniciando ${operationName}`)

    const result = await operation()

    logger.info(
      { operation: operationName, duration: timer(), ...context },
      `${operationName} completado`,
    )

    return result
  }
  catch (error) {
    logger.error(
      {
        operation: operationName,
        duration: timer(),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        ...context,
      },
      `${operationName} falló`,
    )

    throw error
  }
}

/**
 * Helper para sanitizar datos sensibles antes de loggear
 *
 * Remueve passwords, tokens, etc.
 */
export function sanitizeForLog<T extends Record<string, any>>(data: T): Record<string, any> {
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'authorization']

  const sanitized: Record<string, any> = { ...data }

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]'
    }
  }

  return sanitized
}
