<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-semibold text-glass">Orders</h1>
        <p class="text-glass-secondary mt-2">Manage and track all your customer orders</p>
      </div>
      <button
        class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        @click="navigateTo('/orders/new')"
      >
        <Icon name="lucide:plus" class="-ml-1 mr-2 h-5 w-5" />
        New Order
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search Input -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="lucide:search" class="h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="filters.search"
              type="text"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search orders..."
              @input="debouncedSearch"
            >
            <button
              v-if="filters.search"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
              @click="filters.search = ''; applyFilters()"
            >
              <Icon name="lucide:x" class="h-5 w-5 text-gray-400 hover:text-gray-500" />
            </button>
          </div>
          
          <!-- Status Listbox -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <Listbox :model-value="filters.status || ''" @update:model-value="(value: string) => { filters.status = (value as OrderStatus) || undefined; applyFilters() }">
              <div class="relative">
                <ListboxButton class="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-gray-300">
                  <span class="block truncate">{{ statusOptions.find(option => option.value === (filters.status || ''))?.label || 'All Statuses' }}</span>
                  <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <Icon
                      name="lucide:chevron-down"
                      class="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </ListboxButton>

                <transition
                  leave-active-class="transition duration-100 ease-in"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <ListboxOption
                      v-for="option in statusOptions"
                      :key="option.value"
                      v-slot="{ active, selected }"
                      :value="option.value"
                      as="template"
                    >
                      <li
                        :class="[
                          active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-10 pr-4',
                        ]"
                      >
                        <span
                          :class="[
                            selected ? 'font-medium' : 'font-normal',
                            'block truncate',
                          ]"
                        >
                          {{ option.label }}
                        </span>
                        <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                          <Icon
                            name="lucide:check"
                            class="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
          </div>
          
          <!-- Date From Input -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">From Date</label>
            <input
              v-model="filters.date_from"
              type="date"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              @change="applyFilters"
            >
          </div>
          
          <!-- Date To Input -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">To Date</label>
            <input
              v-model="filters.date_to"
              type="date"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              @change="applyFilters"
            >
          </div>
        </div>
        <div class="mt-6 flex justify-between items-center">
          <div class="text-sm text-gray-500">
            Showing {{ orders.length }} of {{ pagination.total }} orders
          </div>
          <button
            v-if="hasActiveFilters"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            @click="clearFilters"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading">
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="space-y-6">
            <div
              v-for="n in 5"
              :key="n"
              class="flex items-center space-x-4"
            >
              <div class="h-4 w-20 bg-gray-200 rounded animate-pulse"/>
              <div class="h-4 flex-1 bg-gray-200 rounded animate-pulse"/>
              <div class="h-6 w-20 bg-gray-200 rounded-full animate-pulse"/>
              <div class="h-4 w-16 bg-gray-200 rounded animate-pulse"/>
              <div class="h-4 w-24 bg-gray-200 rounded animate-pulse"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders Content -->
    <div v-else>
      <!-- Empty State -->
      <div v-if="orders.length === 0" class="text-center py-12">
        <Icon name="lucide:shopping-cart" class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No Orders Found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ hasActiveFilters ? 'Try adjusting your filters to see more orders.' : 'Get started by creating your first order.' }}
        </p>
        <button
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="hasActiveFilters ? clearFilters() : navigateTo('/orders/new')"
        >
          {{ hasActiveFilters ? 'Clear Filters' : 'Create First Order' }}
        </button>
      </div>

      <!-- Orders Table (Desktop) -->
      <div v-else class="hidden md:block bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    class="flex items-center space-x-1 hover:text-gray-700 transition-colors duration-200"
                    @click="toggleSort('id')"
                  >
                    <span>Order ID</span>
                    <Icon name="lucide:arrow-up-down" class="w-4 h-4" />
                  </button>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    class="flex items-center space-x-1 hover:text-gray-700 transition-colors duration-200"
                    @click="toggleSort('total_amount')"
                  >
                    <span>Amount</span>
                    <Icon name="lucide:arrow-up-down" class="w-4 h-4" />
                  </button>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    class="flex items-center space-x-1 hover:text-gray-700 transition-colors duration-200"
                    @click="toggleSort('created_at')"
                  >
                    <span>Date</span>
                    <Icon name="lucide:arrow-up-down" class="w-4 h-4" />
                  </button>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="order in orders"
                :key="order.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-6 py-4 text-sm font-mono text-gray-900">{{ order.id }}</td>
                <td class="px-6 py-4">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ order.customer?.name }}</div>
                    <div class="text-sm text-gray-500">{{ order.customer?.email }}</div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span :class="getStatusBadgeClass(order.status)">{{ order.status }}</span>
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-gray-900">{{ formatCurrency(order.total_amount) }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(order.created_at) }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2">
                    <button
                      class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      @click="navigateTo(`/orders/${order.id}`)"
                    >
                      View
                    </button>
                    <button
                      v-if="order.status === 'pending'"
                      class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      @click="navigateTo(`/orders/${order.id}/edit`)"
                    >
                      Edit
                    </button>
                    <Menu as="div" class="relative inline-block text-left">
                      <div>
                        <MenuButton class="p-1 rounded-full text-gray-400 hover:text-gray-600">
                          <Icon name="lucide:more-horizontal" class="w-5 h-5" />
                        </MenuButton>
                      </div>

                      <transition
                        enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95"
                        enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95"
                      >
                        <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div class="py-1">
                            <MenuItem v-slot="{ active }">
                              <button
                                :class="[
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block w-full px-4 py-2 text-left text-sm',
                                ]"
                                @click="showOrderActions(order)"
                              >
                                More Actions
                              </button>
                            </MenuItem>
                          </div>
                        </MenuItems>
                      </transition>
                    </Menu>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Orders Cards (Mobile) -->
      <div v-if="orders.length > 0" class="md:hidden space-y-4">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
          @click="navigateTo(`/orders/${order.id}`)"
        >
          <div class="flex justify-between items-start mb-3">
            <div class="text-sm font-mono text-gray-500">{{ order.id }}</div>
            <span :class="getStatusBadgeClass(order.status)">{{ order.status }}</span>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <div class="font-medium text-gray-900">{{ order.customer?.name }}</div>
              <div class="text-lg font-semibold text-gray-900">{{ formatCurrency(order.total_amount) }}</div>
            </div>
            <div class="flex justify-between items-center text-sm text-gray-500">
              <div>{{ order.customer?.email }}</div>
              <div>{{ formatDate(order.created_at) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total_pages > 1" class="mt-6">
        <div class="flex justify-center">
          <p class="text-sm text-gray-500">
            Page {{ pagination.page }} of {{ pagination.total_pages }}
          </p>
        </div>
      </div>
    </div>

    <!-- Order Actions Dialog -->
    <Dialog :open="showActionsModal" @close="showActionsModal = false">
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

          <!-- This element is to trick the browser into centering the modal contents. -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div>
              <div class="mt-3 text-center sm:mt-0 sm:text-left">
                <DialogTitle as="h3" class="text-lg leading-6 font-medium text-gray-900">
                  Order Actions
                </DialogTitle>
                <div v-if="selectedOrder" class="mt-4 space-y-4">
                  <div>
                    <h4 class="font-medium text-gray-900 mb-2">Order {{ selectedOrder.id }}</h4>
                    <p class="text-sm text-gray-600">Customer: {{ selectedOrder.customer?.name }}</p>
                    <p class="text-sm text-gray-600">Status: <span :class="getStatusBadgeClass(selectedOrder.status)">{{ selectedOrder.status }}</span></p>
                  </div>
                  
                  <div class="space-y-2">
                    <button
                      v-if="selectedOrder.status !== 'completed'"
                      class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      @click="updateOrderStatus('completed')"
                    >
                      Mark as Completed
                    </button>
                    <button
                      v-if="selectedOrder.status === 'pending'"
                      class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      @click="updateOrderStatus('processing')"
                    >
                      Mark as Processing
                    </button>
                    <button
                      v-if="selectedOrder.status !== 'cancelled'"
                      class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      @click="updateOrderStatus('cancelled')"
                    >
                      Cancel Order
                    </button>
                    <button
                      class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      @click="deleteOrder"
                    >
                      Delete Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                @click="showActionsModal = false"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/vue'
import { useOrdersStore } from '~/stores/orders'
import type { Order, OrderStatus, OrderFilters } from '~/types'
import { debounce } from '~/utils/debounce'

// Reactive state
const currentPage = ref(1)
const showActionsModal = ref(false)
const selectedOrder = ref<Order | null>(null)

const filters = ref<OrderFilters>({
  search: '',
  status: undefined,
  date_from: '',
  date_to: ''
})

// Status options for the listbox
type StatusOption = {
  value: '' | OrderStatus
  label: string
}

const statusOptions: StatusOption[] = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

// Initialize store only on client side
const ordersStore = import.meta.client ? useOrdersStore() : null

// Computed properties that are safe for SSR
const orders = computed(() => ordersStore?.orders || [])
const pagination = computed(() => ordersStore?.pagination || { total: 0, total_pages: 0, page: 1, per_page: 20 })
const loading = computed(() => ordersStore?.loading || false)

const hasActiveFilters = computed(() => {
  try {
    return filters.value?.search || filters.value?.status || filters.value?.date_from || filters.value?.date_to || false
  } catch (error) {
    return false
  }
})

// Methods
const loadOrders = async (page = 1) => {
  if (!ordersStore) return
  currentPage.value = page
  await ordersStore.fetchOrders(page, { ...filters.value })
}

const applyFilters = () => {
  if (!import.meta.client) return
  currentPage.value = 1
  loadOrders(1)
}

const clearFilters = () => {
  Object.assign(filters.value, {
    search: '',
    status: undefined,
    date_from: '',
    date_to: ''
  })
  applyFilters()
}

// Define debouncedSearch after filters are initialized
const debouncedSearch = debounce(() => {
  if (import.meta.client) {
    applyFilters()
  }
}, 300)

const toggleSort = (_field: string) => {
  // TODO: Implement sorting logic
}

const showOrderActions = (order: Order) => {
  selectedOrder.value = order
  showActionsModal.value = true
}

const updateOrderStatus = async (status: OrderStatus) => {
  if (!selectedOrder.value || !ordersStore) return
  
  try {
    await ordersStore.updateOrderStatus(selectedOrder.value.id, status)
    showActionsModal.value = false
    // Refresh the list
    await loadOrders(currentPage.value)
  } catch (error) {
    // TODO: Implement proper error handling
    // Placeholder to avoid unused variable warning
    console.warn('Failed to update order status:', error)
  }
}

const deleteOrder = async () => {
  if (!selectedOrder.value || !ordersStore) return
  
  if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
    try {
      await ordersStore.deleteOrder(selectedOrder.value.id)
      showActionsModal.value = false
      // Refresh the list
      await loadOrders(currentPage.value)
    } catch (error) {
      // TODO: Implement proper error handling  
      // Placeholder to avoid unused variable warning
      console.warn('Failed to delete order:', error)
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

const getStatusBadgeClass = (status: string) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return `${baseClasses} ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}`
}

// Load initial data on client side
onMounted(async () => {
  if (ordersStore) {
    await loadOrders()
  }
})

// SEO
useSeoMeta({
  title: 'Orders - Order Management',
  description: 'Manage and track all your customer orders with filtering and search capabilities.'
})
</script>