<template>
  <div>
    <div class="@container">
      <!-- Page Header -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
          Bienvenido a tu panel de control. Aquí puedes ver un resumen de tu actividad.
        </p>
      </div>

      <!-- Metrics Cards - Mobile-First Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <UiBaseCard class="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ClockIcon class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
            </div>
            <div class="ml-3 sm:ml-4">
              <dt class="text-xs sm:text-sm font-medium text-yellow-800">Pending Orders</dt>
              <dd class="text-xl sm:text-2xl font-bold text-yellow-900">{{ metrics.pending }}</dd>
            </div>
          </div>
        </UiBaseCard>

        <UiBaseCard class="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
            <div class="ml-3 sm:ml-4">
              <dt class="text-xs sm:text-sm font-medium text-green-800">Completed Orders</dt>
              <dd class="text-xl sm:text-2xl font-bold text-green-900">{{ metrics.completed }}</dd>
            </div>
          </div>
        </UiBaseCard>

        <UiBaseCard class="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon class="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
              </div>
            </div>
            <div class="ml-3 sm:ml-4">
              <dt class="text-xs sm:text-sm font-medium text-indigo-800">Total Revenue</dt>
              <dd class="text-xl sm:text-2xl font-bold text-indigo-900">${{ metrics.revenue }}</dd>
            </div>
          </div>
        </UiBaseCard>

        <UiBaseCard class="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UsersIcon class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
            <div class="ml-3 sm:ml-4">
              <dt class="text-xs sm:text-sm font-medium text-purple-800">Total Customers</dt>
              <dd class="text-xl sm:text-2xl font-bold text-purple-900">{{ metrics.customers }}</dd>
            </div>
          </div>
        </UiBaseCard>
      </div>

      <!-- Quick Actions - Mobile-First Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <UiBaseCard 
          class="group hover:shadow-md transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-indigo-200 active:scale-95"
          hover
          @click="navigateTo('/orders/new')"
        >
          <div class="text-center py-2">
            <div class="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-indigo-200 transition-colors">
              <PlusIcon class="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" />
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
              <ClockIcon class="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" />
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
              :trailing-icon="ArrowRightIcon"
            >
              Ir a historial
            </UiBaseButton>
          </div>
        </template>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-8 h-8 mb-4">
              <ArrowPathIcon class="w-6 h-6 text-indigo-600 animate-spin" />
            </div>
            <p class="text-gray-600">Cargando liberaciones...</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="recentOrders.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <InboxIcon class="w-8 h-8 text-gray-400" />
          </div>
          <h4 class="text-lg font-semibold text-gray-900 mb-2">Aún no hay liberaciones</h4>
          <p class="text-gray-600 mb-6">Parte creando tu primera liberación</p>
          <UiBaseButton 
            :to="'/orders/new'" 
            :leading-icon="PlusIcon"
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
                #{{ row.id.slice(0, 8) }}
              </div>
            </template>

            <template #customer-data="{ row }">
              <div class="text-gray-700">
                {{ row.customers?.name || 'Unknown' }}
              </div>
            </template>

            <template #status-data="{ row }">
              <UiBaseBadge 
                :color="getStatusColor(row.status)"
                variant="soft"
                class="capitalize"
              >
                {{ row.status }}
              </UiBaseBadge>
            </template>

            <template #amount-data="{ row }">
              <div class="font-medium text-gray-900">
                ${{ row.total_amount.toFixed(2) }}
              </div>
            </template>

            <template #date-data="{ row }">
              <div class="text-gray-600">
                {{ formatDate(row.order_date) }}
              </div>
            </template>
          </UiBaseTable>
        </div>
      </UiBaseCard>
    </div>
    
    <!-- Confetti Component -->
    <FeedbackConfettiCelebration ref="confettiRef" />
  </div>
</template>

<script setup lang="ts">
import {
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  UsersIcon,
  PlusIcon,
  // UserPlusIcon,
  // CubeIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  InboxIcon
} from '@heroicons/vue/24/outline'

// Composables
const _supabase = useSupabaseClient()
const toast = useToast()

// Reactive data
const loading = ref(true)
const _userName = ref('Usuario') // This should come from auth
const currentDayDate = ref('')
const metrics = ref({
  pending: 25,
  completed: 120,
  revenue: 15000,
  customers: 45
})

const _activityChart = ref([
  { date: '22/07/25', total: 45, accepted: 40, rejected: 5, acceptedPercentage: 89, rejectedPercentage: 11 },
  { date: '21/07/25', total: 42, accepted: 38, rejected: 4, acceptedPercentage: 90, rejectedPercentage: 10 },
  { date: '20/07/25', total: 43, accepted: 42, rejected: 1, acceptedPercentage: 98, rejectedPercentage: 2 }
])
const recentOrders = ref([])
const tableColumns = ref([
  { key: 'order', label: 'Order' },
  { key: 'customer', label: 'Customer' },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount' },
  { key: 'date', label: 'Date' }
])
const _recentInspections = ref([
  {
    id: 1,
    product_name: 'Envases 25 Lts',
    status: 'approved',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    product_name: 'Envases 1LT',
    status: 'rejected',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    product_name: 'Envases 2LT',
    status: 'approved',
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    product_name: 'Envases 3 LT',
    status: 'approved',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
])

// Initialize current date
function initializeDate() {
  const now = new Date()
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  
  const dayName = days[now.getDay()]
  const day = now.getDate()
  const month = months[now.getMonth()]
  const year = now.getFullYear()
  
  currentDayDate.value = `${dayName}, ${day} de ${month} de ${year}`
}

// Fetch data on mount
onMounted(async () => {
  initializeDate()
  await loadDashboardData()
})

async function loadDashboardData() {
  try {
    loading.value = true

    // For now, we'll use mock data
    // In the future, fetch real data from Supabase
    
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000))

  } catch (error) {
    console.error('Error loading dashboard data:', error)
    
    toast.error('Error', 'Failed to load dashboard data')
  } finally {
    loading.value = false
  }
}

// Helper functions
function _getInspectionStatusColor(status: string): 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink' {
  const colors: Record<string, 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink'> = {
    approved: 'green',
    rejected: 'red',
    pending: 'yellow'
  }
  return colors[status] || 'gray'
}

function _getInspectionStatusText(status: string): string {
  const texts: Record<string, string> = {
    approved: 'Aprobado',
    rejected: 'Rechazado',
    pending: 'Pendiente'
  }
  return texts[status] || status
}

function getStatusColor(status: string): 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink' {
  const colors: Record<string, 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink'> = {
    pending: 'yellow',
    processing: 'blue',
    completed: 'green',
    cancelled: 'red'
  }
  return colors[status] || 'gray'
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES')
}

function onOrderClick(row: Record<string, unknown>) {
  if (row.id && typeof row.id === 'string') {
    navigateTo(`/orders/${row.id}`)
  }
}

function _formatInspectionDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    return `Hace ${diffInMinutes} minutos`
  } else if (diffInHours < 24) {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
    return `Hoy, ${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  } else if (diffInHours < 48) {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
    return `Ayer, ${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  } else {
    return date.toLocaleDateString('es-ES')
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

<style scoped>
/* Metric Cards Animation */
.metric-card-wrapper {
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
  animation-delay: calc(var(--card-index) * 0.1s);
}

.metric-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.metric-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.metric-card:active {
  transform: translateY(-2px) scale(0.98);
}

.metric-icon-wrapper {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.metric-card:hover .metric-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.metric-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.metric-card:hover .metric-icon {
  transform: scale(1.1);
}

.metric-value {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.metric-card:hover .metric-value {
  transform: scale(1.05);
}

/* Metric card click celebration */
.metric-card:active .metric-icon-wrapper {
  animation: celebrationBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Quick Action Cards Enhancement */
.quick-action-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.quick-action-card:hover {
  transform: translateY(-2px);
}

.quick-action-card:active {
  transform: translateY(0) scale(0.95);
}

/* Page Content Animation */
.page-content {
  animation: fadeInUp 0.8s ease-out;
}

/* Animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes celebrationBounce {
  0% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.2) rotate(5deg);
  }
  50% {
    transform: scale(1.1) rotate(-3deg);
  }
  75% {
    transform: scale(1.15) rotate(2deg);
  }
  100% {
    transform: scale(1.1) rotate(5deg);
  }
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .metric-card:hover {
    transform: none;
  }
  
  .metric-card:active {
    transform: scale(0.95);
  }
  
  .metric-card:hover .metric-icon-wrapper,
  .metric-card:hover .metric-icon,
  .metric-card:hover .metric-value {
    transform: none;
  }
}

/* Accessibility: Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .metric-card-wrapper,
  .page-content {
    animation: none;
  }
  
  .metric-card,
  .metric-icon-wrapper,
  .metric-icon,
  .metric-value,
  .quick-action-card {
    transition: none;
  }
  
  .metric-card:hover,
  .metric-card:active,
  .quick-action-card:hover,
  .quick-action-card:active {
    transform: none;
  }
  
  .metric-card:active .metric-icon-wrapper {
    animation: none;
  }
}
</style>