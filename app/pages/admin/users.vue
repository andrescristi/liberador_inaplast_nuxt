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
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <BaseButton class="btn-primary" @click="showCreateModal = true">
            <svg
class="w-5 h-5 mr-2"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24">
              <path
stroke-linecap="round"
stroke-linejoin="round"
stroke-width="2"
d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Crear Usuario
          </BaseButton>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg
class="h-6 w-6 text-gray-400"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24">
                  <path
stroke-linecap="round"
stroke-linejoin="round"
stroke-width="2"
d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total Usuarios
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats?.total || 0 }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg
class="h-6 w-6 text-blue-400"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24">
                  <path
stroke-linecap="round"
stroke-linejoin="round"
stroke-width="2"
d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Administradores
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats?.admins || 0 }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg
class="h-6 w-6 text-green-400"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24">
                  <path
stroke-linecap="round"
stroke-linejoin="round"
stroke-width="2"
d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Supervisores
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats?.supervisors || 0 }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg
class="h-6 w-6 text-yellow-400"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24">
                  <path
stroke-linecap="round"
stroke-linejoin="round"
stroke-width="2"
d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m5-13v4a1 1 0 001 1h4m-5-4a5 5 0 00-5 5v7a5 5 0 005 5h4a1 1 0 001-1v-4a5 5 0 00-5-5H9z"/>
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Inspectores
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats?.inspectors || 0 }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <BaseCard class="mb-6">
        <div class="p-6">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="sm:col-span-2">
              <BaseInput
                v-model="searchTerm"
                placeholder="Buscar por nombre o email..."
                @input="debouncedSearch"
              >
                <template #prepend>
                  <svg
class="w-5 h-5 text-gray-400"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24">
                    <path
stroke-linecap="round"
stroke-linejoin="round"
stroke-width="2"
d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </template>
              </BaseInput>
            </div>
            <div>
              <select
                v-model="selectedRole"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                @change="fetchUsers"
              >
                <option value="">Todos los roles</option>
                <option value="Admin">Administrador</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Inspector">Inspector</option>
              </select>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Users Table -->
      <BaseCard>
        <div class="px-4 py-5 sm:p-6">
          <BaseTable
            :headers="tableHeaders"
            :data="users"
            :loading="loading"
          >
            <template #user_role="{ item }">
              <BaseBadge
                :variant="getRoleBadgeVariant(item.user_role)"
                :label="getRoleLabel(item.user_role)"
              />
            </template>
            <template #created_at="{ item }">
              {{ formatDate(item.created_at) }}
            </template>
            <template #actions="{ item }">
              <div class="flex space-x-2">
                <button
                  class="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  @click="editUser(item)"
                >
                  Editar
                </button>
                <button
                  v-if="item.user_role !== 'Admin'"
                  class="text-red-600 hover:text-red-900 text-sm font-medium"
                  @click="confirmDeleteUser(item)"
                >
                  Eliminar
                </button>
              </div>
            </template>
          </BaseTable>
        </div>
      </BaseCard>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Mostrando {{ ((currentPage - 1) * pageSize) + 1 }} a {{ Math.min(currentPage * pageSize, totalUsers) }} de {{ totalUsers }} usuarios
        </div>
        <div class="flex space-x-2">
          <BaseButton
            :disabled="currentPage === 1"
            variant="outline"
            @click="previousPage"
          >
            Anterior
          </BaseButton>
          <BaseButton
            :disabled="currentPage === totalPages"
            variant="outline"
            @click="nextPage"
          >
            Siguiente
          </BaseButton>
        </div>
      </div>
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

    <!-- Delete Confirmation Modal -->
    <BaseModal
      v-if="showDeleteModal"
      @close="showDeleteModal = false"
    >
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Confirmar Eliminación
        </h3>
        <p class="text-sm text-gray-500 mb-6">
          ¿Estás seguro de que deseas eliminar a <strong>{{ userToDelete?.full_name }}</strong>? Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showDeleteModal = false">
            Cancelar
          </BaseButton>
          <BaseButton variant="danger" @click="deleteUser">
            Eliminar
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import type { Profile, ProfileRole } from '~/types'

definePageMeta({
  middleware: 'require-admin-role',
  layout: 'default'
})

const { useUserAdministration } = useUserAdministration()
const { useToast } = useToast()
const { debounce } = useDebounce()

// Reactive data
const users = ref<Profile[]>([])
const stats = ref<any>(null)
const loading = ref(false)
const searchTerm = ref('')
const selectedRole = ref<ProfileRole | ''>('')
const currentPage = ref(1)
const totalUsers = ref(0)
const totalPages = ref(0)
const pageSize = 20

// Modals
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedUser = ref<Profile | null>(null)
const userToDelete = ref<Profile | null>(null)

// Table configuration
const tableHeaders = [
  { key: 'full_name', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  { key: 'user_role', label: 'Rol' },
  { key: 'created_at', label: 'Fecha de Creación' },
  { key: 'actions', label: 'Acciones' }
]

const debouncedSearch = debounce(fetchUsers, 300)

// Methods
const fetchUsers = async () => {
  loading.value = true
  try {
    const filters: any = {}
    if (searchTerm.value) filters.search = searchTerm.value
    if (selectedRole.value) filters.role_filter = selectedRole.value

    const response = await useUserAdministration.getAllUsers(filters, currentPage.value, pageSize)
    users.value = response.data
    totalUsers.value = response.total
    totalPages.value = response.total_pages
  } catch (error: any) {
    useToast().error('Error', error.message)
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    stats.value = await useUserAdministration.getUserStats()
  } catch (error: any) {
    useToast().error('Error', 'No se pudieron cargar las estadísticas')
  }
}

const getRoleBadgeVariant = (role: ProfileRole) => {
  switch (role) {
    case 'Admin': return 'blue'
    case 'Supervisor': return 'green'
    case 'Inspector': return 'yellow'
    default: return 'gray'
  }
}

const getRoleLabel = (role: ProfileRole) => {
  switch (role) {
    case 'Admin': return 'Administrador'
    case 'Supervisor': return 'Supervisor'
    case 'Inspector': return 'Inspector'
    default: return role
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

const deleteUser = async () => {
  if (!userToDelete.value) return
  
  try {
    await useUserAdministration.deleteUser(userToDelete.value.user_id)
    useToast().success('Éxito', 'Usuario eliminado correctamente')
    showDeleteModal.value = false
    userToDelete.value = null
    await fetchUsers()
    await fetchStats()
  } catch (error: any) {
    useToast().error('Error', error.message)
  }
}

const handleUserCreated = async () => {
  showCreateModal.value = false
  await fetchUsers()
  await fetchStats()
  useToast().success('Éxito', 'Usuario creado correctamente')
}

const handleUserUpdated = async () => {
  showEditModal.value = false
  selectedUser.value = null
  await fetchUsers()
  await fetchStats()
  useToast().success('Éxito', 'Usuario actualizado correctamente')
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchUsers(), fetchStats()])
})

// Watchers
watch([searchTerm, selectedRole], () => {
  currentPage.value = 1
})
</script>