# Estructura de Base de Datos - Liberador Inaplast

Este documento describe la estructura completa de la base de datos de Supabase para el proyecto Liberador Inaplast.

## Tablas Principales

### 1. customers - Clientes
Tabla para almacenar información de los clientes.

**Columnas:**
- `id` (UUID) - Identificador único (PK)
  - Valor por defecto: `uuid_generate_v4()`
- `name` (TEXT) - Nombre del cliente (Requerido)
  - Restricción: `length(name) > 0`
- `email` (TEXT) - Correo electrónico (Único, Requerido)
  - Restricción: Formato de email válido
- `phone` (TEXT) - Teléfono (Opcional)
  - Restricción: Mínimo 10 caracteres si se proporciona
- `address` (TEXT) - Dirección (Opcional)
- `created_at` (TIMESTAMPTZ) - Fecha de creación
  - Valor por defecto: `now()`
- `updated_at` (TIMESTAMPTZ) - Fecha de actualización
  - Valor por defecto: `now()`

**RLS:** Habilitado
**Relaciones:** Es referenciada por `orders.customer_id`

---

### 2. products - Productos
Tabla para almacenar información de productos.

**Columnas:**
- `id` (UUID) - Identificador único (PK)
  - Valor por defecto: `uuid_generate_v4()`
- `name` (TEXT) - Nombre del producto (Requerido)
  - Restricción: `length(name) > 0`
- `description` (TEXT) - Descripción del producto (Opcional)
- `price` (NUMERIC) - Precio del producto (Requerido)
  - Restricción: `price >= 0`
- `stock_quantity` (INTEGER) - Cantidad en stock (Requerido)
  - Valor por defecto: `0`
  - Restricción: `stock_quantity >= 0`
- `created_at` (TIMESTAMPTZ) - Fecha de creación
  - Valor por defecto: `now()`
- `updated_at` (TIMESTAMPTZ) - Fecha de actualización
  - Valor por defecto: `now()`

**RLS:** Habilitado

---

### 3. orders - Órdenes
Tabla para almacenar órdenes de compra.

**Columnas:**
- `id` (UUID) - Identificador único (PK)
  - Valor por defecto: `uuid_generate_v4()`
- `customer_id` (UUID) - ID del cliente (FK → customers.id, Requerido)
- `status` (TEXT) - Estado de la orden (Requerido)
  - Valor por defecto: `'pending'`
  - Valores permitidos: `['pending', 'processing', 'completed', 'cancelled']`
- `total_amount` (NUMERIC) - Monto total (Requerido)
  - Restricción: `total_amount >= 0`
- `order_date` (TIMESTAMPTZ) - Fecha de la orden
  - Valor por defecto: `now()`
- `created_at` (TIMESTAMPTZ) - Fecha de creación
  - Valor por defecto: `now()`
- `updated_at` (TIMESTAMPTZ) - Fecha de actualización
  - Valor por defecto: `now()`

**RLS:** Habilitado
**Relaciones:**
- `customer_id` → `customers.id` (Foreign Key)

---

### 4. profiles - Perfiles de Usuario
Tabla para almacenar perfiles de usuarios autenticados.

**Columnas:**
- `id` (UUID) - Identificador único (PK)
  - Valor por defecto: `uuid_generate_v4()`
- `user_id` (UUID) - ID del usuario de auth (FK → auth.users.id, Único, Requerido)
- `first_name` (TEXT) - Nombre (Requerido)
  - Restricción: `length(first_name) > 0`
- `last_name` (TEXT) - Apellido (Requerido)
  - Restricción: `length(last_name) > 0`
- `user_role` (profile_role) - Rol del usuario (Enum)
  - Valor por defecto: `'Inspector'`
  - Valores: `['Admin', 'Inspector', 'Supervisor']`
- `created_at` (TIMESTAMPTZ) - Fecha de creación
  - Valor por defecto: `now()`
- `updated_at` (TIMESTAMPTZ) - Fecha de actualización
  - Valor por defecto: `now()`

**RLS:** Habilitado
**Relaciones:**
- `user_id` → `auth.users.id` (Foreign Key)

---

## Sistema de Muestreo (Calidad)

### 5. planes_de_muestreo - Planes de Muestreo
Tabla para definir planes de muestreo de calidad.

**Columnas:**
- `codigo` (VARCHAR) - Código del plan (PK compuesta)
- `aql` (VARCHAR) - Nivel de calidad aceptable (PK compuesta)
- `tamano_muestra` (SMALLINT) - Tamaño de la muestra (Opcional)
- `numero_maximo_fallas` (SMALLINT) - Número máximo de fallas permitidas
  - Valor por defecto: `0`

**RLS:** Habilitado
**Clave Primaria:** Compuesta por (`codigo`, `aql`)
**Relaciones:** Es referenciada por `grupos_planes`

---

### 6. grupos_muestreo - Grupos de Muestreo
Tabla para definir grupos de muestreo por tamaño de lote y nivel de inspección.

**Columnas:**
- `tamano_lote_desde` (BIGINT) - Tamaño de lote desde (PK compuesta)
- `tamano_lote_hasta` (BIGINT) - Tamaño de lote hasta (Opcional)
- `tipo_de_inspeccion` (VARCHAR) - Tipo de inspección (Opcional)
- `nivel_inspeccion` (VARCHAR) - Nivel de inspección (PK compuesta)
- `codigo_plan_muestreo` (VARCHAR) - Código del plan de muestreo (Opcional)

**RLS:** Habilitado
**Clave Primaria:** Compuesta por (`tamano_lote_desde`, `nivel_inspeccion`)
**Relaciones:** Es referenciada por `grupos_planes`

---

### 7. grupos_planes - Relación Grupos-Planes
Tabla de unión entre grupos de muestreo y planes de muestreo.

**Columnas:**
- `tamano_lote_desde` (BIGINT) - Tamaño de lote desde (FK)
- `nivel_inspeccion` (VARCHAR) - Nivel de inspección (FK)
- `codigo` (VARCHAR) - Código del plan (FK)
- `aql` (VARCHAR) - Nivel AQL (FK)

**RLS:** Habilitado
**Relaciones:**
- (`tamano_lote_desde`, `nivel_inspeccion`) → `grupos_muestreo` (FK)
- (`codigo`, `aql`) → `planes_de_muestreo` (FK)

---

## Tipos de Datos Personalizados

### profile_role (ENUM)
Tipo enumerado para roles de usuario:
- `Admin` - Administrador del sistema
- `Inspector` - Inspector de calidad
- `Supervisor` - Supervisor

---

## Configuración de Seguridad

**Row Level Security (RLS):** Todas las tablas tienen RLS habilitado para controlar el acceso a los datos basado en el contexto del usuario autenticado.

**Extensiones utilizadas:**
- `uuid-ossp` para generación de UUIDs

---

## Estadísticas de Datos

| Tabla | Registros Estimados | Tamaño |
|-------|-------------------|---------|
| customers | 5 | 80 kB |
| products | 6 | 64 kB |
| orders | 2 | 96 kB |
| profiles | 12 | 96 kB |
| planes_de_muestreo | 176 | 64 kB |
| grupos_muestreo | 105 | 32 kB |
| grupos_planes | 1,155 | 104 kB |

---

## Diagrama de Relaciones

```
auth.users
    ↓ (user_id)
profiles

customers
    ↓ (customer_id)
orders

grupos_muestreo ←→ grupos_planes ←→ planes_de_muestreo
    (PK compuestas)      (tabla de unión)     (PK compuestas)
```

---

*Documentación generada el: 2025-08-15*
*Proyecto: Liberador Inaplast - Sistema de Gestión de Calidad*