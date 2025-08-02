<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Create New Order</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Customer Selection -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
        
        <div class="space-y-4">
          <div>
            <label for="customer-search" class="block text-sm font-medium text-gray-700 mb-2">
              Search Customer
            </label>
            <div class="relative">
              <Input
                id="customer-search"
                v-model="customerSearch"
                placeholder="Search by name or email..."
                @input="searchCustomers"
                :loading="customerSearchLoading"
              />
              
              <!-- Customer Dropdown -->
              <div v-if="customerOptions.length > 0 && customerSearch" 
                   class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto">
                <div v-for="customer in customerOptions" 
                     :key="customer.id"
                     @click="selectCustomer(customer)"
                     class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white">
                  <div class="flex items-center">
                    <span class="font-normal truncate">{{ customer.name }}</span>
                    <span class="text-gray-500 ml-2 truncate">{{ customer.email }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Selected Customer Display -->
          <div v-if="selectedCustomer" class="p-4 bg-indigo-50 rounded-lg">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-indigo-900">{{ selectedCustomer.name }}</h3>
                <p class="text-sm text-indigo-700">{{ selectedCustomer.email }}</p>
                <p class="text-sm text-indigo-700">{{ selectedCustomer.phone }}</p>
              </div>
              <Button variant="ghost" size="sm" @click="clearCustomerSelection">
                <Icon name="lucide:x" class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Items -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Order Items</h2>
          <Button type="button" @click="addOrderItem" variant="outline" size="sm">
            <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div class="space-y-4">
          <div v-for="(item, index) in orderItems" 
               :key="index"
               class="border border-gray-200 rounded-lg p-4">
            
            <!-- Product Search -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Search Product
              </label>
              <div class="relative">
                <Input
                  v-model="item.productSearch"
                  placeholder="Search products..."
                  @input="searchProducts(index)"
                />
                
                <!-- Product Dropdown -->
                <div v-if="item.productOptions.length > 0 && item.productSearch" 
                     class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto">
                  <div v-for="product in item.productOptions" 
                       :key="product.id"
                       @click="selectProduct(index, product)"
                       class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white">
                    <div class="flex items-center justify-between">
                      <div>
                        <span class="font-normal truncate">{{ product.name }}</span>
                        <p class="text-sm text-gray-500">Stock: {{ product.stock_quantity }}</p>
                      </div>
                      <span class="text-green-600 font-medium">${{ product.price.toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Selected Product Info -->
            <div v-if="item.product" class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="md:col-span-1">
                <div class="p-3 bg-gray-50 rounded-lg">
                  <h4 class="font-medium text-gray-900">{{ item.product.name }}</h4>
                  <p class="text-sm text-gray-600">Price: ${{ item.product.price.toFixed(2) }}</p>
                  <p class="text-sm text-gray-600">Stock: {{ item.product.stock_quantity }}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 md:col-span-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <Input
                    v-model.number="item.quantity"
                    type="number"
                    min="1"
                    :max="item.product.stock_quantity"
                    @input="updateItemTotal(index)"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Unit Price
                  </label>
                  <Input
                    v-model.number="item.unit_price"
                    type="number"
                    step="0.01"
                    min="0"
                    @input="updateItemTotal(index)"
                  />
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between mt-4">
              <div class="text-lg font-semibold text-gray-900">
                Subtotal: ${{ item.subtotal.toFixed(2) }}
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                @click="removeOrderItem(index)"
                class="text-red-600 hover:text-red-700">
                <Icon name="lucide:trash-2" class="w-4 h-4" />
              </Button>
            </div>
          </div>

          <!-- Add Item Placeholder -->
          <div v-if="orderItems.length === 0" 
               class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Icon name="lucide:package" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500">No items added yet. Click "Add Item" to start.</p>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
        
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">Items ({{ orderItems.length }})</span>
            <span class="font-medium">${{ orderTotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${{ orderTotal.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex items-center justify-end space-x-4">
        <Button type="button" variant="outline" @click="$router.back()">
          Cancel
        </Button>
        <Button 
          type="submit" 
          :loading="loading" 
          :disabled="!isFormValid">
          Create Order
        </Button>
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