import pino from 'pino'
import type { NitroApp } from 'nitropack'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  // Logger configurado exclusivamente para stdout sin filesystem
  const logger = pino({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: process.env.NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss'
      }
    } : undefined
  })

  // Hooks de Nitro para logging de requests
  nitroApp.hooks.hook('request', (event: any) => {
    event.context.logger = logger
    logger.info({
      url: event.node.req.url,
      method: event.node.req.method,
      userAgent: event.node.req.headers['user-agent']
    }, 'Incoming request')
  })

  nitroApp.hooks.hook('beforeResponse', (event: any) => {
    const logger = event.context.logger
    if (logger) {
      logger.info({
        url: event.node.req.url,
        method: event.node.req.method,
        statusCode: event.node.res.statusCode
      }, 'Request completed')
    }
  })

  nitroApp.hooks.hook('error', (error: any, context: any) => {
    const event = context?.event
    const logger = event?.context?.logger || pino()
    logger.error({
      error: error.message,
      stack: error.stack,
      url: event?.node?.req?.url,
      method: event?.node?.req?.method
    }, 'Request error')
  })
})