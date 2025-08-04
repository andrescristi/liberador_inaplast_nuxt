// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  srcDir: 'app/',
  typescript: {
    strict: true
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@vee-validate/nuxt',
    '@nuxt/eslint'
  ],
  
  // Tailwind CSS configuration
  tailwindcss: {
    configPath: '~/tailwind.config.js',
    exposeConfig: true,
    viewer: true, // Enable Tailwind viewer in dev mode
  },
  css: ['~/assets/css/main.css'],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    redirectOptions: {
      login: '/auth/login',
      callback: '/confirm',
      exclude: ['/', '/daisy-test-no-auth', '/demo-daisy', '/demo-daisy-optimized', '/test-daisy', '/showcase-components', '/design-system']
    }
  },
  runtimeConfig: {
    public: {
      supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_ANON_KEY
      }
    }
  }
})