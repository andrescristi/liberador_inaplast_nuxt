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
    url: process.env.SUPABASE_URL,       // URL del proyecto Supabase
    key: process.env.SUPABASE_ANON_KEY,  // Clave anónima (safe para cliente)
    types: './types/database.types.ts',  // Tipos TypeScript generados de DB
    
    // Configuración de redirecciones para flujos de auth
    redirectOptions: {
      login: '/auth/login',                     // Redirect si no autenticado
      callback: '/auth/confirm',               // Después de login exitoso
      exclude: ['/auth/login', '/auth/reset-password', '/auth/confirm', '/ocr-test'] // Páginas públicas
    }
  },
  
  // ===== CONFIGURACIÓN DE RUNTIME =====
  // Variables accesibles en cliente y servidor
  runtimeConfig: {
    public: {
      supabase: {
        url: process.env.SUPABASE_URL,       // Disponible en cliente para SDK
        key: process.env.SUPABASE_ANON_KEY   // Disponible en cliente (segura)
      }
    }
  },
  
  // ===== OPTIMIZACIONES DE PERFORMANCE =====
  experimental: {
    // Deshabilitar extracción de payload para reducir JavaScript bundle
    // Útil para apps que usan principalmente server-side rendering
    payloadExtraction: false
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
  components: {
    global: true, // Componentes disponibles globalmente sin imports explícitos
    
    // Directorios específicos para organización y auto-importación
    dirs: [
      '~/components',          // Componentes generales
      '~/components/ui',       // Sistema de diseño base (BaseButton, BaseModal, etc.)
      '~/components/core',     // Componentes core de la app (Navigation, etc.)
      '~/components/feedback', // Componentes de UX (Toast, Loading, etc.)
      '~/components/forms'     // Componentes específicos de formularios
    ]
  }
})
