<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ isEditing ? 'Edit Customer' : 'Create New Customer' }}
      </h1>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Information -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <Input
              id="name"
              v-model="form.name"
              placeholder="Enter customer name"
              :error="errors.name"
              required
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="customer@email.com"
              :error="errors.email"
              required
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <Input
              id="phone"
              v-model="form.phone"
              type="tel"
              placeholder="(555) 123-4567"
              :error="errors.phone"
            />
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
          </div>

          <div>
            <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <Input
              id="address"
              v-model="form.address"
              placeholder="Full address"
              :error="errors.address"
            />
            <p v-if="errors.address" class="mt-1 text-sm text-red-600">{{ errors.address }}</p>
          </div>
        </div>
      </div>

      <!-- Customer Statistics (if editing) -->
      <div v-if="isEditing && customerStats" class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Customer Statistics</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-indigo-600">{{ customerStats.orders_count }}</div>
            <div class="text-sm text-gray-600">Total Orders</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">${{ customerStats.total_spent.toFixed(2) }}</div>
            <div class="text-sm text-gray-600">Total Spent</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-600">
              {{ customerStats.orders_count > 0 ? (customerStats.total_spent / customerStats.orders_count).toFixed(2) : '0.00' }}
            </div>
            <div class="text-sm text-gray-600">Average Order</div>
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
          {{ isEditing ? 'Update Customer' : 'Create Customer' }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Customer, CreateCustomerForm } from '~/types'
import { useCustomersStore } from '~/stores/customers'

interface Props {
  customerId?: string
}

const props = defineProps<Props>()

// Stores
const customersStore = useCustomersStore()
const router = useRouter()

// Reactive state
const loading = ref(false)
const isEditing = computed(() => !!props.customerId)

const form = reactive<CreateCustomerForm>({
  name: '',
  email: '',
  phone: '',
  address: ''
})

const errors = reactive({
  name: '',
  email: '',
  phone: '',
  address: ''
})

const customerStats = ref<{ orders_count: number; total_spent: number } | null>(null)

// Validation
const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // Name validation
  if (!form.name.trim()) {
    errors.name = 'Name is required'
    isValid = false
  } else if (form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
    isValid = false
  }

  // Email validation
  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      errors.email = 'Please enter a valid email address'
      isValid = false
    }
  }

  // Phone validation (optional but if provided, should be valid)
  if (form.phone && form.phone.trim()) {
    const phoneRegex = /^[\+]?[0-9\(\)\-\s]{10,}$/
    if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number'
      isValid = false
    }
  }

  return isValid
}

const isFormValid = computed(() => {
  return form.name.trim() && form.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
})

// Load customer data if editing
const loadCustomer = async () => {
  if (!props.customerId) return

  loading.value = true
  try {
    await customersStore.fetchCustomerById(props.customerId)
    const customer = customersStore.currentCustomer
    
    if (customer) {
      form.name = customer.name
      form.email = customer.email
      form.phone = customer.phone
      form.address = customer.address

      // If customer has additional stats, load them
      const customersResponse = await customersStore.fetchCustomers(1, {})
      const customerWithStats = customersStore.customers.find(c => c.id === props.customerId)
      if (customerWithStats && 'orders_count' in customerWithStats) {
        customerStats.value = {
          orders_count: (customerWithStats as any).orders_count,
          total_spent: (customerWithStats as any).total_spent
        }
      }
    }
  } catch (error) {
    console.error('Error loading customer:', error)
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
      await customersStore.updateCustomer(props.customerId!, form)
    } else {
      await customersStore.createCustomer(form)
    }
    
    // Show success message and redirect
    await router.push('/customers')
  } catch (error) {
    console.error('Error saving customer:', error)
    // Show error message
  } finally {
    loading.value = false
  }
}

// Real-time validation
watch(() => form.email, () => {
  if (errors.email && form.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailRegex.test(form.email)) {
      errors.email = ''
    }
  }
})

watch(() => form.name, () => {
  if (errors.name && form.name.trim().length >= 2) {
    errors.name = ''
  }
})

watch(() => form.phone, () => {
  if (errors.phone && form.phone) {
    const phoneRegex = /^[\+]?[0-9\(\)\-\s]{10,}$/
    if (phoneRegex.test(form.phone.replace(/\s/g, ''))) {
      errors.phone = ''
    }
  }
})

// Initialize
onMounted(() => {
  if (props.customerId) {
    loadCustomer()
  }
})
</script>