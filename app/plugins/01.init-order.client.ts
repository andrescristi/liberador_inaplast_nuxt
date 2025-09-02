/**
 * Plugin para garantizar el orden correcto de inicialización de módulos
 * 
 * Este plugin se ejecuta únicamente en el cliente y se asegura de que:
 * 1. Vue esté completamente inicializado
 * 2. Supabase se configure correctamente
 * 3. Los composables se inicialicen en el orden correcto
 * 
 * Previene errores de "Cannot access before initialization" 
 * que ocurren en producción debido a la minificación y chunking
 */

export default defineNuxtPlugin({
  name: 'init-order',
  hooks: {
    'app:beforeMount': async (_vueApp) => {
      // Ensure Vue is fully ready
      await nextTick()
      
      try {
        // Pre-initialize critical composables in correct order
        const supabase = useSupabaseClient()
        
        // Verify Supabase is available
        if (!supabase) {
          console.warn('[Init Order] Supabase not available during initialization')
          return
        }
        
        // Pre-warm auth state (without triggering side effects)
        await supabase.auth.getUser()
        
        console.log('[Init Order] Module initialization completed successfully')
        
      } catch (error) {
        console.error('[Init Order] Error during module initialization:', error)
        // Don't throw - let the app continue loading
      }
    }
  }
})