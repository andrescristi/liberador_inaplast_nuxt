# Políticas de Row Level Security (RLS) - Liberador Inaplast

Este documento describe todas las políticas de Row Level Security configuradas en la base de datos de Supabase.

## Funciones de Apoyo

### Funciones de Autorización

#### `is_admin_from_jwt()`
```sql
CREATE OR REPLACE FUNCTION public.is_admin_from_jwt()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    -- Verifica si el usuario tiene rol de admin desde el JWT
    RETURN COALESCE(
        (auth.jwt() ->> 'user_role')::text = 'Admin',
        false
    );
END;
$function$
```

#### `is_admin(user_id_param uuid)`
```sql
CREATE OR REPLACE FUNCTION public.is_admin(user_id_param uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN public.user_has_role('Admin', user_id_param);
END;
$function$
```

#### `user_has_role(required_role profile_role, user_id_param uuid)`
```sql
CREATE OR REPLACE FUNCTION public.user_has_role(required_role profile_role, user_id_param uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = user_id_param 
        AND user_role = required_role
    );
END;
$function$
```

#### `can_change_user_role(target_user_id uuid, new_role profile_role)`
```sql
CREATE OR REPLACE FUNCTION public.can_change_user_role(target_user_id uuid, new_role profile_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    current_user_role profile_role;
    target_current_role profile_role;
BEGIN
    -- Obtiene el rol del usuario actual
    SELECT user_role INTO current_user_role
    FROM public.profiles 
    WHERE user_id = auth.uid()
    LIMIT 1;
    
    -- Obtiene el rol actual del usuario objetivo
    SELECT user_role INTO target_current_role
    FROM public.profiles 
    WHERE user_id = target_user_id
    LIMIT 1;
    
    -- Permite si el usuario es admin
    IF current_user_role = 'Admin' THEN
        RETURN true;
    END IF;
    
    -- Permite si el usuario se actualiza a sí mismo pero NO cambia el rol
    IF target_user_id = auth.uid() AND new_role = target_current_role THEN
        RETURN true;
    END IF;
    
    -- Deniega todos los demás casos
    RETURN false;
END;
$function$
```

---

## Políticas por Tabla

### 1. customers (Clientes)

#### Políticas de Lectura (SELECT)
- **`Allow users to view customers`**
  - **Roles:** `authenticated`
  - **Condición:** `true` (todos los usuarios autenticados pueden ver clientes)

#### Políticas de Inserción (INSERT)
- **`Allow inspectors and above to modify customers`**
  - **Roles:** `authenticated`
  - **Condición:** Usuario debe tener rol Inspector, Supervisor o Admin
  ```sql
  (SELECT profiles.user_role FROM profiles WHERE profiles.user_id = auth.uid()) = ANY (ARRAY['Inspector'::profile_role, 'Supervisor'::profile_role, 'Admin'::profile_role])
  ```

#### Políticas de Actualización (UPDATE)
- **`Allow inspectors and above to update customers`**
  - **Roles:** `authenticated`
  - **Condición:** Usuario debe tener rol Inspector, Supervisor o Admin
  ```sql
  (SELECT profiles.user_role FROM profiles WHERE profiles.user_id = auth.uid()) = ANY (ARRAY['Inspector'::profile_role, 'Supervisor'::profile_role, 'Admin'::profile_role])
  ```

#### Políticas de Eliminación (DELETE)
- **`Allow supervisors and admins to delete customers`**
  - **Roles:** `public`
  - **Condición:** Usuario debe tener rol Supervisor o Admin
  ```sql
  (auth.uid() IN (SELECT profiles.user_id FROM profiles WHERE profiles.user_role = ANY (ARRAY['Supervisor'::profile_role, 'Admin'::profile_role])))
  ```

- **`Only admins can delete customers`** *(Duplicada - Posible conflicto)*
  - **Roles:** `authenticated`
  - **Condición:** Usuario debe ser admin (desde JWT)
  ```sql
  (auth.jwt() ->> 'user_role'::text) = 'admin'::text
  ```

#### Políticas Generales
- **`Allow all operations on customers`**
  - **Roles:** `public`
  - **Operaciones:** `ALL`
  - **Condición:** `true` (permite todo a público - ⚠️ **RIESGO DE SEGURIDAD**)

---

### 2. products (Productos)

#### Políticas de Lectura (SELECT)
- **`Allow users to view products`**
  - **Roles:** `authenticated`
  - **Condición:** `true` (todos los usuarios autenticados pueden ver productos)

#### Políticas de Actualización (UPDATE)
- **`Allow supervisors and admins to modify products`**
  - **Roles:** `authenticated`
  - **Condición:** Usuario debe tener rol Supervisor o Admin
  ```sql
  (auth.uid() IN (SELECT profiles.user_id FROM profiles WHERE profiles.user_role = ANY (ARRAY['Supervisor'::profile_role, 'Admin'::profile_role])))
  ```

- **`Allow supervisors and admins to update products`** *(Duplicada)*
  - **Roles:** `authenticated`
  - **Condición:** Usuario debe tener rol Supervisor o Admin
  ```sql
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.user_role = ANY (ARRAY['Supervisor'::profile_role, 'Admin'::profile_role]))
  ```

#### Políticas de Eliminación (DELETE)
- **`Allow admins to delete products`**
  - **Roles:** `authenticated`
  - **Condición:** Usuario debe tener rol Admin
  ```sql
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.user_role = 'Admin'::profile_role)
  ```

#### Políticas Generales
- **`Allow all operations on products`**
  - **Roles:** `public`
  - **Operaciones:** `ALL`
  - **Condición:** `true` (permite todo a público - ⚠️ **RIESGO DE SEGURIDAD**)

---

### 3. orders (Órdenes)

#### Políticas de Lectura (SELECT)
- **`Allow users to view orders`**
  - **Roles:** `authenticated`
  - **Condición:** `true` (todos los usuarios autenticados pueden ver órdenes)

#### Políticas de Inserción (INSERT)
- **`Allow inspectors and above to create orders`**
  - **Roles:** `authenticated`
  - **Condición:** Usuario debe tener rol Inspector, Supervisor o Admin
  ```sql
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.user_role = ANY (ARRAY['Inspector'::profile_role, 'Supervisor'::profile_role, 'Admin'::profile_role]))
  ```

#### Políticas de Actualización (UPDATE)
- **`Allow inspectors and above to update orders`**
  - **Roles:** `authenticated`
  - **Condición:** Usuario debe tener rol Inspector, Supervisor o Admin
  ```sql
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.user_role = ANY (ARRAY['Inspector'::profile_role, 'Supervisor'::profile_role, 'Admin'::profile_role]))
  ```

#### Políticas de Eliminación (DELETE)
- **`Allow supervisors and admins to delete orders`**
  - **Roles:** `authenticated`
  - **Condición:** Usuario debe tener rol Supervisor o Admin
  ```sql
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.user_role = ANY (ARRAY['Supervisor'::profile_role, 'Admin'::profile_role]))
  ```

#### Políticas Generales
- **`Allow all operations on orders`**
  - **Roles:** `public`
  - **Operaciones:** `ALL`
  - **Condición:** `true` (permite todo a público - ⚠️ **RIESGO DE SEGURIDAD**)

---

### 4. profiles (Perfiles)

#### Políticas de Lectura (SELECT)
- **`Users can view own profile`**
  - **Roles:** `authenticated`
  - **Condición:** `auth.uid() = user_id` (usuarios solo pueden ver su propio perfil)

- **`Admins can view all profiles`**
  - **Roles:** `authenticated`
  - **Condición:** `is_admin_from_jwt()` (solo admins pueden ver todos los perfiles)

#### Políticas de Inserción (INSERT)
- **`Admins can insert profiles`**
  - **Roles:** `authenticated`
  - **Condición:** `is_admin_from_jwt()` (solo admins pueden crear perfiles)

#### Políticas de Actualización (UPDATE)
- **`Users can update own profile`**
  - **Roles:** `authenticated`
  - **Condición:** `auth.uid() = user_id` (usuarios pueden actualizar su propio perfil)
  - **Verificación:** `auth.uid() = user_id` (misma verificación)

- **`Admins can update any profile`**
  - **Roles:** `authenticated`
  - **Condición:** `is_admin_from_jwt()` (admins pueden actualizar cualquier perfil)

#### Políticas de Eliminación (DELETE)
- **`Admins can delete profiles`**
  - **Roles:** `authenticated`
  - **Condición:** `is_admin_from_jwt() AND user_id <> auth.uid()` (admins pueden eliminar perfiles excepto el suyo)

---

### 5. Tablas de Muestreo

Las siguientes tablas **NO tienen políticas RLS configuradas**, lo que significa que están completamente abiertas:

- **`planes_de_muestreo`** - ⚠️ **SIN POLÍTICAS RLS**
- **`grupos_muestreo`** - ⚠️ **SIN POLÍTICAS RLS** 
- **`grupos_planes`** - ⚠️ **SIN POLÍTICAS RLS**

---

## Jerarquía de Roles

```
Admin > Supervisor > Inspector
```

### Permisos por Rol:

#### Admin
- ✅ Ver, crear, actualizar y eliminar todos los registros
- ✅ Gestionar perfiles de usuarios
- ✅ Acceso completo al sistema

#### Supervisor  
- ✅ Ver todos los registros
- ✅ Crear y actualizar clientes, productos y órdenes
- ✅ Eliminar clientes y órdenes
- ❌ Gestionar perfiles de usuarios
- ❌ Eliminar productos

#### Inspector
- ✅ Ver todos los registros
- ✅ Crear y actualizar clientes y órdenes
- ❌ Crear/actualizar productos
- ❌ Eliminar cualquier registro
- ❌ Gestionar perfiles de usuarios

---

## ⚠️ Problemas de Seguridad Identificados

### 1. Políticas Públicas Demasiado Permisivas
Las siguientes políticas permiten acceso público completo:
- `customers`: "Allow all operations on customers"
- `products`: "Allow all operations on products"
- `orders`: "Allow all operations on orders"

**Recomendación:** Eliminar estas políticas o cambiarlas a `authenticated`.

### 2. Políticas Duplicadas
Existen políticas duplicadas que pueden generar confusión:
- `customers`: Dos políticas diferentes para DELETE
- `products`: Dos políticas similares para UPDATE

**Recomendación:** Consolidar políticas duplicadas.

### 3. Tablas sin RLS
Las tablas de muestreo no tienen políticas configuradas:
- `planes_de_muestreo`
- `grupos_muestreo` 
- `grupos_planes`

**Recomendación:** Configurar políticas RLS apropiadas.

### 4. Inconsistencias en Verificación de Roles
Algunas políticas usan `auth.jwt()` mientras otras consultan la tabla `profiles`.

**Recomendación:** Estandarizar el método de verificación de roles.

---

*Documentación generada el: 2025-08-15*
*Proyecto: Liberador Inaplast - Sistema de Gestión de Calidad*