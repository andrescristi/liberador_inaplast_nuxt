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
  modules: [// Framework CSS utility-first
  '@nuxtjs/tailwindcss', // State management reactivo y TypeScript-friendly
  '@pinia/nuxt', // Integración completa Supabase (Auth + DB + Real-time)
  '@nuxtjs/supabase', // Composables utilitarios para Vue 3
  '@vueuse/nuxt', // Validación de formularios (login, registros)
  '@vee-validate/nuxt', // Linting integrado con reglas de Nuxt
  '@nuxt/eslint', // Sistema de iconos optimizado (reemplaza Heroicons)
  '@nuxt/icon', 'nuxt-auth-utils'],
  
  // ===== CONFIGURACIÓN SUPABASE =====
  supabase: {
    url: process.env.NUXT_SUPABASE_URL,       // URL del proyecto Supabase
    key: process.env.NUXT_SUPABASE_ANON_KEY,  // Clave anónima (safe para cliente)
    types: './app/types/database.types.ts',  // Tipos TypeScript generados de DB
    
    // Configuración de redirecciones para flujos de auth
    redirectOptions: {
      login: '/auth/login',                     // Redirect si no autenticado
      callback: '/',                           // Después de login exitoso ir al dashboard
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
      enableDebugMode: process.env.NUXT_ENABLE_DEBUG_MODE || 'false',
      // Configuración de seguridad para generación de QR
      allowedDomains: process.env.NUXT_ALLOWED_DOMAINS || 'http://localhost:3000',
      productionDomain: process.env.NUXT_PRODUCTION_DOMAIN || 'https://liberador-inaplast-nuxt.vercel.app'
    }
  },
  
  // ===== OPTIMIZACIONES DE PERFORMANCE =====
  experimental: {
    // Configuración mínima para evitar problemas de inicialización
    payloadExtraction: false,
    viewTransition: false
  },

  // ===== CONFIGURACIÓN DE RENDERING =====
  // Temporalmente deshabilitar SSR para resolver errores de inicialización
  ssr: false,

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
    prerender: {
      crawlLinks: false
    },
    // Configuración de límites de payload para OCR
    experimental: {
      wasm: true
    },
    // Límites de body size para rutas de API
    routeRules: {
      '/api/ocr/**': {
        // Límite específico para rutas OCR (10MB)
        headers: {
          'x-nitro-body-limit': '10485760' // 10MB en bytes
        }
      }
    },
    // Configuración global de límites
    storage: {
      memory: {
        driver: 'memory'
      }
    }
  },

  // ===== CONFIGURACIÓN VITE SIMPLIFICADA =====
  vite: {
    optimizeDeps: {
      include: [
        'vue', 
        '@supabase/supabase-js',
        'pinia'
      ]
    },
    build: {
      // Configuración mínima para evitar errores de inicialización
      target: 'es2018',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: false
        },
        mangle: {
          keep_fnames: true
        }
      }
    },
    server: {
      // Límites para desarrollo
      hmr: {
        port: 24678
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