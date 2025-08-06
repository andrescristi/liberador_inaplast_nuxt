<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ isEditing ? 'Edit Product' : 'Create New Product' }}
      </h1>
    </div>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- Basic Information -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Product Information</h2>
        
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <Input
                id="name"
                v-model="form.name"
                placeholder="Enter product name"
                :error="errors.name"
                required
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>

            <div>
              <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="price"
                  v-model.number="form.price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="pl-8"
                  :error="errors.price"
                  required
                />
              </div>
              <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price }}</p>
            </div>
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              placeholder="Product description..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              :class="{ 'border-red-300': errors.description }"
            />
            <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
          </div>
        </div>
      </div>

      <!-- Inventory Management -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Inventory</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="stock_quantity" class="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity *
            </label>
            <Input
              id="stock_quantity"
              v-model.number="form.stock_quantity"
              type="number"
              min="0"
              placeholder="0"
              :error="errors.stock_quantity"
              required
            />
            <p v-if="errors.stock_quantity" class="mt-1 text-sm text-red-600">{{ errors.stock_quantity }}</p>
          </div>

          <div class="flex items-center space-x-4 pt-6">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 rounded-full" :class="stockStatusColor"/>
              <span class="text-sm font-medium" :class="stockStatusTextColor">
                {{ stockStatusText }}
              </span>
            </div>
          </div>
        </div>

        <!-- Stock Alert -->
        <div
v-if="form.stock_quantity <= 10 && form.stock_quantity > 0" 
             class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div class="flex items-center">
            <Icon name="lucide:alert-triangle" class="w-5 h-5 text-yellow-600 mr-2" />
            <p class="text-yellow-800">
              <strong>Low Stock Alert:</strong> This product is running low on inventory.
            </p>
          </div>
        </div>

        <div
v-if="form.stock_quantity === 0" 
             class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center">
            <Icon name="lucide:x-circle" class="w-5 h-5 text-red-600 mr-2" />
            <p class="text-red-800">
              <strong>Out of Stock:</strong> This product is currently unavailable.
            </p>
          </div>
        </div>
      </div>

      <!-- Product Statistics (if editing) -->
      <div v-if="isEditing && productStats" class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Product Statistics</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-indigo-600">{{ productStats.times_ordered }}</div>
            <div class="text-sm text-gray-600">Times Ordered</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">${{ productStats.total_revenue.toFixed(2) }}</div>
            <div class="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-600">
              {{ productStats.times_ordered > 0 ? (productStats.total_revenue / productStats.times_ordered).toFixed(2) : '0.00' }}
            </div>
            <div class="text-sm text-gray-600">Avg. Revenue per Order</div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex items-center justify-end space-x-4">
        <Button
type="button"
variant="outline"
@click="$router.back()">
          Cancel
        </Button>
        <Button 
          type="submit" 
          :loading="loading" 
          :disabled="!isFormValid">
          {{ isEditing ? 'Update Product' : 'Create Product' }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { CreateProductForm } from '~/types'
import { useProductsStore } from '~/stores/products'

interface Props {
  productId?: string
}

const props = defineProps<Props>()

// Stores
const productsStore = useProductsStore()
const router = useRouter()

// Reactive state
const loading = ref(false)
const isEditing = computed(() => !!props.productId)

const form = reactive<CreateProductForm>({
  name: '',
  description: '',
  price: 0,
  stock_quantity: 0
})

const errors = reactive({
  name: '',
  description: '',
  price: '',
  stock_quantity: ''
})

const productStats = ref<{ times_ordered: number; total_revenue: number } | null>(null)

// Stock status computed properties
const stockStatusColor = computed(() => {
  if (form.stock_quantity === 0) return 'bg-red-500'
  if (form.stock_quantity <= 10) return 'bg-yellow-500'
  return 'bg-green-500'
})

const stockStatusTextColor = computed(() => {
  if (form.stock_quantity === 0) return 'text-red-700'
  if (form.stock_quantity <= 10) return 'text-yellow-700'
  return 'text-green-700'
})

const stockStatusText = computed(() => {
  if (form.stock_quantity === 0) return 'Out of Stock'
  if (form.stock_quantity <= 10) return 'Low Stock'
  return 'In Stock'
})

// Validation
const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // Name validation
  if (!form.name.trim()) {
    errors.name = 'Product name is required'
    isValid = false
  } else if (form.name.trim().length < 2) {
    errors.name = 'Product name must be at least 2 characters'
    isValid = false
  }

  // Price validation
  if (form.price === null || form.price === undefined) {
    errors.price = 'Price is required'
    isValid = false
  } else if (form.price < 0) {
    errors.price = 'Price must be greater than or equal to 0'
    isValid = false
  }

  // Stock quantity validation
  if (form.stock_quantity === null || form.stock_quantity === undefined) {
    errors.stock_quantity = 'Stock quantity is required'
    isValid = false
  } else if (form.stock_quantity < 0) {
    errors.stock_quantity = 'Stock quantity must be greater than or equal to 0'
    isValid = false
  }

  return isValid
}

const isFormValid = computed(() => {
  return form.name.trim() && 
         form.price >= 0 && 
         form.stock_quantity >= 0
})

// Load product data if editing
const loadProduct = async () => {
  if (!props.productId) return

  loading.value = true
  try {
    await productsStore.fetchProductById(props.productId)
    const product = productsStore.currentProduct
    
    if (product) {
      form.name = product.name
      form.description = product.description
      form.price = product.price
      form.stock_quantity = product.stock_quantity

      // If product has additional stats, load them
      const _productsResponse = await productsStore.fetchProducts(1, {})
      const productWithStats = productsStore.products.find(p => p.id === props.productId)
      if (productWithStats && 'times_ordered' in productWithStats) {
        productStats.value = {
          times_ordered: (productWithStats as { times_ordered: number }).times_ordered,
          total_revenue: (productWithStats as { total_revenue: number }).total_revenue
        }
      }
    }
  } catch {
    // Handle product loading error silently
  } finally {
    loading.value = false
  }
}

// Form submission
const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    if (isEditing.value) {
      await productsStore.updateProduct(props.productId!, form)
    } else {
      await productsStore.createProduct(form)
    }
    
    // Show success message and redirect
    await router.push('/products')
  } catch {
    // Handle product saving error silently
    // Show error message
  } finally {
    loading.value = false
  }
}

// Real-time validation
watch(() => form.name, () => {
  if (errors.name && form.name.trim().length >= 2) {
    errors.name = ''
  }
})

watch(() => form.price, () => {
  if (errors.price && form.price >= 0) {
    errors.price = ''
  }
})

watch(() => form.stock_quantity, () => {
  if (errors.stock_quantity && form.stock_quantity >= 0) {
    errors.stock_quantity = ''
  }
})

// Initialize
onMounted(() => {
  if (props.productId) {
    loadProduct()
  }
})
</script>