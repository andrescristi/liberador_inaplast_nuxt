/**
 * Plugin simple para manejar errores de tokens de Supabase
 */
export default defineNuxtPlugin(() => {
  // Solo ejecutar en el cliente después de la hidratación
  if (!import.meta.client) return

  // Esperar a que la página esté completamente cargada
  if (typeof window === 'undefined') return

  // Función simple para limpiar localStorage
  const clearSupabaseTokens = () => {
    try {
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.includes('supabase') || key?.includes('sb-')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key)
        } catch (e) {
          // Silently ignore errors
        }
      })
    } catch (error) {
      // Silently ignore errors
    }
  }

  // Interceptar errores de refresh token
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason
    if (error?.message?.includes?.('Invalid Refresh Token') || 
        error?.message?.includes?.('Refresh Token Not Found')) {
      clearSupabaseTokens()
      event.preventDefault()
    }
  })
})