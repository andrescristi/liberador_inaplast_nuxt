# Liberador Inaplast - Sistema de Control de Calidad

**Aplicación web corporativa** para gestión de flujos de trabajo de control de calidad de productos en **Inaplast**. Construido con **Nuxt 4**, **Vue 3**, **TailwindCSS** y **Supabase**.

> 📋 **Proyecto Corporativo Privado** - Sistema interno desarrollado específicamente para las operaciones de control de calidad de Inaplast.

## 🎯 Propósito del Sistema

Sistema interno de **Inaplast** para digitalizar y optimizar los procesos de control de calidad:

- **Control de calidad** de productos con flujo de 4 pasos estandarizado
- **Gestión de personal** con roles definidos (Admin, Supervisor, Inspector)
- **Extracción automática** de datos desde etiquetas de producción usando OCR con Gemini AI
- **Planes de muestreo** estadístico según estándares industriales (MIL-STD)
- **Panel administrativo** con trazabilidad completa de operaciones

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico
- **Frontend**: Nuxt 4 + Vue 3 + TypeScript
- **Styling**: TailwindCSS + componentes personalizados
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **OCR**: Google Gemini AI
- **Testing**: Vitest + Playwright
- **Deploy**: Vercel

## 🚀 Funcionalidades Principales

### 1. Sistema de Autenticación (Server-Side) - **v2.6.0**
- **API Endpoints**: `/api/auth/login`, `/api/auth/user`, `/api/auth/profile`, `/api/auth/logout`, `/api/auth/update-password`
- **Composables**: `useAuthState`, `useAuthLogin`, `useAuthProfile`, `useAuthPassword` - arquitectura API-first
- **Roles**: Admin, Supervisor, Inspector con permisos granulares
- **Seguridad**: Autenticación server-side completa, validación con Zod, manejo robusto de errores
- **Reset de contraseñas**: Sistema completo con tokens seguros y validación

### 2. Control de Calidad (4 Pasos)
- **Paso 1**: Subida de imagen de etiqueta + cantidad de cajas
- **Paso 2**: Detalles del producto (datos del OCR + manual)
- **Paso 3**: Pruebas de calidad (dimensiones, resistencia, apariencia)
- **Paso 4**: Resumen y decisión (Aceptado/Rechazado)

### 3. OCR con Gemini AI
- **Endpoint**: `/api/ocr/extract` - extrae datos estructurados de etiquetas
- **Campos**: Lote, Cliente, Producto, Fecha, Turno, Inspector, etc.
- **Integración**: Auto-llena formularios del Paso 2

### 4. Panel de Administración - **v2.7.0**
- **Gestión avanzada de usuarios**: CRUD completo con componentes modulares
- **Componentes especializados**: `UserTable`, `UserFilters`, `UserStatsCards`, `UserPagination`
- **Arquitectura composable**: Sistema `useAdminUser*` para separación de responsabilidades
- **API endpoints**: `/api/admin/users/*` con validación y autorización usando ServiceRole
- **Middleware seguro**: Verificación de permisos admin con cookies server-side
- **Estadísticas en tiempo real**: Métricas detalladas por roles y períodos
- **Sistema de roles**: Reset de contraseñas, activación/desactivación de usuarios
- **Fix crítico**: Resuelto problema de autenticación que impedía acceso a administradores

### 5. Sistema de Muestreo Estadístico
- **Planes de Muestreo**: Configuración AQL y niveles de inspección
- **Grupos de Muestreo**: Rangos de tamaño de lote
- **Standards**: Basado en MIL-STD para aseguramiento de calidad

## 💻 Cómo Funciona el Código

### Estructura de Directorios (Nuxt 4)
```
app/                          # Código fuente principal
├── components/               # Componentes Vue reutilizables
│   ├── admin/               # Gestión de usuarios
│   ├── auth/                # Autenticación
│   ├── core/                # Navegación principal
│   └── ui/                  # Sistema de componentes base
├── composables/             # Lógica reutilizable
│   ├── auth/               # Autenticación (useAuthState, etc.)
│   └── admin/              # Administración de usuarios
├── pages/                   # Rutas de la aplicación
│   ├── auth/               # Login, perfil, reset password
│   ├── admin/              # Panel administrativo
│   ├── orders/             # Gestión de liberaciones
│   └── muestreo/           # Control de calidad
└── middleware/              # Protección de rutas

server/                       # API Backend (Nitro)
├── api/
│   ├── auth/               # Endpoints de autenticación
│   ├── admin/              # Gestión de usuarios
│   ├── ocr/                # Extracción OCR
│   └── profiles/           # Perfiles de usuario
```

### Flujo de Autenticación - **v2.6.0**
1. **Login**: `useAuthLogin` → `/api/auth/login` → server-side Supabase Auth con validación Zod
2. **Estado**: `useAuthState` → `/api/auth/user` → estado reactivo centralizado con cache
3. **Perfil**: `useAuthProfile` → `/api/auth/profile` → datos completos + rol + cache inteligente
4. **Contraseñas**: `useAuthPassword` → `/api/auth/update-password` → cambio seguro de contraseñas
5. **Protección**: Middleware `auth.ts` verifica en cada ruta protegida
6. **Logout**: `/api/auth/logout` → limpieza completa de sesión + redirección
7. **Reset**: Sistema completo de reset de contraseñas con tokens y validación

### Patrón de Composables
```typescript
// ❌ ANTES: Conexión directa
const user = useSupabaseUser()

// ✅ AHORA: API-first
const { user, isAuthenticated } = useAuthState()
```

### Sistema de Componentes UI
- **BaseButton**, **BaseCard**, **BaseModal**, **BaseTable**, etc.
- **Auto-import**: Disponibles globalmente sin imports
- **TypeScript**: Props totalmente tipadas
- **TailwindCSS**: Variantes y estados consistentes

### Cobertura de Testing - **v2.6.0**
- **Tests unitarios**: 387+ tests passing con Vitest
- **Tests de API**: Cobertura completa de endpoints de auth y admin
- **Tests de composables**: Validación de `useAuth*`, `useAdmin*`
- **Tests de componentes**: UserTable y componentes administrativos
- **Mocks avanzados**: Sistema de mocking para Supabase y Nuxt APIs
- **Integración continua**: Tests automatizados en cada commit

## 🔧 Setup Rápido

```bash
# 1. Acceso al repositorio (requiere permisos corporativos)
git clone [repositorio_corporativo]
cd liberador_inaplast_nuxt
pnpm install

# 2. Configurar Supabase
cp .env.example .env
# Actualizar SUPABASE_URL y SUPABASE_ANON_KEY

# 3. Base de datos
npx supabase db push

# 4. Ejecutar
pnpm dev
```

### Configuración de Usuarios
1. **Admin Inicial**: Contactar al administrador del sistema para credenciales
2. **Usuarios Operativos**: Crear desde el panel de administración interno
3. **Roles**: Asignados según jerarquía organizacional de Inaplast

## 🧪 Testing

### Cobertura Actual
- **Auth Endpoints**: 7/7 tests ✅
- **Auth Composables**: 25/25 tests ✅ 
- **Total**: 32+ tests de autenticación
- **E2E**: Playwright para flujos completos

```bash
pnpm test              # Unit tests (Vitest)
pnpm test:e2e          # E2E tests (Playwright)
pnpm test:coverage     # Cobertura de código
```

## 📊 Base de Datos (Supabase)

### Tablas Principales
- `profiles` - Perfiles con roles (Admin/Supervisor/Inspector)
- `orders` - Registros de liberaciones de productos
- `order_items` - Items y resultados de pruebas
- `planes_de_muestreo` - Planes estadísticos de muestreo
- `grupos_muestreo` - Grupos con rangos de tamaño de lote
- `user_activity_logs` - Auditoría de acciones administrativas

### Control de Acceso (RLS)
- **Admin**: Acceso completo + gestión de usuarios
- **Supervisor**: Gestión de órdenes + muestreo + vista global
- **Inspector**: Solo órdenes asignadas (sin admin ni muestreo)

## 🚀 Scripts Disponibles

```bash
pnpm dev              # Servidor de desarrollo
pnpm build            # Build para producción
pnpm lint             # ESLint + corrección automática
pnpm test             # Tests unitarios (Vitest)
pnpm test:e2e         # Tests E2E (Playwright)
```

## 🌐 Deploy (Entorno Corporativo)

**Producción**: Desplegado en infraestructura corporativa de Inaplast

### Variables de Entorno
```env
SUPABASE_URL=tu_supabase_project_url
SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key  # Para ops admin
```

### Configuración Vercel
- **Preset**: `vercel` en `nuxt.config.ts`
- **SSR**: Completamente soportado
- **Deploy**: `vercel --prod`

## 🔑 Decisiones de Arquitectura Clave

### 1. **API-First Authentication**
❌ **Antes**: `useSupabaseUser()` en componentes (inseguro)  
✅ **Ahora**: `/api/auth/*` endpoints → composables → componentes

### 2. **Composables Especializados**
- `useAuthState` - Estado reactivo centralizado
- `useAuthLogin` - Login/logout operations
- `useAuthProfile` - Gestión de perfiles con roles
- `useAdminUserManager` - CRUD usuarios (solo Admin)

### 3. **Componentes Auto-Importados**
```vue
<!-- Sin imports necesarios -->
<BaseButton variant="primary" @click="handleAction">
  Acción
</BaseButton>
```

### 4. **Testing Estratificado**
- **Unit**: Composables + utilidades (Vitest)
- **Integration**: API endpoints + database
- **E2E**: Flujos completos (Playwright)

### 5. **TypeScript Strict**
- Zero `any` types en producción
- Props completamente tipadas
- Database types auto-generados

## 📈 Estado del Proyecto

**Sistema Completamente Funcional en Producción** ✅
- Autenticación server-side segura
- Panel admin con auditoría completa
- OCR con Gemini AI para extracción de datos
- Sistema de muestreo estadístico
- 32+ tests de cobertura crítica
- Deploy automático en Vercel

## 🔧 Desarrollo (Equipo Interno)

**Para desarrolladores autorizados de Inaplast:**

1. Solicitar acceso al repositorio corporativo
2. Crear rama de feature: `git checkout -b feature/nueva-funcionalidad`
3. Implementar cambios siguiendo estándares corporativos
4. Ejecutar suite completa: `pnpm test && pnpm lint`
5. Solicitar revisión de código al líder técnico
6. Deploy tras aprobación del área de calidad

### Contacto Técnico
- **Líder de Proyecto**: [Contacto interno]
- **Administrador del Sistema**: [Contacto interno]
- **Soporte Técnico**: [Contacto interno]

## 📄 Información Legal

**Propiedad Corporativa de Inaplast** - Todos los derechos reservados.

Este sistema es propiedad exclusiva de Inaplast y contiene información confidencial y procesos industriales propietarios. El uso, modificación o distribución está restringido al personal autorizado.

---

**Desarrollado para Inaplast** | Sistema de Control de Calidad v2.7.0

## 📋 Changelog v2.7.1

### ⚡ Build & Bundle Optimizations
- **Circular Dependency Fix**: Resueltas dependencias circulares entre `useModalForm` y admin components
- **Manual Chunking**: Configuración de bundling inteligente por dominio (admin, UI, auth, orders)
- **Auto-Import Cleanup**: Eliminados imports duplicados y reorganizada estructura de composables
- **TypeScript Strict**: Mejorada type safety removiendo usos de `any` en `useOrderState` y `useLogger`

### 🧪 Test Coverage Expansion
- **useModalForm Tests**: Nueva suite de 18 tests cubriendo validación Zod y manejo de formularios
- **useOrderState Tests**: 22 tests para type safety y nuevos campos de Order interface
- **Auto-Import Tests**: Verificación de configuración manual de chunks y eliminación de duplicados
- **OCR Tests Fixed**: Corregidos tests de mapeo de datos OCR con estructura correcta

### 🔧 Order Interface Enhancement
- **New Fields**: `order_number`, `customer_name`, `part_number` opcionales en Order interface
- **Search Capability**: OrderFilters incluye nuevo campo `customer` para búsquedas
- **Type Safety**: useOrderState usa tipos explícitos en lugar de `any` para orderStats

### 🏗️ Architecture Improvements
- **Bundle Strategy**: Admin components y useModalForm agrupados para prevenir circular deps
- **Import Organization**: Estructura jerárquica de auto-imports (`~/composables/**`)
- **Component Prefixes**: UI (Ui), Core (Core), Admin (sin prefijo) para mejor organización

## 📋 Changelog v2.7.0

### 🔧 Fixes Críticos
- **Admin Users Access**: Resuelto problema crítico que impedía acceso a `/admin/users` 
- **Middleware Authentication**: Corregida verificación de permisos server-side con cookies
- **ServiceRole Implementation**: API endpoints admin ahora usan ServiceRole para bypass RLS
- **SSR Compatibility**: Middleware compatible con server-side rendering

### 🛠️ Mejoras Técnicas
- **Authentication Flow**: Middleware `require-admin-role` usa endpoint API con cookies
- **API Security**: Endpoints `/api/admin/users/*` optimizados con verificación ServiceRole
- **Error Handling**: Mejor manejo de errores en verificación de permisos
- **TypeScript**: Limpieza de warnings y imports no utilizados
