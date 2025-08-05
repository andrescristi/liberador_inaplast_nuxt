<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <AppNavigation />

    <!-- Page Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-2 text-gray-600">
          Bienvenido a tu panel de control. Aquí puedes ver un resumen de tu actividad.
        </p>
      </div>

      <!-- Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <UiBaseCard class="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ClockIcon class="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div class="ml-4">
              <dt class="text-sm font-medium text-yellow-800">Pending Orders</dt>
              <dd class="text-2xl font-bold text-yellow-900">{{ metrics.pending }}</dd>
            </div>
          </div>
        </UiBaseCard>

        <UiBaseCard class="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon class="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div class="ml-4">
              <dt class="text-sm font-medium text-green-800">Completed Orders</dt>
              <dd class="text-2xl font-bold text-green-900">{{ metrics.completed }}</dd>
            </div>
          </div>
        </UiBaseCard>

        <UiBaseCard class="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon class="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div class="ml-4">
              <dt class="text-sm font-medium text-indigo-800">Total Revenue</dt>
              <dd class="text-2xl font-bold text-indigo-900">${{ metrics.revenue }}</dd>
            </div>
          </div>
        </UiBaseCard>

        <UiBaseCard class="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UsersIcon class="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div class="ml-4">
              <dt class="text-sm font-medium text-purple-800">Total Customers</dt>
              <dd class="text-2xl font-bold text-purple-900">{{ metrics.customers }}</dd>
            </div>
          </div>
        </UiBaseCard>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <UiBaseCard 
          class="group hover:shadow-md transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-indigo-200"
          hover
          @click="navigateTo('/orders/new')"
        >
          <div class="text-center">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
              <PlusIcon class="w-6 h-6 text-indigo-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">New Order</h3>
            <p class="text-gray-600">Create a new order for a customer</p>
          </div>
        </UiBaseCard>

        <UiBaseCard 
          class="group hover:shadow-md transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-green-200"
          hover
          @click="navigateTo('/customers/new')"
        >
          <div class="text-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <UserPlusIcon class="w-6 h-6 text-green-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Add Customer</h3>
            <p class="text-gray-600">Register a new customer</p>
          </div>
        </UiBaseCard>

        <UiBaseCard 
          class="group hover:shadow-md transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-purple-200"
          hover
          @click="navigateTo('/products/new')"
        >
          <div class="text-center">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <CubeIcon class="w-6 h-6 text-purple-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Add Product</h3>
            <p class="text-gray-600">Add a new product to inventory</p>
          </div>
        </UiBaseCard>
      </div>

      <!-- Recent Orders -->
      <UiBaseCard padding="none">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <UiBaseButton 
              :to="'/orders'" 
              variant="ghost" 
              color="gray"
              :trailing-icon="ArrowRightIcon"
            >
              View all orders
            </UiBaseButton>
          </div>
        </template>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-8 h-8 mb-4">
              <ArrowPathIcon class="w-6 h-6 text-indigo-600 animate-spin" />
            </div>
            <p class="text-gray-600">Loading orders...</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="recentOrders.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <InboxIcon class="w-8 h-8 text-gray-400" />
          </div>
          <h4 class="text-lg font-semibold text-gray-900 mb-2">No orders yet</h4>
          <p class="text-gray-600 mb-6">Get started by creating your first order</p>
          <UiBaseButton 
            :to="'/orders/new'" 
            :leading-icon="PlusIcon"
            size="lg"
          >
            Create Order
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
  </div>
</template>

<script setup lang="ts">
import {
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  UsersIcon,
  PlusIcon,
  UserPlusIcon,
  CubeIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  InboxIcon
} from '@heroicons/vue/24/outline'
import AppNavigation from '~/components/core/AppNavigation.vue'

// Composables
const supabase = useSupabaseClient()
const toast = useToast()

// Reactive data
const loading = ref(true)
const metrics = ref({
  pending: 0,
  completed: 0,
  revenue: 0,
  customers: 0
})
const recentOrders = ref<any[]>([])

// Table configuration
const tableColumns = [
  { key: 'order', label: 'Order' },
  { key: 'customer', label: 'Customer' },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount' },
  { key: 'date', label: 'Date' }
]

// Fetch data on mount
onMounted(async () => {
  await loadDashboardData()
})

async function loadDashboardData() {
  try {
    loading.value = true

    // Fetch metrics in parallel
    const [ordersData, customersData] = await Promise.all([
      supabase.from('orders').select('status, total_amount'),
      supabase.from('customers').select('id')
    ])

    // Calculate metrics
    if (ordersData.data) {
      const orders = ordersData.data as any[]
      metrics.value.pending = orders.filter(o => o.status === 'pending').length
      metrics.value.completed = orders.filter(o => o.status === 'completed').length
      metrics.value.revenue = parseFloat(orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + parseFloat(o.total_amount), 0)
        .toFixed(2))
    }

    if (customersData.data) {
      metrics.value.customers = customersData.data.length
    }

    // Fetch recent orders
    const { data: orders } = await supabase
      .from('orders')
      .select(`
        *,
        customers(name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    recentOrders.value = orders || []

  } catch (error) {
    console.error('Error loading dashboard data:', error)
    
    toast.error('Error', 'Failed to load dashboard data')
  } finally {
    loading.value = false
  }
}

// Helper functions
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
  return new Date(dateString).toLocaleDateString()
}

function onOrderClick(row: any) {
  navigateTo(`/orders/${row.id}`)
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