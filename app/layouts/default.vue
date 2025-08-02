<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Desktop Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-blue-600">
              OrderManager
            </NuxtLink>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex space-x-8">
            <NuxtLink 
              to="/" 
              class="nav-link"
              :class="{ 'active': $route.path === '/' }"
            >
              <Icon name="lucide:home" class="w-4 h-4 mr-2" />
              Dashboard
            </NuxtLink>
            <NuxtLink 
              to="/orders" 
              class="nav-link"
              :class="{ 'active': $route.path.startsWith('/orders') }"
            >
              <Icon name="lucide:shopping-cart" class="w-4 h-4 mr-2" />
              Orders
            </NuxtLink>
            <NuxtLink 
              to="/customers" 
              class="nav-link"
              :class="{ 'active': $route.path.startsWith('/customers') }"
            >
              <Icon name="lucide:users" class="w-4 h-4 mr-2" />
              Customers
            </NuxtLink>
            <NuxtLink 
              to="/products" 
              class="nav-link"
              :class="{ 'active': $route.path.startsWith('/products') }"
            >
              <Icon name="lucide:package" class="w-4 h-4 mr-2" />
              Products
            </NuxtLink>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <button class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
              <Icon name="lucide:bell" class="w-5 h-5" />
            </button>
            <button class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
              <Icon name="lucide:settings" class="w-5 h-5" />
            </button>
            <div class="relative">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Icon name="lucide:user" class="w-4 h-4 text-white" />
              </button>
              
              <!-- User Dropdown -->
              <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-50">
                <div class="py-1">
                  <div v-if="user" class="px-4 py-2 text-sm text-slate-600 border-b border-slate-100">
                    {{ user.email }}
                  </div>
                  <button 
                    @click="handleLogout"
                    class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center"
                  >
                    <Icon name="lucide:log-out" class="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile menu button -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-slate-400 hover:text-slate-600"
          >
            <Icon :name="mobileMenuOpen ? 'lucide:x' : 'lucide:menu'" class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-slate-200 bg-white">
        <div class="space-y-1 px-4 py-3">
          <NuxtLink 
            to="/" 
            class="mobile-nav-link"
            :class="{ 'active': $route.path === '/' }"
            @click="mobileMenuOpen = false"
          >
            <Icon name="lucide:home" class="w-4 h-4 mr-3" />
            Dashboard
          </NuxtLink>
          <NuxtLink 
            to="/orders" 
            class="mobile-nav-link"
            :class="{ 'active': $route.path.startsWith('/orders') }"
            @click="mobileMenuOpen = false"
          >
            <Icon name="lucide:shopping-cart" class="w-4 h-4 mr-3" />
            Orders
          </NuxtLink>
          <NuxtLink 
            to="/customers" 
            class="mobile-nav-link"
            :class="{ 'active': $route.path.startsWith('/customers') }"
            @click="mobileMenuOpen = false"
          >
            <Icon name="lucide:users" class="w-4 h-4 mr-3" />
            Customers
          </NuxtLink>
          <NuxtLink 
            to="/products" 
            class="mobile-nav-link"
            :class="{ 'active': $route.path.startsWith('/products') }"
            @click="mobileMenuOpen = false"
          >
            <Icon name="lucide:package" class="w-4 h-4 mr-3" />
            Products
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Mobile Bottom Navigation (shown only on small screens) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40">
      <div class="flex justify-around py-2">
        <NuxtLink 
          to="/" 
          class="mobile-nav-item"
          :class="{ 'active': $route.path === '/' }"
        >
          <Icon name="lucide:home" class="mobile-nav-icon" />
          <span class="text-xs">Dashboard</span>
        </NuxtLink>
        <NuxtLink 
          to="/orders" 
          class="mobile-nav-item"
          :class="{ 'active': $route.path.startsWith('/orders') }"
        >
          <Icon name="lucide:shopping-cart" class="mobile-nav-icon" />
          <span class="text-xs">Orders</span>
        </NuxtLink>
        <NuxtLink 
          to="/customers" 
          class="mobile-nav-item"
          :class="{ 'active': $route.path.startsWith('/customers') }"
        >
          <Icon name="lucide:users" class="mobile-nav-icon" />
          <span class="text-xs">Customers</span>
        </NuxtLink>
        <NuxtLink 
          to="/products" 
          class="mobile-nav-item"
          :class="{ 'active': $route.path.startsWith('/products') }"
        >
          <Icon name="lucide:package" class="mobile-nav-icon" />
          <span class="text-xs">Products</span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Mobile padding for bottom nav -->
    <div class="md:hidden h-16"></div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { user, signOut } = useAuth()
const mobileMenuOpen = ref(false)
const showUserMenu = ref(false)

// Close mobile menu when route changes
watch(() => useRoute().path, () => {
  mobileMenuOpen.value = false
})

// Close user menu when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      showUserMenu.value = false
    }
  })
})

const handleLogout = async () => {
  try {
    await signOut()
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
</script>

<style scoped>
.nav-link {
  @apply flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200;
}

.nav-link.active {
  @apply text-blue-600 bg-blue-100 font-semibold;
}

.mobile-nav-link {
  @apply flex items-center px-3 py-2 text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200;
}

.mobile-nav-link.active {
  @apply text-blue-600 bg-blue-100 font-semibold;
}

.mobile-nav-item {
  @apply flex flex-col items-center py-2 px-3 text-slate-500 hover:text-blue-600 rounded-lg transition-colors duration-200;
}

.mobile-nav-item.active {
  @apply text-blue-600 bg-blue-50;
}

.mobile-nav-icon {
  @apply w-6 h-6 mb-1;
}
</style>