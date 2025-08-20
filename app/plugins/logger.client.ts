export default defineNuxtPlugin(() => {
  // Client-side logger that uses console methods
  const logger = {
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
    fatal: console.error,
    child: () => logger,
  }

  // Provide the logger to the Nuxt app context
  return {
    provide: {
      logger
    }
  }
})

