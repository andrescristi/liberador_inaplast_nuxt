/**
 * Composable para usar Pinia de forma segura
 * Evita el error "getActivePinia() was called but there was no active Pinia"
 */
import { getActivePinia } from 'pinia'

export function useSafePinia() {
  const isPiniaReady = ref(false)
  
  // Verifica si Pinia está disponible
  const checkPiniaAvailability = () => {
    try {
      const pinia = getActivePinia()
      isPiniaReady.value = !!pinia
      return !!pinia
    } catch {
      isPiniaReady.value = false
      return false
    }
  }
  
  // Espera a que Pinia esté disponible
  const waitForPinia = async (timeout = 5000): Promise<boolean> => {
    return new Promise((resolve) => {
      let attempts = 0
      const maxAttempts = timeout / 100
      
      const check = () => {
        if (checkPiniaAvailability()) {
          resolve(true)
          return
        }
        
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(check, 100)
        } else {
          resolve(false)
        }
      }
      
      check()
    })
  }
  
  // Hook para inicializar cuando esté disponible
  onMounted(async () => {
    await waitForPinia()
  })
  
  return {
    isPiniaReady: readonly(isPiniaReady),
    checkPiniaAvailability,
    waitForPinia
  }
}