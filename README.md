# Sistema Liberador Inaplast

> Sistema integral de gestión de liberación de productos industriales con OCR inteligente y flujos de inspección automatizados.

## Descripción del Proyecto

El **Sistema Liberador Inaplast** es una aplicación web privada diseñada para optimizar el proceso de inspección y liberación de productos en entornos industriales. Permite a los inspectores de calidad procesar órdenes de forma eficiente mediante un flujo guiado de 5 pasos, desde la captura de imágenes hasta la notificación automática con códigos QR.

### Propósito del Sistema

Este sistema resuelve los desafíos del proceso manual de inspección y liberación de productos industriales, proporcionando:

- **Reducción de errores** en el proceso de inspección manual mediante validaciones automáticas
- **Trazabilidad completa** de decisiones de liberación con auditoría integrada
- **Optimización de tiempos** mediante OCR automático con Google Gemini AI
- **Gestión centralizada** de usuarios con sistema de roles y permisos granulares
- **Generación automática** de códigos QR y notificaciones por email

## Características Principales

- **Proceso de Liberación en 5 Pasos**: Flujo guiado desde captura de imagen hasta notificación automática
- **OCR Inteligente**: Extracción automática de datos de etiquetas con Google Gemini AI
- **Notificaciones Automáticas**: Envío de emails con códigos QR al completar órdenes
- **Descarga Masiva de QR**: Selección múltiple de órdenes y generación de PDFs combinados
- **Sistema de Administración**: CRUD completo de usuarios con gestión de roles (Admin, Supervisor, Inspector)
- **Autenticación Segura**: Sistema híbrido JWT + Session con recuperación automática
- **Dashboard Personalizado**: Métricas y vistas diferenciadas por rol de usuario
- **Protección CSRF**: Tokens firmados para prevenir ataques de falsificación de solicitudes
- **Rate Limiting**: Control de acceso con límites de tasa por IP y usuario
- **Logging Estructurado**: Sistema de logs con Pino para monitoreo y debugging

## Stack Tecnológico

### Framework y Core
- **Nuxt 4**: Framework Vue full-stack con auto-imports y file-based routing
- **Vue 3**: Framework JavaScript reactivo con Composition API
- **TypeScript**: Tipado estático estricto para mayor seguridad y mantenibilidad
- **Pinia**: State management oficial de Vue con soporte TypeScript

### Base de Datos y Backend
- **Supabase**: Backend as a Service con PostgreSQL, autenticación y storage
- **PostgreSQL**: Base de datos relacional con RLS (Row Level Security)
- **Nitro**: Motor de servidor de Nuxt con soporte para Vercel Edge Functions

### UI y Estilos
- **TailwindCSS**: Framework CSS utility-first para diseño responsive
- **Headless UI**: Componentes accesibles sin estilos predefinidos
- **Nuxt Icon**: Sistema de iconos optimizado con Iconify

### Seguridad
- **CSRF Protection**: Tokens firmados con HMAC-SHA256
- **Rate Limiting**: Sistema de doble capa (IP + usuario) en memoria
- **Row Level Security**: Políticas de seguridad a nivel de base de datos
- **JWT + Session**: Autenticación híbrida con recuperación automática

### Inteligencia Artificial y Procesamiento
- **Google Gemini AI**: OCR inteligente para extracción de datos de imágenes
- **Sharp**: Optimización y procesamiento de imágenes
- **jsPDF**: Generación de PDFs con códigos QR
- **QRCode**: Generación de códigos QR optimizados

### Logging y Monitoreo
- **Pino**: Logger estructurado de alto rendimiento con sanitización de datos sensibles
- **Pino-Pretty**: Formatter para logs legibles en desarrollo

### Testing
- **Vitest**: Framework de testing unitario rápido y compatible con Vite
- **Playwright**: Testing end-to-end automatizado en navegadores reales
- **Vue Testing Library**: Utilidades para testing de componentes Vue

### Validación y Formularios
- **Vee-Validate**: Validación de formularios con composables
- **Zod**: Schema validation TypeScript-first

## Instalación y Configuración

### Requisitos Previos

- **Node.js**: v18 o superior
- **pnpm**: Gestor de paquetes (instalación: `npm install -g pnpm`)
- **Cuenta de Supabase**: Para base de datos y autenticación
- **API Key de Google Gemini**: Para funcionalidad OCR

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone [repository-url]
cd liberador_inaplast_nuxt

# 2. Instalar dependencias con pnpm (requerido)
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Editar .env con tus credenciales
# - NUXT_SUPABASE_URL: URL de tu proyecto Supabase
# - NUXT_SUPABASE_ANON_KEY: Clave anónima de Supabase
# - NUXT_SUPABASE_SERVICE_KEY: Clave de servicio de Supabase
# - NUXT_GEMINI_API_KEY: API Key de Google Gemini
# - NUXT_SESSION_PASSWORD: Contraseña para sesiones (mínimo 32 caracteres)
# - NUXT_JWT_SECRET: Secret para JWT (mínimo 32 caracteres)
# - NUXT_CSRF_SECRET: Secret para CSRF protection (mínimo 32 caracteres)

# 5. Iniciar servidor de desarrollo
pnpm dev
# La aplicación estará disponible en http://localhost:3000
```

### Variables de Entorno Requeridas

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Supabase
NUXT_SUPABASE_URL=tu_url_de_supabase
NUXT_SUPABASE_ANON_KEY=tu_clave_anonima
NUXT_SUPABASE_SERVICE_KEY=tu_clave_de_servicio

# Google Gemini AI
NUXT_GEMINI_API_KEY=tu_api_key_de_gemini

# Seguridad
NUXT_SESSION_PASSWORD=tu_password_de_sesion_minimo_32_caracteres
NUXT_JWT_SECRET=tu_jwt_secret_minimo_32_caracteres
NUXT_CSRF_SECRET=tu_csrf_secret_minimo_32_caracteres

# Configuración (opcionales)
NUXT_ALLOWED_DOMAINS=http://localhost:3000
NUXT_PRODUCTION_DOMAIN=https://tu-dominio.vercel.app
```

## Comandos Disponibles

### Desarrollo

```bash
pnpm dev              # Inicia servidor de desarrollo en http://localhost:3000
pnpm build            # Compila la aplicación para producción
pnpm preview          # Previsualiza el build de producción localmente
```

### Testing

```bash
pnpm test             # Ejecuta tests unitarios con Vitest
pnpm test:ui          # Interfaz visual para tests unitarios
pnpm test:coverage    # Genera reporte de cobertura de tests
pnpm test:e2e         # Ejecuta tests end-to-end con Playwright
pnpm test:e2e:ui      # Interfaz visual para tests E2E
```

### Calidad de Código

```bash
pnpm lint             # Ejecuta ESLint para verificar código
pnpm lint:fix         # Corrige automáticamente problemas de linting
npx tsc --noEmit      # Verifica tipos de TypeScript sin compilar
```

## Arquitectura del Proyecto

### Estructura de Directorios

```
liberador_inaplast_nuxt/
├── app/                          # Código fuente de la aplicación (srcDir de Nuxt)
│   ├── assets/                   # Recursos estáticos (CSS, imágenes)
│   ├── components/               # Componentes Vue reutilizables
│   │   ├── admin/               # Componentes de administración
│   │   ├── core/                # Componentes base (prefijo: Core-)
│   │   ├── feedback/            # Componentes de feedback (alertas, modales)
│   │   ├── muestreo/            # Componentes de muestreo
│   │   ├── orders/              # Componentes relacionados a órdenes
│   │   └── ui/                  # Componentes UI genéricos
│   ├── composables/             # Composables de Vue (auto-importados)
│   ├── layouts/                 # Layouts de páginas
│   ├── middleware/              # Middleware de navegación
│   ├── pages/                   # Páginas (file-based routing)
│   ├── plugins/                 # Plugins de Nuxt
│   ├── schemas/                 # Schemas de validación con Zod
│   ├── stores/                  # Stores de Pinia
│   ├── types/                   # Tipos TypeScript
│   └── utils/                   # Funciones utilitarias
├── server/                       # Código del servidor (Nitro)
│   ├── api/                     # Endpoints de API REST
│   │   ├── admin/              # APIs de administración
│   │   ├── auth/               # APIs de autenticación
│   │   ├── dashboard/          # APIs del dashboard
│   │   ├── ocr/                # APIs de OCR
│   │   ├── orders/             # APIs de órdenes
│   │   ├── profiles/           # APIs de perfiles
│   │   └── users/              # APIs de usuarios
│   ├── plugins/                # Plugins del servidor
│   └── utils/                  # Utilidades del servidor
│       ├── unified-pdf-generator.ts  # Generador unificado de PDFs
│       ├── logger.ts                 # Configuración de Pino logger
│       └── security/                 # Utilidades de seguridad
├── tests/                       # Tests unitarios y E2E
│   ├── unit/                   # Tests unitarios
│   ├── integration/            # Tests de integración
│   └── e2e/                    # Tests end-to-end
├── types/                       # Tipos TypeScript globales
├── nuxt.config.ts              # Configuración de Nuxt
├── tailwind.config.ts          # Configuración de TailwindCSS
└── tsconfig.json               # Configuración de TypeScript
```

### Patrones de Arquitectura

#### Auto-imports de Nuxt 4
El proyecto utiliza las capacidades de auto-import de Nuxt 4, lo que significa que:
- **Composables** en `app/composables/` se importan automáticamente
- **Componentes** en `app/components/` están disponibles globalmente
- **Utilidades** de Vue y Nuxt no requieren imports explícitos

#### File-based Routing
Las páginas en `app/pages/` se convierten automáticamente en rutas:
- `app/pages/index.vue` → `/`
- `app/pages/orders/index.vue` → `/orders`
- `app/pages/orders/[id].vue` → `/orders/:id`

#### API Routes
Los archivos en `server/api/` se convierten en endpoints automáticamente:
- `server/api/orders/index.get.ts` → `GET /api/orders`
- `server/api/orders/index.post.ts` → `POST /api/orders`
- `server/api/orders/[id].get.ts` → `GET /api/orders/:id`

## Sistema de Roles y Permisos

### Roles Disponibles

El sistema implementa tres roles con permisos granulares:

#### Inspector
- Crear nuevas órdenes de liberación
- Ver únicamente sus propias órdenes
- Editar órdenes en proceso
- Ver métricas personales (solo sus órdenes)
- Descargar QR codes de sus órdenes

#### Supervisor
- Ver todas las órdenes del sistema
- Crear reportes y exportar datos
- Ver métricas globales del sistema
- Descargar QR codes de cualquier orden
- No puede gestionar usuarios

#### Admin
- Todos los permisos de Supervisor
- Gestión completa de usuarios (CRUD)
- Asignación y modificación de roles
- Acceso al panel de administración
- Configuración del sistema

### Seguridad a Nivel de Base de Datos

El sistema utiliza **Row Level Security (RLS)** de PostgreSQL para garantizar que:
- Los inspectores solo puedan acceder a sus propias órdenes mediante políticas de BD
- Las consultas se filtran automáticamente según el usuario autenticado
- No es posible evadir las restricciones desde el cliente

## Flujo de Trabajo: Proceso de Liberación

El sistema guía al usuario a través de un flujo de 5 pasos para liberar productos:

### 1. Captura de Imagen
- Upload de fotografía de la etiqueta del producto
- Validación de formato (JPEG, PNG, WEBP)
- Validación de tamaño máximo (10MB)
- Preview inmediato de la imagen

### 2. Extracción OCR
- Envío de imagen a Google Gemini AI
- Procesamiento inteligente con IA para extraer datos estructurados
- Auto-completado de campos del formulario:
  - Número de pedido
  - Cliente
  - Producto
  - Cantidad
  - Especificaciones técnicas
- Validación y corrección manual disponible

### 3. Pruebas de Calidad
- Configuración dinámica de tests según tipo de producto
- Registro de resultados de inspección con valores numéricos
- Validación de rangos aceptables
- Campos personalizables por categoría de producto

### 4. Decisión de Liberación
- Revisión de toda la información capturada
- Decisión final: Aprobar o Rechazar
- Campo de observaciones para documentar razones
- Registro inmutable de la decisión

### 5. Notificación Automática
- Generación automática de código QR con datos de la orden
- Envío de email al creador de la orden vía Supabase Edge Functions
- Email incluye:
  - Resumen de la orden
  - Link directo al detalle de la orden
  - Código QR embebido
- Registro de notificación enviada

## Sistema de Generación de PDFs

### Arquitectura Unificada

El sistema utiliza un generador unificado (`server/utils/unified-pdf-generator.ts`) que:
- **Elimina código duplicado**: Una sola implementación para PDFs individuales y masivos
- **Optimiza rendimiento**: Genera PDFs directamente sin archivos temporales
- **Reduce uso de memoria**: No requiere fusionar múltiples PDFs
- **Facilita mantenimiento**: Cambios en un solo lugar afectan todo el sistema

### Descarga Individual

Cada orden liberada permite descargar su código QR en formato PDF:
- Acceso desde el detalle de la orden
- Generación bajo demanda (no se almacenan PDFs)
- Formato estandarizado de 100x150mm
- Información incluida: pedido, cliente, estado, código QR

### Descarga Masiva

Los usuarios pueden descargar múltiples códigos QR en un solo PDF:
- **Selección múltiple**: Checkboxes en la lista de órdenes
- **Límite**: Máximo 100 órdenes por descarga (prevención de timeouts)
- **Un solo PDF**: Múltiples páginas, una orden por página
- **Numeración**: Cada página muestra "Página X de Y"
- **Validación por rol**: Inspectores solo ven sus propias órdenes
- **Performance**: Generación optimizada en edge functions de Vercel

### Características Técnicas

- **jsPDF**: Generación de PDFs en memoria
- **QRCode**: Generación de códigos QR optimizados (nivel de corrección L)
- **Compresión**: PDFs comprimidos para reducir tamaño de descarga
- **Logging**: Trazabilidad completa con Pino logger
- **Error handling**: Manejo robusto de errores con fallbacks

## Testing

El proyecto cuenta con una suite completa de tests automatizados:

### Tipos de Tests

#### Tests Unitarios (Vitest)
Ubicados en `tests/`, cubren:
- **Composables**: Lógica de negocio reutilizable
- **Utilidades**: Funciones helper y transformadores
- **Stores**: State management de Pinia
- **Middleware**: Guardias de navegación

#### Tests de Integración
- **API Endpoints**: Validación de respuestas y errores
- **Seguridad**: CSRF protection, rate limiting
- **Autenticación**: Flujos de login, logout, recuperación

#### Tests E2E (Playwright)
- **Flujo completo de liberación**: De captura a notificación
- **Gestión de usuarios**: CRUD desde panel de admin
- **Descarga de QR codes**: Individual y masiva
- **Navegación**: Rutas protegidas y públicas

### Ejecutar Tests

```bash
# Tests unitarios con watch mode
pnpm test

# Tests unitarios con UI interactiva
pnpm test:ui

# Cobertura de tests
pnpm test:coverage

# Tests E2E
pnpm test:e2e

# Tests E2E con UI interactiva
pnpm test:e2e:ui
```

### Convenciones de Testing

- **Arrange-Act-Assert**: Estructura clara en cada test
- **Mocking**: Uso de `tests/mocks/` para datos de prueba
- **Nombres descriptivos**: Tests que explican qué validan
- **Aislamiento**: Cada test es independiente y no afecta a otros

## Deployment en Vercel

### Configuración

El proyecto está optimizado para deployment en Vercel con Nitro preset:

```bash
# Deployment automático
# Cada push a main despliega automáticamente

# Deployment manual
pnpm build
npx vercel deploy --prebuilt
```

### Variables de Entorno en Producción

Configurar en el dashboard de Vercel:

```env
# Supabase (requerido)
NUXT_SUPABASE_URL=https://tu-proyecto.supabase.co
NUXT_SUPABASE_ANON_KEY=tu_anon_key
NUXT_SUPABASE_SERVICE_KEY=tu_service_key

# Google Gemini AI (requerido)
NUXT_GEMINI_API_KEY=tu_gemini_api_key

# Seguridad (requerido - generar con openssl rand -base64 32)
NUXT_SESSION_PASSWORD=tu_session_password_minimo_32_caracteres
NUXT_JWT_SECRET=tu_jwt_secret_minimo_32_caracteres
NUXT_CSRF_SECRET=tu_csrf_secret_minimo_32_caracteres

# Dominios (opcional)
NUXT_ALLOWED_DOMAINS=https://tu-dominio.vercel.app
NUXT_PRODUCTION_DOMAIN=https://tu-dominio.vercel.app
```

### Verificaciones Post-Deployment

Después de desplegar, verificar:
- [ ] Login funciona correctamente
- [ ] OCR procesa imágenes
- [ ] Generación de PDFs funciona
- [ ] Envío de emails con notificaciones
- [ ] Rate limiting está activo
- [ ] Logs se registran correctamente

## Guía para Nuevos Desarrolladores

### Primeros Pasos

Si acabas de unirte al equipo, sigue esta secuencia:

#### 1. Setup del Entorno (30 minutos)
- Clonar el repositorio
- Instalar dependencias con `pnpm install`
- Configurar variables de entorno en `.env`
- Iniciar servidor con `pnpm dev`
- Verificar que la aplicación carga en http://localhost:3000

#### 2. Explorar el Código (1-2 horas)
- Revisar estructura de carpetas en este README
- Leer `nuxt.config.ts` para entender configuración
- Explorar `server/utils/unified-pdf-generator.ts` (ejemplo de código bien estructurado)
- Revisar un componente en `app/components/orders/`
- Leer un composable en `app/composables/`

#### 3. Ejecutar Tests (15 minutos)
- Correr `pnpm test` y revisar la salida
- Abrir `pnpm test:ui` para ver tests en modo interactivo
- Explorar un archivo de test en `tests/`

#### 4. Crear una Orden (20 minutos)
- Hacer login con credenciales del `.env`
- Navegar al dashboard
- Crear una nueva orden siguiendo el flujo de 5 pasos
- Verificar que se genera el código QR
- Revisar el email de notificación

#### 5. Entender el Sistema de Roles (15 minutos)
- Crear usuarios con diferentes roles desde el panel de admin
- Verificar cómo cambian las vistas según el rol
- Entender las políticas RLS en Supabase

### Conceptos Clave a Dominar

- **Auto-imports de Nuxt 4**: No necesitas importar composables ni componentes
- **File-based routing**: Las páginas se crean automáticamente desde archivos
- **Composition API**: Toda la lógica usa `<script setup>` de Vue 3
- **Row Level Security**: La seguridad está en la base de datos, no solo en el cliente
- **Edge Functions**: Las APIs corren en Vercel Edge para máximo rendimiento

### Recursos de Aprendizaje

- **Nuxt 4**: https://nuxt.com/docs
- **Vue 3 Composition API**: https://vuejs.org/guide/introduction.html
- **Supabase**: https://supabase.com/docs
- **TailwindCSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs/

## Convenciones de Código

### Estructura de Componentes Vue

Los componentes siguen la estructura estándar de Vue 3 con `<script setup>`:

```vue
<template>
  <!-- UI con clases de TailwindCSS -->
  <div class="container mx-auto">
    <!-- Contenido del componente -->
  </div>
</template>

<script setup lang="ts">
// 1. Imports (solo si son externos, los composables se auto-importan)
import { someExternalLibrary } from 'external-lib'

// 2. Props y emits
const props = defineProps<{
  orderId: number
}>()

const emit = defineEmits<{
  (e: 'submit', value: string): void
}>()

// 3. Composables (auto-importados)
const { data, loading } = useOrders()

// 4. Reactive state
const isOpen = ref(false)

// 5. Computed properties
const displayValue = computed(() => {
  // lógica
})

// 6. Funciones
function handleSubmit() {
  // lógica
}

// 7. Lifecycle hooks
onMounted(() => {
  // lógica
})
</script>
```

### Naming Conventions (Nuxt 4)

- **Variables**: camelCase (`orderStatus`, `userName`)
- **Constantes**: SNAKE_CASE (`MAX_FILE_SIZE`, `API_BASE_URL`)
- **Componentes**: PascalCase (`UserTable.vue`, `OrderCard.vue`)
- **Composables**: camelCase con prefijo `use` (`useAuthProfile`, `useOrders`)
- **Tipos e Interfaces**: PascalCase (`OrderStatus`, `ProfileData`, `ApiResponse`)
- **Archivos de API**: kebab-case con método HTTP (`index.get.ts`, `[id].delete.ts`)

### Organización de Imports

Gracias al auto-import de Nuxt 4, **no necesitas importar**:
- Composables de `app/composables/`
- Componentes de `app/components/`
- Utilidades de Vue (`ref`, `computed`, `onMounted`, etc.)
- Utilidades de Nuxt (`useState`, `useFetch`, `navigateTo`, etc.)

**Sí necesitas importar**:
- Librerías externas (`import { jsPDF } from 'jspdf'`)
- Tipos de otros archivos (`import type { OrderData } from '~/types/orders'`)
- Utilidades que no están en carpetas auto-importadas

### Manejo de Errores

```typescript
// Usar try-catch con logging estructurado
try {
  const result = await someOperation()
  return result
} catch (error) {
  logger.error({
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context: { orderId: 123 }
  }, 'Descripción del error')

  throw createError({
    statusCode: 500,
    message: 'Mensaje amigable para el usuario'
  })
}
```

### Validación de Formularios

Usar Vee-Validate con Zod schemas:

```typescript
import { z } from 'zod'

// Definir schema
const orderSchema = z.object({
  pedido: z.string().min(1, 'El pedido es requerido'),
  cliente: z.string().min(1, 'El cliente es requerido'),
  cantidad: z.number().positive('La cantidad debe ser positiva')
})

// Usar en componente (validación automática)
const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(orderSchema)
})
```

## Información Legal

### Propiedad Intelectual

Este proyecto es **código propietario** de Inaplast, desarrollado para uso interno exclusivo de la empresa. No es un proyecto de código abierto y no debe ser compartido fuera de la organización.

### Licencia

**Todos los derechos reservados** - Copyright © 2025 Inaplast

El uso, modificación, distribución o cualquier otra forma de explotación de este código está estrictamente prohibido sin autorización expresa por escrito de Inaplast.

---

## Soporte y Contacto

Para soporte técnico, preguntas o reportar problemas:
- Contactar al equipo de desarrollo interno
- Crear un issue en el repositorio (para desarrolladores autorizados)

---

**Versión actual**: 3.0.0
**Última actualización**: Noviembre 2025
**Mantenido por**: Equipo de Desarrollo Inaplast