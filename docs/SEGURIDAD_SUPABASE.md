# Seguridad de Supabase - Configuración Requerida

## ⚠️ CONFIGURACIÓN CRÍTICA REQUERIDA

Para que el sistema de creación de usuarios funcione correctamente, **DEBES** configurar la Service Role Key de Supabase:

### 1. Obtener la Service Role Key

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a `Settings` → `API`
3. En la sección "Project API keys", copia la `service_role` key
   - ⚠️ **NO** uses la `anon` key para operaciones de administración
   - ⚠️ **NO** expongas la `service_role` key en el cliente

### 2. Configurar la Variable de Entorno

Agrega la siguiente línea a tu archivo `.env` (Nuxt Supabase usa `SUPABASE_SERVICE_KEY`):

```bash
SUPABASE_SERVICE_KEY=tu_service_role_key_aqui
```

### 3. Verificar la Configuración

El sistema validará automáticamente que:
- ✅ Las credenciales del cliente **NO** se usan para crear usuarios
- ✅ Solo la Service Role Key se usa para operaciones administrativas
- ✅ La autenticación se maneja completamente server-side
- ✅ Solo usuarios Admin pueden crear otros usuarios

## 🔒 Medidas de Seguridad Implementadas

### Server-Side Only
- **Todos** los endpoints de administración usan `serverSupabaseServiceRole`
- **Cero** acceso a credenciales administrativas desde el cliente
- Autenticación basada en cookies seguras de sesión

### Validación de Permisos
- Verificación de rol Admin antes de cualquier operación
- Validación de datos de entrada estricta
- Rollback automático si falla la creación del perfil

### Endpoint Seguro: `/api/admin/users` (POST)
```typescript
// ✅ Proceso completamente server-side
await requireAdminAuth(event) // Valida permisos Admin
const supabase = serverSupabaseServiceRole(event) // Solo Service Role
await supabase.auth.admin.createUser(...) // Operación administrativa
```

### Composable Seguro
```typescript
// ✅ Sin credenciales en cliente
const response = await fetch('/api/admin/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData),
  credentials: 'include' // Solo cookies de sesión
})
```

## 🚫 Lo que NO Ocurre

- ❌ No se exponen tokens de acceso al cliente
- ❌ No se usa la anon key para operaciones administrativas
- ❌ No se almacenan credenciales administrativas en localStorage
- ❌ No se pasan credenciales en headers Authorization del cliente

## ✅ Validación de Seguridad

Puedes verificar que el sistema es seguro:
1. Inspecciona Network Tab - no verás tokens de admin
2. Check Local Storage - no habrá credenciales administrativas
3. Solo cookies de sesión HTTP-only se usan para autenticación

## ⚡ Para Empezar

1. Configura `SUPABASE_SERVICE_KEY` en tu `.env`
2. Reinicia el servidor de desarrollo
3. ¡El sistema estará completamente seguro y funcional!

## 📚 Documentación Relacionada

- Ver `../README.md` para configuración general del proyecto
- Ver `RLS_POLICIES.md` para políticas de seguridad de base de datos
- Ver `../server/api/admin/` para implementación de endpoints seguros
- Ver `ARCHITECTURE.md` para documentación de arquitectura del sistema

---

**Nota**: Este archivo documenta configuraciones específicas de seguridad para el módulo de administración de usuarios. Es fundamental seguir estas instrucciones para mantener la seguridad del sistema.