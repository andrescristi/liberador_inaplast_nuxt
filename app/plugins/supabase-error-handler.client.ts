/**
 * Plugin para manejar errores de autenticación de Supabase
 * Principalmente para tokens de refresco corruptos o expirados
 */
export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  
  // Función para limpiar tokens corruptos
  const clearCorruptedTokens = async () => {
    try {
      // Limpiar localStorage
      if (import.meta.client) {
        // Limpiar todas las claves relacionadas con Supabase
        const keysToRemove = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key?.includes('supabase') || key?.includes('sb-')) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key))
        
        // Limpiar sessionStorage también
        const sessionKeysToRemove = []
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i)
          if (key?.includes('supabase') || key?.includes('sb-')) {
            sessionKeysToRemove.push(key)
          }
        }
        sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key))
      }
      
      // Cerrar sesión de Supabase sin hacer llamada al servidor
      await supabase.auth.signOut({ scope: 'local' })
    } catch (error) {
      console.warn('Error clearing corrupted tokens:', error)
    }
  }

  // Verificar y limpiar tokens corruptos al cargar la página
  if (import.meta.client) {
    try {
      const { error } = await supabase.auth.getSession()
      
      // Si hay error con la sesión, limpiar tokens
      if (error && error.message.includes('Invalid Refresh Token')) {
        console.log('Detected corrupted refresh token, clearing...')
        await clearCorruptedTokens()
      }
    } catch (error) {
      console.warn('Error checking session:', error)
      // En caso de cualquier error, limpiar tokens por seguridad
      await clearCorruptedTokens()
    }

    // Escuchar cambios de autenticación para detectar errores
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' && !session && user.value) {
        // Si se cerró sesión pero el usuario aún existe, puede ser un error
        console.log('Detected auth state mismatch, clearing tokens...')
        await clearCorruptedTokens()
      }
    })

    // Interceptar errores globales relacionados con refresh tokens
    window.addEventListener('unhandledrejection', async (event) => {
      const error = event.reason
      if (error && typeof error === 'object' && error.message) {
        if (error.message.includes('Invalid Refresh Token') || 
            error.message.includes('Refresh Token Not Found')) {
          console.log('Caught refresh token error, clearing tokens...')
          await clearCorruptedTokens()
          event.preventDefault() // Prevenir que el error se propague
        }
      }
    })
  }
})