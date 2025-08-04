<template>
  <div>
    <!-- Page Header -->
    <div class="card mb-6 text-center">
      <h1 class="text-3xl font-semibold text-gray-900 mb-2">
        Inaplast Dashboard
      </h1>
      <p class="text-gray-600">
        Welcome back! Here's what's happening with your orders today.
      </p>
    </div>

    <!-- Metrics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="card text-center">
        <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Icon name="lucide:clock" class="w-6 h-6 text-warning" />
        </div>
        <p class="text-sm text-gray-600 mb-1">Pending Orders</p>
        <p class="text-2xl font-semibold text-gray-900">{{ metrics.pending }}</p>
      </div>

      <div class="card text-center">
        <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Icon name="lucide:check-circle" class="w-6 h-6 text-success" />
        </div>
        <p class="text-sm text-gray-600 mb-1">Completed Orders</p>
        <p class="text-2xl font-semibold text-gray-900">{{ metrics.completed }}</p>
      </div>

      <div class="card text-center">
        <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Icon name="lucide:dollar-sign" class="w-6 h-6 text-primary" />
        </div>
        <p class="text-sm text-gray-600 mb-1">Total Revenue</p>
        <p class="text-2xl font-semibold text-gray-900">${{ metrics.revenue }}</p>
      </div>

      <div class="card text-center">
        <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Icon name="lucide:users" class="w-6 h-6 text-primary" />
        </div>
        <p class="text-sm text-gray-600 mb-1">Total Customers</p>
        <p class="text-2xl font-semibold text-gray-900">{{ metrics.customers }}</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <NuxtLink to="/orders/new" class="card hover:border-gray-300 transition-colors">
        <div class="text-center">
          <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Icon name="lucide:plus" class="w-5 h-5 text-primary" />
          </div>
          <h3 class="font-medium text-gray-900 mb-1">New Order</h3>
          <p class="text-sm text-gray-600">Create a new order for a customer</p>
        </div>
      </NuxtLink>

      <NuxtLink to="/customers/new" class="card hover:border-gray-300 transition-colors">
        <div class="text-center">
          <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Icon name="lucide:user-plus" class="w-5 h-5 text-primary" />
          </div>
          <h3 class="font-medium text-gray-900 mb-1">Add Customer</h3>
          <p class="text-sm text-gray-600">Register a new customer</p>
        </div>
      </NuxtLink>

      <NuxtLink to="/products/new" class="card hover:border-gray-300 transition-colors">
        <div class="text-center">
          <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Icon name="lucide:package-plus" class="w-5 h-5 text-primary" />
          </div>
          <h3 class="font-medium text-gray-900 mb-1">Add Product</h3>
          <p class="text-sm text-gray-600">Add a new product to inventory</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Recent Orders -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Recent Orders</h3>
        <NuxtLink to="/orders" class="btn-secondary">
          View all orders →
        </NuxtLink>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div class="spinner mx-auto mb-3"></div>
        <p class="text-gray-600">Loading orders...</p>
      </div>

      <div v-else-if="recentOrders.length === 0" class="text-center py-12">
        <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Icon name="lucide:inbox" class="w-6 h-6 text-gray-400" />
        </div>
        <h4 class="text-lg font-medium text-gray-900 mb-2">No orders yet</h4>
        <p class="text-gray-600 mb-4">Get started by creating your first order</p>
        <NuxtLink to="/orders/new" class="btn-primary">
          Create Order
        </NuxtLink>
      </div>

      <div v-else class="table">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id" @click="onOrderClick(order)" class="cursor-pointer">
              <td>
                <span class="font-medium text-gray-900">
                  #{{ order.id.slice(0, 8) }}
                </span>
              </td>
              <td class="text-gray-700">
                {{ order.customers?.name || 'Unknown' }}
              </td>
              <td>
                <span :class="getStatusClass(order.status)" class="badge">
                  {{ order.status }}
                </span>
              </td>
              <td class="font-medium text-gray-900">
                ${{ order.total_amount.toFixed(2) }}
              </td>
              <td class="text-gray-600">
                {{ formatDate(order.order_date) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Composables
const supabase = useSupabaseClient()

// Reactive data
const loading = ref(true)
const metrics = ref({
  pending: 0,
  completed: 0,
  revenue: 0,
  customers: 0
})
const recentOrders = ref<any[]>([])

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
      const orders = ordersData.data
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
  } finally {
    loading.value = false
  }
}

function getStatusClass(status: string) {
  const classes = {
    pending: 'badge-warning',
    processing: 'badge-gray', 
    completed: 'badge-success',
    cancelled: 'badge-error'
  }
  return classes[status] || 'badge-gray'
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}

const onOrderClick = (order: any) => {
  navigateTo(`/orders/${order.id}`)
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