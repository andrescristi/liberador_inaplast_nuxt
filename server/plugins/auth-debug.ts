export default defineNitroPlugin(() => {
  console.log('[DEBUG] auth-debug.ts - Plugin de debugging cargado')

  // Hook para el endpoint automático de nuxt-auth-utils
  sessionHooks.hook('fetch', async (session, event) => {
    console.log('[DEBUG] auth-debug.ts - sessionHooks.fetch llamado')
    console.log('[DEBUG] auth-debug.ts - Session data:', session)
    console.log('[DEBUG] auth-debug.ts - Event URL:', event.node.req.url)
  })

  sessionHooks.hook('clear', async (session, event) => {
    console.log('[DEBUG] auth-debug.ts - sessionHooks.clear llamado')
    console.log('[DEBUG] auth-debug.ts - Session data:', session)
  })
})