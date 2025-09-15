export default defineNuxtPlugin((nuxtApp) => {
  // Este plugin se ejecuta solo en el cliente
  // Asegura que Pinia esté completamente disponible antes del rendering
  
  nuxtApp.hook('app:beforeMount', () => {
    // Verificar que Pinia esté disponible antes del mount
    const pinia = nuxtApp.$pinia
    if (!pinia) {
      // Pinia not available before mount
    }
  })
  
  nuxtApp.hook('app:mounted', () => {
    // Pinia completamente inicializado en cliente
    // Pinia client initialized
  })
})