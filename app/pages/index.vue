<template>
  <!-- 
    Dashboard Principal - Sistema de Liberación Inaplast
    
    Estructura:
    1. Header con título y descripción
    2. Tarjetas de métricas (responsive grid)
    3. Acciones rápidas (Nueva Liberación, Historial)
    4. Tabla de liberaciones recientes con estados
    
    Responsividad:
    - Mobile-first design con contenedor @container
    - Grid adaptativo: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
    - Componentes UI escalables con breakpoints sm/lg
  -->
  <div>
    <div class="@container">
      <!-- Encabezado de página con título contextual -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
          Bienvenido a tu panel de control. Aquí puedes ver un resumen de tu actividad.
        </p>
      </div>

      <!-- 
        Tarjetas de Métricas - Grid Responsive 
        
        Características:
        - 3 métricas principales: Realizadas, Aceptadas, Rechazadas
        - Contenido dinámico basado en rol (shouldShowAllStats)
        - Iconografía consistente con códigos de color
        - Gradientes de fondo para diferenciación visual
      -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <UiBaseCard class="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icon name="bx:objects-horizontal-center" class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
            </div>
            <div class="ml-3 sm:ml-4">
              <dt class="text-xs sm:text-sm font-medium text-yellow-800">
                {{ shouldShowAllStats ? 'Inspecciones Realizadas' : 'Mis Inspecciones Realizadas' }}
              </dt>
              <dd class="text-xl sm:text-2xl font-bold text-yellow-900">{{ metrics.pending }}</dd>
            </div>
          </div>
        </UiBaseCard>

        <UiBaseCard class="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="bx:bxs-check-circle" class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
            <div class="ml-3 sm:ml-4">
              <dt class="text-xs sm:text-sm font-medium text-green-800">
                {{ shouldShowAllStats ? 'Inspecciones Aceptadas' : 'Mis Inspecciones Aceptadas' }}
              </dt>
              <dd class="text-xl sm:text-2xl font-bold text-green-900">{{ metrics.completed }}</dd>
            </div>
          </div>
        </UiBaseCard>

        <UiBaseCard class="bg-gradient-to-br from-red-50 to-blue-50 border-red-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Icon name="bx:bxs-error" class="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
            </div>
            <div class="ml-3 sm:ml-4">
              <dt class="text-xs sm:text-sm font-medium text-red-800">
                {{ shouldShowAllStats ? 'Inspecciones Rechazadas' : 'Mis Inspecciones Rechazadas' }}
              </dt>
              <dd class="text-xl sm:text-2xl font-bold text-red-900">{{ metrics.rejected }}</dd>
            </div>
          </div>
        </UiBaseCard>
      </div>

      <!-- 
        Acciones Rápidas - Navegación Principal
        
        Dos acciones principales del sistema:
        1. Nueva Liberación - Inicia el flujo de 4 pasos
        2. Historial - Navega a la vista completa de liberaciones
        
        Interacciones:
        - Hover effects con transiciones suaves
        - Active states con scaling
        - Iconografía descriptiva
      -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <UiBaseCard 
          class="group hover:shadow-md transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-indigo-200 active:scale-95"
          hover
          @click="navigateTo('/orders/new')"
        >
          <div class="text-center py-2">
            <div class="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-indigo-200 transition-colors">
              <Icon name="bx:bxs-plus-circle" class="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" />
            </div>
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Nueva Liberación</h3>
            <p class="text-sm text-gray-600 leading-tight">Libera nuevos pedidos</p>
          </div>
        </UiBaseCard>

        <UiBaseCard 
          class="group hover:shadow-md transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-indigo-200 active:scale-95"
          hover
          @click="navigateTo('/orders')"
        >
          <div class="text-center py-2">
            <div class="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-indigo-200 transition-colors">
              <Icon name="bx:history" class="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" />
            </div>
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Historial de Liberaciones</h3>
            <p class="text-sm text-gray-600 leading-tight">Ver liberaciones anteriores</p>
          </div>
        </UiBaseCard>

        
      </div>

      <!-- Recent Orders -->
      <UiBaseCard padding="none">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Liberaciones Recientes</h3>
            <UiBaseButton 
              :to="'/orders'" 
              variant="ghost" 
              color="gray"
              trailing-icon="bx:bxs-right-arrow-alt"
            >
              Ir a historial
            </UiBaseButton>
          </div>
        </template>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-8 h-8 mb-4">
              <Icon name="bx:loader-circle" class="w-6 h-6 text-indigo-600 animate-spin" />
            </div>
            <p class="text-gray-600">Cargando liberaciones...</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="recentOrders.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Icon name="bx:bxs-inbox" class="w-8 h-8 text-gray-400" />
          </div>
          <h4 class="text-lg font-semibold text-gray-900 mb-2">Aún no hay liberaciones</h4>
          <p class="text-gray-600 mb-6">Parte creando tu primera liberación</p>
          <UiBaseButton 
            :to="'/orders/new'" 
            leading-icon="bx:bxs-plus-circle"
            size="lg"
          >
            Crear Liberación
          </UiBaseButton>
        </div>

        <!-- Orders Table -->
        <div v-else>
          <UiBaseTable 
            :rows="recentOrders" 
            :columns="tableColumns"
            selectable
            @select="onOrderClick"
          >
            <template #order-data="{ row }">
              <div class="font-medium text-gray-900">
                #{{ (row.id as string).slice(0, 8) }}
              </div>
            </template>

            <template #customer-data="{ row }">
              <div class="text-gray-700">
                {{ (row.customers as any)?.name || 'Unknown' }}
              </div>
            </template>

            <template #status-data="{ row }">
              <UiBaseBadge 
                :color="getStatusColor(row.status as string)"
                variant="soft"
                class="capitalize"
              >
                {{ row.status }}
              </UiBaseBadge>
            </template>

            <template #amount-data="{ row }">
              <div class="font-medium text-gray-900">
                ${{ (row.total_amount as number).toFixed(2) }}
              </div>
            </template>

            <template #date-data="{ row }">
              <div class="text-gray-600">
                {{ formatDate(row.order_date as string) }}
              </div>
            </template>
          </UiBaseTable>
        </div>
      </UiBaseCard>
    </div>
    
  </div>
</template>

<script setup lang="ts">
/**
 * Dashboard principal del sistema de liberación de productos Inaplast
 * 
 * Esta página proporciona una vista general del sistema mostrando:
 * - Métricas diferenciadas por rol de usuario (Inspector vs Admin/Supervisor)  
 * - Acciones rápidas para crear liberaciones y ver historial
 * - Tabla de liberaciones recientes con estados y navegación
 * - Interfaz responsive mobile-first optimizada para tablets y móviles
 * 
 * @route /
 * @access Requiere autenticación (middleware: auth)
 * @author Inaplast Development Team
 * @since v1.0.0
 */

import type { Profile } from '~/types'

// Composables y utilitiesystem/toast
const toast = useToast()
const { getCurrentUserProfile } = useAuthProfile()

// Estado reactivo del componente
/** Perfil del usuario autenticado actual con información de rol */
const userProfile = ref<Profile | null>(null)

// Usar composable para métricas del dashboard con endpoints reales
const {
  metrics,
  loading,
  error: metricsError,
  fetchMetrics
} = useDashboardMetrics()

/** Lista de órdenes recientes para mostrar en la tabla del dashboard */
const recentOrders = ref([])

/** Configuración de columnas para la tabla de órdenes recientes */
const tableColumns = ref([
  { key: 'order', label: 'Order' },
  { key: 'customer', label: 'Customer' },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount' },
  { key: 'date', label: 'Date' }
])

onMounted(async () => {
  await loadDashboardData()
})

/**
 * Carga todos los datos necesarios para el dashboard
 * 
 * Esta función gestiona la carga inicial de datos:
 * - Obtiene el perfil del usuario autenticado
 * - Carga métricas desde endpoint real basándose en el rol del usuario
 * - Maneja estados de error y loading apropiadamente
 * 
 * @async
 * @throws {Error} Si hay problemas de conectividad con la API o Supabase
 */
async function loadDashboardData() {
  try {
    // Obtener perfil del usuario actual para determinar rol y permisos
    userProfile.value = await getCurrentUserProfile()
    
    // Cargar métricas reales desde la API
    await fetchMetrics()

    // Si hay error en las métricas, mostrar notificación
    if (metricsError.value) {
      toast.warning('Datos Parciales', 'Algunas métricas no pudieron cargarse completamente')
    }

  } catch (error) {
    // Manejo de errores durante la carga de datos
    console.error('Error loading dashboard data:', error)
    toast.error('Error', 'Error al cargar los datos del dashboard')
  }
}

/**
 * Computed que determina si el usuario debe ver estadísticas globales
 * 
 * Los usuarios con rol Admin o Supervisor ven métricas globales del sistema,
 * mientras que los Inspectores solo ven sus propias métricas.
 * 
 * @returns {boolean} true para Admin/Supervisor, false para Inspector o usuario no autenticado
 */
const shouldShowAllStats = computed(() => {
  if (!userProfile.value) return false
  return userProfile.value.user_role === 'Admin' || userProfile.value.user_role === 'Supervisor'
})

/**
 * Determina el color apropiado para el badge de estado de una orden
 * 
 * Mapea los diferentes estados de orden a colores específicos para
 * proporcionar feedback visual inmediato del estado.
 * 
 * @param {string} status - Estado de la orden (pending, processing, completed, cancelled)
 * @returns {string} Color del badge según el sistema de diseño
 */
function getStatusColor(status: string): 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink' {
  const colors: Record<string, 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink'> = {
    pending: 'yellow',    // Amarillo para pendientes
    processing: 'blue',   // Azul para en proceso
    completed: 'green',   // Verde para completadas
    cancelled: 'red'      // Rojo para canceladas
  }
  return colors[status] || 'gray' // Gris como fallback
}

/**
 * Formatea una fecha ISO string a formato localizado en español
 * 
 * @param {string} dateString - Fecha en formato ISO string
 * @returns {string} Fecha formateada en formato español (DD/MM/AAAA)
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES')
}

/**
 * Maneja el clic en una fila de la tabla de órdenes
 * 
 * Navega a la página de detalle de la orden seleccionada
 * con validación de tipo segura.
 * 
 * @param {Record<string, unknown>} row - Fila de datos de la tabla
 */
function onOrderClick(row: Record<string, unknown>): void {
  if (row.id && typeof row.id === 'string') {
    navigateTo(`/orders/${row.id}`)
  }
}

// Authentication
definePageMeta({
  middleware: 'auth'
})

// SEO
useSeoMeta({
  title: 'Dashboard - Order Management',
  description: 'View your order management dashboard with key metrics and recent activity.'
})
</script>

