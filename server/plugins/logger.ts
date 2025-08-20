import pino from 'pino'
import fs from 'node:fs'
import path from 'node:path'

declare module 'h3' {
  interface H3EventContext {
    logger: ReturnType<typeof pino>
  }
}

export default defineNitroPlugin((nitroApp) => {
  const logDir = path.join(process.cwd(), 'logs')
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }
  const logFilePath = path.join(logDir, 'server.log')

  // Create a writable stream for the log file
  const dest = pino.destination({ dest: logFilePath, sync: false })

  // Initialize Pino logger
  const logger = pino({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    formatters: {
      level: (label) => ({ level: label }),
    },
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
  }, dest)

  // Attach logger to h3 event context for API routes and server middleware
  nitroApp.hooks.hook('request', (event) => {
    event.context.logger = logger
  })

  // Global error handling for Nitro
  nitroApp.hooks.hook('error', (error, { event }) => {
    const currentLogger = event?.context?.logger || logger
    currentLogger.error({
      error: error?.message,
      stack: error?.stack,
      url: event?.url,
      method: event?.method,
      statusCode: event?.res?.statusCode,
    }, 'Unhandled server error')
  })
})