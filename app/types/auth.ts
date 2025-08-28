/**
 * Tipos relacionados con autenticación y perfiles de usuario
 * 
 * @author Inaplast Development Team
 * @since v2.6.0
 */

// Importar enum del database para usar como fuente de verdad
import type { Database } from '../../types/database.types'

// ============================================================================
// TIPOS DE PERFILES Y AUTENTICACIÓN
// ============================================================================

/**
 * Roles disponibles en el sistema de liberación Inaplast
 * 
 * Usa el enum de la base de datos como fuente única de verdad.
 * Jerarquía de permisos (de mayor a menor):
 * - Admin: Acceso completo al sistema, gestión de usuarios, configuración global
 * - Supervisor: Supervisión de procesos, acceso a reportes globales, aprobación de liberaciones
 * - Inspector: Creación y gestión de liberaciones asignadas, acceso limitado a sus propios datos
 */
export type ProfileRole = Database['public']['Enums']['profile_role']

/**
 * Perfil de usuario del sistema
 * 
 * Representa un usuario registrado con sus datos básicos y rol.
 * Se combina con datos de Supabase Auth para formar el perfil completo.
 * 
 * @example
 * ```typescript
 * const userProfile: Profile = {
 *   id: 'uuid-profile-id',
 *   user_id: 'uuid-auth-user-id',
 *   first_name: 'Juan',
 *   last_name: 'Pérez',
 *   user_role: 'Inspector',
 *   created_at: '2023-01-01T00:00:00Z',
 *   updated_at: '2023-06-01T00:00:00Z',
 *   full_name: 'Juan Pérez', // Computed
 *   email: 'juan.perez@inaplast.com' // From auth.users
 * }
 * ```
 */
export interface Profile {
  /** ID único del perfil en la tabla profiles */
  id: string
  /** ID del usuario en Supabase Auth (FK a auth.users) */
  user_id: string
  /** Nombre del usuario */
  first_name: string
  /** Apellido del usuario */
  last_name: string
  /** Rol del usuario en el sistema */
  user_role: ProfileRole
  /** Fecha de creación del perfil */
  created_at: string | null
  /** Fecha de última actualización */
  updated_at: string | null
  /** Campo calculado: nombre completo (first_name + last_name) */
  full_name?: string
  /** Email del usuario (poblado desde auth.users) */
  email?: string
}

/**
 * Formulario para crear un nuevo perfil de usuario
 * 
 * Usado cuando se crea un perfil manualmente (sin autenticación)
 * o para actualizar datos básicos del perfil.
 */
export interface CreateProfileForm {
  /** Nombre del usuario (requerido) */
  first_name: string
  /** Apellido del usuario (requerido) */
  last_name: string
  /** Rol inicial del usuario */
  user_role: ProfileRole
}

/**
 * Formulario para actualizar un perfil existente
 * 
 * Todos los campos son opcionales para permitir actualizaciones parciales.
 */
export interface UpdateProfileForm {
  /** Nombre del usuario (opcional para actualizaciones parciales) */
  first_name?: string
  /** Apellido del usuario (opcional para actualizaciones parciales) */
  last_name?: string
  /** Rol del usuario (opcional, requiere permisos de admin) */
  user_role?: ProfileRole
}

/**
 * Formulario completo para crear un nuevo usuario
 * 
 * Incluye tanto credenciales de autenticación como datos del perfil.
 * Usado en el panel de administración para crear usuarios completos.
 * 
 * @example
 * ```typescript
 * const newUser: CreateUserForm = {
 *   email: 'inspector@inaplast.com',
 *   password: 'TempPassword123!',
 *   first_name: 'María',
 *   last_name: 'González',
 *   user_role: 'Inspector'
 * }
 * ```
 */
export interface CreateUserForm {
  /** Email único del usuario (para autenticación) */
  email: string
  /** Contraseña temporal (usuario debe cambiarla en primer login) */
  password: string
  /** Nombre del usuario */
  first_name: string
  /** Apellido del usuario */
  last_name: string
  /** Rol inicial del usuario */
  user_role: ProfileRole
}

/**
 * Filtros para búsqueda y filtrado de perfiles
 * 
 * Usado en el panel de administración para filtrar la lista de usuarios.
 */
export interface ProfileFilters {
  /** Término de búsqueda (busca en nombre, apellido y email) */
  search?: string
  /** Filtrar por rol específico */
  role_filter?: ProfileRole
}