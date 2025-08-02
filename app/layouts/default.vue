<template>
  <!-- Magical Particles Background -->
  <MagicalParticles :count="10" :enabled="true" />
  
  <div class="min-h-screen relative z-10">
    <!-- Desktop Header -->
    <header class="glass-nav sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-glass hover:text-white transition-colors duration-200">
              OrderManager
            </NuxtLink>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex space-x-8">
            <NuxtLink 
              to="/" 
              class="nav-link-magical"
              :class="{ 'active': $route.path === '/' }"
            >
              <Icon name="lucide:home" class="w-4 h-4 mr-2" />
              Dashboard
            </NuxtLink>
            <NuxtLink 
              to="/orders" 
              class="nav-link-magical"
              :class="{ 'active': $route.path.startsWith('/orders') }"
            >
              <Icon name="lucide:shopping-cart" class="w-4 h-4 mr-2" />
              Orders
            </NuxtLink>
            <NuxtLink 
              to="/customers" 
              class="nav-link-magical"
              :class="{ 'active': $route.path.startsWith('/customers') }"
            >
              <Icon name="lucide:users" class="w-4 h-4 mr-2" />
              Customers
            </NuxtLink>
            <NuxtLink 
              to="/products" 
              class="nav-link-magical"
              :class="{ 'active': $route.path.startsWith('/products') }"
            >
              <Icon name="lucide:package" class="w-4 h-4 mr-2" />
              Products
            </NuxtLink>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <button class="glass-icon-container w-10 h-10 hover:animate-bounce" @click="showNotifications">
              <Icon name="lucide:bell" class="w-5 h-5 text-glass" />
              <span v-if="notificationCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {{ notificationCount }}
              </span>
            </button>
            <button class="glass-icon-container w-10 h-10 hover:animate-spin-slow" @click="showSettings">
              <Icon name="lucide:settings" class="w-5 h-5 text-glass" />
            </button>
            <div class="relative">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="glass-icon-container w-10 h-10 hover:scale-110 transition-all duration-200 relative"
              >
                <Icon name="lucide:user" class="w-5 h-5 text-glass" />
                <div class="absolute inset-0 rounded-xl border-2 border-transparent hover:border-white/20 transition-all duration-200"></div>
              </button>
              
              <!-- User Dropdown -->
              <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 glass-card z-50 animate-in slide-in-from-top-2 duration-200">
                <div class="py-1">
                  <div v-if="user" class="px-4 py-3 text-sm text-glass-secondary border-b border-glass-light">
                    {{ user.email }}
                  </div>
                  <button 
                    @click="handleLogout"
                    class="w-full text-left px-4 py-3 text-sm text-glass hover:bg-glass-light transition-all duration-200 flex items-center rounded-b-lg"
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
            class="md:hidden glass-icon-container w-10 h-10"
          >
            <Icon :name="mobileMenuOpen ? 'lucide:x' : 'lucide:menu'" class="w-6 h-6 text-glass" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-glass-light bg-glass-light backdrop-blur-lg">
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
    <nav class="md:hidden fixed bottom-0 left-0 right-0 glass-nav border-t border-glass-light z-40">
      <div class="flex justify-around py-3">
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
    
    <!-- Floating Action Button -->
    <div class="glass-fab" @click="showQuickActions = !showQuickActions">
      <Icon name="lucide:plus" class="w-6 h-6 text-glass" :class="{ 'rotate-45': showQuickActions }" />
    </div>
    
    <!-- Quick Actions Menu -->
    <transition name="fab-menu">
      <div v-if="showQuickActions" class="fixed bottom-20 right-4 space-y-3 z-40">
        <NuxtLink to="/orders/new" class="glass-fab w-12 h-12" style="animation-delay: 0.1s" @click="showQuickActions = false">
          <Icon name="lucide:shopping-cart" class="w-5 h-5 text-blue-400" />
        </NuxtLink>
        <NuxtLink to="/customers/new" class="glass-fab w-12 h-12" style="animation-delay: 0.2s" @click="showQuickActions = false">
          <Icon name="lucide:user-plus" class="w-5 h-5 text-green-400" />
        </NuxtLink>
        <NuxtLink to="/products/new" class="glass-fab w-12 h-12" style="animation-delay: 0.3s" @click="showQuickActions = false">
          <Icon name="lucide:package-plus" class="w-5 h-5 text-purple-400" />
        </NuxtLink>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

// Close quick actions when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.glass-fab') && !target.closest('.fab-menu')) {
      showQuickActions.value = false
    }
  })
})

const { user, signOut } = useAuth()
const mobileMenuOpen = ref(false)
const showUserMenu = ref(false)
const showQuickActions = ref(false)
const notificationCount = ref(3) // Example notification count

// Delightful interactions
const showNotifications = () => {
  console.log('🔔 Showing notifications with sparkle!')
  // You could show a notification panel here
}

const showSettings = () => {
  console.log('⚙️ Opening magical settings!')
  // You could show a settings modal here
}

// Close mobile menu when route changes
watch(() => useRoute().path, () => {
  mobileMenuOpen.value = false
  showQuickActions.value = false
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
  @apply flex items-center px-4 py-2.5 text-sm font-medium text-glass-secondary hover:text-glass hover:bg-glass-light rounded-lg transition-all duration-200 relative overflow-hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.nav-link:hover::before {
  left: 100%;
}

.nav-link.active {
  @apply text-glass bg-glass-medium font-semibold shadow-glass;
  border: 1px solid var(--glass-border);
}

/* Override for magical nav links */
.nav-link-magical {
  @apply nav-link;
}

.mobile-nav-link {
  @apply flex items-center px-4 py-3 text-base font-medium text-glass-secondary hover:text-glass hover:bg-glass-medium rounded-lg transition-all duration-200 relative overflow-hidden;
}

.mobile-nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.mobile-nav-link:hover::before {
  left: 100%;
}

.mobile-nav-link.active {
  @apply text-glass bg-glass-medium font-semibold shadow-glass;
  border: 1px solid var(--glass-border);
}

.mobile-nav-item {
  @apply flex flex-col items-center py-2 px-3 text-glass-muted hover:text-glass rounded-lg transition-all duration-200 relative;
}

.mobile-nav-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--glass-bg-light);
  border-radius: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.mobile-nav-item:hover::before {
  opacity: 1;
}

.mobile-nav-item.active {
  @apply text-glass;
}

.mobile-nav-item.active::before {
  opacity: 1;
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
}

.mobile-nav-item > * {
  position: relative;
  z-index: 1;
}

.mobile-nav-icon {
  @apply w-6 h-6 mb-1;
}

/* FAB Menu Animations */
.fab-menu-enter-active {
  transition: all 0.3s ease-out;
}

.fab-menu-leave-active {
  transition: all 0.2s ease-in;
}

.fab-menu-enter-from {
  opacity: 0;
  transform: scale(0.5) translateY(20px);
}

.fab-menu-leave-to {
  opacity: 0;
  transform: scale(0.5) translateY(20px);
}

.fab-menu-enter-to {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* Slow spin animation */
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.hover\:animate-spin-slow:hover {
  animation: spin-slow 2s linear infinite;
}
</style>