export default defineNuxtPlugin(() => {
  // Plugin de servidor para asegurar que Pinia esté disponible durante SSR
  // @pinia/nuxt ya maneja la inicialización, pero este plugin
  // asegura que no haya problemas de timing durante SSR
  
  if (import.meta.server) {
    // En el servidor, Pinia ya está configurado por @pinia/nuxt
    // Este plugin sirve para debugging y hooks adicionales si fuera necesario
    // Pinia server plugin initialized
  }
})