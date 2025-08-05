<template>
  <nav class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
              <BuildingOfficeIcon class="w-6 h-6 text-white" />
            </div>
            <NuxtLink to="/" class="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
              Inaplast
            </NuxtLink>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-1">
          <UiBaseButton
            :to="'/orders'"
            variant="ghost"
            color="gray"
            class="font-medium"
            :leading-icon="ShoppingCartIcon"
          >
            Orders
          </UiBaseButton>
          
          <UiBaseButton
            :to="'/customers'"
            variant="ghost"
            color="gray"
            class="font-medium"
            :leading-icon="UsersIcon"
          >
            Customers
          </UiBaseButton>
          
          <UiBaseButton
            :to="'/products'"
            variant="ghost"
            color="gray"
            class="font-medium"
            :leading-icon="CubeIcon"
          >
            Products
          </UiBaseButton>
        </div>

        <!-- User Menu -->
        <div class="flex items-center">
          <UiBaseDropdown :items="userMenuItems">
            <template #button>
              <div class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
                <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <UserIcon class="w-4 h-4 text-white" />
                </div>
                <span class="hidden sm:inline">{{ user?.email?.split('@')[0] || 'User' }}</span>
                <ChevronDownIcon class="w-4 h-4" />
              </div>
            </template>
            
            <template #account>
              <div class="text-left">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ user?.email?.split('@')[0] || 'User' }}
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {{ user?.email }}
                </p>
              </div>
            </template>
          </UiBaseDropdown>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <UiBaseButton
            variant="ghost"
            color="gray"
            :leading-icon="Bars3Icon"
            @click="mobileMenuOpen = !mobileMenuOpen"
          />
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 pt-4 pb-4">
        <div class="space-y-1">
          <UiBaseButton
            :to="'/orders'"
            variant="ghost"
            color="gray"
            class="w-full justify-start font-medium"
            :leading-icon="ShoppingCartIcon"
            @click="mobileMenuOpen = false"
          >
            Orders
          </UiBaseButton>
          
          <UiBaseButton
            :to="'/customers'"
            variant="ghost"
            color="gray"
            class="w-full justify-start font-medium"
            :leading-icon="UsersIcon"
            @click="mobileMenuOpen = false"
          >
            Customers
          </UiBaseButton>
          
          <UiBaseButton
            :to="'/products'"
            variant="ghost"
            color="gray"
            class="w-full justify-start font-medium"
            :leading-icon="CubeIcon"
            @click="mobileMenuOpen = false"
          >
            Products
          </UiBaseButton>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {
  BuildingOfficeIcon,
  ShoppingCartIcon,
  UsersIcon,
  CubeIcon,
  UserIcon,
  ChevronDownIcon,
  Bars3Icon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

// Composables
const user = useSupabaseUser()
const { signOut } = useAuth()
const toast = useToast()

// State
const signingOut = ref(false)
const mobileMenuOpen = ref(false)

// User menu items
const userMenuItems = computed(() => [
  [{
    slot: 'account',
    disabled: true
  }], 
  [{
    label: 'Profile',
    icon: UserCircleIcon,
    to: '/profile'
  }], 
  [{
    label: signingOut.value ? 'Signing out...' : 'Sign Out',
    icon: ArrowRightOnRectangleIcon,
    click: handleSignOut,
    disabled: signingOut.value
  }]
])

// Sign out handler
const handleSignOut = async () => {
  try {
    signingOut.value = true
    
    // Add smooth UX delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    await signOut()
    
    toast.success('Signed out successfully')
    
  } catch (error) {
    console.error('Sign out error:', error)
    
    toast.error('Error signing out', 'Please try again.')
  } finally {
    signingOut.value = false
  }
}

// Close mobile menu on route change
watch(() => useRoute().path, () => {
  mobileMenuOpen.value = false
})
</script>