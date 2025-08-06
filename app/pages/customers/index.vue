<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-3xl font-semibold text-glass">Customers</h1>
        <p class="text-glass-secondary mt-2">Manage your customer database and relationships</p>
      </div>
      <DaisyButton
icon="lucide:user-plus"
class="mt-4 sm:mt-0"
@click="navigateTo('/customers/new')">
        Add Customer
      </DaisyButton>
    </div>

    <!-- Search and Filters -->
    <DaisyCard padding="lg" class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DaisyInput
          v-model="filters.search"
          placeholder="Search customers..."
          left-icon="lucide:search"
          clearable
          @input="debouncedSearch"
        />
        <div/> <!-- Spacer for future filters -->
        <div class="text-sm text-glass-secondary flex items-center">
          Showing {{ customersStore.customers.length }} of {{ customersStore.pagination.total }} customers
        </div>
      </div>
    </DaisyCard>

    <!-- Loading State -->
    <div v-if="customersStore.loading">
      <DaisyCard padding="lg">
        <div class="space-y-6">
          <div
v-for="n in 5"
:key="n"
class="flex items-center space-x-4">
            <div class="skeleton-glass h-12 w-12 rounded-full"/>
            <div class="flex-1 space-y-2">
              <div class="skeleton-glass h-4 w-full rounded"/>
              <div class="skeleton-glass h-3 w-3/4 rounded"/>
            </div>
            <div class="skeleton-glass h-8 w-16 rounded"/>
          </div>
        </div>
      </DaisyCard>
    </div>

    <!-- Customers Content -->
    <div v-else>
      <!-- Empty State -->
      <div v-if="customersStore.customers.length === 0" class="empty-state">
        <Icon name="lucide:users" class="empty-state-icon" />
        <h3 class="empty-state-title">No Customers Found</h3>
        <p class="empty-state-description">
          {{ hasActiveFilters ? 'Try adjusting your search to see more customers.' : 'Get started by adding your first customer.' }}
        </p>
        <Button class="mt-4" @click="hasActiveFilters ? clearFilters() : navigateTo('/customers/new')">
          {{ hasActiveFilters ? 'Clear Search' : 'Add First Customer' }}
        </Button>
      </div>

      <!-- Customers Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DaisyCard
          v-for="customer in customersStore.customers"
          :key="customer.id"
          padding="lg"
          interactive
          hover
          @click="navigateTo(`/customers/${customer.id}`)"
        >
          <div class="flex items-start space-x-4">
            <div class="glass-icon-container w-12 h-12 flex-shrink-0">
              <Icon name="lucide:user" class="w-6 h-6 text-primary-400" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-glass truncate">{{ customer.name }}</h3>
              <p class="text-sm text-glass-secondary truncate">{{ customer.email }}</p>
              <p class="text-sm text-glass-muted">{{ customer.phone }}</p>
              <div class="mt-3 flex items-center text-xs text-glass-muted">
                <Icon name="lucide:calendar" class="w-3 h-3 mr-1" />
                Added {{ formatDate(customer.created_at) }}
              </div>
            </div>
            <DaisyButton
              variant="ghost"
              size="sm"
              icon="lucide:more-horizontal"
              @click.stop="showCustomerActions(customer)"
            />
          </div>
        </DaisyCard>
      </div>

      <!-- Pagination -->
      <div v-if="customersStore.pagination.total_pages > 1" class="mt-6">
        <Pagination
          v-model="currentPage"
          :total-pages="customersStore.pagination.total_pages"
          :total="customersStore.pagination.total"
          :per-page="customersStore.pagination.per_page"
          @change="loadCustomers"
        />
      </div>
    </div>

    <!-- Customer Actions Modal -->
    <Modal v-model="showActionsModal" title="Customer Actions">
      <div v-if="selectedCustomer" class="space-y-4">
        <div>
          <h4 class="font-medium text-slate-900 mb-2">{{ selectedCustomer.name }}</h4>
          <p class="text-sm text-slate-600">{{ selectedCustomer.email }}</p>
          <p class="text-sm text-slate-600">{{ selectedCustomer.phone }}</p>
        </div>
        
        <div class="space-y-2">
          <Button
            variant="secondary"
            class="w-full"
            @click="navigateTo(`/customers/${selectedCustomer.id}`)"
          >
            View Profile
          </Button>
          <Button
            variant="secondary"
            class="w-full"
            @click="navigateTo(`/customers/${selectedCustomer.id}/edit`)"
          >
            Edit Customer
          </Button>
          <Button
            variant="secondary"
            class="w-full"
            @click="createOrderForCustomer"
          >
            Create Order
          </Button>
          <Button
            variant="destructive"
            class="w-full"
            @click="deleteCustomer"
          >
            Delete Customer
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
import { useCustomersStore } from '~/stores/customers'
import type { Customer, CustomerFilters } from '~/types'
import { debounce } from '~/utils/debounce'

const customersStore = useCustomersStore()

// Reactive state
const currentPage = ref(1)
const showActionsModal = ref(false)
const selectedCustomer = ref<Customer | null>(null)

const filters = reactive<CustomerFilters>({
  search: ''
})

// Computed
const hasActiveFilters = computed(() => {
  return !!filters.search
})

// Methods
const loadCustomers = async (page = 1) => {
  currentPage.value = page
  await customersStore.fetchCustomers(page, { ...filters })
}

const clearFilters = () => {
  filters.search = ''
  loadCustomers(1)
}

const debouncedSearch = debounce(() => {
  currentPage.value = 1
  loadCustomers(1)
}, 300)

const showCustomerActions = (customer: Customer) => {
  selectedCustomer.value = customer
  showActionsModal.value = true
}

const createOrderForCustomer = () => {
  if (selectedCustomer.value) {
    navigateTo(`/orders/new?customer_id=${selectedCustomer.value.id}`)
    showActionsModal.value = false
  }
}

const deleteCustomer = async () => {
  if (!selectedCustomer.value) return
  
  if (confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
    try {
      await customersStore.deleteCustomer(selectedCustomer.value.id)
      showActionsModal.value = false
      await loadCustomers(currentPage.value)
    } catch (error) {
      console.error('Failed to delete customer:', error)
    }
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Load initial data
await loadCustomers()

// SEO
useSeoMeta({
  title: 'Customers - Order Management',
  description: 'Manage your customer database and relationships with search and filtering capabilities.'
})
</script>