# Guía de Desarrollo - Sistema Liberador Inaplast

Esta guía proporciona información detallada para desarrolladores que trabajen en el sistema de liberación de productos Inaplast.

## 📋 Tabla de Contenidos

- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Convenciones de Código](#convenciones-de-código)
- [Estructura de Componentes](#estructura-de-componentes)
- [Gestión de Estado](#gestión-de-estado)
- [API y Base de Datos](#api-y-base-de-datos)
- [Testing](#testing)
- [Debugging](#debugging)
- [Performance](#performance)

## 🏗 Arquitectura del Sistema

### Stack Tecnológico

```
Frontend:
├── Nuxt.js 4 (Vue.js 3 + Vite)
├── TailwindCSS (Styling)
├── Headless UI (Components)
├── @nuxt/icon (Iconografía)
└── Pinia (State Management)

Backend:
├── Nuxt Server API (Edge Functions)
├── Supabase (PostgreSQL + Auth + Real-time)
└── Row Level Security (RLS)

Testing:
├── Vitest (Unit/Integration)
├── Playwright (E2E)
└── Vue Testing Library
```

### Arquitectura de Roles

```typescript
// Jerarquía de permisos (mayor a menor)
Admin → Supervisor → Inspector

// Acceso a funcionalidades
Admin:
  ✅ Gestión completa de usuarios
  ✅ Configuración del sistema
  ✅ Métricas globales
  ✅ Todas las liberaciones

Supervisor:
  ✅ Supervisión de procesos
  ✅ Métricas globales
  ✅ Aprobación de liberaciones
  ❌ Gestión de usuarios

Inspector:
  ✅ Crear liberaciones
  ✅ Sus propias métricas
  ❌ Ver datos de otros usuarios
  ❌ Funciones administrativas
```

## 📝 Convenciones de Código

### Nomenclatura

```typescript
// Archivos y directorios
kebab-case: user-profile.vue, admin-users.ts
camelCase: variables, funciones
PascalCase: componentes, tipos, interfaces
UPPER_SNAKE_CASE: constantes

// Ejemplos
const userName = 'juan'              // ✅ Variables
function getUserProfile() {}         // ✅ Funciones
interface ProfileData {}            // ✅ Interfaces
const MAX_RETRY_ATTEMPTS = 3         // ✅ Constantes
<UserProfileCard />                  // ✅ Componentes
```

### Estructura de Componentes Vue

```vue
<template>
  <!-- 
    1. Comentario descriptivo del componente
    2. Estructura semántica HTML
    3. Clases TailwindCSS organizadas
  -->
</template>

<script setup lang="ts">
/**
 * JSDoc completo del componente
 * - Descripción de funcionalidad
 * - Props y emits documentados
 * - Ejemplos de uso
 */

// 1. Imports (tipos primero, luego utils)
import type { Profile } from '~/types'

// 2. Props e interfaces
interface Props {
  user: Profile
}

// 3. Composables
const { signOut } = useAuth()

// 4. Estado reactivo
const loading = ref(false)

// 5. Computed properties
const fullName = computed(() => `${props.user.first_name} ${props.user.last_name}`)

// 6. Funciones
async function handleLogout() {
  // Implementación
}

// 7. Lifecycle hooks
onMounted(() => {
  // Inicialización
})

// 8. Metadata
definePageMeta({
  middleware: 'auth'
})
</script>
```

### Documentación JSDoc

```typescript
/**
 * Descripción breve de la función
 * 
 * Descripción detallada opcional con:
 * - Casos de uso principales
 * - Consideraciones especiales
 * - Efectos secundarios
 * 
 * @param {string} param1 - Descripción del parámetro
 * @param {Object} options - Objeto de opciones
 * @param {boolean} [options.force=false] - Parámetro opcional
 * 
 * @returns {Promise<Result>} Descripción del retorno
 * 
 * @throws {Error} Descripción de cuándo se lanza
 * 
 * @example
 * ```typescript
 * const result = await myFunction('test', { force: true })
 * console.log(result)
 * ```
 * 
 * @since v1.0.0
 */
async function myFunction(param1: string, options: Options): Promise<Result> {
  // Implementación
}
```

## 🧩 Estructura de Componentes

### Sistema UI Base

```
app/components/ui/
├── BaseButton.vue     # Botones con variantes
├── BaseCard.vue       # Contenedores con slots
├── BaseInput.vue      # Inputs con validación
├── BaseModal.vue      # Modales con transiciones
├── BaseTable.vue      # Tablas con selección
├── BaseBadge.vue      # Status badges
└── BaseDropdown.vue   # Menus dropdown
```

### Componentes de Dominio

```
app/components/
├── admin/             # Componentes específicos de admin
│   ├── UserCreateModal.vue
│   └── UserEditModal.vue
├── core/              # Componentes centrales
│   └── AppNavigation.vue
└── ui/                # Sistema de diseño base
```

### Props y Validación

```typescript
// ✅ Buena práctica
interface Props {
  /** Título del modal (requerido) */
  title: string
  /** Tamaño del modal */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Mostrar modal */
  show: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

// ❌ Evitar
const props = defineProps({
  title: String,
  size: {
    type: String,
    default: 'md'
  }
})
```

## 🗃 Gestión de Estado

### Composables vs Pinia

```typescript
// ✅ Usar composables para lógica específica
const { user, signIn, signOut } = useAuth()
const { toast } = useToast()

// ✅ Usar Pinia para estado global complejo
const ordersStore = useOrdersStore()
```

### Patrón de Composables

```typescript
// app/composables/useProfile.ts
export const useProfile = () => {
  const profile = ref<Profile | null>(null)
  
  const getCurrentProfile = async () => {
    // Implementación con manejo de errores
  }
  
  const updateProfile = async (data: UpdateProfileForm) => {
    // Implementación con validación
  }
  
  return {
    profile: readonly(profile),
    getCurrentProfile,
    updateProfile
  }
}
```

## 🔌 API y Base de Datos

### Estructura de APIs

```
server/api/
├── admin/             # Endpoints administrativos
│   └── users/         # CRUD de usuarios
│       ├── index.get.ts    # Listar usuarios paginados
│       ├── index.post.ts   # Crear usuario
│       ├── [id].put.ts     # Actualizar usuario
│       └── [id].delete.ts  # Eliminar usuario
└── metrics/           # Endpoints de métricas
```

### Seguridad API

```typescript
// Siempre usar middleware de autenticación
export default defineEventHandler(async (event) => {
  // 1. Validar autenticación
  await requireAuth(event)
  
  // 2. Validar permisos específicos
  await requireAdminAuth(event)
  
  // 3. Usar service role para RLS bypass
  const supabase = serverSupabaseServiceRole(event)
  
  // 4. Implementar lógica
})
```

### Supabase RPC Functions

```sql
-- Usar RPC para lógica compleja con múltiples tablas
CREATE OR REPLACE FUNCTION get_all_profiles(
  search_term TEXT DEFAULT NULL,
  role_filter TEXT DEFAULT NULL,
  page_num INTEGER DEFAULT 1,
  page_size INTEGER DEFAULT 20
)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  first_name TEXT,
  last_name TEXT,
  user_role TEXT,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  total_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Implementación optimizada
END;
$$;
```

## 🧪 Testing

### Estructura de Tests

```
tests/
├── components/        # Tests de componentes Vue
├── composables/       # Tests de composables
├── api/              # Tests de endpoints API
├── e2e/              # Tests end-to-end
├── security/         # Tests de seguridad
├── fixtures/         # Datos de prueba
└── setup.ts          # Configuración global
```

### Ejemplo de Test de Componente

```typescript
// tests/components/ui/BaseButton.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '~/components/ui/BaseButton.vue'

describe('BaseButton', () => {
  it('renders with correct variant', () => {
    const wrapper = mount(BaseButton, {
      props: {
        variant: 'solid',
        color: 'indigo'
      },
      slots: {
        default: 'Click me'
      }
    })
    
    expect(wrapper.text()).toContain('Click me')
    expect(wrapper.classes()).toContain('bg-indigo-600')
  })
})
```

### Ejemplo de Test E2E

```typescript
// tests/e2e/auth-flows.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication Flows', () => {
  test('admin can login and access admin panel', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Login como admin
    await page.fill('[data-testid="email"]', 'admin@inaplast.com')
    await page.fill('[data-testid="password"]', 'admin123')
    await page.click('[data-testid="login-button"]')
    
    // Verificar redirection al dashboard
    await expect(page).toHaveURL('/dashboard')
    
    // Verificar acceso a administración
    await page.click('[data-testid="admin-menu"]')
    await expect(page.locator('[data-testid="user-management"]')).toBeVisible()
  })
})
```

## 🐛 Debugging

### Herramientas de Debug

```typescript
// 1. Console logging estructurado
console.log('🔍 [Auth] Login attempt:', { email, timestamp: new Date() })

// 2. Vue DevTools
// Instalar extensión del navegador

// 3. Supabase Dashboard
// Usar logs en tiempo real para debugging de queries

// 4. Network tab
// Verificar requests/responses de API
```

### Variables de Entorno de Debug

```bash
# .env.local
DEBUG_MODE=true
NUXT_LOG_LEVEL=debug
SUPABASE_DEBUG=true
```

## ⚡ Performance

### Optimizaciones Frontend

```typescript
// 1. Lazy loading de componentes
const AdminPanel = defineAsyncComponent(() => import('~/components/admin/AdminPanel.vue'))

// 2. Computed cacheable
const expensiveComputation = computed(() => {
  return heavyCalculation(props.data)
})

// 3. Debounce para búsquedas
const { debounce } = useDebounce()
const debouncedSearch = debounce(searchUsers, 300)
```

### Optimizaciones de Base de Datos

```sql
-- 1. Índices apropiados
CREATE INDEX idx_profiles_user_role ON profiles(user_role);
CREATE INDEX idx_profiles_search ON profiles USING gin(to_tsvector('spanish', first_name || ' ' || last_name));

-- 2. RPC functions para queries complejas
-- 3. Paginación siempre habilitada
-- 4. Limit en resultados por defecto
```

### Monitoring

```typescript
// 1. Core Web Vitals
// 2. Supabase query performance
// 3. API response times
// 4. Bundle size optimization
```

---

## 🔄 Workflow de Desarrollo

1. **Feature Branch**: Crear rama desde `main`
2. **Development**: Implementar con tests
3. **Documentation**: Actualizar JSDoc y README
4. **Testing**: Ejecutar test suite completo
5. **Code Review**: PR con reviewer asignado
6. **Deployment**: Merge automático a production

```bash
# Comandos esenciales
pnpm dev           # Desarrollo
pnpm test          # Tests unitarios
pnpm test:e2e      # Tests E2E
pnpm lint          # Linting
pnpm typecheck     # Verificación de tipos
```

---

Para preguntas específicas o dudas sobre implementación, consultar la documentación inline en el código o crear un issue en el repositorio.