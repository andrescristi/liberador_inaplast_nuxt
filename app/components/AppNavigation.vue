<template>
  <nav class="glass-nav sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <div class="flex items-center space-x-3">
            <div class="glass-icon-container w-10 h-10">
              <svg class="w-6 h-6 text-glass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
              </svg>
            </div>
            <NuxtLink to="/" class="text-xl font-semibold text-glass hover:text-white transition-colors duration-200">
              Order Management
            </NuxtLink>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <NuxtLink to="/orders" class="nav-link-magical">
            Orders
          </NuxtLink>
          <NuxtLink to="/customers" class="nav-link-magical">
            Customers
          </NuxtLink>
          <NuxtLink to="/products" class="nav-link-magical">
            Products
          </NuxtLink>
          
          <!-- User Menu -->
          <div class="relative ml-6" ref="userMenuRef">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 text-glass-secondary hover:text-glass hover:bg-glass-light px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group"
            >
              <div class="glass-icon-container w-8 h-8 group-hover:scale-110 transition-transform duration-200">
                <Icon name="lucide:user" class="w-4 h-4" />
              </div>
              <span>{{ user?.email?.split('@')[0] || 'Usuario' }}</span>
              <Icon name="lucide:chevron-down" class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': userMenuOpen }" />
            </button>
            
            <!-- Dropdown Menu -->
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-48 glass-card rounded-lg shadow-glass-xl z-50"
              >
                <div class="p-2 space-y-1">
                  <div class="px-3 py-2 text-xs text-glass-muted border-b border-glass-light">
                    {{ user?.email }}
                  </div>
                  <NuxtLink
                    to="/profile"
                    @click="userMenuOpen = false"
                    class="w-full flex items-center space-x-2 px-3 py-2 text-sm text-glass-secondary hover:text-glass hover:bg-glass-light rounded-lg transition-all duration-200 group"
                  >
                    <Icon name="lucide:user" class="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>Mi Perfil</span>
                  </NuxtLink>
                  <button
                    @click="handleSignOut"
                    class="w-full flex items-center space-x-2 px-3 py-2 text-sm text-glass-secondary hover:text-glass hover:bg-glass-light rounded-lg transition-all duration-200 group"
                    :disabled="signingOut"
                  >
                    <Icon name="lucide:log-out" class="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span v-if="signingOut" class="animate-pulse">Cerrando sesión...</span>
                    <span v-else>Cerrar Sesión</span>
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
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await signOut()
    
  } catch (error) {
    console.error('Sign out error:', error)
    signingOut.value = false
    // Could add a toast notification here
  }
}

// Close user menu when clicking outside
const handleClickOutside = (event: Event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    userMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Close menu on route change
watch(() => useRoute().path, () => {
  userMenuOpen.value = false
})
</script>