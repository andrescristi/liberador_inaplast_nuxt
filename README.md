# Sistema Liberador Inaplast

**Sistema de control de calidad industrial** para la digitalización de procesos de liberación de productos en **Inaplast**. Desarrollado con **Nuxt 4**, **Vue 3**, **TypeScript** y **Supabase**.

> 🏭 **Proyecto Corporativo Privado** - Sistema interno para operaciones industriales de control de calidad.

## 🎯 ¿Qué es este Sistema?

El **Sistema Liberador Inaplast** digitaliza el proceso manual de control de calidad, transformando formularios en papel en un flujo de trabajo estructurado de 4 pasos:

1. **Captura de imagen** - Subir foto de etiqueta del producto
2. **Extracción OCR** - Datos extraídos automáticamente con IA (Google Gemini + Tesseract.js)  
3. **Pruebas de calidad** - Tests visuales y funcionales personalizables
4. **Decisión final** - Aprobación/rechazo basado en resultados

### 👥 Usuarios del Sistema
- **Inspectores**: Ejecutan liberaciones diarias
- **Supervisores**: Revisan y aprueban procesos  
- **Administradores**: Configuran sistema y gestionan usuarios

## 🛠️ Stack Tecnológico

### 🚀 Framework Principal
- **Nuxt 4.0.3** - Meta-framework Vue con SSR/SSG
- **Vue 3.x** - Framework reactivo con Composition API
- **TypeScript 5.6.2** - Type safety completo
- **TailwindCSS 3.4.0** - CSS utility-first

### 🗄️ Backend & Base de Datos
- **Supabase 2.53.0** - Backend-as-a-Service (PostgreSQL + Auth + Real-time)
- **Pinia 0.11.2** - Gestión de estado reactivo
- **Zod 3.25.76** - Validación de schemas

### 🎨 UI & Componentes
- **Headless UI 1.7.23** - Componentes accesibles
- **Nuxt Icon 1.15.0** - Sistema de iconos
- **VeeValidate 4.15.1** - Validación de formularios

### 🤖 IA & OCR
- **Google GenAI 1.15.0** - OCR principal con Gemini AI
- **Tesseract.js 6.0.1** - OCR fallback local
- **Sharp 0.34.3** - Procesamiento de imágenes
- **Nomenclatura consistente**: Campos OCR estandarizados en camelCase

### 🧪 Testing
- **Vitest 3.2.4** - Unit tests
- **Playwright 1.54.2** - E2E tests
- **ESLint** - Linting con @antfu/eslint-config

## 📁 Estructura del Proyecto

```
app/                           # Código fuente principal (Nuxt srcDir)
├── components/                # Componentes Vue (auto-import)
│   ├── ui/                   # Componentes base (BaseButton, BaseModal, etc.)
│   ├── orders/               # Wizard de liberación (4 pasos)
│   ├── admin/                # Panel administrativo
│   └── core/                 # Navegación y layout
├── composables/              # Lógica de negocio (auto-import)
│   ├── auth/                 # Sistema de autenticación híbrida
│   ├── orders/               # Estado del proceso de liberación
│   └── admin/                # CRUD de usuarios y permisos
├── pages/                    # File-based routing
│   ├── auth/                 # Login y autenticación
│   ├── orders/               # Gestión de liberaciones
│   └── admin/                # Panel de administración
├── middleware/               # Protección de rutas
├── schemas/                  # Validación con Zod
├── types/                    # Definiciones TypeScript
└── utils/                    # Utilidades generales
```

### Backend (`server/`)
```
server/
├── api/                      # REST endpoints
│   ├── auth/                 # Autenticación (login, profile, logout)
│   ├── orders/               # Gestión de liberaciones
│   ├── admin/users/          # CRUD de usuarios (solo admin)
│   └── ocr/                  # Procesamiento OCR con IA
└── utils/                    # Utilidades server-side
```

## 🚀 Configuración Inicial

### Pre-requisitos

- **Node.js** 20+ (LTS)
- **pnpm** 8+ (package manager)
- **Git** 2.40+
- Credenciales de Supabase y Google AI

### Instalación Rápida

1. **Clonar e instalar**
   ```bash
   git clone [repositorio_corporativo_privado]
   cd liberador_inaplast_nuxt
   pnpm install
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Completar `.env` con las credenciales:
   ```env
   # Supabase
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_ANON_KEY=tu_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_service_key
   
   # Google AI (OCR)
   GOOGLE_GENAI_API_KEY=tu_api_key
   
   # JWT Secret (64+ caracteres)
   NUXT_JWT_SECRET=tu_jwt_secret_muy_largo
   ```

3. **Iniciar desarrollo**
   ```bash
   pnpm dev  # http://localhost:3000
   ```

### Verificación

```bash
npx tsc --noEmit  # TypeScript OK
pnpm lint         # ESLint OK  
pnpm test         # Tests OK
pnpm build        # Build OK
```

### Usuario Admin Inicial

Usar las credenciales del archivo `.env` para el primer login.

## 🔄 Flujo de Desarrollo

### Comandos Principales

```bash
pnpm dev              # Desarrollo con hot-reload
pnpm build            # Build para producción  
pnpm lint             # Linting (solo archivos .ts/.vue)
pnpm test             # Unit tests con Vitest
pnpm test:e2e         # E2E tests con Playwright
```

### Workflow de Desarrollo

1. **Nueva funcionalidad**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   pnpm dev
   ```

2. **Antes de commit** (automático según CLAUDE.md)
   ```bash
   npx tsc --noEmit  # Verificar TypeScript
   pnpm lint         # Solo si modificaste .ts/.vue
   pnpm build        # Verificar build
   ```

3. **Commit y PR**
   ```bash
   git commit -m "feat: descripción"
   # El CI ejecuta todos los tests automáticamente
   ```

## ⚙️ Funcionalidades Principales

### 🔄 Wizard de Liberación (4 pasos)
1. **Captura de imagen** - Upload de foto de etiqueta
2. **Extracción OCR** - Google Gemini AI + Tesseract.js con nomenclatura estandarizada
3. **Pruebas de calidad** - Tests visuales y funcionales
4. **Decisión final** - Aprobado/Rechazado con trazabilidad completa

### 🛡️ Sistema de Autenticación Híbrida
- **Doble verificación**: JWT (cliente) + Session (servidor)
- **Recuperación automática**: Sesiones persisten tras reiniciar desarrollo
- **Roles granulares**: Admin, Supervisor, Inspector
- **Middleware protegido**: Páginas y APIs seguras

### 👥 Panel de Administración
- **CRUD de usuarios** completo
- **Gestión de roles** y permisos
- **Métricas del sistema** en tiempo real
- **Protección por rol**: Solo administradores

### 📊 Sistema de Muestreo
- **Planes estadísticos** basados en MIL-STD
- **Niveles AQL** configurables
- **Cálculo automático** de tamaño de muestra
- **Integración** con flujo de liberación

## 🏗️ Arquitectura y Patrones

### 🎯 Principios Clave
- **API-First**: Lógica de negocio en servidor Nitro
- **Type-Safe**: TypeScript estricto con tipos de Supabase
- **Composable**: Lógica reutilizable con Vue 3
- **Auto-Import**: Componentes y composables automáticos
- **Schema-First**: Validación con Zod sincronizada con DB

### 📦 Patrones Utilizados

**🔐 Composable Pattern**
```typescript
// Lógica reutilizable y reactiva
const { user, login, logout } = useHybridAuth()
const { orders, createOrder } = useOrderState()
const { profile, hasRole } = useAuthProfile()
```

**📋 Schema-First Validation**
```typescript
// Validación con Zod sincronizada con DB
export const createOrderSchema = z.object({
  cliente: z.string().min(1),
  producto: z.string().min(1),
  cantidadMuestra: z.number().min(1) // Nomenclatura camelCase consistente
})

// Auto-types desde schema
type CreateOrderForm = z.infer<typeof createOrderSchema>
```

**🛡️ Middleware de Rutas**
```vue
<script setup>
// Protección declarativa
definePageMeta({
  middleware: ['auth']        // Solo autenticación
  // middleware: ['auth', 'admin'] // + Permisos admin
})
</script>
```

**🔄 Auto-Import System**
```vue
<template>
  <!-- Componentes auto-importados -->
  <BaseButton @click="handleClick">
  <OrderWizard :data="order" />
</template>

<script setup>
// Composables auto-importados
const { user } = useAuthState()
const { orders } = useOrderList()
</script>
```

## 🧪 Testing

### Estructura Multi-Capa

```bash
# Unit Testing
pnpm test                     # Todos los unit tests
pnpm test:coverage            # Con reporte de cobertura
pnpm test --watch             # Modo watch para desarrollo

# E2E Testing  
pnpm test:e2e                 # Cross-browser testing
pnpm test:e2e --ui            # Con interfaz visual
pnpm test:e2e --headed        # Con navegador visible

# Tests específicos
pnpm test composables/auth    # Solo auth composables
pnpm test middleware          # Solo middleware
pnpm test api/auth            # Solo API auth
```

### Cobertura de Testing
- **Unit Tests**: Composables y utilidades
- **Component Tests**: Componentes Vue individuales  
- **Integration Tests**: Endpoints de API
- **E2E Tests**: Flujos completos de usuario (auth, orders)

## 🚢 Deployment

### Producción (Vercel)
- **Plataforma**: Vercel con Nitro optimizado
- **SSR**: Renderizado server-side
- **Edge**: CDN global automático 
- **SSL**: Certificados Let's Encrypt

### Variables de Entorno
```env
# Producción en Vercel
SUPABASE_URL=https://proyecto-prod.supabase.co
SUPABASE_ANON_KEY=prod_anon_key
SUPABASE_SERVICE_ROLE_KEY=prod_service_key
GOOGLE_GENAI_API_KEY=prod_genai_key
NUXT_JWT_SECRET=prod_jwt_secret_64_chars
```

### CI/CD Pipeline
1. **Quality Gates**: TypeScript + ESLint + Tests
2. **Build**: Construcción optimizada
3. **Deploy**: Automático a Vercel desde `main`
4. **Smoke Tests**: Verificación post-deploy

## 📚 Recursos para Desarrolladores

### 📖 Documentación Técnica
- **Nuxt 4**: [nuxt.com](https://nuxt.com) - Meta-framework Vue
- **Vue 3**: [vuejs.org](https://vuejs.org) - Composition API
- **Supabase**: [supabase.com/docs](https://supabase.com/docs) - Backend
- **TailwindCSS**: [tailwindcss.com](https://tailwindcss.com) - CSS

### 🛠️ Herramientas Recomendadas
- **VS Code** + extensiones Vue/TypeScript
- **Vue DevTools** para debugging
- **Supabase Studio** para base de datos  
- **Vercel Dashboard** para deployments

### 📝 Convenciones del Proyecto
- **Commits**: Conventional (feat, fix, docs, refactor)
- **Branches**: feature/descripcion, hotfix/issue
- **Middleware**: Usar array `['auth']` no string `'auth'`
- **Nomenclatura**: CamelCase para todos los campos (ej: `cantidadMuestra`)
- **Linting**: Solo ejecutar en archivos .ts/.vue modificados

### ⚡ Tips Rápidos
```typescript
// ✅ Middleware correcto
definePageMeta({
  middleware: ['auth', 'admin'] // Array
})

// ✅ Composables auto-importados  
const { user, isAdmin } = useHybridAuth()

// ✅ Componentes auto-importados
<BaseButton variant="solid">Texto</BaseButton>
```

## 📄 Información Legal

**© 2024 Inaplast - Todos los derechos reservados**

Sistema propiedad de **Inaplast** con información confidencial y procesos industriales propietarios. Uso restringido a personal autorizado.

---

**¡Bienvenido al equipo de desarrollo!** 🚀

Esta guía te dará todo lo necesario para contribuir efectivamente. Para dudas específicas, consulta con el equipo técnico.


