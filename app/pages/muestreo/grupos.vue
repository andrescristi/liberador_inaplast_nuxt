<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between mb-8">
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Grupos de Muestreo
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            Configura rangos de lotes y niveles de inspección para planes de muestreo
          </p>
        </div>
        <div v-if="canManageGrupos" class="mt-4 flex md:mt-0 md:ml-4">
          <BaseButton 
            color="primary" 
            variant="solid" 
            size="md"
            leading-icon="bx:plus"
            @click="showCreateModal = true"
          >
            Nuevo Grupo
          </BaseButton>
        </div>
      </div>

      <!-- Stats Cards -->
      <div v-if="stats" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="bx:group" class="h-6 w-6 text-purple-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total Grupos
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.total_grupos }}
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
                <Icon name="bx:layer" class="h-6 w-6 text-blue-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Niveles de Inspección
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ Object.keys(stats.grupos_por_nivel || {}).length }}
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
                <Icon name="bx:category" class="h-6 w-6 text-green-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Tipos de Inspección
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.tipos_inspeccion?.length || 0 }}
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
                <Icon name="bx:link" class="h-6 w-6 text-yellow-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Planes Vinculados
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.total_planes }}
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
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-5">
            <div class="sm:col-span-2">
              <BaseInput
                v-model="searchTerm"
                placeholder="Buscar por nivel o tipo..."
                @input="debouncedSearch"
              >
                <template #prepend>
                  <Icon name="bx:search" class="w-5 h-5 text-gray-400" />
                </template>
              </BaseInput>
            </div>
            <div>
              <select
                v-model="selectedNivel"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                @change="fetchGrupos"
              >
                <option value="">Todos los niveles</option>
                <option
v-for="nivel in nivelesUnicos"
:key="nivel"
:value="nivel">
                  Nivel {{ nivel }}
                </option>
              </select>
            </div>
            <div>
              <select
                v-model="selectedTipo"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                @change="fetchGrupos"
              >
                <option value="">Todos los tipos</option>
                <option
v-for="tipo in tiposUnicos"
:key="tipo"
:value="tipo">
                  {{ tipo }}
                </option>
              </select>
            </div>
            <div>
              <BaseInput
                v-model.number="tamanoLoteFiltro"
                type="number"
                min="1"
                placeholder="Tamaño de lote"
                @input="debouncedSearch"
              />
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Grupos Table -->
      <BaseCard>
        <div class="px-4 py-5 sm:p-6">
          <BaseTable
            :columns="tableHeaders"
            :rows="grupos"
            :loading="loading"
          >
            <template #rango_lote-data="{ row }">
              <div class="font-mono text-sm">
                {{ (row as GrupoMuestreo).tamano_lote_desde }} - 
                {{ (row as GrupoMuestreo).tamano_lote_hasta || '∞' }}
              </div>
            </template>
            <template #nivel_inspeccion-data="{ row }">
              <BaseBadge color="blue" variant="solid">
                Nivel {{ (row as GrupoMuestreo).nivel_inspeccion }}
              </BaseBadge>
            </template>
            <template #tipo_de_inspeccion-data="{ row }">
              <span class="text-sm text-gray-600">
                {{ (row as GrupoMuestreo).tipo_de_inspeccion || 'No especificado' }}
              </span>
            </template>
            <template #codigo_plan_muestreo-data="{ row }">
              <BaseBadge 
                v-if="(row as GrupoMuestreo).codigo_plan_muestreo" 
                color="green" 
                variant="outline"
              >
                {{ (row as GrupoMuestreo).codigo_plan_muestreo }}
              </BaseBadge>
              <span v-else class="text-gray-400 text-sm">Sin asignar</span>
            </template>
            <template #actions-data="{ row }">
              <div class="flex space-x-2">
                <button
                  class="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  @click="viewGrupo(row as GrupoMuestreo)"
                >
                  Ver
                </button>
                <button
                  v-if="canManageGrupos"
                  class="text-purple-600 hover:text-purple-900 text-sm font-medium"
                  title="Gestionar planes asignados"
                  @click="gestionarPlanes(row as GrupoMuestreo)"
                >
                  Planes
                </button>
                <button
                  v-if="canManageGrupos"
                  class="text-yellow-600 hover:text-yellow-900 text-sm font-medium"
                  @click="editGrupo(row as GrupoMuestreo)"
                >
                  Editar
                </button>
                <button
                  v-if="canManageGrupos"
                  class="text-red-600 hover:text-red-900 text-sm font-medium"
                  @click="confirmDeleteGrupo(row as GrupoMuestreo)"
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
          Mostrando {{ ((currentPage - 1) * pageSize) + 1 }} a {{ Math.min(currentPage * pageSize, totalGrupos) }} de {{ totalGrupos }} grupos
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

    <!-- Create Grupo Modal -->
    <GrupoMuestreoCreateModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleGrupoCreated"
    />

    <!-- Edit Grupo Modal -->
    <GrupoMuestreoEditModal
      v-if="showEditModal && selectedGrupo"
      :grupo="selectedGrupo"
      @close="showEditModal = false"
      @updated="handleGrupoUpdated"
    />

    <!-- View Grupo Modal -->
    <GrupoMuestreoViewModal
      v-if="showViewModal && selectedGrupo"
      :grupo="selectedGrupo"
      @close="showViewModal = false"
    />

    <!-- Relaciones Grupo Modal -->
    <GrupoMuestreoRelacionesModal
      v-if="showRelacionesModal && selectedGrupo"
      :grupo="selectedGrupo"
      @close="showRelacionesModal = false"
      @updated="handleRelacionesUpdated"
    />

    <!-- Delete Confirmation Modal -->
    <BaseModal
      :show="showDeleteModal"
      @close="showDeleteModal = false"
    >
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Confirmar Eliminación
        </h3>
        <p class="text-sm text-gray-500 mb-6">
          ¿Estás seguro de que deseas eliminar el grupo de muestreo 
          <strong>{{ grupoToDelete?.tamano_lote_desde }}-{{ grupoToDelete?.nivel_inspeccion }}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showDeleteModal = false">
            Cancelar
          </BaseButton>
          <BaseButton color="danger" @click="deleteGrupo">
            Eliminar
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import type { GrupoMuestreo, GrupoMuestreoWithDetails, EstadisticasMuestreo } from '~/types'

// Components are auto-imported by Nuxt
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseTable from '~/components/ui/BaseTable.vue'
// Components are auto-imported by Nuxt
import GrupoMuestreoCreateModal from '~/components/muestreo/GrupoMuestreoCreateModal.vue'
import GrupoMuestreoEditModal from '~/components/muestreo/GrupoMuestreoEditModal.vue'
import GrupoMuestreoViewModal from '~/components/muestreo/GrupoMuestreoViewModal.vue'
import GrupoMuestreoRelacionesModal from '~/components/muestreo/GrupoMuestreoRelacionesModal.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const muestreoAPI = useMuestreoAPI()
const { debounce } = useDebounce()
const { user } = useAuth()

// Reactive data
const grupos = ref<GrupoMuestreoWithDetails[]>([])
const stats = ref<EstadisticasMuestreo | null>(null)
const loading = ref(false)
const searchTerm = ref('')
const selectedNivel = ref('')
const selectedTipo = ref('')
const tamanoLoteFiltro = ref<number | undefined>()
const currentPage = ref(1)
const totalGrupos = ref(0)
const totalPages = ref(0)
const pageSize = 20

// Modals
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const showRelacionesModal = ref(false)
const showDeleteModal = ref(false)
const selectedGrupo = ref<GrupoMuestreoWithDetails | null>(null)
const grupoToDelete = ref<GrupoMuestreo | null>(null)

// Computed
const canManageGrupos = computed(() => {
  return user.value?.user_role === 'Admin' || user.value?.user_role === 'Supervisor'
})

const nivelesUnicos = computed(() => {
  const niveles = new Set(grupos.value.map(g => g.nivel_inspeccion))
  return Array.from(niveles).sort()
})

const tiposUnicos = computed(() => {
  const tipos = new Set(
    grupos.value
      .map(g => g.tipo_de_inspeccion)
      .filter(Boolean)
  )
  return Array.from(tipos).sort()
})

// Table configuration
const tableHeaders = [
  { key: 'rango_lote', label: 'Rango de Lote' },
  { key: 'nivel_inspeccion', label: 'Nivel Inspección' },
  { key: 'tipo_de_inspeccion', label: 'Tipo Inspección' },
  { key: 'codigo_plan_muestreo', label: 'Plan Recomendado' },
  { key: 'actions', label: 'Acciones' }
]

// Methods
const fetchGrupos = async () => {
  loading.value = true
  try {
    const filters = {
      search: searchTerm.value,
      nivel_inspeccion: selectedNivel.value,
      tipo_de_inspeccion: selectedTipo.value,
      lote_size: tamanoLoteFiltro.value
    }

    const response = await muestreoAPI.getGruposMuestreo(
      filters,
      currentPage.value,
      pageSize
    )
    
    grupos.value = response.data
    totalGrupos.value = response.total
    totalPages.value = response.total_pages
  } catch (error) {
    // Error fetching grupos
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    stats.value = await muestreoAPI.getEstadisticasMuestreo()
  } catch (error) {
    // Error fetching stats
  }
}

const viewGrupo = (grupo: GrupoMuestreo) => {
  selectedGrupo.value = grupo
  showViewModal.value = true
}

const editGrupo = (grupo: GrupoMuestreo) => {
  selectedGrupo.value = grupo
  showEditModal.value = true
}

const gestionarPlanes = (grupo: GrupoMuestreo) => {
  selectedGrupo.value = grupo
  showRelacionesModal.value = true
}

const confirmDeleteGrupo = (grupo: GrupoMuestreo) => {
  grupoToDelete.value = grupo
  showDeleteModal.value = true
}

const deleteGrupo = async () => {
  if (!grupoToDelete.value) return

  try {
    await muestreoAPI.deleteGrupoMuestreo(
      grupoToDelete.value.tamano_lote_desde,
      grupoToDelete.value.nivel_inspeccion
    )
    showDeleteModal.value = false
    grupoToDelete.value = null
    await Promise.all([fetchGrupos(), fetchStats()])
  } catch (error) {
    // Error deleting grupo
  }
}

const handleGrupoCreated = async () => {
  showCreateModal.value = false
  await Promise.all([fetchGrupos(), fetchStats()])
}

const handleGrupoUpdated = async () => {
  showEditModal.value = false
  selectedGrupo.value = null
  await Promise.all([fetchGrupos(), fetchStats()])
}

const handleRelacionesUpdated = async () => {
  // Refrescar la vista de grupos para mostrar cambios en las relaciones
  await fetchGrupos()
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchGrupos()
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchGrupos()
  }
}

const debouncedSearch = debounce(fetchGrupos, 300)

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchGrupos(), fetchStats()])
})

// Watchers
watch([selectedNivel, selectedTipo], () => {
  currentPage.value = 1
})
</script>