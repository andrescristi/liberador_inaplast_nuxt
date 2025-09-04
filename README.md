# Sistema Liberador Inaplast - Guía para Desarrolladores

**Sistema web corporativo** para la gestión y digitalización de procesos de control de calidad en **Inaplast**. Construido con tecnologías modernas: **Nuxt 4**, **Vue 3**, **TailwindCSS** y **Supabase**.

> 📋 **Proyecto Corporativo Privado** - Sistema interno desarrollado específicamente para las operaciones industriales de control de calidad de Inaplast.

## 📚 Índice

- [¿Qué es el Sistema Liberador?](#-qué-es-el-sistema-liberador)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Configuración Inicial](#-configuración-inicial)
- [Flujo de Desarrollo](#-flujo-de-desarrollo)
- [Funcionalidades Principales](#-funcionalidades-principales)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Patrones y Convenciones](#-patrones-y-convenciones)
- [Recursos Adicionales](#-recursos-adicionales)

## 🏭 ¿Qué es el Sistema Liberador?

El **Sistema Liberador Inaplast** es una aplicación web que digitaliza y optimiza los procesos de control de calidad industrial, transformando operaciones manuales en flujos de trabajo estructurados y trazables.

### Propósito Principal

- **Digitalizador de procesos**: Reemplaza formularios en papel por interfaces digitales
- **Control de calidad estructurado**: Implementa un flujo de 4 pasos estandarizado
- **Gestión de personal**: Sistema de roles con permisos granulares
- **Trazabilidad completa**: Registro detallado de todas las operaciones
- **Automatización inteligente**: Extracción de datos usando OCR y AI

### Usuarios del Sistema

- **Inspectores de Calidad**: Ejecutan las liberaciones de productos diariamente
- **Supervisores**: Revisan y aprueban procesos, gestionan equipos
- **Administradores**: Configuran el sistema, gestionan usuarios y datos

## 🏗️ Arquitectura del Sistema

### Diagrama de Alto Nivel

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API    │    │   Base de       │
│   (Nuxt 4)      │────│   (Nitro)        │────│   Datos         │
│   Vue 3 + TS    │    │   Server-side    │    │   (Supabase)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐            ┌─────▼─────┐           ┌─────▼─────┐
    │ Clientes│            │ Servicios │           │ PostgreSQL│
    │ Móviles │            │ External  │           │ + RLS     │
    │ Tablets │            │ (AI/OCR)  │           │ Políticas │
    └─────────┘            └───────────┘           └───────────┘
```

### Principios Arquitectónicos

1. **API-First**: Toda la lógica de negocio reside en endpoints del servidor
2. **Type-Safe**: TypeScript estricto en todo el stack
3. **Composable Architecture**: Lógica reutilizable mediante composables de Vue
4. **Auto-Import System**: Importación automática de componentes y composables
5. **Schema-First Validation**: Validación con Zod tanto en cliente como servidor

## 💻 Stack Tecnológico

### Framework y Core

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Nuxt** | 4.0.3 | Meta-framework Vue con SSR/SSG |
| **Vue** | 3.x | Framework reactivo con Composition API |
| **TypeScript** | 5.6.2 | Type safety en todo el stack |
| **TailwindCSS** | 3.4.0 | CSS utility-first para styling |

### Backend y Base de Datos

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Supabase** | 2.53.0 | Backend-as-a-Service con PostgreSQL |
| **Pinia** | 0.11.2 | Gestión de estado reactivo |
| **Zod** | 3.25.76 | Schema validation runtime |

### UI y Experiencia

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Headless UI** | 1.7.23 | Componentes accesibles sin styling |
| **Nuxt Icon** | 1.15.0 | Sistema de iconos optimizado |
| **VeeValidate** | 4.15.1 | Validación de formularios |

### AI y Procesamiento

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Google GenAI** | 1.15.0 | Integración con Gemini AI para OCR |
| **Tesseract.js** | 6.0.1 | OCR local en navegador |
| **Sharp** | 0.34.3 | Compresión de imágenes server-side |

### Testing y Calidad

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Vitest** | 3.2.4 | Unit testing rápido |
| **Playwright** | 1.54.2 | E2E testing cross-browser |
| **Testing Library** | 8.1.0 | Component testing utilities |
| **ESLint** | 9.32.0 | Linting con configuración @antfu |

## 📁 Estructura del Proyecto

### Directorio Principal (`app/`)

```
app/                                    # Código fuente principal
├── components/                         # Componentes Vue (auto-import)
│   ├── ui/                            # Sistema de componentes base
│   │   ├── BaseButton.vue             # Botón con variantes
│   │   ├── BaseModal.vue              # Modal reutilizable
│   │   ├── BaseInput.vue              # Input con validación
│   │   └── ImageUploadOCR.vue         # Subida de imagen con OCR
│   ├── admin/                         # Panel administrativo
│   │   ├── UserTable.vue              # CRUD de usuarios
│   │   └── UserStatsCards.vue         # Métricas del sistema
│   ├── orders/                        # Proceso de liberación
│   │   ├── OrderWizard.vue            # Wizard principal 4 pasos
│   │   ├── OrderWizardStep1.vue       # Subida imagen + cantidad
│   │   ├── OrderWizardStep2.vue       # Datos producto (OCR)
│   │   ├── OrderWizardStep3.vue       # Pruebas de calidad
│   │   └── OrderWizardStep4.vue       # Resumen y decisión
│   └── core/                          # Componentes principales
│       └── AppNavigation.vue          # Navegación responsiva
├── composables/                        # Lógica de negocio (auto-import)
│   ├── auth/                          # Autenticación
│   │   ├── useAuthState.ts            # Estado usuario reactivo
│   │   ├── useAuthLogin.ts            # Login/logout
│   │   └── useAuthToken.ts            # Gestión de tokens
│   ├── admin/                         # Administración
│   │   ├── useAdminUserCRUD.ts        # CRUD operations
│   │   └── useAdminUserManager.ts     # Orquestador principal
│   ├── orders/                        # Liberaciones
│   │   └── useOrderState.ts           # Estado del wizard
│   └── tools/                         # Utilidades
│       ├── useOCRConfig.ts            # Configuración OCR
│       └── useImageCompression.ts     # Compresión imágenes
├── pages/                              # File-based routing
│   ├── auth/                          # Autenticación
│   ├── admin/                         # Panel admin
│   ├── orders/                        # Gestión liberaciones
│   └── muestreo/                      # Control calidad
├── middleware/                         # Protección rutas
│   ├── auth.ts                        # Verificación autenticación
│   └── require-admin-role.ts          # Permisos administrativos
├── schemas/                            # Validación Zod
│   ├── admin/user.ts                  # Schemas usuarios
│   ├── orders/new_order.ts            # Schemas liberaciones
│   └── shared/validation.ts           # Validaciones comunes
├── types/                              # Definiciones TypeScript
│   ├── auth.ts                        # Tipos autenticación
│   ├── orders.ts                      # Tipos liberaciones
│   └── database.types.ts              # Tipos Supabase generados
└── utils/                              # Utilidades generales
    ├── formatters.ts                  # Helpers de formateo
    └── supabase.ts                    # Configuración Supabase
```

### Backend API (`server/`)

```
server/                                 # Backend API (Nitro)
├── api/                               # REST endpoints
│   ├── auth/                          # Autenticación
│   │   ├── login.post.ts              # POST /api/auth/login
│   │   ├── user.get.ts                # GET /api/auth/user
│   │   └── logout.post.ts             # POST /api/auth/logout
│   ├── admin/users/                   # Gestión usuarios (admin)
│   │   ├── list.get.ts                # GET lista usuarios
│   │   ├── index.post.ts              # POST crear usuario
│   │   ├── [id].put.ts                # PUT actualizar usuario
│   │   └── [id].delete.ts             # DELETE eliminar usuario
│   ├── orders/                        # Liberaciones de productos
│   │   └── create.post.ts             # POST crear liberación
│   ├── ocr/                           # Procesamiento OCR
│   │   └── extract.post.ts            # POST extraer datos imagen
│   └── dashboard/                     # Métricas y estadísticas
│       └── metrics.get.ts             # GET métricas sistema
└── utils/auth.ts                      # Utilidades autenticación
```

### Base de Datos (`supabase/`)

```
supabase/                              # Esquema base de datos
├── config.toml                        # Configuración Supabase
├── migrations/                        # SQL migrations versionadas
│   ├── 20250801000001_initial_schema.sql
│   ├── 20250802000001_add_user_profiles.sql
│   └── 20250811000001_add_user_activity_logs.sql
└── seed.sql                           # Datos iniciales desarrollo
```

### Testing (`tests/`)

```
tests/                                 # Suite completa de testing
├── components/                        # Tests componentes Vue
│   └── orders/OrderWizardStep1.test.ts
├── composables/                       # Tests lógica composables
│   └── auth/useAuthLogin.test.ts
├── api/                               # Tests endpoints API
│   └── auth/login.test.ts
├── e2e/                               # Tests end-to-end
│   └── auth-flow.spec.ts
└── setup.ts                           # Configuración testing
```

## 🚀 Configuración Inicial

### Pre-requisitos

- **Node.js** 20+ (LTS recomendado)
- **pnpm** 8+ (package manager del proyecto)
- **Git** 2.40+
- Acceso a credenciales de Supabase y Google AI

### Instalación Paso a Paso

1. **Clonar el repositorio**
   ```bash
   git clone [repositorio_corporativo_privado]
   cd liberador_inaplast_nuxt
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install --frozen-lockfile
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Completar el archivo `.env` con:
   ```env
   # Supabase (Backend)
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
   
   # Google AI (OCR)
   GOOGLE_GENAI_API_KEY=AIzaSy...
   
   # App Config
   NUXT_PUBLIC_APP_NAME="Liberador Inaplast"
   ```

4. **Configurar base de datos**
   ```bash
   # Aplicar migraciones
   npx supabase db push
   
   # Datos de prueba (opcional)
   npx supabase db seed
   ```

5. **Iniciar desarrollo**
   ```bash
   pnpm dev
   ```
   
   La aplicación estará disponible en `http://localhost:3000`

### Verificación de Setup

```bash
# Verificar TypeScript
npx tsc --noEmit

# Verificar linting
pnpm lint

# Ejecutar tests
pnpm test

# Build de producción
pnpm build
```

Si todos los comandos ejecutan sin errores, el setup está completo.

### Crear Usuario Administrador Inicial

Ejecutar en Supabase SQL Editor:

```sql
-- Crear usuario admin inicial
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('admin@inaplast.com', crypt('admin123', gen_salt('bf')), NOW());

-- Crear perfil con rol admin
INSERT INTO profiles (user_id, first_name, last_name, user_role)
SELECT id, 'Admin', 'Sistema', 'Admin' 
FROM auth.users WHERE email = 'admin@inaplast.com';
```

## 🔄 Flujo de Desarrollo

### Comandos de Desarrollo

```bash
# Desarrollo con hot-reload
pnpm dev

# Build optimizado
pnpm build

# Preview build local
pnpm preview

# Linting con auto-fix
pnpm lint
pnpm lint:fix

# TypeScript checking
npx tsc --noEmit
```

### Workflow Recomendado

1. **Crear rama de feature**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Desarrollo con hot-reload**
   ```bash
   pnpm dev
   ```

3. **Quality gates antes de commit**
   ```bash
   npx tsc --noEmit    # ✅ TypeScript
   pnpm lint           # ✅ ESLint
   pnpm test           # ✅ Unit tests
   pnpm build          # ✅ Build
   ```

4. **Commit y push**
   ```bash
   git add .
   git commit -m "feat: descripción del cambio"
   git push origin feature/nueva-funcionalidad
   ```

5. **Crear Pull Request**
   - CI/CD ejecutará tests automáticamente
   - Code review del equipo
   - Merge a `main` = deploy automático

## ⚙️ Funcionalidades Principales

### 1. Sistema de Autenticación

**Características:**
- Autenticación híbrida (tokens + cookies)
- Tres roles: Admin, Supervisor, Inspector
- JWT tokens con validación de expiración
- Optimizado para dispositivos móviles

**Componentes clave:**
- `useAuthState()` - Estado reactivo del usuario
- `useAuthLogin()` - Operaciones login/logout
- `useAuthToken()` - Gestión de tokens JWT

### 2. Proceso de Liberación de Productos

**Flujo de 4 pasos:**
1. **Paso 1**: Subida de imagen de etiqueta + cantidad de cajas
2. **Paso 2**: Detalles del producto (datos extraídos por OCR)
3. **Paso 3**: Pruebas de calidad (dimensiones, resistencia, apariencia)
4. **Paso 4**: Resumen y decisión final (Aceptado/Rechazado)

**Tecnología OCR:**
- Extracción automática de datos usando Google Gemini AI
- Compresión inteligente de imágenes server-side con Sharp
- Fallback local con Tesseract.js

### 3. Panel de Administración

**Funcionalidades:**
- CRUD completo de usuarios
- Gestión de roles y permisos
- Estadísticas y métricas en tiempo real
- Logs de auditoría de actividades

**Arquitectura modular:**
- Componentes especializados (`UserTable`, `UserFilters`, `UserStatsCards`)
- Composables de negocio (`useAdminUserCRUD`, `useAdminUserManager`)
- APIs seguras con validación de permisos

### 4. Sistema de Muestreo Estadístico

**Características:**
- Planes de muestreo basados en estándares MIL-STD
- Configuración de niveles AQL (Acceptable Quality Level)
- Grupos de muestreo por rangos de tamaño de lote

## 🧪 Testing

### Estructura de Testing

El proyecto implementa una estrategia de testing multi-capa:

- **Unit Tests**: Lógica de composables y utilidades
- **Component Tests**: Componentes Vue individuales
- **Integration Tests**: Endpoints de API
- **E2E Tests**: Flujos completos de usuario

### Comandos de Testing

```bash
# Unit testing con Vitest
pnpm test                    # Todos los tests
pnpm test --watch            # Modo watch
pnpm test:coverage           # Reporte de cobertura
pnpm test:ui                 # Runner visual

# E2E testing con Playwright
pnpm test:e2e                # Cross-browser E2E
pnpm test:e2e:ui             # Runner visual E2E
pnpm test:e2e --headed       # Con interfaz visual
```

### Ejemplo de Test

```typescript
// tests/composables/auth/useAuthLogin.test.ts
import { describe, it, expect, vi } from 'vitest'
import { useAuthLogin } from '~/composables/auth/useAuthLogin'

describe('useAuthLogin', () => {
  it('should login user successfully', async () => {
    const { login, isLoading, error } = useAuthLogin()
    
    // Mock de API
    global.$fetch = vi.fn().mockResolvedValue({
      user: { id: '123', email: 'test@inaplast.com' },
      token: 'jwt-token'
    })
    
    await login('test@inaplast.com', 'password')
    
    expect(error.value).toBe(null)
    expect(global.$fetch).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      body: { email: 'test@inaplast.com', password: 'password' }
    })
  })
})
```

## 🚢 Deployment

### Entorno de Producción

- **Plataforma**: Vercel con optimización Nitro
- **SSR**: Renderizado del lado del servidor
- **CDN**: Edge locations globales
- **SSL**: Certificados automáticos Let's Encrypt

### Variables de Entorno Producción

```env
# Supabase
SUPABASE_URL=https://proyecto-prod.supabase.co
SUPABASE_ANON_KEY=production_anon_key
SUPABASE_SERVICE_ROLE_KEY=production_service_role_key

# Google AI
GOOGLE_GENAI_API_KEY=production_genai_key

# Security
NUXT_SECRET_KEY=generated_64_character_secret_key
```

### CI/CD Pipeline

El proyecto utiliza GitHub Actions para deployment automático:

1. **Quality Gates**: TypeScript, Lint, Tests
2. **Build**: Construcción optimizada para producción
3. **Deploy**: Deployment automático a Vercel
4. **Smoke Tests**: Verificación post-deploy

## 📐 Patrones y Convenciones

### Auto-Import System

```typescript
// ❌ NO necesario - auto-importado
import { useAuthState } from '~/composables/auth/useAuthState'
import BaseButton from '~/components/ui/BaseButton.vue'

// ✅ SÍ - auto-import configurado
const { user, login } = useAuthState()
<BaseButton variant="solid" />
```

### Schema-First Validation

```typescript
// schemas/admin/user.ts
export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  first_name: z.string().min(2, 'Mínimo 2 caracteres'),
  user_role: z.enum(['Admin', 'Supervisor', 'Inspector'])
})

export type CreateUserForm = z.infer<typeof createUserSchema>

// Uso en API
const validatedData = createUserSchema.parse(requestBody)

// Uso en formularios
const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(createUserSchema)
})
```

### Composable Pattern

```typescript
export const useFeatureLogic = () => {
  // Estado reactivo
  const data = ref<DataType[]>([])
  const loading = ref(false)
  
  // Lógica de negocio
  const fetchData = async () => {
    loading.value = true
    try {
      data.value = await $fetch('/api/endpoint')
    } finally {
      loading.value = false
    }
  }
  
  // Estado computado
  const filteredData = computed(() => 
    data.value.filter(item => item.active)
  )
  
  // Exposición controlada
  return {
    data: readonly(data),
    loading: readonly(loading),
    filteredData,
    fetchData
  }
}
```

### Component Architecture

```vue
<!-- Componentes base reutilizables -->
<BaseButton variant="solid" color="indigo" @click="action">
  Texto
</BaseButton>

<!-- Componentes de dominio específicos -->
<UserCreateModal :show="modal" @created="handleCreated" />

<!-- Páginas que orquestan funcionalidades -->
<AdminUsersPage>
  <UserFilters />
  <UserTable />
  <UserPagination />
</AdminUsersPage>
```

## 🔒 Seguridad

### Row Level Security (RLS)

La base de datos implementa políticas de seguridad a nivel de fila:

```sql
-- Los usuarios solo ven sus propios datos o si son admin
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (
  auth.uid() = user_id OR 
  (SELECT user_role FROM profiles WHERE user_id = auth.uid()) = 'Admin'
);

-- Los inspectores solo ven sus liberaciones
CREATE POLICY "orders_select" ON orders FOR SELECT USING (
  CASE (SELECT user_role FROM profiles WHERE user_id = auth.uid())
    WHEN 'Admin' THEN true
    WHEN 'Supervisor' THEN true  
    WHEN 'Inspector' THEN inspector_id = auth.uid()
    ELSE false
  END
);
```

### Autenticación API-First

- Tokens JWT con expiración
- Headers de autorización en requests
- Middleware de protección en rutas
- Validación server-side en endpoints

## 📚 Recursos Adicionales

### Documentación Técnica

- [Nuxt 4 Documentation](https://nuxt.com)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Supabase Documentation](https://supabase.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

### Herramientas de Desarrollo

- **VS Code**: Editor recomendado con extensiones Vue, TypeScript
- **Vue DevTools**: Para debugging de componentes y estado
- **Supabase Studio**: Gestión visual de la base de datos
- **Vercel Dashboard**: Monitoring de deployments

### Convenciones del Proyecto

- **Commits**: Conventional commits (feat, fix, docs, refactor)
- **Branches**: feature/descripcion, hotfix/issue, release/version
- **PRs**: Template con checklist de calidad
- **Issues**: Templates para bugs y features

### Soporte y Contacto

- **Tech Lead**: Arquitectura y decisiones técnicas
- **Senior Developer**: Code reviews y mentoring
- **DevOps**: CI/CD y deployment issues
- **Product Owner**: Requisitos y prioridades de negocio

---

## 📄 Información Legal

**© 2024 Inaplast - Todos los derechos reservados**

Este sistema es propiedad exclusiva de **Inaplast** y contiene información confidencial y procesos industriales propietarios. El uso, modificación o distribución está restringido al personal autorizado de la empresa.

---

**Bienvenido al equipo de desarrollo del Sistema Liberador Inaplast** 🚀

Esta guía te proporcionará todo lo necesario para comenzar a contribuir efectivamente al proyecto. Para dudas específicas, consulta con el equipo técnico o revisa la documentación adicional en la carpeta `/docs` del proyecto.