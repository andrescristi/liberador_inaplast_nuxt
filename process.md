# Sistema de Liberación de Pedidos - Basado en Pantallas Móviles del Mockup

## Estructura del Proyecto
```
/order-release-manager/
├── /docs/
│   ├── /01-ux-research/
│   ├── /02-planning/
│   ├── /03-ui-design/
│   └── /04-architecture/
├── /.agent-artifacts/
└── /app/ (Next.js app con shadcn-ui)
```

**No usar búsqueda web en ninguna fase del proyecto.**

---

## CARACTERÍSTICAS EXACTAS A IMPLEMENTAR:

Basado únicamente en las 7 pantallas móviles visibles en el mockup INAPLAST:

### PANTALLA 1 - LOGIN:
- **Título**: "INAPLAST - Liberación de pedidos"
- **Subtítulo**: "Gestión pedidos"
- **Campos de login**: Usuario y contraseña
- **Botón de entrada**: "Entrar"
- **Roles disponibles**: Inspector, Supervisor, Administrador
- Layout centrado y minimalista
- Logo/branding corporativo

### PANTALLA 2 - INICIO/DASHBOARD:
- **Header**: "Liberación de pedidos" con notificación 
- **Saludo**: 
  - "Bienvenido de vuelta, [Nombre]!"
  - Hora actual
  
- **Métricas filtradas por rol**:
  - Métricas: Total Inspecciones, Total rechazos, Total aceptaciones
  - Inspector: Solo sus métricas personales
  - Supervisor/Admin: Métricas globales 
  - Gráficos de barras horizontales con colores para rechazos y aceptaciones (verde para las aprobaciones, rojo para los rechazod)
- **Sección "Últimas liberaciones" filtrada por permisos**:
  - Inspector: Solo sus liberaciones
  - Supervisor/Admin: Todas las liberaciones
  - Lista con iconos de estado 
  - Producto, Cliente, Fechas y descripciones
- **Navegación inferior**: 4 iconos (Home, Agregar Inspección, Historial Inspecciones, Perfil)
  - Administrador: Ícono adicional para gestión de usuarios

### PANTALLA 3 - HISTORIAL DE LIBERACIONES:
- **Header**: "Historial de liberaciones" con buscador
- **Filtros por rol**:
  - Inspector: Solo "Mis inspecciones" de los últimos 7 días
  - Supervisor/Admin: "Todas las inspecciones" con filtros avanzados (por inspector, fecha, estado)
- **Lista de elementos filtrada por permisos** con:
  - Estados visuales (iconos ✓ ✗)
  - Fechas (formato dd/mm/yyyy)
  - Información de pedidos
  - Inspector asignado (solo visible para Supervisor/Admin)
  - Códigos de referencia
- **Navegación inferior**: Mismos íconos

### PANTALLA 4 - INFORME DE INSPECCIÓN:
- **Header**: "Informe de inspecciones" con ícono de regreso
- **Control de acceso por rol**:
  - Inspector: Solo puede ver sus propias inspecciones
  - Supervisor/Admin: Puede ver cualquier inspección
- **Información del pedido**:
  - Producto
  - Cliente específico
  - Fecha de proceso
  - Inspector responsable (visible para Supervisor/Admin)
- **Indicadores de estado visual**:
  - 🔴 "Tiene Manchas"
  - 🔴 "Presenta hoyos"  
  - 🟢 "Es del color que corresponde"
  - 🔴 "Estado: rechazado"
- **Acciones por rol**:
  - Inspector: Solo visualización
  - Supervisor: Puede aprobar/rechazar inspecciones
  - Admin: Acceso completo + reasignar inspector
- **Navegación inferior**: Mismos 4 iconos

### PANTALLA 5 - FORM DE INGRESO PASO 1:
- **Header**: "Nueva Inspección" con ícono de regreso
- **Título**: "Paso 1"
- **Formulario con campos**:
  - Campos de entrada de datos
  - Selectors y inputs
- **Indicador de progreso**: Círculo azul con "A" 
- **Botón inferior**: "Continuar"
- **Navegación inferior**: Mismos 4 iconos

### PANTALLA 6 - FORM DE INGRESO PASO 2:
- **Header**: "Nueva Inspección" 
- **Título**: "Paso 2"
- **Formulario avanzado**:
  - Más campos específicos
  - Controles de calidad
- **Indicador de progreso**: Diseño similar al paso 1
- **Botones**: "Anterior" y "Continuar"
- **Navegación inferior**: Mismos 4 iconos

### PANTALLA 7 - FORM DE INGRESO PASO 3:
- **Header**: "Nueva Inspección"
- **Título**: "Paso 3"
- **Formulario final**:
  - Campos de confirmación
  - Revisión de datos
- **Indicador de progreso**: Paso final
- **Botones**: "Anterior" y "Finalizar"
- **Navegación inferior**: Mismos 4 iconos

### PANTALLA 8 - FORM DE INGRESO PASO 4:
- **Header**: "Nueva Inspección"
- **Título**: "Paso 4"
- **Resultado final**:
  - "Resultados Final: Rechazado"
  - Lista de pruebas con checkmarks:
    - ✅ "Prueba 1"
    - ✅ "Prueba 2" 
    - ✅ "Prueba 3"
- **Navegación inferior**: Mismos 4 iconos

### PANTALLA 9 - ADMINISTRACIÓN DE USUARIOS (Solo Administrador):
- **Header**: "Gestión de Usuarios" con ícono de regreso
- **Lista de usuarios** con:
  - Nombre completo
  - Rol actual (Inspector/Supervisor/Administrador)
  - Estado (Activo/Inactivo)
  - Fecha y hora de última visita
  - Número de inspecciones realizadas (sólo para los inspectores)
- **Acciones disponibles**:
  - ➕ "Crear nuevo usuario"
  - ✏️ Editar usuario existente
  - 🔒 Activar/Desactivar usuario
  - 🔄 Cambiar rol de usuario
- **Filtros**:
  - Por rol
  - Por estado (activo/inactivo)
  - Búsqueda por nombre
- **Navegación inferior**: Mismos 4 iconos + ícono de usuarios destacado

### PANTALLA 10 - CREAR/EDITAR USUARIO (Solo Administrador):
- **Header**: "Nuevo Usuario" o "Editar Usuario"
- **Formulario**:
  - Nombre completo (requerido)
  - Email/Usuario (requerido)
  - Contraseña (solo para nuevo usuario)
  - Rol: Dropdown (Inspector/Supervisor/Administrador)
  - Estado: Toggle (Activo/Inactivo)
- **Botones**:
  - "Guardar" / "Actualizar"
  - "Cancelar"
- **Navegación inferior**: Mismos 4 iconos

---

## FASE 1: INVESTIGACIÓN UX

### 1. Usar el agente ux-researcher para:
- **Replicar exactamente el diseño móvil** del mockup INAPLAST con sistema de roles
- **Crear wireframes específicos** para cada una de las 10 pantallas:
  * Login con autenticación por roles
  * Dashboard con datos filtrados por permisos (Inspector vs Supervisor/Admin)
  * Historial con filtros avanzados según rol
  * Informe con controles de acceso por usuario
  * Formularios multi-paso (4 pantallas) con validaciones por rol
  * Administración de usuarios (solo Administrador)
  * Crear/Editar usuarios con validaciones
- **Sistema de navegación inferior** con 5-6 iconos según rol
- **Control de acceso visual** - ocultar/mostrar elementos según permisos
- **Flujo de navegación** con validación de roles en cada pantalla
- **Responsive design** optimizado para dispositivos móviles
- Guardar wireframes en `/order-release-manager/docs/01-ux-research/wireframes/`
- Documentar patrones en `/order-release-manager/docs/01-ux-research/interaction-patterns.md`

### 2. Luego usar el agente sprint-prioritizer para:
- **Desglosar en componentes específicos con control de roles**:
  * `LoginScreen` (autenticación con roles)
  * `DashboardHome` (métricas filtradas por permisos)
  * `HistoryList` (lista filtrable según rol)
  * `InspectionReport` (indicadores con control de acceso)
  * `MultiStepForm` (4 pasos con validaciones por rol)
  * `UserManagement` (solo Administrador)
  * `UserForm` (crear/editar usuarios)
  * `ProgressIndicator` (círculos con letras)
  * `BottomNavigation` (navegación adaptada por rol)
  * `StatusBadge` (indicadores visuales ✓ ✗)
  * `RoleGuard` (componente de control de acceso)
  * `PermissionCheck` (validador de permisos)
- Guardar desglose en `/order-release-manager/docs/02-planning/component-breakdown.md`
- Crear orden de implementación en `/order-release-manager/docs/02-planning/build-order.md`

Actualizar `/.agent-artifacts/handoff-notes.md` con decisiones de diseño del mockup móvil.

---

## FASE 2: DISEÑO UI

### Diseño mobile-first siguiendo exactamente las pantallas del mockup.

### 1. Usar el agente ui-designer para:
Diseñar componentes usando shadcn-ui replicando el mockup móvil:

**Componentes de Pantalla:**
- **LoginScreen**: Usar Card centrado con:
  * Logo INAPLAST
  * Título "Liberación de pedidos"
  * Subtítulo "Gestión pedidos"
  * Campos: Usuario y Contraseña
  * Botón "Entrar" prominente
  * Manejo de errores de autenticación
  
- **DashboardHome**: Usar Grid y Card con control de roles:
  * Header con saludo personalizado por rol
  * Campana de notificación con badge rojo
  * Contadores filtrados (Inspector: personales, Supervisor/Admin: globales)
  * Progress bars horizontales con colores
  * Lista de liberaciones filtrada por permisos
  
- **HistoryList**: Usar Command y ScrollArea con filtros por rol:
  * Buscador integrado en header
  * Filtros adaptativos: "Mis inspecciones" vs "Todas las inspecciones"
  * Lista con estados visuales según permisos
  * Información del inspector (solo para Supervisor/Admin)
  
- **InspectionReport**: Usar Card y Badge con control de acceso:
  * Validación: Inspector solo ve sus inspecciones
  * Información del envase y responsable
  * Indicadores de defectos con permisos de edición
  * Acciones diferenciadas por rol (ver/aprobar/reasignar)
  
- **UserManagement**: Usar DataTable (solo Administrador):
  * Lista de usuarios con roles y estados
  * Filtros por rol y estado activo/inactivo
  * Acciones: crear, editar, activar/desactivar usuarios
  * Búsqueda por nombre
  
- **UserForm**: Usar Card y Form (solo Administrador):
  * Campos: nombre, email, contraseña, rol, estado
  * Validaciones de campos requeridos
  * Dropdown para selección de roles
  * Toggle para estado activo/inactivo
  
- **MultiStepForm**: Usar Card y Stepper con:
  * Indicador de progreso (círculo azul con letra)
  * Campos de formulario por paso
  * Navegación "Anterior/Continuar/Finalizar"
  * Pantalla final con checkmarks de pruebas

- **BottomNavigation**: Usar Tabs con roles adaptativos:
  * 5 iconos base para todos los roles
  * 6° ícono "Usuarios" solo para Administrador
  * Indicador de pantalla activa
  * Estilo azul INAPLAST

**Componentes de Control de Acceso:**
- **RoleGuard**: Componente wrapper para proteger rutas
- **PermissionCheck**: Hook para validar permisos específicos
- **RoleBadge**: Indicador visual del rol del usuario

**Sistema de Colores y Jerarquía Visual:**
- Primario: Azul (#4A90E2) navegación y headers
- Éxito: Verde (#4CAF50) checkmarks y aprobados
- Advertencia: Amarillo (#FFC107) en proceso
- Error: Rojo (#F44336) rechazos y defectos
- Roles: Colores diferenciados para cada rol
  * Inspector: Azul claro
  * Supervisor: Naranja
  * Administrador: Morado

Guardar especificaciones en `/order-release-manager/docs/03-ui-design/component-specs.md`

### 2. Luego usar el agente whimsy-injector para agregar:
- **Transiciones móviles**: Slide entre pantallas del formulario
- **Animaciones de carga**: Para métricas del dashboard
- **Feedback táctil**: Vibración sutil en acciones importantes
- **Estados de carga**: Skeletons para listas y datos
- **Animaciones de estado**: Transición suave de colores en badges
- **Gestos móviles**: Swipe para navegación entre pasos

Documentar animaciones en `/order-release-manager/docs/03-ui-design/animations.md`

---

## FASE 3: DESARROLLO FRONTEND

### 1. Usar el agente rapid-prototyper para:
- Inicializar Next.js 14 con TypeScript en `/order-release-manager/app/`
- Configurar shadcn-ui con tema móvil
- Instalar paquetes móviles:
  * `framer-motion` para transiciones de pantalla
  * `react-hook-form` para formularios multi-paso
  * `zustand` para estado global
  * `date-fns` para formateo de fechas

### 2. Usar el agente frontend-developer para implementar:

**PÁGINAS (/app/) - Una por pantalla con control de roles:**
- `page.tsx`: LoginScreen (pantalla 1)
- `dashboard/page.tsx`: DashboardHome con datos filtrados (pantalla 2)
- `history/page.tsx`: HistoryList filtrada por permisos (pantalla 3)
- `inspection/[id]/page.tsx`: InspectionReport con control de acceso (pantalla 4)
- `inspection/new/step-1/page.tsx`: Form Paso 1 (pantalla 5)
- `inspection/new/step-2/page.tsx`: Form Paso 2 (pantalla 6)
- `inspection/new/step-3/page.tsx`: Form Paso 3 (pantalla 7)
- `inspection/new/results/page.tsx`: Resultados (pantalla 8)
- `admin/users/page.tsx`: UserManagement (pantalla 9 - solo Admin)
- `admin/users/[id]/page.tsx`: UserForm (pantalla 10 - solo Admin)

**COMPONENTES (/components/) con control de roles:**
- `auth/LoginScreen.tsx`
- `auth/RoleGuard.tsx` (protección de rutas)
- `dashboard/DashboardHome.tsx` (filtrado por rol)
- `dashboard/MetricsCards.tsx` (datos según permisos)
- `dashboard/RecentActivity.tsx` (actividad filtrada)
- `history/HistoryList.tsx` (lista según rol)
- `history/SearchHeader.tsx` (filtros adaptativos)
- `inspection/InspectionReport.tsx` (acceso controlado)
- `inspection/DefectIndicators.tsx`
- `forms/MultiStepInspection.tsx`
- `forms/ProgressIndicator.tsx`
- `admin/UserManagement.tsx` (solo Admin)
- `admin/UserForm.tsx` (crear/editar usuarios)
- `admin/UserList.tsx` (lista de usuarios)
- `shared/BottomNavigation.tsx` (adaptada por rol)
- `shared/StatusBadge.tsx`
- `shared/RoleBadge.tsx` (indicador de rol)
- `shared/PermissionCheck.tsx` (hook de permisos)

**GESTIÓN DE ESTADO (/store/) con roles:**
- `useAuthStore.ts`: autenticación, usuario actual, rol y permisos
- `useOrderStore.ts`: pedidos e inspecciones filtradas por rol
- `useUserStore.ts`: gestión de usuarios (solo Admin)
- `useFormStore.ts`: estado del formulario multi-paso
- `useUIStore.ts`: navegación y estado de pantallas por rol
- `usePermissionStore.ts`: control de acceso y validaciones

### 3. Usar test-writer-fixer para:
- Probar navegación entre las 10 pantallas con control de roles
- Validar formulario multi-paso con permisos
- Probar filtrado de datos según rol (Inspector vs Supervisor/Admin)
- Verificar control de acceso a pantallas restringidas
- Probar responsive design móvil
- Verificar estados visuales (✓ ✗ badges) según permisos
- Testing de autenticación y autorización

### 4. Usar performance-benchmarker para:
- Optimizar para dispositivos móviles
- Asegurar transiciones suaves
- Verificar rendimiento en listas largas

---

## FASE 4: BACKEND CON API ROUTES

### 1. Usar el agente backend-architect para:

**ENDPOINTS con control de roles:**

**AUTENTICACIÓN (/app/api/auth/):**
- `POST /api/auth/login` - autenticación con validación de roles
- `POST /api/auth/logout` - cerrar sesión
- `GET /api/auth/me` - información del usuario actual
- `POST /api/auth/refresh` - renovar token de sesión

**DASHBOARD (/app/api/dashboard/):**
- `GET /api/dashboard` - métricas filtradas por rol
  * Inspector: solo sus métricas
  * Supervisor/Admin: métricas globales (130, 70, 126)
- `GET /api/dashboard/activity` - actividad reciente filtrada

**INSPECCIONES (/app/api/inspections/):**
- `GET /api/inspections` - lista filtrada por rol
  * Inspector: solo sus inspecciones
  * Supervisor/Admin: todas las inspecciones
- `GET /api/inspections/[id]` - detalle con validación de acceso
- `POST /api/inspections` - crear (todos los roles)
- `PATCH /api/inspections/[id]` - editar según permisos
- `PATCH /api/inspections/[id]/approve` - aprobar (solo Supervisor/Admin)
- `PATCH /api/inspections/[id]/reject` - rechazar (solo Supervisor/Admin)

**USUARIOS (/app/api/users/) - Solo Administrador:**
- `GET /api/users` - lista de usuarios
- `POST /api/users` - crear usuario
- `GET /api/users/[id]` - detalle de usuario
- `PATCH /api/users/[id]` - actualizar usuario
- `DELETE /api/users/[id]` - eliminar/desactivar usuario
- `PATCH /api/users/[id]/role` - cambiar rol

**Estructura de datos con roles:**
```typescript
// /app/api/db.ts
export const db = {
  users: [
    { id: 1, name: "Alexis", email: "alexis@inaplast.com", role: "inspector", active: true },
    { id: 2, name: "María", email: "maria@inaplast.com", role: "supervisor", active: true },
    { id: 3, name: "Carlos", email: "carlos@inaplast.com", role: "administrador", active: true }
  ],
  roles: {
    inspector: {
      name: "Inspector",
      permissions: ["view_own_inspections", "create_inspections"]
    },
    supervisor: {
      name: "Supervisor", 
      permissions: ["view_all_inspections", "approve_inspections", "reject_inspections", "create_inspections"]
    },
    administrador: {
      name: "Administrador",
      permissions: ["view_all_inspections", "approve_inspections", "reject_inspections", "create_inspections", "manage_users", "view_all_users"]
    }
  },
  dashboardMetrics: { 
    global: { count1: 130, count2: 70, count3: 126 },
    byUser: {} // métricas personales por inspector
  },
  recentActivity: [], // filtrada por permisos
  inspections: [], // con campo inspectorId
  orders: [], // con control de acceso
  formProgress: {} // estado de formularios multi-paso
}
```
  users: [{ name: "Alexis", role: "inspector" }],
  dashboardMetrics: { count1: 130, count2: 70, count3: 126 },
  recentActivity: [], // para la lista del dashboard
  inspections: [], // con estados ✓ ✗
  orders: [], // pedidos con defectos visuales
  formProgress: {} // estado de formularios multi-paso
}
```

---

## 🚀 PROMPT DE LANZAMIENTO FINAL

### Usar el agente project-shipper para:
- **Verificar sistema completo de roles**:
  * Inspector: Solo ve sus inspecciones y métricas personales
  * Supervisor: Ve todas las inspecciones, puede aprobar/rechazar
  * Administrador: Acceso completo + gestión de usuarios
- **Probar flujo completo por rol**:
  * Login → Dashboard filtrado → Historial según permisos → Inspección con control de acceso → Formulario 4 pasos
  * Administrador: + Gestión de usuarios (crear, editar, activar/desactivar)
- **Validar las 10 pantallas móviles** funcionan con roles:
  1. Login con autenticación
  2. Dashboard con datos filtrados por rol
  3. Historial con permisos aplicados
  4. Informe con control de acceso
  5-8. Formulario multi-paso (4 pantallas)
  9. Gestión usuarios (solo Admin)
  10. Crear/Editar usuario (solo Admin)
- **Comprobar métricas dinámicas**:
  * Inspector: Solo sus números personales
  * Supervisor/Admin: Métricas globales (130, 70, 126)
- **Validar indicadores de defectos** con permisos de edición
- **Probar en dispositivos móviles** reales con diferentes usuarios
- **Verificar navegación inferior** adaptada por rol (5-6 iconos)
- **Testing de seguridad**:
  * Intentos de acceso no autorizado devuelven 403
  * Inspectores no pueden ver datos de otros
  * Solo Administradores acceden a gestión de usuarios
- **Desplegar con datos de demo** por cada rol
- **Crear guía de usuario** por rol con pantallas específicas

**CRITERIOS DE ÉXITO:**
✅ Inspector solo ve sus inspecciones y estadísticas
✅ Supervisor ve todo + puede aprobar/rechazar
✅ Administrador tiene control total + gestión usuarios
✅ 10 pantallas móviles replican pixel-perfect el mockup INAPLAST
✅ Sistema de autenticación y autorización robusto
✅ Navegación adaptativa según rol del usuario
✅ API endpoints protegidos con middleware de roles
✅ Interfaz responsive optimizada para tablets/móviles de planta

**El sistema debe mantener la fidelidad visual del mockup INAPLAST mientras implementa un sistema de roles completo y seguro.**