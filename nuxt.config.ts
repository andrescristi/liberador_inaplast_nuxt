/**
 * Configuración principal de Nuxt.js para el Sistema Liberador Inaplast
 * 
 * Este archivo configura:
 * - Módulos esenciales para el sistema de liberación
 * - Integración segura con Supabase (Auth + Database)
 * - Optimizaciones de performance para producción
 * - Auto-importación de componentes UI
 * - Configuraciones SEO específicas del negocio
 * 
 * @see https://nuxt.com/docs/api/configuration/nuxt-config
 */
export default defineNuxtConfig({
  // ===== HERRAMIENTAS DE DESARROLLO =====
  devtools: {
    enabled: true, // Vue DevTools integradas para debugging

    timeline: {
      enabled: true // Timeline de performance para analizar rendering
    }
  },
  compatibilityDate: '2025-08-11', // Fecha de compatibilidad para features estables
  
  // Estructura de proyecto personalizada - source en /app en lugar de root
  srcDir: 'app/',
  
  // ===== ESTILOS GLOBALES =====
  // Orden importante: main.css primero, luego mobile-optimizations
  css: [
    '~/assets/css/main.css',                    // Estilos base y variables CSS
    '~/assets/css/mobile-optimizations.css'    // Optimizaciones específicas móvil
  ],
  
  // ===== TYPESCRIPT CONFIGURATION =====
  typescript: {
    strict: true // Mode estricto para máxima type safety
  },
  
  // ===== MÓDULOS ESENCIALES =====
  modules: [
    '@nuxtjs/tailwindcss',  // Framework CSS utility-first
    '@pinia/nuxt',          // State management reactivo y TypeScript-friendly
    '@nuxtjs/supabase',     // Integración completa Supabase (Auth + DB + Real-time)
    '@vueuse/nuxt',         // Composables utilitarios para Vue 3
    '@vee-validate/nuxt',   // Validación de formularios (login, registros)
    '@nuxt/eslint',         // Linting integrado con reglas de Nuxt
    '@nuxt/icon'            // Sistema de iconos optimizado (reemplaza Heroicons)
  ],
  
  // ===== CONFIGURACIÓN SUPABASE =====
  supabase: {
    url: process.env.NUXT_SUPABASE_URL,       // URL del proyecto Supabase
    key: process.env.NUXT_SUPABASE_ANON_KEY,  // Clave anónima (safe para cliente)
    types: './types/database.types.ts',  // Tipos TypeScript generados de DB
    
    // Configuración de redirecciones para flujos de auth
    redirectOptions: {
      login: '/auth/login',                     // Redirect si no autenticado
      callback: '/auth/confirm',               // Después de login exitoso
      exclude: ['/auth/login', '/auth/reset-password', '/auth/confirm', '/ocr-test'] // Páginas públicas
    },
    
    // Configuración de cookies para compatibilidad móvil
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 7, // 7 días de duración
      sameSite: 'lax',          // Permite cookies en navegadores móviles
      secure: process.env.NODE_ENV === 'production' // Solo HTTPS en producción
    }
  },
  
  // ===== CONFIGURACIÓN DE RUNTIME =====
  // Variables accesibles en cliente y servidor
  runtimeConfig: {
    public: {
      supabase: {
        url: process.env.NUXT_SUPABASE_URL,       // Disponible en cliente para SDK
        key: process.env.NUXT_SUPABASE_ANON_KEY   // Disponible en cliente (segura)
      },
      // Feature flags para alternar funcionalidades
      enableMockOCR: process.env.NUXT_ENABLE_MOCK_OCR || 'true', // Default a true para desarrollo
      enableDebugMode: process.env.NUXT_ENABLE_DEBUG_MODE || 'false'
    }
  },
  
  // ===== OPTIMIZACIONES DE PERFORMANCE =====
  experimental: {
    // Deshabilitar extracción de payload para reducir JavaScript bundle
    payloadExtraction: false,
    // Enable view transitions for better UX
    viewTransition: true,
    // Disable async components that might cause initialization issues
    asyncContext: false,
    // Ensure proper SSR compatibility
    emitRouteChunkError: 'automatic'
  },

  // ===== CONFIGURACIÓN DE RENDERING =====
  ssr: true,

  // ===== OPTIMIZACIÓN DE IMPORTS =====
  build: {
    // Ensure proper transpilation
    transpile: [
      '@supabase/supabase-js',
      '@vueuse/core'
    ]
  },

  // ===== CONFIGURACIÓN NITRO PARA VERCEL =====
  nitro: {
    preset: 'vercel',
    rollupConfig: {
      external: [],
      output: {
        format: 'esm'
      }
    }
  },

  // ===== CONFIGURACIÓN VITE OPTIMIZADA =====
  vite: {
    ssr: {
      noExternal: ['vue', '@vue/shared', '@supabase/supabase-js']
    },
    optimizeDeps: {
      include: [
        'vue', 
        '@vue/shared', 
        '@supabase/supabase-js',
        'pinia'
      ],
      exclude: ['@nuxt/kit']
    },
    build: {
      // Disable minification to prevent variable hoisting issues
      minify: false,
      // Ensure proper module format
      target: 'esnext',
      // Disable tree shaking temporarily to prevent order issues
      rollupOptions: {
        treeshake: false,
        output: {
          // More conservative chunk splitting
          manualChunks: {
            // Single vendor chunk for all dependencies
            'vendor': [
              'vue', 
              '@vue/shared',
              '@supabase/supabase-js',
              'pinia',
              '@vueuse/core',
              'zod'
            ],
            // Single framework chunk
            'framework': [
              '@nuxt/kit'
            ]
          },
          // Ensure proper variable names and avoid minification conflicts
          generatedCode: {
            constBindings: true
          },
          // More predictable naming for debugging
          chunkFileNames: '[name]-[hash].js',
          entryFileNames: 'entry-[hash].js'
        }
      }
    }
  },
  
  // ===== CONFIGURACIÓN SEO Y META TAGS =====
  app: {
    head: {
      // Título base que aparece en pestañas del navegador
      title: 'Liberador Inaplast - Control de Calidad',
      
      meta: [
        { charset: 'utf-8' },
        // Viewport optimizado para móvil (crítico para responsive design)
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        
        // Meta descripción para SEO y compartir en redes sociales
        { 
          name: 'description', 
          content: 'Sistema de control de calidad para liberación de productos - Inaplast' 
        },
        
        // Color del theme del navegador (mobile browsers)
        // Coincide con color primary de TailwindCSS (indigo-600)
        { name: 'theme-color', content: '#4f46e5' }
      ],
      
      link: [
        // Favicon estándar para todos los navegadores
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  // ===== CONFIGURACIÓN DE AUTO-IMPORTACIÓN =====
  
  // Configuración de auto-imports para composables y utilidades
  imports: {
    dirs: [
      // Auto-importar composables de directorio principal
      '~/composables',
      // Auto-importar composables anidados (como ~/composables/auth/*)
      '~/composables/**'
    ]
  },

  // Configuración de auto-importación de componentes
  components: [
    {
      path: '~/components',
      global: true
    },
    {
      path: '~/components/ui',
      prefix: 'Ui',
      global: true
    },
    {
      path: '~/components/core',
      prefix: 'Core',
      global: true
    },
    {
      path: '~/components/feedback', 
      global: true
    },
    
    {
      path: '~/components/orders',
      global: true
    },
    {
      path: '~/components/admin',
      global: true
    },
    {
      path: '~/components/muestreo',
      global: true
    }
  ]
})
