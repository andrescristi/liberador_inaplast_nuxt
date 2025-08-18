<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <Icon name="bx:bxs-pie-chart-alt-2" class="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 sm:text-4xl">
          Sistema de Muestreo
        </h1>
        <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Gestiona planes de muestreo, grupos de inspección y criterios de calidad 
          para garantizar la excelencia en tus productos
        </p>
      </div>


      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <!-- Grupos de Muestreo -->
        <BaseCard class="hover:shadow-lg transition-shadow duration-200">
          <div class="p-8">
            <div class="flex items-center mb-6">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon name="bx:group" class="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-xl font-semibold text-gray-900">Grupos de Muestreo</h3>
                <p class="text-gray-600">Gestiona rangos de lotes y niveles de inspección</p>
              </div>
            </div>
            <div class="space-y-3 mb-6">
              <div class="flex items-center text-sm text-gray-600">
                <Icon name="bx:check" class="w-4 h-4 mr-2 text-green-500" />
                Configurar rangos de tamaño de lote
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <Icon name="bx:check" class="w-4 h-4 mr-2 text-green-500" />
                Definir niveles de inspección
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <Icon name="bx:check" class="w-4 h-4 mr-2 text-green-500" />
                Asignar planes de muestreo
              </div>
            </div>
            <NuxtLink to="/muestreo/grupos">
              <BaseButton variant="solid" color="primary" class="w-full">
                Gestionar Grupos
              </BaseButton>
            </NuxtLink>
          </div>
        </BaseCard>

        <!-- Planes de Muestreo -->
        <BaseCard class="hover:shadow-lg transition-shadow duration-200">
          <div class="p-8">
            <div class="flex items-center mb-6">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="bx:clipboard-check" class="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-xl font-semibold text-gray-900">Planes de Muestreo</h3>
                <p class="text-gray-600">Define criterios y códigos de muestreo</p>
              </div>
            </div>
            <div class="space-y-3 mb-6">
              <div class="flex items-center text-sm text-gray-600">
                <Icon name="bx:check" class="w-4 h-4 mr-2 text-green-500" />
                Crear códigos de plan
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <Icon name="bx:check" class="w-4 h-4 mr-2 text-green-500" />
                Establecer niveles AQL
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <Icon name="bx:check" class="w-4 h-4 mr-2 text-green-500" />
                Definir tamaños de muestra
              </div>
            </div>
            <NuxtLink to="/muestreo/planes">
              <BaseButton variant="outline" color="primary" class="w-full">
                Gestionar Planes
              </BaseButton>
            </NuxtLink>
          </div>
        </BaseCard>
      </div>

      <!-- Recent Activity -->
      <BaseCard v-if="canManageMuestreo">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Icon name="bx:time-five" class="w-6 h-6 mr-2 text-gray-500" />
            Acciones Rápidas
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <BaseButton
              variant="outline"
              color="gray"
              class="justify-start"
              leading-icon="bx:plus"
              @click="() => navigateTo('/muestreo/grupos')"
            >
              Nuevo Grupo
            </BaseButton>
            <BaseButton
              variant="outline"
              color="gray"
              class="justify-start"
              leading-icon="bx:plus"
              @click="() => navigateTo('/muestreo/planes')"
            >
              Nuevo Plan
            </BaseButton>
            <BaseButton
              variant="outline"
              color="gray"
              class="justify-start"
              leading-icon="bx:search-alt"
              @click="() => navigateTo('/muestreo/grupos')"
            >
              Buscar Grupos
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EstadisticasMuestreo } from '~/types'

// Import components explicitly
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const muestreoAPI = useMuestreoAPI()
const { user } = useAuth()

// Reactive data
const stats = ref<EstadisticasMuestreo | null>(null)

// Computed
const canManageMuestreo = computed(() => {
  return user.value?.user_role === 'Admin' || user.value?.user_role === 'Supervisor'
})

// Methods
const fetchStats = async () => {
  try {
    stats.value = await muestreoAPI.getEstadisticasMuestreo()
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

// Lifecycle
onMounted(() => {
  fetchStats()
})
</script>