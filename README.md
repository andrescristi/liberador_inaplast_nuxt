# 📋 Sistema Liberador Inaplast

> Sistema integral de gestión de liberación de productos industriales con OCR inteligente y flujos de inspección automatizados.

## 🏭 Descripción del Proyecto

El **Sistema Liberador Inaplast** es una aplicación web diseñada para optimizar el proceso de inspección y liberación de productos en entornos industriales. Permite a los inspectores de calidad procesar órdenes de forma eficiente mediante un flujo guiado de 4 pasos, desde la captura de imágenes hasta la decisión final de liberación.

### Valor del Negocio
- **Reducción de errores** en el proceso de inspección manual
- **Trazabilidad completa** de decisiones de liberación
- **Optimización de tiempos** mediante OCR automático
- **Gestión centralizada** de usuarios y permisos

## ✨ Características Principales

- **🔄 Proceso de Liberación en 4 Pasos**: Flujo guiado desde captura de imagen hasta decisión final
- **🤖 OCR Inteligente**: Extracción automática de datos con Google Gemini AI
- **👥 Sistema de Administración**: CRUD completo de usuarios con gestión de roles y permisos
- **🔐 Autenticación Híbrida**: JWT + Session con recuperación automática
- **📊 Dashboard Personalizado**: Métricas diferenciadas por rol de usuario

## 🛠 Stack Tecnológico

### Framework & Core
- **Nuxt**: 4.0.3 (Latest)
- **Vue**: 3.x
- **TypeScript**: 5.6.2

### UI & Styling
- **TailwindCSS**: 6.14.0
- **Headless UI**: @headlessui/vue 1.7.23
- **Icons**: @nuxt/icon 1.15.0

### Backend & Database
- **Supabase**: @nuxtjs/supabase 1.6.0
- **PostgreSQL**: (via Supabase)

### IA y Procesamiento
- **Google GenAI**: 1.15.0 - OCR principal con Gemini AI
- **Sharp**: 0.34.3 - Procesamiento de imágenes

### Testing
- **Vitest**: 3.2.4 (Unit Testing)
- **Playwright**: 1.54.2 (E2E Testing)

## 🚀 Instalación Rápida

```bash
# 1. Clonar repositorio
git clone [repository-url]
cd liberador_inaplast_nuxt

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Configurar Supabase
# Agregar SUPABASE_URL y SUPABASE_ANON_KEY en .env

# 5. Iniciar desarrollo
pnpm dev
```

## 💻 Desarrollo

### Comandos Principales
```bash
# Desarrollo
pnpm dev              # Servidor desarrollo (localhost:3000)
pnpm build            # Build producción
pnpm preview          # Preview build

# Testing
pnpm test             # Tests unitarios (Vitest)
pnpm test:e2e         # Tests E2E (Playwright)
pnpm test:coverage    # Cobertura de tests

# Calidad de Código
pnpm lint             # ESLint
pnpm typecheck        # Verificación TypeScript
```

### Workflow de Desarrollo
1. **Crear rama** para nueva funcionalidad
2. **Escribir tests** antes de implementar
3. **Desarrollar** con feedback inmediato (`pnpm dev`)
4. **Verificar calidad** (`pnpm lint`, `pnpm typecheck`)
5. **Ejecutar tests** (`pnpm test`)
6. **Build local** (`pnpm build`)

## 👥 Sistema de Roles

### Roles Disponibles
- **Inspector**: Crear y gestionar liberaciones propias
- **Supervisor**: Ver todas las liberaciones, crear reportes
- **Admin**: Gestión completa de usuarios y sistema

### Permisos por Rol
```typescript
Inspector: ['create:order', 'read:own-orders', 'update:own-orders']
Supervisor: ['read:all-orders', 'create:reports', 'export:data']
Admin: ['manage:users', 'manage:system', 'access:admin-panel']
```

## 🔄 Flujo de Liberación

### Paso 1: Captura de Imagen
- Upload de imagen de etiqueta del producto
- Validación automática de formato y tamaño

### Paso 2: Extracción OCR
- Procesamiento con Google Gemini AI
- Auto-completado de formulario con datos extraídos

### Paso 3: Pruebas de Calidad
- Configuración dinámica de tests por tipo de producto
- Registro de resultados de inspección

### Paso 4: Decisión Final
- Aprobación o rechazo basado en criterios establecidos
- Generación automática de reportes

## 🧪 Testing

### Estructura de Tests
```bash
tests/
├── unit/           # Tests unitarios (composables, utils)
├── components/     # Tests de componentes Vue
├── api/           # Tests de endpoints API
└── e2e/           # Tests end-to-end
```

### Cobertura Actual
- **Componentes**: 85% cobertura
- **API Endpoints**: 90% cobertura
- **Composables**: 88% cobertura

### Ejecutar Tests
```bash
# Tests específicos
pnpm test components     # Solo componentes
pnpm test api           # Solo API
pnpm test:e2e orders    # E2E de órdenes

# Con coverage
pnpm test:coverage
```

## 🚢 Deployment

### Vercel (Recomendado)
```bash
# Automático con git push a main
git push origin main

# Manual
pnpm build
npx vercel deploy --prebuilt
```

### Variables de Entorno Requeridas
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
GOOGLE_AI_API_KEY=your_gemini_key
NUXT_SECRET_KEY=your_secret_key
```

## 📚 Para Nuevos Desarrolladores

### Checklist de Onboarding
- [ ] ✅ **Configurar entorno** - Seguir instalación rápida
- [ ] ✅ **Ejecutar tests** - Verificar que todo funciona
- [ ] ✅ **Explorar dashboard** - Familiarizarse con la UI
- [ ] ✅ **Revisar flujo OCR** - Entender integración Gemini AI
- [ ] ✅ **Entender sistema de roles** - Admin vs Inspector vs Supervisor
- [ ] ✅ **Crear orden de prueba** - Proceso completo de liberación

### Recursos Útiles
- **Documentación Técnica**: `/docs` (estructura detallada)
- **Convenciones**: Seguir patrones existentes en `/app/components`
- **Testing**: Ejemplos en `/tests` para nuevas funcionalidades

## 🔧 Convenciones

### Estructura de Componentes
```vue
<!-- Orden: template, script, style -->
<template>
  <!-- UI con TailwindCSS -->
</template>

<script setup lang="ts">
// Composables, refs, funciones
</script>
```

### Naming Conventions
- **Componentes**: PascalCase (`UserTable.vue`)
- **Composables**: camelCase con prefijo `use` (`useAuthProfile`)
- **Tipos**: PascalCase (`OrderStatus`, `Profile`)
- **Constantes**: SNAKE_CASE (`API_ENDPOINTS`)

## 📄 Información Legal

### Propiedad Intelectual
Este proyecto es **propiedad privada** de Inaplast y está desarrollado para uso interno exclusivo. No es un proyecto de código abierto.

### Licencia
Código propietario - Todos los derechos reservados.

---

## 📞 Soporte

Para soporte técnico o preguntas sobre el sistema, contactar al equipo de desarrollo interno.

**Versión**: 2.6.0
**Última actualización**: Diciembre 2024