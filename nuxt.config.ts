// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  srcDir: 'app/',
  css: [
    '~/assets/css/main.css',
    '~/assets/css/mobile-optimizations.css'
  ],
  typescript: {
    strict: true
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@vee-validate/nuxt',
    '@nuxt/eslint'
  ],
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