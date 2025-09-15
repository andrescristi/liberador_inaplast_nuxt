<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between mb-8">
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Planes de Muestreo
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            Gestiona los planes de muestreo estadístico para control de calidad
          </p>
        </div>
        <div v-if="canManagePlanes" class="mt-4 flex md:mt-0 md:ml-4">
          <BaseButton 
            color="primary" 
            variant="solid" 
            size="md"
            leading-icon="bx:plus"
            @click="showCreateModal = true"
          >
            Nuevo Plan
          </BaseButton>
        </div>
      </div>

      <!-- Stats Cards -->
      <div v-if="stats" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Icon name="bx:clipboard-check" class="h-6 w-6 text-blue-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total Planes
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.total_planes }}
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
                <Icon name="bx:target-lock" class="h-6 w-6 text-green-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Niveles AQL
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ Object.keys(stats.planes_por_aql || {}).length }}
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
                    Relaciones
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.total_relaciones }}
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
                <Icon name="bx:group" class="h-6 w-6 text-purple-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Grupos
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.total_grupos }}
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
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div class="sm:col-span-2">
              <BaseInput
                v-model="searchTerm"
                placeholder="Buscar por código o AQL..."
                @input="debouncedSearch"
              >
                <template #prepend>
                  <Icon name="bx:search" class="w-5 h-5 text-gray-400" />
                </template>
              </BaseInput>
            </div>
            <div>
              <select
                v-model="selectedCodigo"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                @change="fetchPlanes"
              >
                <option value="">Todos los códigos</option>
                <option
v-for="codigo in codigosUnicos"
:key="codigo"
:value="codigo">
                  {{ codigo }}
                </option>
              </select>
            </div>
            <div>
              <select
                v-model="selectedAQL"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                @change="fetchPlanes"
              >
                <option value="">Todos los AQL</option>
                <option
v-for="aql in aqlsUnicos"
:key="aql"
:value="aql">
                  {{ aql }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Planes Table -->
      <BaseCard>
        <div class="px-4 py-5 sm:p-6">
          <BaseTable
            :columns="tableHeaders"
            :rows="planes"
            :loading="loading"
          >
            <template #codigo-data="{ row }">
              <BaseBadge color="blue" variant="outline">
                {{ (row as PlanDeMuestreo).codigo }}
              </BaseBadge>
            </template>
            <template #aql-data="{ row }">
              <span class="font-medium text-green-600">
                {{ (row as PlanDeMuestreo).aql }}
              </span>
            </template>
            <template #tamano_muestra-data="{ row }">
              <span class="font-mono text-sm">
                {{ (row as PlanDeMuestreo).tamano_muestra || 'N/A' }}
              </span>
            </template>
            <template #numero_maximo_fallas-data="{ row }">
              <span class="font-mono text-sm text-red-600">
                {{ (row as PlanDeMuestreo).numero_maximo_fallas ?? 'N/A' }}
              </span>
            </template>
            <template #actions-data="{ row }">
              <div class="flex space-x-2">
                <button
                  class="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  @click="viewPlan(row as PlanDeMuestreo)"
                >
                  Ver
                </button>
                <button
                  v-if="canManagePlanes"
                  class="text-yellow-600 hover:text-yellow-900 text-sm font-medium"
                  @click="editPlan(row as PlanDeMuestreo)"
                >
                  Editar
                </button>
                <button
                  v-if="canManagePlanes"
                  class="text-red-600 hover:text-red-900 text-sm font-medium"
                  @click="confirmDeletePlan(row as PlanDeMuestreo)"
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
          Mostrando {{ ((currentPage - 1) * pageSize) + 1 }} a {{ Math.min(currentPage * pageSize, totalPlanes) }} de {{ totalPlanes }} planes
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

    <!-- Create Plan Modal -->
    <PlanMuestreoCreateModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handlePlanCreated"
    />

    <!-- Edit Plan Modal -->
    <PlanMuestreoEditModal
      v-if="showEditModal && selectedPlan"
      :plan="selectedPlan"
      @close="showEditModal = false"
      @updated="handlePlanUpdated"
    />

    <!-- View Plan Modal -->
    <PlanMuestreoViewModal
      v-if="showViewModal && selectedPlan"
      :plan="selectedPlan"
      @close="showViewModal = false"
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
          ¿Estás seguro de que deseas eliminar el plan <strong>{{ planToDelete?.codigo }}-{{ planToDelete?.aql }}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showDeleteModal = false">
            Cancelar
          </BaseButton>
          <BaseButton color="danger" @click="deletePlan">
            Eliminar
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import type { PlanDeMuestreo, PlanMuestreoWithDetails, EstadisticasMuestreo } from '~/types'

// Components are auto-imported by Nuxt
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseTable from '~/components/ui/BaseTable.vue'
// Components are auto-imported by Nuxt
import PlanMuestreoCreateModal from '~/components/muestreo/PlanMuestreoCreateModal.vue'
import PlanMuestreoEditModal from '~/components/muestreo/PlanMuestreoEditModal.vue'
import PlanMuestreoViewModal from '~/components/muestreo/PlanMuestreoViewModal.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const muestreoAPI = useMuestreoAPI()
const _toast = useToast()
const { debounce } = useDebounce()
const { user } = useAuth()

// Reactive data
const planes = ref<PlanMuestreoWithDetails[]>([])
const stats = ref<EstadisticasMuestreo | null>(null)
const loading = ref(false)
const searchTerm = ref('')
const selectedCodigo = ref('')
const selectedAQL = ref('')
const currentPage = ref(1)
const totalPlanes = ref(0)
const totalPages = ref(0)
const pageSize = 20

// Modals
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const showDeleteModal = ref(false)
const selectedPlan = ref<PlanMuestreoWithDetails | null>(null)
const planToDelete = ref<PlanDeMuestreo | null>(null)

// Computed
const canManagePlanes = computed(() => {
  return user.value?.user_role === 'Admin' || user.value?.user_role === 'Supervisor'
})

const codigosUnicos = computed(() => {
  const codigos = new Set(planes.value.map(p => p.codigo))
  return Array.from(codigos).sort()
})

const aqlsUnicos = computed(() => {
  const aqls = new Set(planes.value.map(p => p.aql))
  return Array.from(aqls).sort()
})

// Table configuration
const tableHeaders = [
  { key: 'codigo', label: 'Código' },
  { key: 'aql', label: 'AQL' },
  { key: 'tamano_muestra', label: 'Tamaño Muestra' },
  { key: 'numero_maximo_fallas', label: 'Máx. Fallas' },
  { key: 'actions', label: 'Acciones' }
]

// Methods
const fetchPlanes = async () => {
  loading.value = true
  try {
    const filters = {
      search: searchTerm.value,
      codigo: selectedCodigo.value,
      aql: selectedAQL.value
    }

    const response = await muestreoAPI.getPlanesMuestreo(
      filters,
      currentPage.value,
      pageSize
    )
    
    planes.value = response.data
    totalPlanes.value = response.total
    totalPages.value = response.total_pages
  } catch (error) {
    // Error fetching planes
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

const viewPlan = (plan: PlanDeMuestreo) => {
  selectedPlan.value = plan
  showViewModal.value = true
}

const editPlan = (plan: PlanDeMuestreo) => {
  selectedPlan.value = plan
  showEditModal.value = true
}

const confirmDeletePlan = (plan: PlanDeMuestreo) => {
  planToDelete.value = plan
  showDeleteModal.value = true
}

const deletePlan = async () => {
  if (!planToDelete.value) return

  try {
    await muestreoAPI.deletePlanMuestreo(
      planToDelete.value.codigo,
      planToDelete.value.aql
    )
    showDeleteModal.value = false
    planToDelete.value = null
    await Promise.all([fetchPlanes(), fetchStats()])
  } catch (error) {
    // Error deleting plan
  }
}

const handlePlanCreated = async () => {
  showCreateModal.value = false
  await Promise.all([fetchPlanes(), fetchStats()])
}

const handlePlanUpdated = async () => {
  showEditModal.value = false
  selectedPlan.value = null
  await Promise.all([fetchPlanes(), fetchStats()])
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchPlanes()
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchPlanes()
  }
}

const debouncedSearch = debounce(fetchPlanes, 300)

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchPlanes(), fetchStats()])
})

// Watchers
watch([selectedCodigo, selectedAQL], () => {
  currentPage.value = 1
})
</script>