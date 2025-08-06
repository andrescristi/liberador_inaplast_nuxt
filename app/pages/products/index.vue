<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Products</h1>
        <p class="text-slate-600 mt-2">Manage your product inventory and catalog</p>
      </div>
      <Button class="mt-4 sm:mt-0" @click="navigateTo('/products/new')">
        <Icon name="lucide:package-plus" class="w-4 h-4 mr-2" />
        Add Product
      </Button>
    </div>

    <!-- Search and Filters -->
    <Card class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          v-model="filters.search"
          placeholder="Search products..."
          icon="lucide:search"
          @input="debouncedSearch"
        />
        <Select
          v-model="filters.low_stock"
          :options="stockOptions"
          placeholder="Stock level"
          @change="applyFilters"
        />
        <div/> <!-- Spacer -->
        <div class="text-sm text-slate-600 flex items-center">
          Showing {{ productsStore.products.length }} of {{ productsStore.pagination.total }} products
        </div>
      </div>
    </Card>

    <!-- Loading State -->
    <div v-if="productsStore.loading">
      <Card>
        <div class="space-y-4">
          <div
v-for="n in 5"
:key="n"
class="flex items-center space-x-4 p-4">
            <div class="skeleton h-16 w-16 rounded-lg"/>
            <div class="flex-1 space-y-2">
              <div class="skeleton h-4 w-full"/>
              <div class="skeleton h-3 w-3/4"/>
              <div class="skeleton h-3 w-1/4"/>
            </div>
            <div class="skeleton h-8 w-16"/>
          </div>
        </div>
      </Card>
    </div>

    <!-- Products Content -->
    <div v-else>
      <!-- Empty State -->
      <div v-if="productsStore.products.length === 0" class="empty-state">
        <Icon name="lucide:package" class="empty-state-icon" />
        <h3 class="empty-state-title">No Products Found</h3>
        <p class="empty-state-description">
          {{ hasActiveFilters ? 'Try adjusting your filters to see more products.' : 'Get started by adding your first product to inventory.' }}
        </p>
        <Button class="mt-4" @click="hasActiveFilters ? clearFilters() : navigateTo('/products/new')">
          {{ hasActiveFilters ? 'Clear Filters' : 'Add First Product' }}
        </Button>
      </div>

      <!-- Products Table (Desktop) -->
      <Card v-else class="hidden md:block">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Product</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Price</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Stock</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Status</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="product in productsStore.products"
                :key="product.id"
                class="hover:bg-slate-50 transition-colors duration-150"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="lucide:package" class="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <div class="text-sm font-medium text-slate-900">{{ product.name }}</div>
                      <div class="text-sm text-slate-500">{{ product.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-slate-900">{{ formatCurrency(product.price) }}</td>
                <td class="px-6 py-4">
                  <div class="text-sm text-slate-900">{{ product.stock_quantity }} units</div>
                  <div v-if="product.stock_quantity < 10" class="text-xs text-red-600">Low stock</div>
                </td>
                <td class="px-6 py-4">
                  <Badge :variant="getStockStatus(product.stock_quantity)" size="sm">
                    {{ getStockStatusText(product.stock_quantity) }}
                  </Badge>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="navigateTo(`/products/${product.id}`)"
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="navigateTo(`/products/${product.id}/edit`)"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon-only
                      icon="lucide:more-horizontal"
                      @click="showProductActions(product)"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <!-- Products Grid (Mobile) -->
      <div v-if="productsStore.products.length > 0" class="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          v-for="product in productsStore.products"
          :key="product.id"
          hover
          @click="navigateTo(`/products/${product.id}`)"
        >
          <div class="space-y-3">
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="lucide:package" class="w-6 h-6 text-slate-400" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-slate-900 truncate">{{ product.name }}</h3>
                  <p class="text-xs text-slate-500 truncate">{{ product.description }}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon-only
                icon="lucide:more-horizontal"
                @click.stop="showProductActions(product)"
              />
            </div>
            
            <div class="flex justify-between items-center">
              <div class="text-lg font-semibold text-slate-900">{{ formatCurrency(product.price) }}</div>
              <div class="text-right">
                <div class="text-sm text-slate-600">{{ product.stock_quantity }} units</div>
                <Badge :variant="getStockStatus(product.stock_quantity)" size="sm">
                  {{ getStockStatusText(product.stock_quantity) }}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Pagination -->
      <div v-if="productsStore.pagination.total_pages > 1" class="mt-6">
        <Pagination
          v-model="currentPage"
          :total-pages="productsStore.pagination.total_pages"
          :total="productsStore.pagination.total"
          :per-page="productsStore.pagination.per_page"
          @change="loadProducts"
        />
      </div>
    </div>

    <!-- Product Actions Modal -->
    <Modal v-model="showActionsModal" title="Product Actions">
      <div v-if="selectedProduct" class="space-y-4">
        <div>
          <h4 class="font-medium text-slate-900 mb-2">{{ selectedProduct.name }}</h4>
          <p class="text-sm text-slate-600">{{ formatCurrency(selectedProduct.price) }}</p>
          <p class="text-sm text-slate-600">Stock: {{ selectedProduct.stock_quantity }} units</p>
        </div>
        
        <div class="space-y-2">
          <Button
            variant="secondary"
            class="w-full"
            @click="navigateTo(`/products/${selectedProduct.id}`)"
          >
            View Details
          </Button>
          <Button
            variant="secondary"
            class="w-full"
            @click="navigateTo(`/products/${selectedProduct.id}/edit`)"
          >
            Edit Product
          </Button>
          <Button
            variant="destructive"
            class="w-full"
            @click="deleteProduct"
          >
            Delete Product
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
import { useProductsStore } from '~/stores/products'
import type { Product, ProductFilters } from '~/types'
import { debounce } from '~/utils/debounce'

const productsStore = useProductsStore()

// Reactive state
const currentPage = ref(1)
const showActionsModal = ref(false)
const selectedProduct = ref<Product | null>(null)

const filters = reactive<ProductFilters>({
  search: '',
  low_stock: false
})

// Options for dropdowns
const stockOptions = [
  { value: false, label: 'All Stock Levels' },
  { value: true, label: 'Low Stock Only' }
]

// Computed
const hasActiveFilters = computed(() => {
  return filters.search || filters.low_stock
})

// Methods
const loadProducts = async (page = 1) => {
  currentPage.value = page
  await productsStore.fetchProducts(page, { ...filters })
}

const applyFilters = () => {
  currentPage.value = 1
  loadProducts(1)
}

const clearFilters = () => {
  Object.assign(filters, {
    search: '',
    low_stock: false
  })
  applyFilters()
}

const debouncedSearch = debounce(() => {
  applyFilters()
}, 300)

const showProductActions = (product: Product) => {
  selectedProduct.value = product
  showActionsModal.value = true
}

const deleteProduct = async () => {
  if (!selectedProduct.value) return
  
  if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
    try {
      await productsStore.deleteProduct(selectedProduct.value.id)
      showActionsModal.value = false
      await loadProducts(currentPage.value)
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }
}

const getStockStatus = (stock: number) => {
  if (stock === 0) return 'error'
  if (stock < 10) return 'warning'
  return 'success'
}

const getStockStatusText = (stock: number) => {
  if (stock === 0) return 'Out of Stock'
  if (stock < 10) return 'Low Stock'
  return 'In Stock'
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Load initial data
await loadProducts()

// SEO
useSeoMeta({
  title: 'Products - Order Management',
  description: 'Manage your product inventory and catalog with stock tracking and search capabilities.'
})
</script>