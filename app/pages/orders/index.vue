<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Encabezado -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Órdenes de Inspección</h1>
        <p class="mt-2 text-sm text-gray-700">
          Gestiona y monitorea todas las órdenes de inspección de calidad
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/orders/new"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Icon name="bx:plus" class="w-4 h-4 mr-2" />
          Nueva Orden
        </NuxtLink>
      </div>
    </div>

    <!-- Estadísticas rápidas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Icon name="bx:list-ul" class="w-6 h-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.total }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Icon name="bx:check-circle" class="w-6 h-6 text-green-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Aprobadas</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.approved }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Icon name="bx:x-circle" class="w-6 h-6 text-red-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Rechazadas</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.rejected }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Icon name="bx:calendar" class="w-6 h-6 text-blue-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Este mes</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.thisMonth }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="bg-white shadow rounded-lg p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Búsqueda -->
        <div class="lg:col-span-2">
          <label for="search" class="block text-sm font-medium text-gray-700">Buscar</label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="bx:search" class="w-4 h-4 text-gray-400" />
            </div>
            <input
              id="search"
              v-model="filters.search"
              type="text"
              class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Buscar por ID, cliente, producto..."
              @input="debouncedSearch"
            />
          </div>
        </div>

        <!-- Estado -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700">Estado</label>
          <select
            id="status"
            v-model="filters.status"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            @change="fetchOrders"
          >
            <option value="">Todos los estados</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>

        <!-- Rango de fechas -->
        <div>
          <label for="dateRange" class="block text-sm font-medium text-gray-700">Período</label>
          <select
            id="dateRange"
            v-model="selectedDateRange"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            @change="handleDateRangeChange"
          >
            <option value="">Todo el tiempo</option>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="quarter">Este trimestre</option>
          </select>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div class="flex items-center space-x-3">
          <button
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="clearFilters"
          >
            <Icon name="bx:x" class="w-4 h-4 mr-2" />
            Limpiar filtros
          </button>
          <button
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="exportToExcel"
          >
            <Icon name="bx:download" class="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
        <div class="flex items-center space-x-2 text-sm text-gray-500">
          <span>{{ pagination.total }} orden{{ pagination.total !== 1 ? 'es' : '' }}</span>
          <button
            class="p-1 rounded hover:bg-gray-100"
            @click="fetchOrders"
            :disabled="loading"
          >
            <Icon name="bx:refresh" class="w-4 h-4" :class="{ 'animate-spin': loading }" />
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla de órdenes -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <!-- Loading State -->
      <div v-if="loading" class="p-6">
        <div class="animate-pulse space-y-4">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="space-y-2">
            <div class="h-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            <div class="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!orders.length" class="text-center py-12">
        <Icon name="bx:file-blank" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron órdenes</h3>
        <p class="text-gray-600 mb-6">
          {{ hasActiveFilters ? 'Intenta ajustar tus filtros de búsqueda' : 'Comienza creando tu primera orden de inspección' }}
        </p>
        <NuxtLink
          to="/orders/new"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Icon name="bx:plus" class="w-4 h-4 mr-2" />
          Nueva Orden
        </NuxtLink>
      </div>

      <!-- Tabla -->
      <ul v-else class="divide-y divide-gray-200">
        <li v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
          <div class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <div 
                    class="w-3 h-3 rounded-full"
                    :class="order.status === 'Aprobado' ? 'bg-green-400' : 'bg-red-400'"
                  ></div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3">
                    <p class="text-sm font-medium text-blue-600 truncate">
                      <NuxtLink :to="`/orders/${order.id}`" class="hover:underline">
                        Orden #{{ order.id.slice(0, 8) }}
                      </NuxtLink>
                    </p>
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="order.status === 'Aprobado' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'"
                    >
                      {{ order.status }}
                    </span>
                  </div>
                  <div class="mt-1">
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div class="flex items-center">
                        <Icon name="bx:user" class="w-4 h-4 mr-1 text-gray-400" />
                        {{ order.cliente }}
                      </div>
                      <div class="flex items-center">
                        <Icon name="bx:package" class="w-4 h-4 mr-1 text-gray-400" />
                        {{ order.producto }}
                      </div>
                      <div class="flex items-center">
                        <Icon name="bx:barcode" class="w-4 h-4 mr-1 text-gray-400" />
                        {{ order.codigo_producto }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">{{ formatDate(order.created_at) }}</p>
                  <p class="text-sm text-gray-500">{{ order.turno }} - {{ order.maquina }}</p>
                </div>
                <div class="flex-shrink-0">
                  <button
                    class="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    @click="navigateTo(`/orders/${order.id}`)"
                  >
                    <Icon name="bx:chevron-right" class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>

      <!-- Paginación -->
      <div v-if="pagination.totalPages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              :disabled="!pagination.hasPreviousPage"
              @click="changePage(pagination.page - 1)"
            >
              Anterior
            </button>
            <button
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              :disabled="!pagination.hasNextPage"
              @click="changePage(pagination.page + 1)"
            >
              Siguiente
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando
                <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
                a
                <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
                de
                <span class="font-medium">{{ pagination.total }}</span>
                resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :disabled="!pagination.hasPreviousPage"
                  @click="changePage(pagination.page - 1)"
                >
                  <Icon name="bx:chevron-left" class="w-5 h-5" />
                </button>
                
                <template v-for="page in visiblePages" :key="page">
                  <button
                    v-if="page === '...'"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </button>
                  <button
                    v-else
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium"
                    :class="page === pagination.page 
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                      : 'bg-white text-gray-500 hover:bg-gray-50'"
                    @click="changePage(page)"
                  >
                    {{ page }}
                  </button>
                </template>
                
                <button
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  :disabled="!pagination.hasNextPage"
                  @click="changePage(pagination.page + 1)"
                >
                  <Icon name="bx:chevron-right" class="w-5 h-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order, OrderFilters, PaginatedResponse } from '~/types/orders'

// Estado reactivo
const orders = ref<Order[]>([])
const loading = ref(true)
const filters = ref<OrderFilters>({
  status: undefined,
  search: ''
})
const selectedDateRange = ref('')
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false
})

// Estadísticas
const stats = ref({
  total: 0,
  approved: 0,
  rejected: 0,
  thisMonth: 0
})

// Computadas
const hasActiveFilters = computed(() => {
  return filters.value.status || filters.value.search || selectedDateRange.value
})

const visiblePages = computed(() => {
  const current = pagination.value.page
  const total = pagination.value.totalPages
  const pages: (number | string)[] = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    
    if (current > 4) {
      pages.push('...')
    }
    
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    if (current < total - 3) {
      pages.push('...')
    }
    
    if (total > 1) {
      pages.push(total)
    }
  }
  
  return pages
})

// Funciones principales
const fetchOrders = async () => {
  loading.value = true
  
  try {
    const queryParams = new URLSearchParams({
      page: pagination.value.page.toString(),
      limit: pagination.value.limit.toString()
    })
    
    if (filters.value.status) {
      queryParams.append('status', filters.value.status)
    }
    
    if (filters.value.search) {
      queryParams.append('search', filters.value.search)
    }
    
    const response = await $fetch<PaginatedResponse<Order>>(`/api/orders?${queryParams}`)
    
    orders.value = response?.data || []
    pagination.value = response?.pagination || {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false
    }
    
    // Calcular estadísticas
    await calculateStats()
    
  } catch (error) {
    console.error('Error fetching orders:', error)
    // TODO: Mostrar toast de error
  } finally {
    loading.value = false
  }
}

const calculateStats = async () => {
  try {
    // Obtener todas las órdenes para estadísticas (sin paginación)
    const response = await $fetch<PaginatedResponse<Order>>('/api/orders?limit=1000')
    const allOrders = response?.data || []
    
    stats.value.total = allOrders.length
    stats.value.approved = allOrders.filter(order => order.status === 'Aprobado').length
    stats.value.rejected = allOrders.filter(order => order.status === 'Rechazado').length
    
    // Calcular órdenes de este mes
    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)
    
    stats.value.thisMonth = allOrders.filter(order => 
      new Date(order.created_at) >= thisMonth
    ).length
    
  } catch (error) {
    console.error('Error calculating stats:', error)
    // Establecer valores por defecto en caso de error
    stats.value = {
      total: 0,
      approved: 0,
      rejected: 0,
      thisMonth: 0
    }
  }
}

const changePage = (page: number) => {
  pagination.value.page = page
  fetchOrders()
}

const clearFilters = () => {
  filters.value = {
    status: undefined,
    search: ''
  }
  selectedDateRange.value = ''
  pagination.value.page = 1
  fetchOrders()
}

const handleDateRangeChange = () => {
  const range = selectedDateRange.value
  const now = new Date()
  
  if (!range) {
    filters.value.dateFrom = undefined
    filters.value.dateTo = undefined
  } else {
    switch (range) {
      case 'today':
        filters.value.dateFrom = new Date(now.setHours(0, 0, 0, 0)).toISOString()
        filters.value.dateTo = new Date(now.setHours(23, 59, 59, 999)).toISOString()
        break
      case 'week':
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        weekStart.setHours(0, 0, 0, 0)
        filters.value.dateFrom = weekStart.toISOString()
        filters.value.dateTo = new Date().toISOString()
        break
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        filters.value.dateFrom = monthStart.toISOString()
        filters.value.dateTo = new Date().toISOString()
        break
      case 'quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
        filters.value.dateFrom = quarterStart.toISOString()
        filters.value.dateTo = new Date().toISOString()
        break
    }
  }
  
  pagination.value.page = 1
  fetchOrders()
}

const exportToExcel = () => {
  // TODO: Implementar exportación a Excel
  alert('Funcionalidad de exportación en desarrollo')
}

// Utilidades
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Debounced search
let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    fetchOrders()
  }, 500)
}

// Ciclo de vida
onMounted(() => {
  fetchOrders()
})

// Meta tags
useSeoMeta({
  title: 'Órdenes de Inspección - Sistema Inaplast',
  description: 'Lista completa de órdenes de inspección de calidad con filtros y búsqueda avanzada.'
})

// Middleware de autenticación
definePageMeta({
  middleware: 'auth'
})
</script>