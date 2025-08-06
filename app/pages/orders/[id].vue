<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="ordersStore.loading" class="space-y-6">
      <div class="skeleton h-8 w-64"/>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card p-6">
          <div class="skeleton h-6 w-32 mb-4"/>
          <div class="space-y-2">
            <div class="skeleton h-4 w-full"/>
            <div class="skeleton h-4 w-3/4"/>
            <div class="skeleton h-4 w-1/2"/>
          </div>
        </div>
        <div class="card p-6">
          <div class="skeleton h-6 w-32 mb-4"/>
          <div class="space-y-2">
            <div class="skeleton h-4 w-full"/>
            <div class="skeleton h-4 w-3/4"/>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Content -->
    <div v-else-if="order" class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <Button
variant="ghost"
size="sm"
@click="navigateTo('/orders')">
            <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Order {{ order.id }}</h1>
            <p class="text-slate-600 mt-1">{{ formatDate(order.created_at) }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <Badge :variant="order.status" size="lg">{{ order.status }}</Badge>
          <Button
            v-if="order.status === 'pending'"
            variant="secondary"
            @click="navigateTo(`/orders/${order.id}/edit`)"
          >
            <Icon name="lucide:edit" class="w-4 h-4 mr-2" />
            Edit Order
          </Button>
        </div>
      </div>

      <!-- Order Information Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Customer Information -->
        <Card title="Customer Information">
          <div v-if="order.customer" class="space-y-4">
            <div>
              <label class="text-sm font-medium text-slate-700">Name</label>
              <p class="text-slate-900">{{ order.customer.name }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-slate-700">Email</label>
              <p class="text-slate-900">{{ order.customer.email }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-slate-700">Phone</label>
              <p class="text-slate-900">{{ order.customer.phone }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-slate-700">Address</label>
              <p class="text-slate-900">{{ order.customer.address }}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              @click="navigateTo(`/customers/${order.customer.id}`)"
            >
              View Customer Profile
              <Icon name="lucide:external-link" class="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>

        <!-- Order Status & Actions -->
        <Card title="Order Status">
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-slate-700">Current Status</label>
              <div class="mt-1">
                <Badge :variant="order.status" size="lg">{{ order.status }}</Badge>
              </div>
            </div>
            
            <div>
              <label class="text-sm font-medium text-slate-700">Order Date</label>
              <p class="text-slate-900">{{ formatDateTime(order.order_date) }}</p>
            </div>
            
            <div>
              <label class="text-sm font-medium text-slate-700">Last Updated</label>
              <p class="text-slate-900">{{ formatDateTime(order.updated_at) }}</p>
            </div>

            <!-- Status Actions -->
            <div class="space-y-2 pt-4 border-t border-slate-200">
              <h4 class="text-sm font-medium text-slate-700">Quick Actions</h4>
              <div class="space-y-2">
                <Button
                  v-if="order.status === 'pending'"
                  variant="primary"
                  size="sm"
                  class="w-full"
                  :loading="updating"
                  @click="updateStatus('processing')"
                >
                  Mark as Processing
                </Button>
                <Button
                  v-if="order.status === 'processing'"
                  variant="primary"
                  size="sm"
                  class="w-full"
                  :loading="updating"
                  @click="updateStatus('completed')"
                >
                  Mark as Completed
                </Button>
                <Button
                  v-if="order.status !== 'cancelled'"
                  variant="destructive"
                  size="sm"
                  class="w-full"
                  :loading="updating"
                  @click="updateStatus('cancelled')"
                >
                  Cancel Order
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Order Items -->
      <Card title="Order Items">
        <div class="space-y-4">
          <!-- Desktop Table -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Product</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Quantity</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Unit Price</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Subtotal</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="item in mockOrderItems" :key="item.id">
                  <td class="px-4 py-4">
                    <div>
                      <div class="text-sm font-medium text-slate-900">{{ item.product?.name }}</div>
                      <div class="text-sm text-slate-500">{{ item.product?.description }}</div>
                    </div>
                  </td>
                  <td class="px-4 py-4 text-sm text-slate-900">{{ item.quantity }}</td>
                  <td class="px-4 py-4 text-sm text-slate-900">{{ formatCurrency(item.unit_price) }}</td>
                  <td class="px-4 py-4 text-sm font-semibold text-slate-900">{{ formatCurrency(item.subtotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards -->
          <div class="md:hidden space-y-3">
            <div
              v-for="item in mockOrderItems"
              :key="item.id"
              class="border border-slate-200 rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-slate-900">{{ item.product?.name }}</h4>
                  <p class="text-xs text-slate-500">{{ item.product?.description }}</p>
                </div>
                <div class="text-sm font-semibold text-slate-900">{{ formatCurrency(item.subtotal) }}</div>
              </div>
              <div class="flex justify-between text-sm text-slate-600">
                <span>Qty: {{ item.quantity }}</span>
                <span>{{ formatCurrency(item.unit_price) }} each</span>
              </div>
            </div>
          </div>

          <!-- Order Total -->
          <div class="border-t border-slate-200 pt-4">
            <div class="flex justify-end">
              <div class="w-full max-w-xs space-y-2">
                <div class="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span>{{ formatCurrency(orderSubtotal) }}</span>
                </div>
                <div class="flex justify-between text-sm text-slate-600">
                  <span>Tax</span>
                  <span>{{ formatCurrency(orderTax) }}</span>
                </div>
                <div class="flex justify-between text-lg font-semibold text-slate-900 border-t border-slate-200 pt-2">
                  <span>Total</span>
                  <span>{{ formatCurrency(order.total_amount) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Status Timeline -->
      <Card title="Status Timeline">
        <div class="space-y-4">
          <div
            v-for="(timeline, index) in statusTimeline"
            :key="index"
            class="flex items-start space-x-3"
          >
            <div
              class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
              :class="timeline.completed ? 'bg-green-500' : 'bg-slate-300'"
            >
              <Icon
                v-if="timeline.completed"
                name="lucide:check"
                class="w-3 h-3 text-white"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-900 capitalize">{{ timeline.status }}</p>
              <p v-if="timeline.timestamp" class="text-sm text-slate-500">{{ formatDateTime(timeline.timestamp) }}</p>
            </div>
          </div>
        </div>
      </Card>

      <!-- Danger Zone -->
      <Card
title="Danger Zone"
variant="outlined"
class="border-red-200">
        <div class="space-y-4">
          <p class="text-sm text-slate-600">
            These actions cannot be undone. Please be careful.
          </p>
          <Button
            variant="destructive"
            @click="deleteOrder"
          >
            <Icon name="lucide:trash-2" class="w-4 h-4 mr-2" />
            Delete Order
          </Button>
        </div>
      </Card>
    </div>

    <!-- Not Found State -->
    <div v-else class="empty-state">
      <Icon name="lucide:file-x" class="empty-state-icon" />
      <h3 class="empty-state-title">Order Not Found</h3>
      <p class="empty-state-description">
        The order you're looking for doesn't exist or has been deleted.
      </p>
      <Button class="mt-4" @click="navigateTo('/orders')">
        Back to Orders
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrdersStore } from '~/stores/orders'
import type { OrderStatus, OrderItem, StatusTimelineItem } from '~/types'

const route = useRoute()
const ordersStore = useOrdersStore()

const updating = ref(false)

// Get order from store or fetch it
const order = computed(() => ordersStore.currentOrder)

// Mock order items data (replace with real data from API)
const mockOrderItems: OrderItem[] = [
  {
    id: '1',
    order_id: route.params.id as string,
    product_id: 'PROD-001',
    quantity: 2,
    unit_price: 50,
    subtotal: 100,
    product: {
      id: 'PROD-001',
      name: 'Premium Widget A',
      description: 'High-quality professional grade widget',
      price: 50,
      stock_quantity: 150,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  },
  {
    id: '2',
    order_id: route.params.id as string,
    product_id: 'PROD-002',
    quantity: 1,
    unit_price: 125,
    subtotal: 125,
    product: {
      id: 'PROD-002',
      name: 'Professional Tool X',
      description: 'Advanced tool for professional use',
      price: 125,
      stock_quantity: 25,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  }
]

// Computed values
const orderSubtotal = computed(() => {
  return mockOrderItems.reduce((sum, item) => sum + item.subtotal, 0)
})

const orderTax = computed(() => {
  return orderSubtotal.value * 0.1 // 10% tax
})

const statusTimeline = computed((): StatusTimelineItem[] => {
  if (!order.value) return []
  
  const timeline: StatusTimelineItem[] = [
    { status: 'pending', timestamp: order.value.created_at, completed: true },
    { status: 'processing', timestamp: order.value.status !== 'pending' ? order.value.updated_at : '', completed: order.value.status === 'processing' || order.value.status === 'completed' },
    { status: 'completed', timestamp: order.value.status === 'completed' ? order.value.updated_at : '', completed: order.value.status === 'completed' }
  ]
  
  if (order.value.status === 'cancelled') {
    timeline.push({ status: 'cancelled', timestamp: order.value.updated_at, completed: true })
  }
  
  return timeline
})

// Methods
const updateStatus = async (newStatus: OrderStatus) => {
  if (!order.value) return
  
  updating.value = true
  try {
    await ordersStore.updateOrderStatus(order.value.id, newStatus)
  } catch (error) {
    console.error('Failed to update order status:', error)
  } finally {
    updating.value = false
  }
}

const deleteOrder = async () => {
  if (!order.value) return
  
  if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
    try {
      await ordersStore.deleteOrder(order.value.id)
      await navigateTo('/orders')
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
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

// Fetch order data
await ordersStore.fetchOrderById(route.params.id as string)

// SEO
useSeoMeta({
  title: `Order ${route.params.id} - Order Management`,
  description: `View details for order ${route.params.id} including customer information, items, and status.`
})
</script>