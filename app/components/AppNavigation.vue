<template>
  <nav class="nav sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 lg:px-6">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Icon name="lucide:layers" class="w-4 h-4 text-primary" />
            </div>
            <NuxtLink to="/" class="text-lg font-semibold text-gray-900 hover:text-primary transition-colors">
              Inaplast
            </NuxtLink>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <NuxtLink to="/orders" class="nav-link">
            Orders
          </NuxtLink>
          <NuxtLink to="/customers" class="nav-link">
            Customers
          </NuxtLink>
          <NuxtLink to="/products" class="nav-link">
            Products
          </NuxtLink>
          
          <!-- User Menu -->
          <div class="relative ml-8" ref="userMenuRef">
            <button
              @click="toggleUserMenu"
              :aria-expanded="userMenuOpen"
              aria-haspopup="true"
              :aria-label="`User menu for ${user?.email?.split('@')[0] || 'User'}`"
              class="btn-secondary flex items-center gap-2"
            >
              <div class="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Icon name="lucide:user" class="w-4 h-4 text-gray-600" />
              </div>
              <span class="hidden sm:inline font-medium">{{ user?.email?.split('@')[0] || 'User' }}</span>
              <Icon 
                name="lucide:chevron-down" 
                class="w-3 h-3 transition-transform" 
                :class="{ 'rotate-180': userMenuOpen }" 
              />
            </button>
            
            <!-- Dropdown Menu -->
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                role="menu"
                :aria-hidden="!userMenuOpen"
              >
                <div class="py-1">
                  <!-- User info header -->
                  <div class="px-3 py-2 border-b border-gray-100 mb-1">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ user?.email?.split('@')[0] || 'User' }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
                  </div>
                  
                  <!-- Menu items -->
                  <NuxtLink
                    to="/profile"
                    @click="userMenuOpen = false"
                    class="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                    role="menuitem"
                  >
                    <Icon name="lucide:user" class="w-4 h-4" />
                    <span>Profile</span>
                  </NuxtLink>
                  
                  <button
                    @click="handleSignOut"
                    class="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="signingOut"
                    role="menuitem"
                  >
                    <Icon 
                      :name="signingOut ? 'lucide:loader-2' : 'lucide:log-out'" 
                      :class="['w-4 h-4', { 'animate-spin': signingOut }]" 
                    />
                    <span>{{ signingOut ? 'Signing out...' : 'Sign Out' }}</span>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// Composables
const user = useSupabaseUser()
const { signOut } = useAuth()

// User menu state
const userMenuOpen = ref(false)
const userMenuRef = ref()
const signingOut = ref(false)

// User menu functions
const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const handleSignOut = async () => {
  try {
    signingOut.value = true
    userMenuOpen.value = false
    
    // Add a small delay for smooth UX with loading state
    await new Promise(resolve => setTimeout(resolve, 300))
    
    await signOut()
    
    // Success feedback could be added here
    
  } catch (error) {
    console.error('Sign out error:', error)
    signingOut.value = false
    
    // Show error feedback
    const { toastError } = useDaisyComponents()
    toastError('Error signing out. Please try again.')
    
    // Re-open menu to allow retry
    userMenuOpen.value = true
  }
}

// Enhanced click outside handling with better performance
const handleClickOutside = (event: Event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    userMenuOpen.value = false
  }
}

// Keyboard navigation support
const handleKeyDown = (event: KeyboardEvent) => {
  if (userMenuOpen.value) {
    switch (event.key) {
      case 'Escape':
        userMenuOpen.value = false
        // Focus back to trigger button
        const triggerButton = userMenuRef.value?.querySelector('button')
        if (triggerButton) triggerButton.focus()
        break
      case 'Tab':
        // Let browser handle tab navigation within menu
        break
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault()
        const menuItems = userMenuRef.value?.querySelectorAll('[role="menuitem"]')
        if (menuItems && menuItems.length > 0) {
          const currentIndex = Array.from(menuItems).findIndex(item => item === document.activeElement)
          const nextIndex = event.key === 'ArrowDown' 
            ? (currentIndex + 1) % menuItems.length
            : currentIndex <= 0 ? menuItems.length - 1 : currentIndex - 1
          ;(menuItems[nextIndex] as HTMLElement).focus()
        }
        break
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
})

// Close menu on route change
watch(() => useRoute().path, () => {
  userMenuOpen.value = false
})
</script>