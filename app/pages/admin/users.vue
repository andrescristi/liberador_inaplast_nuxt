<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between mb-8">
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Administración de Usuarios
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            Gestiona usuarios, roles y permisos del sistema
          </p>
        </div>
        <div v-if="!hasPermissionsError" class="mt-4 flex md:mt-0 md:ml-4">
          <BaseButton 
            color="primary" 
            variant="solid" 
            size="md"
            leading-icon="bx:plus"
            @click="showCreateModal = true"
          >
            Crear Usuario
          </BaseButton>
        </div>
      </div>

      <!-- Stats Cards -->
      <UserStatsCards 
        v-if="!hasPermissionsError" 
        :stats="stats" 
        class="mb-8" 
      />

      <!-- Search and Filters -->
      <UserFilters
        v-if="!hasPermissionsError"
        v-model:search-term="searchTerm"
        v-model:selected-role="selectedRole"
        @search="debouncedSearch"
        @role-change="fetchUsers"
      />

      <!-- Permissions Error Message -->
      <div v-if="hasPermissionsError" class="mb-6">
        <div class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Acceso Denegado
              </h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{ permissionsErrorMessage }}</p>
              </div>
              <div class="mt-4">
                <div class="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    class="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                    @click="$router.push('/')"
                  >
                    Ir al Inicio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <UserTable
        v-if="!hasPermissionsError"
        :users="users"
        @edit="editUser"
        @delete="confirmDeleteUser"
        @reset-password="confirmResetPassword"
      />

      <!-- Pagination -->
      <UserPagination
        v-if="!hasPermissionsError"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-users="totalUsers"
        :page-size="pageSize"
        @next-page="nextPage"
        @previous-page="previousPage"
      />
    </div>
    
    <!-- Create User Modal -->
    <UserCreateModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleUserCreated"
    />

    <!-- Edit User Modal -->
    <UserEditModal
      v-if="showEditModal && selectedUser"
      :user="selectedUser"
      @close="showEditModal = false"
      @updated="handleUserUpdated"
    />

    <!-- Confirmation Modals -->
    <UserConfirmationModals
      :show-delete-modal="showDeleteModal"
      :show-reset-password-modal="showResetPasswordModal"
      :user-to-delete="userToDelete"
      :user-to-reset-password="userToResetPassword"
      @close:delete="showDeleteModal = false"
      @close:reset-password="showResetPasswordModal = false"
      @confirm:delete="deleteUser"
      @confirm:reset-password="resetPassword"
    />
  </div>
</template>

<script setup lang="ts">
import type { Profile, ProfileRole } from '~/types'

// Import components explicitly to fix SSR resolution issues
import BaseButton from '~/components/ui/BaseButton.vue'
import UserCreateModal from '~/components/admin/UserCreateModal.vue'
import UserEditModal from '~/components/admin/UserEditModal.vue'
import UserStatsCards from '~/components/admin/UserStatsCards.vue'
import UserFilters from '~/components/admin/UserFilters.vue'
import UserTable from '~/components/admin/UserTable.vue'
import UserPagination from '~/components/admin/UserPagination.vue'
import UserConfirmationModals from '~/components/admin/UserConfirmationModals.vue'
import { useAdminUserAPI } from '~/composables/admin/useAdminUserAPI'

definePageMeta({
  middleware: 'require-admin-role',
  layout: 'default'
})

const userAPI = useAdminUserAPI()
const toast = useToast()
const { debounce } = useDebounce()

// Reactive data
const users = ref<Profile[]>([])
const stats = ref<{ total: number; admins: number; supervisors: number; inspectors: number } | null>(null)
const loading = ref(false)
const searchTerm = ref('')
const selectedRole = ref<ProfileRole | ''>('')
const currentPage = ref(1)
const totalUsers = ref(0)
const totalPages = ref(0)
const pageSize = 10
const hasPermissionsError = ref(false)
const permissionsErrorMessage = ref('')

// Modals
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showResetPasswordModal = ref(false)
const selectedUser = ref<Profile | null>(null)
const userToDelete = ref<Profile | null>(null)
const userToResetPassword = ref<Profile | null>(null)

// Methods
const fetchUsers = async () => {
  loading.value = true
  hasPermissionsError.value = false
  permissionsErrorMessage.value = ''
  
  try {
    const filters: { search?: string; role_filter?: ProfileRole } = {}
    if (searchTerm.value) filters.search = searchTerm.value
    if (selectedRole.value) filters.role_filter = selectedRole.value

    // Use HTTP API endpoint instead of direct Supabase client to bypass RLS issues
    const response = await userAPI.getAllUsersViaHTTP(filters, currentPage.value, pageSize)
    users.value = response.data
    totalUsers.value = response.total
    totalPages.value = response.total_pages
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al cargar usuarios'
    
    // Detectar errores de permisos 
    const isPermissionError = errorMessage.includes('Access denied') || 
        errorMessage.includes('Admin privileges required') ||
        errorMessage.includes('Acceso denegado') ||
        errorMessage.includes('403') ||
        errorMessage.includes('Forbidden') ||
        errorMessage.includes('Unknown error occurred') || // Error genérico de Supabase 403
        (error && typeof error === 'object' && 'code' in error && (error as Record<string, unknown>).code === 'PGRST301')
    
    if (isPermissionError) {
      hasPermissionsError.value = true
      permissionsErrorMessage.value = 'No tienes permisos de administrador para ver esta página. Contacta a un administrador del sistema.'
    } else {
      toast.error('Error', errorMessage)
    }
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    // Llamada directa al endpoint de API para debugging
    const response = await $fetch<{
      total: number
      admins: number
      supervisors: number
      inspectors: number
    }>('/api/admin/users/stats')
    
    stats.value = {
      total: response.total,
      admins: response.admins,
      supervisors: response.supervisors,
      inspectors: response.inspectors
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'No se pudieron cargar las estadísticas'
    
    // Si ya hay un error de permisos, no mostrar toast adicional
    if (!hasPermissionsError.value) {
      const isPermissionError = errorMessage.includes('Access denied') || 
          errorMessage.includes('Admin privileges required') ||
          errorMessage.includes('Acceso denegado') ||
          errorMessage.includes('403') ||
          errorMessage.includes('Forbidden') ||
          errorMessage.includes('Unknown error occurred') || // Error genérico de Supabase 403
          (error && typeof error === 'object' && 'code' in error && (error as Record<string, unknown>).code === 'PGRST301')
      
      if (isPermissionError) {
        hasPermissionsError.value = true
        permissionsErrorMessage.value = 'No tienes permisos de administrador para ver esta página. Contacta a un administrador del sistema.'
      } else {
        toast.error('Error', errorMessage)
      }
    }
  }
}

const editUser = (user: Profile) => {
  selectedUser.value = user
  showEditModal.value = true
}

const confirmDeleteUser = (user: Profile) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const confirmResetPassword = (user: Profile) => {
  userToResetPassword.value = user
  showResetPasswordModal.value = true
}

const deleteUser = async () => {
  if (!userToDelete.value) return
  
  try {
    await $fetch(`/api/admin/users/${userToDelete.value.user_id}`, {
      method: 'DELETE'
    })
    toast.success('Éxito', 'Usuario eliminado correctamente')
    showDeleteModal.value = false
    userToDelete.value = null
    await fetchUsers()
    await fetchStats()
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al eliminar usuario'
    toast.error('Error', errorMessage)
  }
}

const resetPassword = async () => {
  if (!userToResetPassword.value) return
  
  try {
    await userAPI.resetUserPasswordViaHTTP(userToResetPassword.value.user_id)
    toast.success('Éxito', `Email de recuperación enviado a ${userToResetPassword.value.full_name}`)
    showResetPasswordModal.value = false
    userToResetPassword.value = null
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al resetear contraseña'
    toast.error('Error', errorMessage)
  }
}

const handleUserCreated = async () => {
  showCreateModal.value = false
  await fetchUsers()
  await fetchStats()
  toast.success('Éxito', 'Usuario creado correctamente')
}

const handleUserUpdated = async () => {
  showEditModal.value = false
  selectedUser.value = null
  await fetchUsers()
  await fetchStats()
  toast.success('Éxito', 'Usuario actualizado correctamente')
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchUsers()
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchUsers()
  }
}

const debouncedSearch = debounce(fetchUsers, 300)

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchUsers(), fetchStats()])
})

// Watchers
watch([searchTerm, selectedRole], () => {
  currentPage.value = 1
})
</script>