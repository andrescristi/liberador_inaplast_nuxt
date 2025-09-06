# Sistema de Autenticación Híbrido JWT + Session

## Diseño del Sistema

### Arquitectura Híbrida

El nuevo sistema combina JWT (stateless) para verificación de identidad y Sessions (stateful) para manejo de estado:

```
┌─────────┐                                  ┌─────────┐
│ Client  │                                  │ Server  │  
└─────────┘                                  └─────────┘
     │                                              │
     │←────────Signs JWT (stateless)────────────────│
     │                                              │
     ├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐      │
     │  Client stores JWT locally        │      │
     └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘      │
     │                                              │
     │←────────Generates session ID (stateful)─────│
     │                                              │
     │←────────Sets session ID in cookie───────────│
     │                                              │
     ├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ 
     │  Client stores session ID (from cookie)    │
     │  locally                                    │
     └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

### Componentes del Sistema

#### 1. JWT (Stateless)
- **Propósito**: Verificación de identidad y claims básicos
- **Almacenamiento**: localStorage del cliente
- **Contenido**: 
  - user_id
  - email
  - roles
  - exp (expiración)
- **Ventajas**: No requiere estado en servidor, escalable

#### 2. Session ID (Stateful)
- **Propósito**: Manejo de estado de sesión activa
- **Almacenamiento**: Cookie + memoria/redis en servidor
- **Contenido**: 
  - session_id único
  - timestamps de actividad
  - metadata de sesión
- **Ventajas**: Control granular, revocación inmediata

### Flujo de Autenticación

1. **Login**:
   - Usuario envía credenciales
   - Servidor valida con Supabase
   - Genera JWT firmado con datos del usuario
   - Crea session ID único en memoria/redis
   - Devuelve JWT al cliente
   - Configura cookie con session ID
   - Cliente almacena ambos localmente

2. **Requests Autenticados**:
   - Cliente envía JWT en Authorization header
   - Cliente envía session ID via cookie automáticamente
   - Servidor verifica ambos:
     - JWT para identidad (rápido)
     - Session ID para estado activo (seguro)

3. **Logout**:
   - Cliente elimina JWT de localStorage
   - Servidor invalida session ID
   - Cookie se limpia automáticamente

### Ventajas del Sistema Híbrido

- **Escalabilidad**: JWT no requiere estado compartido
- **Seguridad**: Session ID permite revocación inmediata
- **Performance**: JWT evita consultas DB constantes
- **Flexibilidad**: Permite manejo granular de sesiones
- **Compatibilidad**: Funciona en diferentes entornos (Vercel, móvil)

### Implementación

#### Servidor
- `server/utils/hybrid-auth.ts`: Utilidades de autenticación híbrida
- `server/api/auth/`: Endpoints de login/logout/refresh
- `server/plugins/session-store.ts`: Almacén de sesiones en memoria

#### Cliente  
- `composables/auth/useHybridAuth.ts`: Composable principal
- `middleware/hybrid-auth.ts`: Middleware actualizado
- `stores/auth.ts`: Store de Pinia para estado global

#### Seguridad
- JWT firmado con secret seguro
- Session IDs criptográficamente seguros
- Cookies con flags httpOnly, secure, sameSite
- Limpieza automática de sesiones expiradas