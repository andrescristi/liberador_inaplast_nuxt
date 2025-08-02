<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Orders</h1>
        <p class="text-slate-600 mt-2">Manage and track all your customer orders</p>
      </div>
      <Button class="mt-4 sm:mt-0" @click="navigateTo('/orders/new')">
        <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
        New Order
      </Button>
    </div>

    <!-- Filters -->
    <Card class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          v-model="filters.search"
          placeholder="Search orders..."
          icon="lucide:search"
          @input="debouncedSearch"
        />
        <Select
          v-model="filters.status"
          :options="statusOptions"
          placeholder="Filter by status"
          @change="applyFilters"
        />
        <Input
          v-model="filters.date_from"
          type="date"
          label="From Date"
          @change="applyFilters"
        />
        <Input
          v-model="filters.date_to"
          type="date"
          label="To Date"
          @change="applyFilters"
        />
      </div>
      <div class="mt-4 flex justify-between items-center">
        <div class="text-sm text-slate-600">
          Showing {{ ordersStore.orders.length }} of {{ ordersStore.pagination.total }} orders
        </div>
        <Button
          v-if="hasActiveFilters"
          variant="ghost"
          size="sm"
          @click="clearFilters"
        >
          Clear Filters
        </Button>
      </div>
    </Card>

    <!-- Loading State -->
    <div v-if="ordersStore.loading">
      <Card>
        <div class="space-y-4">
          <div v-for="n in 5" :key="n" class="flex items-center space-x-4 p-4">
            <div class="skeleton h-4 w-20"></div>
            <div class="skeleton h-4 w-32 flex-1"></div>
            <div class="skeleton h-6 w-20"></div>
            <div class="skeleton h-4 w-16"></div>
            <div class="skeleton h-4 w-24"></div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Orders Content -->
    <div v-else>
      <!-- Empty State -->
      <div v-if="ordersStore.orders.length === 0" class="empty-state">
        <Icon name="lucide:shopping-cart" class="empty-state-icon" />
        <h3 class="empty-state-title">No Orders Found</h3>
        <p class="empty-state-description">
          {{ hasActiveFilters ? 'Try adjusting your filters to see more orders.' : 'Get started by creating your first order.' }}
        </p>
        <Button class="mt-4" @click="hasActiveFilters ? clearFilters() : navigateTo('/orders/new')">
          {{ hasActiveFilters ? 'Clear Filters' : 'Create First Order' }}
        </Button>
      </div>

      <!-- Orders Table (Desktop) -->
      <Card v-else class="hidden md:block">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  <button
                    class="flex items-center space-x-1 hover:text-slate-900"
                    @click="toggleSort('id')"
                  >
                    <span>Order ID</span>
                    <Icon name="lucide:arrow-up-down" class="w-4 h-4" />
                  </button>
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Status</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  <button
                    class="flex items-center space-x-1 hover:text-slate-900"
                    @click="toggleSort('total_amount')"
                  >
                    <span>Amount</span>
                    <Icon name="lucide:arrow-up-down" class="w-4 h-4" />
                  </button>
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  <button
                    class="flex items-center space-x-1 hover:text-slate-900"
                    @click="toggleSort('created_at')"
                  >
                    <span>Date</span>
                    <Icon name="lucide:arrow-up-down" class="w-4 h-4" />
                  </button>
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="order in ordersStore.orders"
                :key="order.id"
                class="hover:bg-slate-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 text-sm font-mono text-slate-900">{{ order.id }}</td>
                <td class="px-6 py-4">
                  <div>
                    <div class="text-sm font-medium text-slate-900">{{ order.customer?.name }}</div>
                    <div class="text-sm text-slate-500">{{ order.customer?.email }}</div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <Badge :variant="order.status">{{ order.status }}</Badge>
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-slate-900">{{ formatCurrency(order.total_amount) }}</td>
                <td class="px-6 py-4 text-sm text-slate-500">{{ formatDate(order.created_at) }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="navigateTo(`/orders/${order.id}`)"
                    >
                      View
                    </Button>
                    <Button
                      v-if="order.status === 'pending'"
                      variant="ghost"
                      size="sm"
                      @click="navigateTo(`/orders/${order.id}/edit`)"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon-only
                      icon="lucide:more-horizontal"
                      @click="showOrderActions(order)"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <!-- Orders Cards (Mobile) -->
      <div v-else class="md:hidden space-y-4">
        <div
          v-for="order in ordersStore.orders"
          :key="order.id"
          class="order-card"
          @click="navigateTo(`/orders/${order.id}`)"
        >
          <div class="flex justify-between items-start mb-3">
            <div class="text-sm font-mono text-slate-600">{{ order.id }}</div>
            <Badge :variant="order.status" size="sm">{{ order.status }}</Badge>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <div class="font-medium text-slate-900">{{ order.customer?.name }}</div>
              <div class="text-lg font-semibold text-slate-900">{{ formatCurrency(order.total_amount) }}</div>
            </div>
            <div class="flex justify-between items-center text-sm text-slate-500">
              <div>{{ order.customer?.email }}</div>
              <div>{{ formatDate(order.created_at) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="ordersStore.pagination.total_pages > 1" class="mt-6">
        <Pagination
          v-model="currentPage"
          :total-pages="ordersStore.pagination.total_pages"
          :total="ordersStore.pagination.total"
          :per-page="ordersStore.pagination.per_page"
          @change="loadOrders"
        />
      </div>
    </div>

    <!-- Order Actions Modal -->
    <Modal v-model="showActionsModal" title="Order Actions">
      <div v-if="selectedOrder" class="space-y-4">
        <div>
          <h4 class="font-medium text-slate-900 mb-2">Order {{ selectedOrder.id }}</h4>
          <p class="text-sm text-slate-600">Customer: {{ selectedOrder.customer?.name }}</p>
          <p class="text-sm text-slate-600">Status: <Badge :variant="selectedOrder.status" size="sm">{{ selectedOrder.status }}</Badge></p>
        </div>
        
        <div class="space-y-2">
          <Button
            v-if="selectedOrder.status !== 'completed'"
            variant="secondary"
            class="w-full"
            @click="updateOrderStatus('completed')"
          >
            Mark as Completed
          </Button>
          <Button
            v-if="selectedOrder.status === 'pending'"
            variant="secondary"
            class="w-full"
            @click="updateOrderStatus('processing')"
          >
            Mark as Processing
          </Button>
          <Button
            v-if="selectedOrder.status !== 'cancelled'"
            variant="destructive"
            class="w-full"
            @click="updateOrderStatus('cancelled')"
          >
            Cancel Order
          </Button>
          <Button
            variant="destructive"
            class="w-full"
            @click="deleteOrder"
          >
            Delete Order
          </Button>
        </div>
      </div>
      
      <template #footer>
        <Button variant="ghost" @click="showActionsModal = false">Close</Button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { useOrdersStore } from '~/stores/orders'
import type { Order, OrderStatus, OrderFilters } from '~/types'
import { debounce } from '~/utils/debounce'

const ordersStore = useOrdersStore()

// Reactive state
const currentPage = ref(1)
const showActionsModal = ref(false)
const selectedOrder = ref<Order | null>(null)

const filters = reactive<OrderFilters>({
  search: '',
  status: '',
  date_from: '',
  date_to: ''
})

// Options for dropdowns
const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

// Computed
const hasActiveFilters = computed(() => {
  return filters.search || filters.status || filters.date_from || filters.date_to
})

// Methods
const loadOrders = async (page = 1) => {
  currentPage.value = page
  await ordersStore.fetchOrders(page, { ...filters })
}

const applyFilters = () => {
  currentPage.value = 1
  loadOrders(1)
}

const clearFilters = () => {
  Object.assign(filters, {
    search: '',
    status: '',
    date_from: '',
    date_to: ''
  })
  applyFilters()
}

const debouncedSearch = debounce(() => {
  applyFilters()
}, 300)

const toggleSort = (field: string) => {
  // Implement sorting logic
  console.log('Sort by:', field)
}

const showOrderActions = (order: Order) => {
  selectedOrder.value = order
  showActionsModal.value = true
}

const updateOrderStatus = async (status: OrderStatus) => {
  if (!selectedOrder.value) return
  
  try {
    await ordersStore.updateOrderStatus(selectedOrder.value.id, status)
    showActionsModal.value = false
    // Refresh the list
    await loadOrders(currentPage.value)
  } catch (error) {
    console.error('Failed to update order status:', error)
  }
}

const deleteOrder = async () => {
  if (!selectedOrder.value) return
  
  if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
    try {
      await ordersStore.deleteOrder(selectedOrder.value.id)
      showActionsModal.value = false
      // Refresh the list
      await loadOrders(currentPage.value)
    } catch (error) {
      console.error('Failed to delete order:', error)
    }
  }
}

// Utility functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Load initial data
await loadOrders()

// SEO
useSeoMeta({
  title: 'Orders - Order Management',
  description: 'Manage and track all your customer orders with filtering and search capabilities.'
})
</script>