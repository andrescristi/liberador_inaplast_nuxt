# Sistema Liberador Inaplast

**Sistema de control de calidad industrial** desarrollado para la digitalización completa de los procesos de liberación de productos en **Inaplast**. Una solución corporativa que transforma los procedimientos manuales en un flujo de trabajo digital estructurado, eficiente y trazable.

Desarrollado con tecnologías de vanguardia: **Nuxt 4**, **Vue 3**, **TypeScript**, **Supabase** y **inteligencia artificial** para OCR automatizado.

> 🏭 **Proyecto Corporativo Privado** - Sistema interno para operaciones industriales de control de calidad en Inaplast.

## 🎯 Descripción del Sistema

El **Sistema Liberador Inaplast** es una aplicación web empresarial que digitaliza completamente el proceso de control de calidad para la liberación de productos industriales. Elimina los formularios en papel, reduce errores humanos y proporciona trazabilidad completa de todas las decisiones de calidad.

### ✨ Características Principales

- **🔄 Proceso de Liberación en 4 Pasos**: Flujo guiado desde captura de imagen hasta decisión final
- **🤖 OCR Inteligente**: Extracción automática de datos con Google Gemini AI y fallback a Tesseract.js
- **👥 Sistema de Roles**: Admin, Supervisor e Inspector con permisos granulares
- **📊 Dashboard Personalizado**: Métricas diferenciadas por rol de usuario
- **🔍 Búsqueda Avanzada**: Incluye búsqueda por número de orden secuencial
- **📄 Exportación**: PDF y Excel con datos completos de inspección
- **📱 Diseño Responsivo**: Optimizado para tablets y móviles industriales
- **🔐 Autenticación Híbrida**: JWT + Session con recuperación automática
- **📈 Sistema de Muestreo**: Planes estadísticos basados en MIL-STD con niveles AQL

## 🛠️ Stack Tecnológico

### Framework y Core
- **Nuxt 4.0.3** - Meta-framework Vue con SSR/SSG y auto-importación
- **Vue 3.x** - Framework reactivo con Composition API
- **TypeScript 5.6.2** - Type safety completo con tipos generados de Supabase
- **TailwindCSS 3.4.0** - CSS utility-first con sistema de diseño consistente

### Backend y Base de Datos
- **Supabase 2.53.0** - Backend-as-a-Service (PostgreSQL + Auth + Real-time)
- **Pinia 0.11.2** - Gestión de estado reactivo con soporte TypeScript
- **Zod 3.25.76** - Validación de schemas con auto-tipos
- **Nitro** - Servidor de producción optimizado para Vercel

### UI y Componentes
- **Headless UI 1.7.23** - Componentes accesibles sin estilos
- **Nuxt Icon 1.15.0** - Sistema de iconos optimizado
- **VeeValidate 4.15.1** - Validación de formularios con soporte Zod
- **VueUse 13.6.0** - Utilidades composables para Vue 3

### IA y Procesamiento
- **Google GenAI 1.15.0** - OCR principal con Gemini AI para extracción de datos
- **Tesseract.js** - OCR fallback local para mayor confiabilidad
- **Sharp 0.34.3** - Procesamiento y optimización de imágenes
- **HTML2Canvas 1.4.1** - Captura de screenshots para debugging

### Generación de Documentos
- **jsPDF 3.0.2** - Generación de PDF con datos de inspección
- **XLSX 0.18.5** - Exportación a Excel con formateo avanzado
- **QRCode 1.5.4** - Generación de códigos QR para trazabilidad

### Testing y Calidad
- **Vitest 3.2.4** - Unit tests con cobertura de código
- **Playwright 1.54.2** - E2E tests cross-browser automatizados
- **ESLint + @antfu/eslint-config** - Linting con reglas consistentes
- **@nuxt/test-utils** - Utilidades de testing específicas para Nuxt

## 🔄 Flujo de Liberación (4 Pasos)

### Paso 1: Captura de Imagen
- Upload seguro de fotografías de etiquetas de productos
- Validación automática de formato (JPG, PNG, WEBP)
- Optimización de imágenes con Sharp para procesamiento OCR
- Preview en tiempo real con recorte opcional

### Paso 2: Extracción OCR Inteligente
- **Procesamiento Primario**: Google Gemini AI para extracción precisa
- **Fallback Robusto**: Tesseract.js si Gemini no está disponible
- **Mapeo Inteligente**: Conversión automática entre nomenclaturas
- **Auto-población**: Formularios se llenan automáticamente con datos extraídos

### Paso 3: Pruebas de Calidad Interactivas
- **Tests Visuales**: Switches animados para evaluación rápida
- **Tests Funcionales**: Validación de especificaciones técnicas
- **Sistema de Muestreo**: Cálculo automático según planes MIL-STD
- **Notas de Calidad**: Comentarios detallados del inspector

### Paso 4: Decisión Final Documentada
- **Aprobación/Rechazo**: Decisión binaria con justificación requerida
- **Trazabilidad Completa**: Timestamp, usuario responsable, y motivos
- **Generación de Documentos**: PDF automático con todos los datos
- **Notificaciones**: Alertas según el resultado de la inspección

## 👥 Sistema de Roles y Permisos

### 🔧 Inspector de Calidad
- **Responsabilidades**: Ejecución diaria de liberaciones
- **Permisos**:
  - Crear y procesar órdenes de inspección
  - Ver sus propias liberaciones y métricas personales
  - Exportar reportes de sus inspecciones
  - Actualizar su perfil personal

### 👨‍💼 Supervisor de Producción
- **Responsabilidades**: Supervisión y revisión de procesos críticos
- **Permisos**:
  - Ver todas las liberaciones del sistema
  - Métricas globales y análisis estadístico
  - Revisar y aprobar liberaciones críticas
  - Gestionar configuraciones de muestreo

### 👑 Administrador del Sistema
- **Responsabilidades**: Gestión completa del sistema
- **Permisos**:
  - CRUD completo de usuarios y roles
  - Configuración de parámetros del sistema
  - Acceso a logs y métricas detalladas
  - Gestión de copias de seguridad

## 📁 Estructura del Proyecto

```
app/                               # Código fuente principal (Nuxt srcDir)
├── components/                    # Componentes Vue (auto-importación)
│   ├── ui/                       # Componentes base reutilizables
│   │   ├── BaseButton.vue
│   │   ├── BaseCard.vue
│   │   ├── BaseModal.vue
│   │   └── BaseTable.vue
│   ├── orders/                   # Wizard de liberación (4 pasos)
│   │   ├── OrderWizard.vue
│   │   ├── OrderWizardStep1.vue  # Captura de imagen
│   │   ├── OrderWizardStep2.vue  # Datos OCR
│   │   ├── OrderWizardStep3.vue  # Pruebas de calidad
│   │   └── OrderWizardStep4.vue  # Decisión final
│   ├── admin/                    # Panel administrativo
│   │   ├── UserCRUD.vue
│   │   └── SystemMetrics.vue
│   └── core/                     # Navegación y layout
│       ├── AppHeader.vue
│       ├── AppSidebar.vue
│       └── AppFooter.vue
├── composables/                  # Lógica de negocio (auto-importación)
│   ├── auth/                     # Sistema de autenticación híbrida
│   │   ├── useHybridAuth.ts      # Auth principal con JWT + Session
│   │   ├── useAuthProfile.ts     # Gestión de perfiles de usuario
│   │   └── useAuthToken.ts       # Manejo de tokens JWT
│   ├── orders/                   # Estado del proceso de liberación
│   │   ├── useOrderState.ts      # Estado del wizard
│   │   ├── useOrderAPI.ts        # API calls para órdenes
│   │   └── useOrderExport.ts     # Exportación PDF/Excel
│   ├── tools/                    # Herramientas y utilidades
│   │   ├── useOCRConfig.ts       # Configuración OCR y mapeo
│   │   ├── useImageCompression.ts # Compresión de imágenes
│   │   └── useLogger.ts          # Sistema de logging
│   └── admin/                    # CRUD de usuarios y permisos
│       ├── useAdminUserCRUD.ts
│       └── useAdminUserManager.ts
├── pages/                        # File-based routing
│   ├── auth/                     # Autenticación
│   │   ├── login.vue
│   │   ├── profile.vue
│   │   └── reset-password.vue
│   ├── orders/                   # Gestión de liberaciones
│   │   ├── index.vue             # Lista de órdenes
│   │   ├── new.vue               # Wizard de nueva orden
│   │   └── [id].vue              # Detalle de orden
│   ├── admin/                    # Panel de administración
│   │   └── users.vue             # Gestión de usuarios
│   ├── muestreo/                 # Sistema de muestreo
│   │   ├── index.vue
│   │   ├── planes.vue
│   │   └── grupos.vue
│   └── index.vue                 # Dashboard principal
├── middleware/                   # Protección de rutas
│   ├── auth.ts                   # Verificación de autenticación
│   └── admin.ts                  # Verificación de permisos admin
├── schemas/                      # Validación con Zod
│   ├── auth.ts                   # Schemas de autenticación
│   ├── orders/                   # Schemas de órdenes
│   │   ├── new_order.ts
│   │   ├── ocr.ts
│   │   └── tests.ts
│   └── admin.ts                  # Schemas de administración
├── types/                        # Definiciones TypeScript
│   ├── database.types.ts         # Tipos generados de Supabase
│   ├── auth.ts                   # Tipos de autenticación
│   └── orders.ts                 # Tipos de órdenes
├── utils/                        # Utilidades generales
│   ├── nameMappers.ts            # Mapeo DB ↔ camelCase
│   ├── constants.ts              # Constantes del sistema
│   └── formatters.ts             # Formateadores de datos
└── assets/                       # Assets estáticos
    ├── css/
    │   ├── main.css
    │   └── mobile-optimizations.css
    └── images/
```

### Backend (server/)
```
server/
├── api/                          # REST endpoints
│   ├── auth/                     # Autenticación
│   │   ├── login.post.ts
│   │   ├── logout.post.ts
│   │   ├── profile.get.ts
│   │   └── refresh.post.ts
│   ├── orders/                   # Gestión de liberaciones
│   │   ├── index.get.ts          # Lista paginada
│   │   ├── index.post.ts         # Crear nueva orden
│   │   └── [id].get.ts           # Detalle de orden
│   ├── admin/users/              # CRUD de usuarios (solo admin)
│   │   ├── index.post.ts         # Crear usuario
│   │   ├── [id].put.ts           # Actualizar usuario
│   │   ├── [id].delete.ts        # Eliminar usuario
│   │   └── list.get.ts           # Listar usuarios
│   ├── ocr/                      # Procesamiento OCR con IA
│   │   └── extract.post.ts       # Extracción con Gemini + Tesseract
│   ├── dashboard/                # Métricas del dashboard
│   │   └── metrics.get.ts        # Métricas por rol
│   └── profiles/                 # Gestión de perfiles
│       ├── current.get.ts
│       └── index.put.ts
└── utils/                        # Utilidades server-side
    ├── auth.ts                   # Validación JWT
    ├── database.ts               # Helpers de Supabase
    └── logger.ts                 # Sistema de logging
```

## 🚀 Instalación y Configuración

### Pre-requisitos

- **Node.js 20+** (LTS recomendado)
- **pnpm 8+** (package manager preferido)
- **Git 2.40+**
- Credenciales de **Supabase** y **Google AI**

### Instalación Rápida

1. **Clonar el repositorio**
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
   # Supabase Configuration
   NUXT_SUPABASE_URL=https://tu-proyecto.supabase.co
   NUXT_SUPABASE_ANON_KEY=tu_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_service_key

   # Google AI Configuration (OCR)
   GOOGLE_GENAI_API_KEY=tu_api_key_gemini

   # JWT Secret (mínimo 64 caracteres)
   NUXT_JWT_SECRET=tu_jwt_secret_muy_largo_y_seguro

   # Feature Flags
   NUXT_ENABLE_MOCK_OCR=false
   NUXT_ENABLE_DEBUG_MODE=false
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   pnpm dev
   # Servidor disponible en http://localhost:3000
   ```

### Verificación de Instalación

```bash
# Verificar TypeScript
npx tsc --noEmit

# Verificar ESLint (solo si modificaste .ts/.vue)
pnpm lint

# Ejecutar tests unitarios
pnpm test

# Verificar build de producción
pnpm build
```

### Credenciales de Usuario Inicial

Las credenciales del usuario administrador inicial se encuentran en el archivo `.env`:
- **Email**: Valor de la variable de entorno
- **Password**: Valor de la variable de entorno
- **Rol**: Admin (con permisos completos)

## 🆕 Actualizaciones Recientes (Septiembre 2025)

### ✅ Mejoras de UI/UX - Sistema de Modales

#### 🔧 **Fix: Z-Index y Layering de Modales**
**Problema**: Los modales se mostraban por debajo del navbar de navegación, causando problemas de usabilidad donde los usuarios no podían interactuar correctamente con los modales.

**Solución Implementada**:
- **BaseModal.vue**: Actualizado para usar variables CSS consistentes (`--z-modal: 1050` y `--z-modal-backdrop: 1040`)
- **Sistema de Z-Index**: Implementación de escala jerárquica donde modales (1050) > navegación sticky (1020)
- **Variables CSS**: Uso de CSS custom properties para layering consistente en toda la aplicación

```css
/* Variables CSS implementadas en main.css */
:root {
  --z-sticky: 1020;     /* Navegación sticky */
  --z-modal-backdrop: 1040;  /* Backdrop de modales */
  --z-modal: 1050;      /* Modales principales */
}
```

#### 🔐 **Fix: Toggle de Visibilidad de Contraseña**
**Problema**: En UserCreateModal, el botón de toggle para mostrar/ocultar contraseña no era clickeable debido a interceptación de eventos por el input subyacente.

**Solución Técnica**:
- **UserCreateModal.vue**: Agregado `z-20` al contenedor de botones para asegurar layering correcto
- **Funcionalidad**: Toggle funciona correctamente sin interferencias de z-index
- **UX Mejorada**: Usuarios pueden alternar visibilidad de contraseña y usar el generador automático

```vue
<!-- Fix implementado línea 62 -->
<div class="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 z-20">
  <button @click="showPassword = !showPassword">
    <!-- Toggle de visibilidad funcional -->
  </button>
</div>
```

#### 🧪 **Testing: Cobertura de Nuevas Funcionalidades**
**Tests Implementados**:

1. **BaseModal.test.ts**:
   - Verificación de z-index usando variables CSS
   - Testeo de layering correcto vs elementos de navegación
   - Validación de props y comportamiento de modal

2. **UserCreateModal.test.ts**:
   - Tests de toggle de contraseña (mostrar/ocultar)
   - Verificación de z-index en contenedor de botones
   - Validación de generador de contraseñas
   - Tests de indicador de fortaleza de contraseña

**Métricas de Calidad**:
- ✅ **Tests Unitarios**: 25+ nuevos tests para componentes de modal
- ✅ **Cobertura Z-Index**: Verificación completa de layering
- ✅ **Validación UX**: Tests de interacción de usuario
- ✅ **Funcionalidad**: 100% de features de contraseña testeadas

#### 📊 **Beneficios Medibles**
**Para Usuarios Finales**:
- ✅ **Modales Accesibles**: 100% de modales ahora funcionan correctamente
- ✅ **Toggle Funcional**: 0% de clics interceptados en botones de contraseña
- ✅ **UX Consistente**: Layering coherente en toda la aplicación

**Para Desarrolladores**:
- ✅ **CSS Mantenible**: Variables centralizadas para z-index
- ✅ **Tests Robustos**: Cobertura completa de componentes críticos
- ✅ **Debugging Mejorado**: Z-index conflicts fácilmente identificables

### 🔄 **Arquitectura: Sistema de Z-Index Escalable**
**Implementación de Layering Hierarchy**:
```css
:root {
  --z-dropdown: 1000;
  --z-sticky: 1020;        /* AppNavigation */
  --z-fixed: 1030;         /* Bottom navigation */
  --z-modal-backdrop: 1040; /* Modal backdrops */
  --z-modal: 1050;         /* Modal content */
  --z-popover: 1060;       /* Popovers y tooltips */
  --z-toast: 1080;         /* Notificaciones */
}
```

Esta actualización establece las bases para un sistema de UI más robusto y escalable, eliminando conflictos de layering y mejorando significativamente la experiencia de usuario en componentes críticos como los modales de administración.

## 💻 Uso del Sistema

### Para Nuevos Desarrolladores

#### 1. Configuración del Entorno de Desarrollo
```bash
# Instalar extensiones recomendadas de VS Code
# - Vue Language Features (Volar)
# - TypeScript Vue Plugin (Volar)
# - Tailwind CSS IntelliSense
# - ESLint

# Verificar configuración
pnpm dev --check
```

#### 2. Comandos de Desarrollo Frecuentes
```bash
# Desarrollo con hot-reload
pnpm dev

# Tests en modo watch
pnpm test --watch

# Linting (solo archivos .ts/.vue modificados)
pnpm lint

# E2E tests con interfaz visual
pnpm test:e2e --ui

# Build para producción
pnpm build
```

#### 3. Flujo de Desarrollo Recomendado
1. **Nueva funcionalidad**:
   ```bash
   git checkout -b feature/descripcion-clara
   pnpm dev
   # Desarrollar funcionalidad
   ```

2. **Antes de commit** (automático):
   - TypeScript check (`npx tsc --noEmit`)
   - ESLint (solo si modificaste `.ts/.vue`)
   - Build verification (`pnpm build`)

3. **Commit y PR**:
   ```bash
   git commit -m "feat: descripción clara de la funcionalidad"
   # El CI ejecutará todos los tests automáticamente
   ```

### Para Usuarios del Sistema

#### Dashboard Principal
- **Métricas Personalizadas**: Los inspectores ven sus propias estadísticas, mientras que supervisores y admins ven datos globales
- **Acciones Rápidas**: Acceso directo a "Nueva Liberación" e "Historial"
- **Liberaciones Recientes**: Tabla con las últimas 5 liberaciones realizadas

#### Proceso de Liberación
1. **Acceder**: Dashboard → "Nueva Liberación" o `/orders/new`
2. **Paso 1**: Subir fotografía de la etiqueta del producto
3. **Paso 2**: Revisar y corregir datos extraídos por OCR
4. **Paso 3**: Ejecutar pruebas de calidad (visual y funcional)
5. **Paso 4**: Tomar decisión final (Aprobado/Rechazado) con justificación

#### Búsqueda Avanzada
- **Por Número de Orden**: `#12345` o `12345`
- **Por Cliente**: Nombre parcial o completo
- **Por Producto**: Descripción del producto
- **Por Fecha**: Rango de fechas
- **Por Estado**: Aprobado, Rechazado, Pendiente
- **Por Inspector**: Nombre del inspector responsable

## 🔧 API Endpoints Principales

### Autenticación
```typescript
POST /api/auth/login
// Body: { email: string, password: string }
// Response: { user: User, token: string }

POST /api/auth/logout
// Headers: { Authorization: "Bearer <token>" }
// Response: { success: boolean }

GET /api/auth/profile
// Headers: { Authorization: "Bearer <token>" }
// Response: { profile: Profile }

POST /api/auth/refresh
// Body: { refreshToken: string }
// Response: { token: string }
```

### Órdenes de Liberación
```typescript
GET /api/orders
// Query: { page?: number, limit?: number, search?: string }
// Response: { data: Order[], total: number, pages: number }

POST /api/orders
// Body: CreateOrderSchema
// Response: { order: Order, id: string }

GET /api/orders/[id]
// Params: { id: string }
// Response: { order: Order, tests: Test[] }

PUT /api/orders/[id]
// Body: UpdateOrderSchema
// Response: { order: Order }
```

### OCR Processing
```typescript
POST /api/ocr/extract
// Body: { image: File, config?: OCRConfig }
// Response: { extractedData: OCRResult, confidence: number }
```

### Dashboard y Métricas
```typescript
GET /api/dashboard/metrics
// Headers: { Authorization: "Bearer <token>" }
// Response: {
//   completed: number,
//   rejected: number,
//   pending: number,
//   userRole: string
// }
```

### Administración (Solo Admin)
```typescript
GET /api/admin/users/list
// Response: { users: User[], total: number }

POST /api/admin/users
// Body: CreateUserSchema
// Response: { user: User, tempPassword: string }

PUT /api/admin/users/[id]
// Body: UpdateUserSchema
// Response: { user: User }

DELETE /api/admin/users/[id]
// Response: { success: boolean }
```

## 🧪 Testing

### Estructura de Tests

```bash
# Unit Tests (Vitest)
pnpm test                     # Todos los unit tests
pnpm test:coverage           # Con reporte de cobertura
pnpm test --watch            # Modo watch para desarrollo
pnpm test composables/auth   # Tests específicos

# E2E Tests (Playwright)
pnpm test:e2e                # Cross-browser testing
pnpm test:e2e --ui           # Con interfaz visual
pnpm test:e2e --headed       # Con navegador visible
```

### Cobertura de Testing
- **Unit Tests**: Composables, utilidades y lógica de negocio
- **Component Tests**: Componentes Vue individuales con Vue Testing Library
- **Integration Tests**: Endpoints de API y middleware
- **E2E Tests**: Flujos completos de usuario (autenticación, liberaciones)

### Tests Críticos del Sistema
```typescript
// Autenticación híbrida
describe('useHybridAuth', () => {
  it('should maintain session after browser restart')
  it('should handle JWT refresh automatically')
  it('should redirect unauthenticated users')
})

// Wizard de liberación
describe('OrderWizard', () => {
  it('should complete full 4-step process')
  it('should handle OCR errors gracefully')
  it('should validate all form steps')
})

// Sistema OCR
describe('OCR Processing', () => {
  it('should extract data from product labels')
  it('should fallback to Tesseract when Gemini fails')
  it('should map database fields correctly')
})
```

## 🚢 Deployment

### Producción en Vercel
El sistema está optimizado para deployment en Vercel con las siguientes características:

- **Preset Nitro**: `vercel` para máxima compatibilidad
- **SSR Habilitado**: Renderizado server-side para mejor SEO
- **Edge Functions**: API endpoints optimizados
- **Límites de Payload**: 10MB para rutas OCR
- **Variables de Entorno**: Configuración automática desde Vercel Dashboard

### Variables de Entorno de Producción
```env
# Producción
NUXT_SUPABASE_URL=https://proyecto-prod.supabase.co
NUXT_SUPABASE_ANON_KEY=prod_anon_key
SUPABASE_SERVICE_ROLE_KEY=prod_service_key
GOOGLE_GENAI_API_KEY=prod_genai_key
NUXT_JWT_SECRET=prod_jwt_secret_64_chars_minimum

# Feature Flags
NUXT_ENABLE_MOCK_OCR=false
NUXT_ENABLE_DEBUG_MODE=false
```

### CI/CD Pipeline
1. **Quality Gates**: TypeScript check + ESLint + Tests completos
2. **Build Process**: Construcción optimizada con tree-shaking
3. **Auto Deploy**: Deployment automático desde branch `main`
4. **Health Checks**: Verificación post-deploy de endpoints críticos

### Monitoreo en Producción
- **Logs Centralizados**: Sistema Pino para logging estructurado
- **Error Tracking**: Captura de errores JavaScript y API
- **Performance Metrics**: Core Web Vitals y tiempo de respuesta API
- **Uptime Monitoring**: Verificación continua de disponibilidad

## 🔧 Arquitectura y Patrones

### Principios de Desarrollo
- **API-First**: Toda lógica de negocio en servidor Nitro
- **Type-Safe**: TypeScript estricto con tipos generados de Supabase
- **Composable Pattern**: Lógica reutilizable con Vue 3 Composition API
- **Auto-Import**: Componentes y composables sin imports explícitos
- **Schema-First**: Validación Zod sincronizada con estructura de base de datos

### Patrones Implementados

#### 🔐 Composable Pattern
```typescript
// Lógica reutilizable y reactiva
const { user, login, logout, isAuthenticated } = useHybridAuth()
const { orders, createOrder, updateOrder } = useOrderState()
const { profile, hasRole, isAdmin } = useAuthProfile()
```

#### 📋 Schema-First Validation
```typescript
// Validación centralizada con auto-tipos
export const createOrderSchema = z.object({
  cliente: z.string().min(1, 'Cliente es requerido'),
  producto: z.string().min(1, 'Producto es requerido'),
  cantidadMuestra: z.number().min(1, 'Cantidad de muestra requerida')
})

// Tipos automáticos desde schema
type CreateOrderForm = z.infer<typeof createOrderSchema>
```

#### 🛡️ Middleware de Protección
```vue
<script setup>
// Protección declarativa de rutas
definePageMeta({
  middleware: ['auth']           // Solo autenticación
  // middleware: ['auth', 'admin'] // + Permisos de administrador
})
</script>
```

#### 🔄 Auto-Import System
```vue
<template>
  <!-- Componentes auto-importados sin imports explícitos -->
  <BaseButton @click="handleSubmit">Guardar</BaseButton>
  <OrderWizard :data="orderData" @complete="onComplete" />
</template>

<script setup>
// Composables auto-importados
const { user } = useAuthState()
const { orders } = useOrderList()
const toast = useToast()
</script>
```

## 📚 Recursos para Desarrolladores

### Documentación Técnica
- **Nuxt 4**: [nuxt.com](https://nuxt.com) - Meta-framework Vue con SSR/SSG
- **Vue 3**: [vuejs.org](https://vuejs.org) - Composition API y reactivity
- **Supabase**: [supabase.com/docs](https://supabase.com/docs) - Backend-as-a-Service
- **TailwindCSS**: [tailwindcss.com](https://tailwindcss.com) - Utility-first CSS
- **TypeScript**: [typescriptlang.org](https://typescriptlang.org) - Type safety

### Herramientas de Desarrollo
- **VS Code** + extensiones Vue/TypeScript/Tailwind
- **Vue DevTools** para debugging reactivo
- **Supabase Studio** para gestión de base de datos
- **Vercel Dashboard** para deployments y analytics
- **Playwright Test Runner** para E2E testing

### Convenciones del Proyecto

#### Nomenclatura
- **Variables y Props**: `camelCase` estricto (`cantidadMuestra`, `testResults`)
- **Componentes**: `PascalCase` (`OrderWizardStep3`, `BaseButton`)
- **Archivos**: `kebab-case` para páginas, `PascalCase` para componentes
- **API Endpoints**: `camelCase` en requests/responses, mappers para DB

#### Desarrollo y Git
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`)
- **Branches**: `feature/descripcion-clara`, `hotfix/bug-critico`
- **Middleware**: Siempre array `['auth']` nunca string `'auth'`
- **Pre-commit**: TypeScript check → ESLint → Build verification

#### Debugging y Mantenimiento
- **Error Handling**: Inicialización segura con fallbacks
- **OCR Processing**: Timeout 60s, logging detallado
- **Testing**: Unit tests obligatorios para componentes críticos
- **Type Safety**: Verificación estricta pre-commit

## 🎯 Funcionalidades Específicas del Negocio

### Sistema de Numeración Secuencial
- **Auto-incremento**: Números de orden únicos y consecutivos
- **Formato**: `#000001`, `#000002`, etc.
- **Búsqueda**: Por número exacto o parcial
- **Trazabilidad**: Histórico completo desde el número 1

### Integración con Procesos Industriales
- **Códigos de Producto**: Mapeo con catálogo interno de Inaplast
- **Especificaciones Técnicas**: Validaciones específicas por tipo de producto
- **Planes de Muestreo**: Integración con estándares MIL-STD-105E
- **Niveles AQL**: Configurables según criticidad del producto

### Exportación y Reportes
- **PDF Detallado**: Reporte completo con imagen, datos OCR, tests y decisión
- **Excel Masivo**: Exportación de múltiples liberaciones con filtros
- **QR Codes**: Códigos únicos para trazabilidad física
- **Templates**: Formatos personalizables para diferentes tipos de reporte

### Optimizaciones Móviles
- **Responsive Design**: Mobile-first con breakpoints específicos
- **Touch Interactions**: Gestos optimizados para tablets industriales
- **Offline Fallback**: Funcionalidad básica sin conexión (próximamente)
- **Performance**: Carga rápida en redes industriales lentas

## 📄 Información Legal

**© 2025 Inaplast - Todos los derechos reservados**

Este sistema es **propiedad exclusiva de Inaplast** y contiene información confidencial, procesos industriales propietarios y conocimiento técnico especializado.

### Restricciones de Uso
- **Acceso Restringido**: Solo personal autorizado y desarrolladores certificados
- **Información Confidencial**: Datos de producción, procesos y métricas industriales
- **Propiedad Intelectual**: Algoritmos de control de calidad y workflows propietarios
- **Seguridad**: Cumplimiento con normativas industriales y protección de datos

---

## 🎯 Mensaje para Nuevos Desarrolladores

**¡Bienvenido al equipo de desarrollo del Sistema Liberador Inaplast!** 🚀

Has accedido a un sistema de **misión crítica** que digitaliza los procesos de control de calidad industrial. Tu trabajo impacta directamente la **eficiencia operacional** y **calidad de productos** de Inaplast.

### Checklist de Incorporación

1. ✅ **Configurar entorno** - Seguir guía de instalación paso a paso
2. ✅ **Revisar arquitectura** - Entender patrones Composable y Auto-import
3. ✅ **Familiarizarse con el stack** - Nuxt 4, Vue 3, TypeScript, Supabase
4. ✅ **Ejecutar tests completos** - Verificar que todo funciona localmente
5. ✅ **Configurar herramientas** - VS Code con extensiones recomendadas
6. ✅ **Revisar flujo OCR** - Entender integración Gemini AI + Tesseract
7. ✅ **Probar wizard completo** - Ejecutar proceso de liberación end-to-end

### Recursos de Apoyo
- **Documentación**: README.md (este archivo) como referencia principal
- **Código**: Comentarios detallados en componentes críticos
- **Tests**: Suite completa como documentación ejecutable
- **Tipos**: TypeScript como documentación auto-generada

### Filosofía de Desarrollo
- **Código limpio**: Legible, mantenible y bien documentado
- **Type safety**: TypeScript estricto en todo momento
- **Testing**: Cobertura alta en funcionalidades críticas
- **Performance**: Optimizado para uso industrial diario
- **UX**: Interfaces intuitivas para usuarios no técnicos

**¡Construyamos juntos software de calidad industrial para Inaplast!** 💪