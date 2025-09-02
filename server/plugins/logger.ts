import pino from 'pino'

export default defineNitroPlugin((nitroApp) => {
  // Logger simplificado para entornos serverless - solo stdout
  const logger = pino({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
    // Sin transport en producción para compatibilidad serverless
  })

  // Solo mantener logging de errores para serverless
  nitroApp.hooks.hook('error', (error, { event }) => {
    logger.error({
      error: error.message,
      stack: error.stack,
      url: event?.node?.req?.url,
      method: event?.node?.req?.method
    }, 'Request error')
  })
})