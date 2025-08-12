export default defineNuxtPlugin((nuxtApp) => {
  // Este plugin se ejecuta solo en el cliente
  // Pinia ya está configurado por @pinia/nuxt, pero esto asegura
  // que esté disponible cuando se necesite en el cliente
  
  nuxtApp.hook('app:created', () => {
    // Pinia ya está disponible aquí
    console.log('Pinia initialized on client')
  })
})