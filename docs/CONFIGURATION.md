# Guía de Configuración - Sistema Liberador Inaplast

Esta guía cubre toda la configuración necesaria para el desarrollo, testing y deployment del sistema.

## 📋 Tabla de Contenidos

- [Variables de Entorno](#variables-de-entorno)
- [Configuración de Supabase](#configuración-de-supabase)
- [Configuración de Testing](#configuración-de-testing)
- [Configuración de Deployment](#configuración-de-deployment)
- [Configuración de IDE](#configuración-de-ide)
- [Troubleshooting](#troubleshooting)

## 🔧 Variables de Entorno

### Desarrollo Local (.env.local)

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
NUXT_APP_BASE_URL=http://localhost:3000
NUXT_PORT=3000

# Development Debug
DEBUG_MODE=true
NUXT_LOG_LEVEL=debug
SUPABASE_DEBUG=true

# Testing
TEST_DATABASE_URL=postgresql://postgres:password@localhost:54322/postgres
PLAYWRIGHT_BASE_URL=http://localhost:3000
```

### Producción (.env.production)

```bash
# Supabase Production
SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_ANON_KEY=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-role-key

# App Configuration
NUXT_APP_BASE_URL=https://your-domain.com
NODE_ENV=production

# Security
NUXT_SECURITY_HEADERS=true
NUXT_CSRF_PROTECTION=true

# Analytics (opcional)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Variables Requeridas

| Variable | Descripción | Requerido | Ejemplo |
|----------|-------------|-----------|---------|
| `SUPABASE_URL` | URL de proyecto Supabase | ✅ | `https://abc123.supabase.co` |
| `SUPABASE_ANON_KEY` | Clave anónima de Supabase | ✅ | `eyJhbGciOiJIUzI1NiI...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de service role | ✅ | `eyJhbGciOiJIUzI1NiI...` |
| `NUXT_APP_BASE_URL` | URL base de la app | ✅ | `https://app.inaplast.com` |

## 📊 Configuración de Supabase

### 1. Proyecto Supabase

```sql
-- 1. Crear proyecto en https://supabase.com
-- 2. Configurar base de datos
-- 3. Ejecutar migraciones

-- Aplicar migraciones
supabase db push

-- O desde SQL Editor:
-- Copiar contenido de supabase/migrations/
```

### 2. Configuración de Autenticación

```json
// En Supabase Dashboard > Authentication > Settings
{
  "SITE_URL": "https://your-domain.com",
  "REDIRECT_URLS": [
    "http://localhost:3000/auth/callback",
    "https://your-domain.com/auth/callback"
  ],
  "JWT_EXPIRY": 3600,
  "REFRESH_TOKEN_ROTATION": true,
  "PASSWORD_MIN_LENGTH": 8,
  "EMAIL_CONFIRMATION": true
}
```

### 3. Row Level Security (RLS)

```sql
-- Habilitar RLS en tablas críticas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para admins (bypass con service role)
CREATE POLICY "Admins full access" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND user_role = 'Admin'
    )
  );
```

### 4. RPC Functions

```sql
-- Función para obtener perfiles con emails
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
SET search_path = public
AS $$
DECLARE
  offset_val INTEGER;
BEGIN
  offset_val := (page_num - 1) * page_size;
  
  RETURN QUERY
  WITH filtered_profiles AS (
    SELECT 
      p.id,
      p.user_id,
      p.first_name,
      p.last_name,
      p.user_role,
      p.created_at,
      p.updated_at,
      au.email,
      (p.first_name || ' ' || p.last_name) as full_name
    FROM profiles p
    LEFT JOIN auth.users au ON p.user_id = au.id
    WHERE 
      (search_term IS NULL OR 
       p.first_name ILIKE '%' || search_term || '%' OR
       p.last_name ILIKE '%' || search_term || '%' OR
       au.email ILIKE '%' || search_term || '%')
      AND
      (role_filter IS NULL OR p.user_role = role_filter)
    ORDER BY p.created_at DESC
  ),
  total_count AS (
    SELECT COUNT(*) as count FROM filtered_profiles
  )
  SELECT 
    fp.*,
    tc.count as total_count
  FROM filtered_profiles fp
  CROSS JOIN total_count tc
  LIMIT page_size
  OFFSET offset_val;
END;
$$;
```

## 🧪 Configuración de Testing

### Vitest (vitest.config.ts)

```typescript
import { defineConfig } from 'vitest/config'
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        'coverage/**'
      ]
    }
  }
})
```

### Playwright (playwright.config.js)

```javascript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html', { outputFolder: 'test-results/e2e-report' }],
    ['json', { outputFile: 'test-results/e2e-results.json' }]
  ],
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
  ],
  
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
```

### Setup de Tests (tests/setup.ts)

```typescript
import { beforeAll, afterAll, beforeEach } from 'vitest'
import { createClient } from '@supabase/supabase-js'

// Setup global para tests
beforeAll(async () => {
  // Configurar base de datos de testing
  // Limpiar datos existentes
  // Crear usuarios de prueba
})

afterAll(async () => {
  // Limpiar después de todos los tests
})

beforeEach(async () => {
  // Reset antes de cada test
})

// Helpers globales
global.testUser = {
  admin: {
    email: 'admin@test.com',
    password: 'test123456',
    role: 'Admin'
  },
  inspector: {
    email: 'inspector@test.com', 
    password: 'test123456',
    role: 'Inspector'
  }
}
```

## 🚀 Configuración de Deployment

### Vercel (vercel.json)

```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": ".output/public",
  "framework": "nuxtjs",
  "env": {
    "SUPABASE_URL": "@supabase-url",
    "SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role-key"
  },
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  },
  "functions": {
    "app/server/**": {
      "maxDuration": 30
    }
  },
  "redirects": [
    {
      "source": "/",
      "destination": "/dashboard",
      "permanent": false,
      "has": [
        {
          "type": "cookie",
          "key": "sb-access-token"
        }
      ]
    }
  ]
}
```

### Netlify (netlify.toml)

```toml
[build]
  command = "pnpm run build"
  publish = ".output/public"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--prefer-offline --no-audit"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = ".output/server"
```

### Docker (Dockerfile)

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.output ./

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server/index.mjs"]
```

## 💻 Configuración de IDE

### VS Code (.vscode/settings.json)

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "off",
  "typescript.suggest.autoImports": true,
  "vue.codeActions.enabled": true,
  "vue.complete.casing.tags": "kebab",
  "vue.complete.casing.props": "camel",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript", 
    "typescriptreact",
    "vue"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.vue": "vue"
  },
  "emmet.includeLanguages": {
    "vue": "html"
  }
}
```

### Extensiones Recomendadas (.vscode/extensions.json)

```json
{
  "recommendations": [
    "Vue.volar",
    "Vue.vscode-typescript-vue-plugin",
    "bradlc.vscode-tailwindcss",
    "ms-playwright.playwright",
    "vitest.explorer",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Error de Autenticación Supabase

```bash
# Problema: "Invalid JWT"
# Solución: Verificar claves de entorno
echo $SUPABASE_ANON_KEY
# Regenerar claves si es necesario
```

#### 2. Error de CORS

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    cors: {
      origin: ['http://localhost:3000', 'https://your-domain.com'],
      credentials: true
    }
  }
})
```

#### 3. Error de Hidratación SSR

```vue
<!-- Usar ClientOnly para componentes problemáticos -->
<ClientOnly>
  <ProblematicComponent />
  <template #fallback>
    <div>Cargando...</div>
  </template>
</ClientOnly>
```

#### 4. Problemas de Base de Datos

```sql
-- Verificar permisos RLS
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Verificar usuarios en auth
SELECT id, email, created_at FROM auth.users;

-- Verificar perfiles
SELECT * FROM profiles;
```

#### 5. Problemas de Testing

```bash
# Limpiar cache de tests
pnpm vitest run --reporter=verbose --no-cache

# Regenerar snapshots
pnpm test -- --update-snapshots

# Debug de Playwright
pnpm test:e2e --debug
```

### Logs de Debug

```typescript
// Activar logs detallados
console.log('🔍 Debug Info:', {
  environment: process.env.NODE_ENV,
  supabaseUrl: process.env.SUPABASE_URL?.slice(0, 20),
  timestamp: new Date().toISOString()
})
```

### Performance Debugging

```bash
# Analizar bundle size
pnpm build --analyze

# Verificar performance de queries
# En Supabase Dashboard > Database > Query Performance

# Lighthouse audit
npx lighthouse http://localhost:3000 --view
```

---

## 📚 Recursos Adicionales

- [Documentación Nuxt.js](https://nuxt.com/docs)
- [Documentación Supabase](https://supabase.com/docs)
- [Guías TailwindCSS](https://tailwindcss.com/docs)
- [Testing con Vitest](https://vitest.dev/guide/)
- [E2E con Playwright](https://playwright.dev/docs/intro)

Para configuraciones específicas del proyecto o dudas técnicas, consultar el README principal o crear un issue en el repositorio.