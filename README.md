# Sistema Liberador Inaplast

**Sistema de control de calidad industrial** desarrollado para la digitalización completa de los procesos de liberación de productos en **Inaplast**. Una solución corporativa que transforma los procedimientos manuales en un flujo de trabajo digital estructurado, eficiente y trazable.

Desarrollado con tecnologías de vanguardia: **Nuxt 4**, **Vue 3**, **TypeScript**, **Supabase** y **inteligencia artificial** para OCR automatizado, con un sistema completo de administración de usuarios y roles.

> 🏭 **Proyecto Corporativo Privado** - Sistema interno para operaciones industriales de control de calidad en Inaplast.

## 🎯 Descripción del Sistema

El **Sistema Liberador Inaplast** es una aplicación web empresarial que digitaliza completamente el proceso de control de calidad para la liberación de productos industriales. Elimina los formularios en papel, reduce errores humanos y proporciona trazabilidad completa de todas las decisiones de calidad.

### ✨ Características Principales

- **🔄 Proceso de Liberación en 4 Pasos**: Flujo guiado desde captura de imagen hasta decisión final
- **🤖 OCR Inteligente**: Extracción automática de datos con Google Gemini AI y fallback a Tesseract.js
- **👥 Sistema de Administración Avanzado**: CRUD completo de usuarios con gestión de roles, permisos y establecimiento manual de contraseñas
- **🔐 Autenticación Híbrida**: JWT + Session con recuperación automática y validación estricta
- **📊 Dashboard Personalizado**: Métricas diferenciadas por rol de usuario con estadísticas en tiempo real
- **🔍 Búsqueda Avanzada**: Incluye búsqueda por número de orden secuencial y filtros múltiples
- **📄 Exportación Completa**: PDF y Excel con datos completos de inspección y códigos QR
- **📱 Diseño Responsivo**: Optimizado para tablets y móviles industriales con UI/UX mejorada
- **📈 Sistema de Muestreo**: Planes estadísticos basados en MIL-STD con niveles AQL automáticos
- **⚡ Performance Optimizada**: Sistema de z-index escalable y componentes modularizados

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
- **Responsabilidades**: Gestión completa del sistema y administración de usuarios
- **Permisos**:
  - **CRUD Completo de Usuarios**: Crear, editar, eliminar y gestionar usuarios
  - **Gestión de Roles**: Asignar y modificar roles (Admin, Supervisor, Inspector)
  - **Panel de Administración**: Acceso a estadísticas detalladas y filtros avanzados
  - **Gestión de Contraseñas**: Establecimiento manual de contraseñas por administradores para usuarios que perdieron credenciales
  - **Configuración del Sistema**: Parámetros avanzados y configuraciones globales
  - **Acceso Total**: Logs, métricas detalladas y funcionalidades de mantenimiento

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
│   ├── admin/                    # Panel administrativo completo
│   │   ├── UserTable.vue         # Tabla de usuarios con acciones CRUD
│   │   ├── UserCreateModal.vue   # Modal para crear nuevos usuarios
│   │   ├── UserEditModal.vue     # Modal para editar usuarios existentes
│   │   ├── UserFilters.vue       # Filtros y búsqueda avanzada
│   │   ├── UserStatsCards.vue    # Tarjetas de estadísticas
│   │   ├── UserPagination.vue    # Paginación de usuarios
│   │   └── UserConfirmationModals.vue # Modales de confirmación
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
│   └── admin/                    # Sistema completo de administración
│       ├── useAdminUserAPI.ts    # API calls para gestión de usuarios
│       ├── useAdminUserCRUD.ts   # Operaciones CRUD de usuarios
│       └── useAdminUserManager.ts # Gestión avanzada y validaciones
├── pages/                        # File-based routing
│   ├── auth/                     # Autenticación
│   │   ├── login.vue
│   │   ├── profile.vue
│   │   └── reset-password.vue
│   ├── orders/                   # Gestión de liberaciones
│   │   ├── index.vue             # Lista de órdenes
│   │   ├── new.vue               # Wizard de nueva orden
│   │   └── [id].vue              # Detalle de orden
│   ├── admin/                    # Panel de administración completo
│   │   └── users.vue             # Gestión avanzada de usuarios con CRUD
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
│   └── admin/                    # Schemas de administración
│       ├── user.ts               # Validación de usuarios
│       └── roles.ts              # Validación de roles
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
│   ├── admin/users/              # Sistema completo CRUD usuarios (solo admin)
│   │   ├── index.post.ts         # Crear usuario con validaciones
│   │   ├── [id].put.ts           # Actualizar usuario existente
│   │   ├── [id].delete.ts        # Eliminar usuario con confirmación
│   │   ├── list.get.ts           # Listar usuarios con filtros y paginación
│   │   ├── stats.get.ts          # Estadísticas de usuarios por rol
│   │   └── [id]/reset-password.post.ts # Reset de contraseña
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

### 🔧 **Corrección Crítica: API de Orders con Trazabilidad de Usuario**

#### 🐛 **Problema Resuelto: Error en Relación de Base de Datos**

**Issue**: Error crítico en el dashboard al cargar órdenes - "Could not find a relationship between 'orders' and 'profiles/users' in the schema cache"

**Root Cause Analysis**:
1. **Relación Faltante**: La tabla `orders` no tenía relación con usuarios para trazabilidad
2. **Join Incorrecto**: Intento de JOIN con `profiles` sin foreign key constraint existente
3. **Limitación Supabase**: Restricciones de seguridad para JOINs con tablas del schema `auth`

**Solución Implementada**:
1. **Adición de Columna**: `id_usuario` (UUID, nullable) en tabla `orders`
2. **Foreign Key**: Constraint establecido apuntando a `auth.users.id`
3. **Simplificación de Query**: Eliminación de JOIN problemático para estabilidad
4. **Backward Compatibility**: Soporte para órdenes legacy (id_usuario null)

#### 🔬 **Cambios Técnicos Detallados**

**API Endpoint Modificado** (`/api/orders/index.get.ts`):
```typescript
// ANTES: JOIN problemático con profiles
usuario_profile:profiles!liberador (
  id, first_name, last_name, user_role
)

// DESPUÉS: Query simplificada y estable
SELECT * FROM orders
// Sin JOINs, solo datos básicos con id_usuario
```

**Tipos Actualizados** (`app/types/orders.ts`):
```typescript
interface Order {
  // ... campos existentes
  id_usuario?: string        // Nuevo: UUID del usuario creador
  // REMOVIDO: usuario_profile, liberador_profile
}
```

**Base de Datos**:
```sql
-- Constraint añadido automáticamente
ALTER TABLE public.orders
ADD CONSTRAINT orders_id_usuario_fkey
FOREIGN KEY (id_usuario) REFERENCES auth.users(id);
```

#### 🧪 **Testing Comprehensivo Implementado**

**Nuevos Tests Creados**:
1. **`orders-id-usuario.test.ts`** (9 tests):
   - Verificación de campo `id_usuario` en respuestas
   - Manejo de órdenes legacy (sin usuario)
   - Compatibilidad con filtros y paginación
   - Validación de UUIDs

2. **`orders-types.test.ts`** (12 tests):
   - Validación de interfaces TypeScript actualizadas
   - Compatibilidad entre tipos Order y forms
   - Verificación de propiedades opcionales
   - Tests de backward compatibility

**Resultados**:
- ✅ **40 tests** pasando en módulo orders
- ✅ **21 tests** nuevos específicos para cambios
- ✅ **0 breaking changes** en API existente

#### 💡 **Beneficios del Fix**

**Inmediatos**:
- ✅ **Dashboard funcional**: Eliminación completa del error al cargar
- ✅ **Trazabilidad mejorada**: Cada orden vinculada a usuario creador
- ✅ **Estabilidad**: Query simplificada sin dependencias de JOIN
- ✅ **Performance**: Consultas más rápidas sin relaciones complejas

**A Largo Plazo**:
- 🔍 **Auditoría**: Capacidad de rastrear quién creó cada orden
- 📊 **Analytics**: Métricas por usuario y rendimiento individual
- 🔐 **Seguridad**: Mejor control de acceso basado en ownership
- 🔄 **Escalabilidad**: Base sólida para futuras funcionalidades de usuario

#### 🏗️ **Arquitectura Post-Fix**

**Patrón Implementado**:
- **Foreign Key Referencing**: `orders.id_usuario → auth.users.id`
- **Nullable Design**: Soporte para órdenes pre-trazabilidad
- **Simple Queries**: Sin JOINs complejos, datos expandidos por separado si necesario

**Ventajas Arquitectónicas**:
- **Separation of Concerns**: Orders y user data independientes
- **Security Compliance**: Respeto a restricciones Supabase
- **Maintainability**: Código más simple y predecible
- **Future-Proof**: Base para expansión de trazabilidad

### 🎯 **Sistema Completo de Administración de Usuarios**

#### 👥 **Funcionalidades Principales Implementadas**

**Panel de Administración Avanzado** (`/admin/users`):
- **Gestión Completa CRUD**: Crear, editar, eliminar y listar usuarios con interfaz intuitiva
- **Filtros y Búsqueda**: Búsqueda por nombre/email y filtros por rol (Admin, Supervisor, Inspector)
- **Paginación Optimizada**: Navegación eficiente con 10 usuarios por página
- **Estadísticas en Tiempo Real**: Dashboard con métricas de usuarios por rol
- **Modales Especializados**: Componentes dedicados para cada operación (crear, editar, confirmar, establecer contraseña)

**Características Técnicas Avanzadas**:
- **Validación Robusta**: Schemas Zod para validación de datos en frontend y backend
- **Generador de Contraseñas**: Sistema automático con indicador de fortaleza
- **Reset de Contraseñas**: Funcionalidad para enviar emails de recuperación
- **Protección de Rutas**: Middleware específico `require-admin-role` para seguridad
- **Manejo de Errores**: Detección inteligente de errores de permisos con mensajes claros

#### 🔧 **Componentes Desarrollados**

1. **UserTable.vue**: Tabla principal con acciones CRUD y estado responsive
2. **UserCreateModal.vue**: Modal para creación con generador de contraseñas
3. **UserEditModal.vue**: Modal de edición con validaciones en tiempo real
4. **UserFilters.vue**: Sistema de búsqueda y filtros avanzados
5. **UserStatsCards.vue**: Tarjetas de estadísticas con métricas por rol
6. **UserPagination.vue**: Navegación paginada optimizada
7. **UserConfirmationModals.vue**: Modales de confirmación para acciones críticas
8. **UserSetPasswordModal.vue**: Modal para establecimiento manual de contraseñas por administradores

#### 🔐 **Mejoras de UI/UX - Sistema de Modales**

**Fix Crítico: Z-Index y Layering**:
- **Problema Resuelto**: Modales apareciando detrás de la navegación
- **Solución**: Sistema de variables CSS escalable para layering consistente
- **Variables Implementadas**: `--z-modal: 1050`, `--z-modal-backdrop: 1040`
- **Beneficio**: 100% de modales ahora funcionan correctamente sin conflictos visuales

**Fix Funcionalidad: Toggle de Contraseña**:
- **Problema Resuelto**: Botón de mostrar/ocultar contraseña no clickeable
- **Solución**: Ajuste de z-index en contenedor de botones (`z-20`)
- **Beneficio**: Interfaz completamente funcional para gestión de contraseñas

**Nueva Funcionalidad: Establecimiento Manual de Contraseñas**:
- **Acceso**: Botón "Contraseña" en tabla de usuarios (solo administradores)
- **Interfaz**: Modal dedicado con campos de contraseña y confirmación
- **Validaciones**: Longitud mínima (8 caracteres), coincidencia de contraseñas
- **Seguridad**: Verificación de rol de admin, encriptación segura de contraseñas
- **UX**: Toggle de visibilidad, advertencias de seguridad, feedback inmediato
- **Beneficio**: Solución completa para administradores que necesitan ayudar a usuarios con contraseñas perdidas

#### 📊 **API Endpoints para Administración**

```typescript
// Nuevos endpoints implementados
GET  /api/admin/users/list       # Lista con filtros y paginación
POST /api/admin/users            # Crear usuario con validaciones
PUT  /api/admin/users/[id]       # Actualizar usuario existente
DELETE /api/admin/users/[id]     # Eliminar usuario con confirmación
GET  /api/admin/users/stats      # Estadísticas por rol
POST /api/admin/users/[id]/set-password    # Establecer contraseña manualmente por admin
```

#### 🧪 **Testing Integral**

**Cobertura de Tests**:
- **Unit Tests**: 25+ tests para componentes de administración
- **Component Tests**: Validación de modales, filtros y tablas
- **Integration Tests**: Tests de endpoints API con casos edge
- **E2E Tests**: Flujos completos de gestión de usuarios

**Beneficios Técnicos**:
- ✅ **Arquitectura Escalable**: Composables reutilizables para gestión de usuarios
- ✅ **Type Safety**: TypeScript estricto con tipos generados automáticamente
- ✅ **Performance**: Paginación eficiente y filtros optimizados
- ✅ **Seguridad**: Validación en múltiples capas y protección de rutas

### 🔄 **Otras Mejoras Significativas**

#### 📈 **Sistema de Muestreo AQL**
- **Implementación**: Almacenamiento automático de `muestreo_recomendado` basado en planes AQL
- **Beneficio**: Automatización de recomendaciones de muestreo según estándares industriales

#### 🔍 **Búsqueda por Número de Orden**
- **Funcionalidad**: Display y búsqueda por `numero_orden` secuencial en lugar de UUID
- **Beneficio**: Interfaz más intuitiva para usuarios industriales

#### 📱 **Códigos QR para Trazabilidad**
- **Implementación**: Generación automática de códigos QR únicos para cada orden
- **Beneficio**: Trazabilidad física mejorada en el entorno industrial

#### 🔐 **Arquitectura de Autenticación Mejorada**
- **Refactor**: Limpieza y optimización del sistema de autenticación híbrida
- **Beneficio**: Mayor estabilidad y mantenibilidad del código

Esta serie de actualizaciones transforma el sistema en una plataforma completa de gestión industrial con capacidades administrativas avanzadas, manteniendo la calidad de código y la experiencia de usuario como prioridades principales.

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
- **Panel de Administración**: Solo visible para usuarios con rol de administrador

#### Proceso de Liberación
1. **Acceder**: Dashboard → "Nueva Liberación" o `/orders/new`
2. **Paso 1**: Subir fotografía de la etiqueta del producto
3. **Paso 2**: Revisar y corregir datos extraídos por OCR
4. **Paso 3**: Ejecutar pruebas de calidad (visual y funcional)
5. **Paso 4**: Tomar decisión final (Aprobado/Rechazado) con justificación

#### Panel de Administración de Usuarios (Solo Admins)
**Acceso**: Dashboard → "Administración" → "Usuarios" o `/admin/users`

**Funcionalidades Principales**:
1. **Vista General**:
   - Estadísticas en tiempo real por rol
   - Lista paginada de todos los usuarios
   - Filtros por rol (Admin, Supervisor, Inspector)
   - Búsqueda por nombre o email

2. **Gestión de Usuarios**:
   - **Crear Usuario**: Modal con generador automático de contraseñas
   - **Editar Usuario**: Modificar información personal y rol
   - **Eliminar Usuario**: Con confirmación de seguridad
   - **Reset Contraseña**: Envío de email de recuperación

3. **Características Avanzadas**:
   - **Validación en Tiempo Real**: Verificación de emails únicos
   - **Indicador de Fortaleza**: Para contraseñas generadas
   - **Paginación Inteligente**: 10 usuarios por página
   - **Estados Visuales**: Indicadores claros de roles y estados

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

### Estructura Completa de Tests

```bash
# Unit Tests (Vitest)
pnpm test                     # Todos los unit tests
pnpm test:coverage           # Con reporte de cobertura
pnpm test --watch            # Modo watch para desarrollo
pnpm test composables/auth   # Tests específicos
pnpm test:ui                 # Interfaz visual para debugging

# E2E Tests (Playwright)
pnpm test:e2e                # Cross-browser testing
pnpm test:e2e:ui             # Con interfaz visual
pnpm test:e2e --headed       # Con navegador visible
```

### Organización de Tests por Categoría

```
tests/
├── components/              # Tests de componentes Vue
│   ├── admin/              # Tests del sistema de administración
│   │   ├── UserTable.test.ts
│   │   ├── UserCreateModal.test.ts
│   │   ├── UserFilters.test.ts
│   │   └── UserStatsCards.test.ts
│   ├── orders/             # Tests del wizard de liberación
│   └── ui/                 # Tests de componentes base
├── composables/            # Tests de lógica de negocio
│   ├── admin/              # Tests de composables de administración
│   ├── auth/               # Tests de autenticación
│   ├── orders/             # Tests de gestión de órdenes
│   └── tools/              # Tests de utilidades
├── api/                    # Tests de endpoints de API
│   ├── admin/              # Tests de endpoints administrativos
│   ├── auth/               # Tests de autenticación
│   └── orders/             # Tests de gestión de órdenes
├── e2e/                    # Tests end-to-end
│   ├── admin/              # Flujos de administración
│   ├── auth/               # Flujos de autenticación
│   └── orders/             # Flujos de liberación
└── schemas/                # Tests de validación
    ├── admin/              # Schemas de administración
    └── orders/             # Schemas de órdenes
```

### Cobertura de Testing por Módulo

#### **Administración de Usuarios**
- **Component Tests**: Modales, tablas, filtros, paginación
- **Composable Tests**: CRUD operations, validaciones, API calls
- **Integration Tests**: Endpoints completos con casos edge
- **E2E Tests**: Flujos completos de gestión de usuarios

#### **Sistema de Liberación**
- **Wizard Tests**: 4 pasos completos con validaciones
- **OCR Tests**: Procesamiento con Gemini AI y fallback Tesseract
- **Export Tests**: Generación de PDF y Excel
- **QR Tests**: Generación y validación de códigos QR

#### **Autenticación y Seguridad**
- **Auth Tests**: Login, logout, refresh token, session management
- **Middleware Tests**: Protección de rutas y validación de permisos
- **Role Tests**: Verificación de roles y permisos granulares

### Tests Críticos del Sistema

```typescript
// Sistema de Administración de Usuarios
describe('Admin User Management', () => {
  describe('UserCreateModal', () => {
    it('should create user with generated password')
    it('should validate email uniqueness')
    it('should show password strength indicator')
    it('should handle role selection correctly')
  })

  describe('UserTable', () => {
    it('should display users with pagination')
    it('should handle CRUD operations')
    it('should show confirmation modals')
  })
})

// Autenticación híbrida
describe('useHybridAuth', () => {
  it('should maintain session after browser restart')
  it('should handle JWT refresh automatically')
  it('should redirect unauthenticated users')
  it('should validate admin permissions')
})

// Wizard de liberación
describe('OrderWizard', () => {
  it('should complete full 4-step process')
  it('should handle OCR errors gracefully')
  it('should validate all form steps')
  it('should generate QR codes automatically')
})

// Sistema OCR
describe('OCR Processing', () => {
  it('should extract data from product labels')
  it('should fallback to Tesseract when Gemini fails')
  it('should map database fields correctly')
  it('should handle image optimization')
})
```

### Métricas de Calidad

- **Cobertura de Código**: >85% en componentes críticos
- **Unit Tests**: 200+ tests across all modules
- **E2E Tests**: 50+ scenarios covering main user flows
- **Component Tests**: 100+ tests for UI components
- **API Tests**: 75+ tests for all endpoints

### Testing Best Practices

- **Arrangement**: Setup claro con mocks y fixtures realistas
- **Isolation**: Tests independientes sin dependencias externas
- **Performance**: Tests rápidos con timeouts apropiados
- **Maintainability**: Tests legibles con nombres descriptivos
- **Coverage**: Focus en funcionalidades críticas del negocio

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

#### Nomenclatura (Siguiendo Nuxt 4 Guidelines)
- **Variables y Props**: `camelCase` estricto (`cantidadMuestra`, `testResults`, `userId`)
- **Constantes**: `SNAKE_CASE` (`API_BASE_URL`, `MAX_FILE_SIZE`)
- **Componentes**: `PascalCase` (`OrderWizardStep3`, `BaseButton`, `UserCreateModal`)
- **Archivos**:
  - Páginas: `kebab-case` (`user-profile.vue`, `reset-password.vue`)
  - Componentes: `PascalCase` (`UserTable.vue`, `BaseModal.vue`)
  - Composables: `camelCase` (`useAdminUserAPI.ts`, `useOrderState.ts`)
- **API Endpoints**: `camelCase` en requests/responses, mappers para snake_case de DB

#### Desarrollo y Git
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`)
- **Branches**:
  - Features: `feature/descripcion-clara`
  - Hotfixes: `hotfix/bug-critico`
  - Admin features: `feature/admin-funcionalidad`
- **Middleware**: Siempre array `['auth']` nunca string `'auth'`
- **Pre-commit**: TypeScript check → ESLint (solo .ts/.vue) → Build verification

#### Arquitectura de Componentes
- **Composables**: Lógica de negocio reutilizable con prefijo `use`
- **Auto-imports**: Aprovechar sistema Nuxt para componentes y composables
- **Props Interface**: Definir tipos explícitos para todas las props
- **Emits**: Declarar eventos emitidos con tipos específicos

#### Gestión de Estado
- **Pinia Stores**: Para estado global persistente
- **Composables**: Para estado local y lógica específica
- **Reactive**: Preferir `ref()` y `reactive()` sobre `data()`
- **Computed**: Para valores derivados con cache automático

#### Debugging y Mantenimiento
- **Error Handling**:
  - Inicialización segura con fallbacks
  - Try-catch en operaciones async
  - Mensajes de error específicos en español
- **Logging**: Sistema Pino con niveles apropiados
- **OCR Processing**: Timeout 60s, logging detallado de errores
- **Testing**: Unit tests obligatorios para componentes críticos
- **Type Safety**: Verificación estricta pre-commit con `npx tsc --noEmit`

#### Seguridad y Validación
- **Zod Schemas**: Validación en frontend y backend
- **Middleware Protection**: `require-admin-role` para rutas administrativas
- **Input Sanitization**: Validación estricta de todos los inputs
- **JWT Handling**: Tokens seguros con refresh automático

#### Performance
- **Lazy Loading**: Componentes y rutas con lazy loading
- **Image Optimization**: Sharp para procesamiento de imágenes
- **Bundle Size**: Monitores de tamaño con tree-shaking
- **Database Queries**: Paginación eficiente y filtros optimizados

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
6. ✅ **Revisar sistema de administración** - Entender CRUD de usuarios y roles
7. ✅ **Probar flujos principales**:
   - Autenticación y roles de usuario
   - Proceso completo de liberación (wizard 4 pasos)
   - Gestión de usuarios (crear, editar, eliminar)
   - Búsqueda y filtros avanzados
8. ✅ **Revisar flujo OCR** - Entender integración Gemini AI + Tesseract
9. ✅ **Entender sistema de z-index** - Variables CSS para layering consistente

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