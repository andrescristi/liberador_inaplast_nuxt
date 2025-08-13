// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  compatibilityDate: '2025-08-11',
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
    '@nuxt/eslint',
    '@nuxt/icon'
  ],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    types: './types/database.types.ts',
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/confirm',
      exclude: ['/auth/login', '/auth/reset-password', '/auth/confirm']
    }
  },
  runtimeConfig: {
    public: {
      supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_ANON_KEY
      }
    }
  },
  
  // Performance optimizations
  experimental: {
    payloadExtraction: false
  },
  
  // SEO and meta configuration
  app: {
    head: {
      title: 'Liberador Inaplast - Control de Calidad',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Sistema de control de calidad para liberación de productos - Inaplast' 
        },
        { name: 'theme-color', content: '#4f46e5' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  // Component auto-import configuration
  components: {
    global: true,
    dirs: [
      '~/components',
      '~/components/ui',
      '~/components/core',
      '~/components/feedback',
      '~/components/forms'
    ]
  }
})