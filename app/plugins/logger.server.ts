import pino from 'pino'

export default defineNuxtPlugin(() => {
  let logger

  // On the server, try to use the logger instance attached by the Nitro plugin
  const event = useRequestEvent()
  if (event && event.context.logger) {
    logger = event.context.logger
  } else {
    // Fallback for server-side code that might run outside a request context
    logger = pino({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    })
  }

  // Provide the logger to the Nuxt app context
  return {
    provide: {
      logger
    }
  }
})

// Composable for convenience
export const useLogger = () => {
  return useNuxtApp().$logger
}