<template>
  <div class="space-y-4 sm:space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Create New Order</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
      <!-- Customer Selection -->
      <div class="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <h2 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Customer Information</h2>
        
        <div class="space-y-3 sm:space-y-4">
          <div>
            <label for="customer-search" class="block text-sm font-medium text-gray-700 mb-2">
              Search Customer
            </label>
            <div class="relative">
              <UiBaseInput
                id="customer-search"
                v-model="customerSearch"
                placeholder="Search by name or email..."
                size="lg"
                class="text-base"
                @input="searchCustomers"
              />
              
              <!-- Customer Dropdown - Mobile Optimized -->
              <div v-if="customerOptions.length > 0 && customerSearch" 
                   class="absolute z-20 mt-1 w-full bg-white shadow-xl max-h-64 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto">
                <div v-for="customer in customerOptions" 
                     :key="customer.id"
                     @click="selectCustomer(customer)"
                     class="cursor-pointer select-none relative py-3 px-4 hover:bg-indigo-600 hover:text-white active:bg-indigo-700 transition-colors">
                  <div class="flex flex-col sm:flex-row sm:items-center">
                    <span class="font-medium truncate">{{ customer.name }}</span>
                    <span class="text-gray-500 hover:text-indigo-200 text-sm sm:ml-2 truncate">{{ customer.email }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Selected Customer Display - Mobile Optimized -->
          <div v-if="selectedCustomer" class="p-4 bg-indigo-50 rounded-lg">
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-indigo-900 truncate">{{ selectedCustomer.name }}</h3>
                <p class="text-sm text-indigo-700 truncate">{{ selectedCustomer.email }}</p>
                <p class="text-sm text-indigo-700 truncate">{{ selectedCustomer.phone }}</p>
              </div>
              <UiBaseButton 
                variant="ghost" 
                size="sm" 
                class="flex-shrink-0 ml-2 w-8 h-8 p-0"
                @click="clearCustomerSelection"
              >
                <XMarkIcon class="w-4 h-4" />
              </UiBaseButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Items -->
      <div class="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 class="text-base sm:text-lg font-semibold text-gray-900">Order Items</h2>
          <UiBaseButton 
            type="button" 
            @click="addOrderItem" 
            variant="outline" 
            size="md"
            class="w-full sm:w-auto"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            Add Item
          </UiBaseButton>
        </div>

        <div class="space-y-4">
          <div v-for="(item, index) in orderItems" 
               :key="index"
               class="border border-gray-200 rounded-lg p-3 sm:p-4">
            
            <!-- Product Search -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Search Product
              </label>
              <div class="relative">
                <UiBaseInput
                  v-model="item.productSearch"
                  placeholder="Search products..."
                  size="lg"
                  class="text-base"
                  @input="searchProducts(index)"
                />
                
                <!-- Product Dropdown - Mobile Optimized -->
                <div v-if="item.productOptions.length > 0 && item.productSearch" 
                     class="absolute z-20 mt-1 w-full bg-white shadow-xl max-h-64 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto">
                  <div v-for="product in item.productOptions" 
                       :key="product.id"
                       @click="selectProduct(index, product)"
                       class="cursor-pointer select-none relative py-3 px-4 hover:bg-indigo-600 hover:text-white active:bg-indigo-700 transition-colors">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div class="flex-1 min-w-0">
                        <span class="font-medium truncate block">{{ product.name }}</span>
                        <p class="text-sm text-gray-500 hover:text-indigo-200">Stock: {{ product.stock_quantity }}</p>
                      </div>
                      <span class="text-green-600 hover:text-green-300 font-medium text-lg mt-1 sm:mt-0">${{ product.price.toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Selected Product Info - Mobile-First Layout -->
            <div v-if="item.product" class="space-y-4">
              <div class="p-3 sm:p-4 bg-gray-50 rounded-lg">
                <h4 class="font-medium text-gray-900 text-base sm:text-lg">{{ item.product.name }}</h4>
                <div class="grid grid-cols-2 gap-4 mt-2 text-sm">
                  <p class="text-gray-600">Price: <span class="font-medium">${{ item.product.price.toFixed(2) }}</span></p>
                  <p class="text-gray-600">Stock: <span class="font-medium">{{ item.product.stock_quantity }}</span></p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <UiBaseInput
                    v-model.number="item.quantity"
                    type="number"
                    min="1"
                    :max="item.product.stock_quantity"
                    size="lg"
                    class="text-base text-center"
                    @input="updateItemTotal(index)"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Unit Price
                  </label>
                  <UiBaseInput
                    v-model.number="item.unit_price"
                    type="number"
                    step="0.01"
                    min="0"
                    size="lg"
                    class="text-base text-center"
                    @input="updateItemTotal(index)"
                  />
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
              <div class="text-base sm:text-lg font-semibold text-gray-900">
                Subtotal: ${{ item.subtotal.toFixed(2) }}
              </div>
              <UiBaseButton 
                type="button" 
                variant="outline" 
                size="md"
                @click="removeOrderItem(index)"
                class="text-red-600 hover:text-red-700 hover:border-red-300 w-10 h-10 p-0">
                <TrashIcon class="w-4 h-4" />
              </UiBaseButton>
            </div>
          </div>

          <!-- Add Item Placeholder -->
          <div v-if="orderItems.length === 0" 
               class="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center">
            <CubeIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 text-sm sm:text-base">No items added yet. Click "Add Item" to start.</p>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <h2 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
        
        <div class="space-y-3">
          <div class="flex justify-between items-center text-sm sm:text-base">
            <span class="text-gray-600">Items ({{ orderItems.length }})</span>
            <span class="font-medium">${{ orderTotal.toFixed(2) }}</span>
          </div>
          <div class="border-t border-gray-200 pt-3">
            <div class="flex justify-between items-center text-lg sm:text-xl font-semibold">
              <span>Total</span>
              <span class="text-indigo-600">${{ orderTotal.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions - Mobile-First -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-4">
        <UiBaseButton 
          type="button" 
          variant="outline" 
          size="lg"
          class="order-2 sm:order-1"
          @click="$router.back()"
        >
          Cancel
        </UiBaseButton>
        <UiBaseButton 
          type="submit" 
          size="lg"
          class="order-1 sm:order-2"
          :loading="loading" 
          :disabled="!isFormValid"
        >
          {{ loading ? 'Creating...' : 'Create Order' }}
        </UiBaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Customer, Product, CreateOrderForm } from '~/types'
import { useCustomersStore } from '~/stores/customers'
import { useProductsStore } from '~/stores/products'
import { useOrdersStore } from '~/stores/orders'
import { debounce } from '~/utils/debounce'
import { XMarkIcon, PlusIcon, TrashIcon, CubeIcon } from '@heroicons/vue/24/outline'

interface OrderItem {
  product?: Product
  productSearch: string
  productOptions: Product[]
  quantity: number
  unit_price: number
  subtotal: number
}

// Stores
const customersStore = useCustomersStore()
const productsStore = useProductsStore()
const ordersStore = useOrdersStore()
const router = useRouter()

// Reactive state
const loading = ref(false)
const customerSearch = ref('')
const customerOptions = ref<Customer[]>([])
const customerSearchLoading = ref(false)
const selectedCustomer = ref<Customer | null>(null)

const orderItems = ref<OrderItem[]>([])

// Customer search
const searchCustomers = debounce(async () => {
  if (!customerSearch.value.trim()) {
    customerOptions.value = []
    return
  }
  
  customerSearchLoading.value = true
  try {
    customerOptions.value = await customersStore.searchCustomers(customerSearch.value)
  } catch (error) {
    console.error('Error searching customers:', error)
  } finally {
    customerSearchLoading.value = false
  }
}, 300)

const selectCustomer = (customer: Customer) => {
  selectedCustomer.value = customer
  customerSearch.value = customer.name
  customerOptions.value = []
}

const clearCustomerSelection = () => {
  selectedCustomer.value = null
  customerSearch.value = ''
  customerOptions.value = []
}

// Product search
const searchProducts = debounce(async (itemIndex: number) => {
  const item = orderItems.value[itemIndex]
  if (!item.productSearch.trim()) {
    item.productOptions = []
    return
  }
  
  try {
    item.productOptions = await productsStore.searchProducts(item.productSearch)
  } catch (error) {
    console.error('Error searching products:', error)
    item.productOptions = []
  }
}, 300)

const selectProduct = (itemIndex: number, product: Product) => {
  const item = orderItems.value[itemIndex]
  item.product = product
  item.productSearch = product.name
  item.unit_price = product.price
  item.productOptions = []
  updateItemTotal(itemIndex)
}

// Order items management
const addOrderItem = () => {
  orderItems.value.push({
    productSearch: '',
    productOptions: [],
    quantity: 1,
    unit_price: 0,
    subtotal: 0
  })
}

const removeOrderItem = (index: number) => {
  orderItems.value.splice(index, 1)
}

const updateItemTotal = (index: number) => {
  const item = orderItems.value[index]
  item.subtotal = item.quantity * item.unit_price
}

// Computed properties
const orderTotal = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + item.subtotal, 0)
})

const isFormValid = computed(() => {
  return selectedCustomer.value && 
         orderItems.value.length > 0 && 
         orderItems.value.every(item => item.product && item.quantity > 0 && item.unit_price > 0)
})

// Form submission
const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  loading.value = true
  try {
    const orderData: CreateOrderForm = {
      customer_id: selectedCustomer.value!.id,
      items: orderItems.value.map(item => ({
        product_id: item.product!.id,
        quantity: item.quantity,
        unit_price: item.unit_price
      }))
    }
    
    await ordersStore.createOrder(orderData)
    
    // Show success message and redirect
    await router.push('/orders')
  } catch (error) {
    console.error('Error creating order:', error)
    // Show error message
  } finally {
    loading.value = false
  }
}

// Initialize with one empty item
onMounted(() => {
  addOrderItem()
})
</script>