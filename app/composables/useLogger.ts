import type { Logger } from 'pino'
import { z } from 'zod'

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
type LogData = Record<string, unknown>

interface SafeLogger {
  trace: (message: string, data?: LogData) => void
  debug: (message: string, data?: LogData) => void
  info: (message: string, data?: LogData) => void
  warn: (message: string, data?: LogData) => void
  error: (message: string, data?: LogData) => void
  fatal: (message: string, data?: LogData) => void
  isEnabled: (level: LogLevel) => boolean
}

const logMessageSchema = z.string().min(1).max(1000)
const logDataSchema = z.record(z.unknown()).optional()

const SENSITIVE_KEYS = [
  'password', 'token', 'secret', 'key', 'auth', 'authorization',
  'cookie', 'session', 'apikey', 'api_key', 'access_token',
  'refresh_token', 'jwt', 'bearer', 'credential', 'pin'
]

const MAX_LOGS_PER_MINUTE = 100
const logCounts = new Map<string, { count: number; resetTime: number }>()

/**
 * Sanitiza datos sensibles de los logs
 */
const sanitizeLogData = (data: LogData): LogData => {
  if (!data || typeof data !== 'object') return {}
  
  const sanitized = { ...data }
  
  for (const [key, value] of Object.entries(sanitized)) {
    const lowerKey = key.toLowerCase()
    
    // Filtrar claves sensibles
    if (SENSITIVE_KEYS.some(sensitiveKey => lowerKey.includes(sensitiveKey))) {
      sanitized[key] = '[REDACTED]'
      continue
    }
    
    // Sanitizar strings que parezcan tokens o passwords
    if (typeof value === 'string') {
      // JWT tokens
      if (value.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/)) {
        sanitized[key] = '[JWT_REDACTED]'
        continue
      }
      
      // API keys (strings largas alfanuméticas)
      if (value.length > 20 && /^[A-Za-z0-9+/=_-]+$/.test(value)) {
        sanitized[key] = '[API_KEY_REDACTED]'
        continue
      }
    }
    
    // Recursivamente sanitizar objetos anidados
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeLogData(value as LogData)
    }
  }
  
  return sanitized
}

/**
 * Valida mensaje de log
 */
const validateLogMessage = (message: unknown): string => {
  try {
    const validMessage = logMessageSchema.parse(message)
    // Remover caracteres de control y limitar longitud
    return validMessage.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').substring(0, 1000) // eslint-disable-line no-control-regex
  } catch {
    return '[INVALID_MESSAGE]'
  }
}

/**
 * Implementa rate limiting para prevenir spam de logs
 */
const checkRateLimit = (identifier: string = 'default'): boolean => {
  const now = Date.now()
  const currentMinute = Math.floor(now / 60000)
  
  const entry = logCounts.get(identifier)
  
  if (!entry || entry.resetTime !== currentMinute) {
    logCounts.set(identifier, { count: 1, resetTime: currentMinute })
    return true
  }
  
  if (entry.count >= MAX_LOGS_PER_MINUTE) {
    return false
  }
  
  entry.count++
  return true
}

/**
 * Obtiene el nivel mínimo de log según el entorno
 */
const getMinLogLevel = (): LogLevel => {
  const env = process.env.NODE_ENV
  const logLevel = process.env.LOG_LEVEL as LogLevel
  
  if (logLevel) return logLevel
  
  switch (env) {
    case 'production': return 'info'
    case 'test': return 'warn'
    default: return 'debug'
  }
}

const LOG_LEVELS: Record<LogLevel, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60
}

export const useLogger = (): SafeLogger => {
  const nuxtApp = useNuxtApp()
  const pinoLogger = nuxtApp.$logger as Logger
  const minLevel = getMinLogLevel()
  const minLevelValue = LOG_LEVELS[minLevel]
  
  const createLogMethod = (level: LogLevel) => {
    return (message: unknown, data?: unknown) => {
      try {
        // Verificar si el nivel está habilitado
        if (LOG_LEVELS[level] < minLevelValue) {
          return
        }
        
        // Rate limiting
        if (!checkRateLimit()) {
          return
        }
        
        // Validar y sanitizar inputs
        const safeMessage = validateLogMessage(message)
        const validatedData = data ? logDataSchema.parse(data) : undefined
        const safeData = validatedData ? sanitizeLogData(validatedData) : undefined
        
        // Agregar metadata de contexto
        const logContext = {
          timestamp: new Date().toISOString(),
          level,
          environment: process.env.NODE_ENV || 'development',
          ...safeData
        }
        
        // Log usando pino
        pinoLogger[level](logContext, safeMessage)
      } catch {
        // Fallback silencioso para evitar loops de error
        // Error en logger - no loggear para evitar loops
      }
    }
  }
  
  const isEnabled = (level: LogLevel): boolean => {
    return LOG_LEVELS[level] >= minLevelValue
  }
  
  return {
    trace: createLogMethod('trace'),
    debug: createLogMethod('debug'),
    info: createLogMethod('info'),
    warn: createLogMethod('warn'),
    error: createLogMethod('error'),
    fatal: createLogMethod('fatal'),
    isEnabled
  }
}