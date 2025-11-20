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

- **🔄 Proceso de Liberación en 5 Pasos**: Flujo guiado desde captura hasta notificación automática
- **🤖 OCR Inteligente**: Extracción automática de datos con Google Gemini AI
- **📧 Notificaciones Automáticas**: Envío de emails con códigos QR al completar órdenes
- **📦 Descarga Masiva de QR**: Selección múltiple de órdenes y descarga de PDFs combinados
- **👥 Sistema de Administración**: CRUD completo de usuarios con gestión de roles
- **🔐 Autenticación Híbrida**: JWT + Session con recuperación automática
- **📊 Dashboard Personalizado**: Métricas diferenciadas por rol de usuario con filtrado automático

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
- **Edge Functions**: Supabase (notificaciones automáticas)

### IA y Procesamiento
- **Google GenAI**: 1.15.0 - OCR principal con Gemini AI
- **Sharp**: 0.34.3 - Procesamiento de imágenes
- **PDF-Lib**: 1.17.1 - Manipulación y fusión de PDFs

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
Inspector: ['create:order', 'read:own-orders', 'update:own-orders', 'view:own-metrics']
Supervisor: ['read:all-orders', 'create:reports', 'export:data', 'view:global-metrics']
Admin: ['manage:users', 'manage:system', 'access:admin-panel', 'view:global-metrics']
```

### Filtrado de Datos por Rol
- **Inspector**: Ve únicamente las órdenes que él mismo creó y sus métricas personales
- **Supervisor/Admin**: Acceso completo a todas las órdenes y métricas globales del sistema

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

### Paso 5: Notificación Automática
- Envío automático de email con código QR
- Link directo al código QR de la orden
- Notificación al usuario que creó la orden

## 📦 Gestión de Códigos QR

### Descarga Individual
- Acceso directo al PDF con código QR desde el detalle de cada orden
- URLs firmadas temporales para seguridad
- Códigos QR con información completa de la orden

### Descarga Masiva
- **Selección múltiple**: Checkboxes para seleccionar órdenes individuales o todas en la página
- **Generación optimizada**: Crea un solo PDF con múltiples códigos QR (una página por orden)
- **Formato consistente**: Todos los QR codes siguen el mismo diseño y tamaño
- **Barra de acciones flotante**: Interfaz intuitiva con contador de selección
- **Barra de progreso**: Feedback visual durante la generación del PDF
- **Límite de 100 órdenes**: Control de rendimiento y timeouts
- **Validación por rol**: Inspectores solo pueden descargar sus propias órdenes
- **Limpieza automática**: Archivos temporales se eliminan después de 2 horas

### Implementación Técnica
- **bulk-qr-pdf-generator.ts**: Generador de PDFs con múltiples QR codes usando jsPDF
- **Optimización de rendimiento**: Genera directamente en lugar de fusionar PDFs individuales
- **Menor uso de almacenamiento**: No requiere descargar PDFs individuales desde Supabase
- **Procesamiento en servidor**: Edge functions de Vercel para máximo rendimiento

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
NUXT_SUPABASE_URL=your_supabase_url
NUXT_SUPABASE_ANON_KEY=your_anon_key
NUXT_SUPABASE_SERVICE_KEY=your_service_key
NUXT_GEMINI_API_KEY=your_gemini_key
NUXT_SESSION_PASSWORD=your_session_password
NUXT_JWT_SECRET=your_jwt_secret
```

## 📚 Para Nuevos Desarrolladores

### Checklist de Onboarding
- [ ] ✅ **Configurar entorno** - Seguir instalación rápida
- [ ] ✅ **Ejecutar tests** - Verificar que todo funciona
- [ ] ✅ **Explorar dashboard** - Familiarizarse con la UI
- [ ] ✅ **Revisar flujo OCR** - Entender integración Gemini AI
- [ ] ✅ **Probar notificaciones** - Verificar envío automático de emails
- [ ] ✅ **Entender sistema de roles** - Admin vs Inspector vs Supervisor
- [ ] ✅ **Crear orden completa** - Proceso end-to-end con notificación

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

**Versión**: 2.9.0
**Última actualización**: Noviembre 2025