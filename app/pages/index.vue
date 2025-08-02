<template>
  <!-- Magical Particles Background -->
  <MagicalParticles :count="15" :enabled="!loading" />
  
  <!-- Confetti for celebrations -->
  <ConfettiCelebration ref="confettiRef" />
  
  <div class="min-h-screen relative z-10">
    <!-- Glass Navigation -->
    <nav class="glass-nav sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex items-center space-x-3">
              <div class="glass-icon-container w-10 h-10">
                <svg class="w-6 h-6 text-glass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                </svg>
              </div>
              <h1 class="text-xl font-semibold text-glass">Order Management</h1>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <NuxtLink to="/orders" class="text-glass-secondary hover:text-glass hover:bg-glass-light px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
              Orders
            </NuxtLink>
            <NuxtLink to="/customers" class="text-glass-secondary hover:text-glass hover:bg-glass-light px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
              Customers
            </NuxtLink>
            <NuxtLink to="/products" class="text-glass-secondary hover:text-glass hover:bg-glass-light px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
              Products
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Glass Page Header -->
      <div class="glass-card-magical p-8 mb-8 animate-float" @click="triggerEasterEgg">
        <div class="text-center">
          <h2 class="text-4xl font-bold text-glass mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p class="text-glass-secondary text-lg max-w-2xl mx-auto">
            Welcome back! Here's what's happening with your orders today.
          </p>
        </div>
      </div>

      <!-- Glass Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="glass-card-hover animate-float" style="animation-delay: 0.1s" @click="celebrateMetric('pending')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="glass-icon-container w-12 h-12 animate-glow icon-wiggle">
                <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-glass-secondary">Pending Orders</p>
              <p class="text-3xl font-bold text-glass">{{ metrics.pending }}</p>
            </div>
          </div>
        </div>

        <div class="glass-card-hover animate-float" style="animation-delay: 0.2s" @click="celebrateMetric('completed')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="glass-icon-container w-12 h-12 animate-glow icon-wiggle" style="animation-delay: 0.5s">
                <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-glass-secondary">Completed Orders</p>
              <p class="text-3xl font-bold text-glass">{{ metrics.completed }}</p>
            </div>
          </div>
        </div>

        <div class="glass-card-hover animate-float" style="animation-delay: 0.3s" @click="celebrateMetric('revenue')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="glass-icon-container w-12 h-12 animate-glow icon-wiggle" style="animation-delay: 1s">
                <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-glass-secondary">Total Revenue</p>
              <p class="text-3xl font-bold text-glass">${{ metrics.revenue }}</p>
            </div>
          </div>
        </div>

        <div class="glass-card-hover animate-float" style="animation-delay: 0.4s" @click="celebrateMetric('customers')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="glass-icon-container w-12 h-12 animate-glow icon-wiggle" style="animation-delay: 1.5s">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-glass-secondary">Total Customers</p>
              <p class="text-3xl font-bold text-glass">{{ metrics.customers }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Glass Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <NuxtLink to="/orders/new" class="glass-card-hover p-6 group transition-all duration-300" @click="onQuickActionClick('order')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="glass-icon-container w-12 h-12 group-hover:scale-110 transition-transform duration-200">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-glass group-hover:text-white transition-colors duration-200">New Order</h3>
              <p class="text-sm text-glass-secondary group-hover:text-glass transition-colors duration-200">Create a new order for a customer</p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink to="/customers/new" class="glass-card-hover p-6 group transition-all duration-300" @click="onQuickActionClick('customer')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="glass-icon-container w-12 h-12 group-hover:scale-110 transition-transform duration-200">
                <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-glass group-hover:text-white transition-colors duration-200">Add Customer</h3>
              <p class="text-sm text-glass-secondary group-hover:text-glass transition-colors duration-200">Register a new customer</p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink to="/products/new" class="glass-card-hover p-6 group transition-all duration-300" @click="onQuickActionClick('product')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="glass-icon-container w-12 h-12 group-hover:scale-110 transition-transform duration-200">
                <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-glass group-hover:text-white transition-colors duration-200">Add Product</h3>
              <p class="text-sm text-glass-secondary group-hover:text-glass transition-colors duration-200">Add a new product to inventory</p>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Glass Recent Orders -->
      <div class="glass-card">
        <div class="px-6 py-4 border-b border-glass-light">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-glass">Recent Orders</h3>
            <NuxtLink to="/orders" class="btn-glass-secondary text-sm hover:scale-105 transition-transform duration-200">
              View all orders →
            </NuxtLink>
          </div>
        </div>
        <div class="p-6">
          <div v-if="loading" class="text-center py-8">
            <div class="flex items-center justify-center space-x-2">
              <div class="spinner-magical"></div>
              <p class="text-glass-secondary animate-pulse">Cargando órdenes mágicas...</p>
            </div>
          </div>
          <div v-else-if="recentOrders.length === 0" class="empty-state">
            <div class="glass-icon-container w-16 h-16 mx-auto mb-6">
              <svg class="w-8 h-8 text-glass-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h4 class="empty-state-title">No orders yet</h4>
            <p class="empty-state-description">Get started by creating your first order</p>
            <NuxtLink to="/orders/new" class="btn-glass-primary">
              Create Order
            </NuxtLink>
          </div>
          <div v-else class="overflow-hidden">
            <div class="data-table">
              <table class="min-w-full">
                <thead>
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                    <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in recentOrders" :key="order.id" class="transition-all duration-200 hover:scale-[1.01] cursor-pointer" @click="onOrderClick(order)">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      <span class="bg-glass-light px-3 py-1 rounded-lg">
                        #{{ order.id.slice(0, 8) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      {{ order.customers?.name || 'Unknown' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getStatusClass(order.status)" class="status-indicator">
                        {{ order.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      <span class="text-green-400">${{ order.total_amount.toFixed(2) }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-glass-muted">
                      {{ formatDate(order.order_date) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
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
const recentOrders = ref([])
const confettiRef = ref()
const easterEggClicks = ref(0)

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
      metrics.value.revenue = orders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + parseFloat(o.total_amount), 0)
        .toFixed(2)
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

function getStatusClass(status) {
  const classes = {
    pending: 'status-pending',
    processing: 'status-processing', 
    completed: 'status-completed',
    cancelled: 'status-cancelled'
  }
  return classes[status] || 'status-badge'
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}

// Delightful interactions
const celebrateMetric = (metricType: string) => {
  console.log(`🎉 Celebrating ${metricType} metric!`)
  if (confettiRef.value) {
    confettiRef.value.celebrate()
  }
}

const onQuickActionClick = (actionType: string) => {
  console.log(`✨ Quick action: ${actionType}`)
  // Add a subtle bounce animation
}

const onOrderClick = (order: any) => {
  console.log(`📋 Clicked order: ${order.id}`)
  // Navigate to order detail with a nice transition
  navigateTo(`/orders/${order.id}`)
}

const triggerEasterEgg = () => {
  easterEggClicks.value++
  if (easterEggClicks.value >= 5) {
    // Secret konami code activation!
    document.body.classList.add('konami-activated')
    if (confettiRef.value) {
      confettiRef.value.celebrate()
    }
    setTimeout(() => {
      document.body.classList.remove('konami-activated')
      easterEggClicks.value = 0
    }, 3000)
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