<template>
  <!-- Top Navigation -->
  <nav class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
      <div class="flex justify-between h-14 sm:h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <div class="flex items-center space-x-2 sm:space-x-3">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center shadow-sm">
              <Icon name="bx:bxs-factory" class="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <NuxtLink to="/" class="text-lg sm:text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors">
              Inaplast
            </NuxtLink>
          </div>
        </div>

        <!-- Navigation Links (Desktop Only) -->
        <div class="hidden md:flex items-center space-x-1">
          <UiBaseButton
            v-for="item in navigationItems"
            :key="item.to"
            :to="item.to"
            variant="ghost"
            color="gray"
            class="font-medium"
            :leading-icon="item.icon"
          >
            {{ item.label }}
          </UiBaseButton>
        </div>

        <!-- Desktop User Menu -->
        <div class="hidden md:flex items-center">
          <UiBaseDropdown :items="userMenuItems">
            <template #button>
              <div class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors min-h-[44px]">
                <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
                  <Icon name="bx:bxs-user" class="w-4 h-4 text-white" />
                </div>
                <span class="hidden lg:inline">{{ user?.email?.split('@')[0] || 'User' }}</span>
                <Icon name="bx:bxs-chevron-down" class="w-4 h-4" />
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

        <!-- Mobile menu button with enhanced animation -->
        <div class="md:hidden flex items-center">
          <UiBaseButton
            variant="ghost"
            color="gray"
            size="lg"
            class="w-11 h-11 p-0 mobile-menu-btn"
            @click="toggleMobileMenu"
          >
            <!-- Animated hamburger/X icon -->
            <div class="hamburger-icon" :class="{ 'open': mobileMenuOpen }">
              <span class="hamburger-line" />
              <span class="hamburger-line" />
              <span class="hamburger-line" />
            </div>
          </UiBaseButton>
        </div>
      </div>

      <!-- Mobile Slide-out Menu with enhanced animations -->
      <Transition
        enter-active-class="transition-all duration-400 ease-out"
        enter-from-class="opacity-0 -translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-4 scale-95"
      >
        <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-200 shadow-lg mobile-menu-content">
          <div class="px-3 py-4 space-y-2">
            <!-- Navigation Links -->
            <div 
              v-for="(item, index) in navigationItems" 
              :key="item.to"
              class="mobile-nav-item"
              :style="{ '--item-index': index }"
            >
              <UiBaseButton
                :to="item.to"
                variant="ghost"
                color="gray"
                class="w-full justify-start font-medium text-base py-4 px-4 rounded-xl mobile-nav-btn"
                :leading-icon="item.icon"
                @click="closeMobileMenu"
              >
                {{ item.label }}
              </UiBaseButton>
            </div>
            
            <!-- Divider -->
            <div class="border-t border-gray-200 my-4"/>
            
            <!-- User Section -->
            <div class="px-4 py-3 bg-gray-50 rounded-xl">
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
                  <Icon name="bx:bxs-user" class="w-5 h-5 text-white" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ user?.email?.split('@')[0] || 'User' }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">
                    {{ user?.email }}
                  </p>
                </div>
              </div>
              
              <div class="space-y-1">
                <UiBaseButton
                  :to="'/profile'"
                  variant="ghost"
                  color="gray"
                  class="w-full justify-start text-sm py-2 px-3 rounded-lg"
                  :leading-icon="'bx:bxs-user'"
                  @click="closeMobileMenu"
                >
                  Perfil
                </UiBaseButton>
                
                <UiBaseButton
                  variant="ghost"
                  color="gray"
                  class="w-full justify-start text-sm py-2 px-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                  :leading-icon="'bx:log-out'"
                  :disabled="signingOut"
                  @click="handleSignOut"
                >
                  {{ signingOut ? 'Signing out...' : 'Sign Out' }}
                </UiBaseButton>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </nav>

  <!-- Bottom Navigation for Mobile with enhanced animations -->
  <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-2 py-2 mobile-bottom-nav">
    <div class="flex items-center justify-around">
      <div 
        v-for="(item, index) in bottomNavItems" 
        :key="item.to"
        class="bottom-nav-item"
        :style="{ '--item-delay': index * 0.1 + 's' }"
      >
        <UiBaseButton
          :to="item.to"
          :variant="item.variant"
          :color="item.color"
          :class="[
            'flex-1 flex-col py-2 px-1 text-xs rounded-lg min-h-[56px] bottom-nav-btn',
            item.special ? 'mx-1 scale-110' : ''
          ]"
          :leading-icon="item.icon"
        >
          <span class="mt-1">{{ item.label }}</span>
        </UiBaseButton>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// Icons are now provided by @nuxt/icon

// Composables
const user = useSupabaseUser()
const { signOut, getCurrentUserProfile } = useAuth()
const toast = useToast()

// State
const signingOut = ref(false)
const mobileMenuOpen = ref(false)
const userProfile = ref<any>(null)

// Get user profile
watchEffect(async () => {
  if (user.value) {
    try {
      userProfile.value = await getCurrentUserProfile()
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  } else {
    userProfile.value = null
  }
})

// Navigation items data
const navigationItems = computed(() => {
  const baseItems = [
    { to: '/', label: 'Inicio', icon: 'bx:home-alt-2' },
    { to: '/orders/new', label: 'Nueva Liberación', icon: 'bx:bxs-plus-square' },
    { to: '/orders', label: 'Historial', icon: 'bx:bxs-calendar-minus' }
  ]

  // Add admin navigation for admin users
  if (userProfile.value?.user_role === 'Admin') {
    baseItems.push({
      to: '/admin/users',
      label: 'Administración',
      icon: 'bx:bxs-cog'
    })
  }

  return baseItems
})

const bottomNavItems = computed(() => {
  const baseItems = [
    { to: '/', label: 'Inicio', icon: 'bx:home-alt-2', variant: 'ghost' as const, color: 'gray' as const },
    { 
      to: '/orders/new', 
      label: 'Nueva Liberación', 
      icon: 'bx:bxs-plus-square', 
      variant: 'solid' as const, 
      color: 'primary' as const,
      special: true 
    },
    { to: '/orders', label: 'Historial', icon: 'bx:bxs-calendar-minus', variant: 'ghost' as const, color: 'gray' as const }
  ]

  // Add admin navigation for admin users in mobile
  if (userProfile.value?.user_role === 'Admin') {
    baseItems.push({
      to: '/admin/users',
      label: 'Admin',
      icon: 'bx:bxs-cog',
      variant: 'ghost' as const,
      color: 'gray' as const
    })
  }

  return baseItems
})

// User menu items
const userMenuItems = computed(() => {
  const menuItems = [
    [{
      slot: 'account',
      disabled: true
    }], 
    [{
      label: 'Profile',
      icon: 'bx:user-circle',
      to: '/profile'
    }]
  ]

  // Add admin menu item for admin users
  if (userProfile.value?.user_role === 'Admin') {
    menuItems.push([{
      label: 'Administración',
      icon: 'bx:cog',
      to: '/admin/users'
    }])
  }

  menuItems.push([{
    label: signingOut.value ? 'Signing out...' : 'Sign Out',
    icon: 'bx:exit',
    onClick: handleSignOut,
    disabled: signingOut.value
  } as any])

  return menuItems
})

// Sign out handler
const handleSignOut = async () => {
  try {
    signingOut.value = true
    
    // Add smooth UX delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    await signOut()
    
    toast.success('Signed out successfully')
    
  } catch {
    // Handle sign out error silently or use proper error reporting
    toast.error('Error signing out', 'Please try again.')
  } finally {
    signingOut.value = false
  }
}

// Enhanced mobile menu methods
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  
  // Add haptic feedback simulation
  if (import.meta.client) {
    // Trigger a subtle vibration on supported devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// Close mobile menu on route change
watch(() => useRoute().path, () => {
  mobileMenuOpen.value = false
})
</script>

<style scoped>
/* Animated Hamburger Icon */
.hamburger-icon {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.hamburger-line {
  display: block;
  height: 2px;
  width: 100%;
  background-color: currentColor;
  border-radius: 1px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.hamburger-icon.open .hamburger-line:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.hamburger-icon.open .hamburger-line:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger-icon.open .hamburger-line:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

/* Mobile Menu Content Animation */
.mobile-menu-content {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.mobile-nav-item {
  animation: slideInStagger 0.4s ease-out both;
  animation-delay: calc(var(--item-index) * 0.1s + 0.1s);
}

.mobile-nav-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-nav-btn:hover {
  transform: translateX(8px);
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.1), 
    rgba(14, 165, 233, 0.1)
  );
}

.mobile-nav-btn:active {
  transform: translateX(8px) scale(0.98);
}

/* Bottom Navigation Enhancements */
.mobile-bottom-nav {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(229, 231, 235, 0.8);
}

.bottom-nav-item {
  animation: bounceInUp 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
  animation-delay: var(--item-delay);
}

.bottom-nav-btn {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bottom-nav-btn:active {
  transform: scale(0.9);
}

.bottom-nav-btn:hover {
  transform: translateY(-2px);
}

/* Special new button animation */
.bottom-nav-btn.scale-110 {
  position: relative;
}

.bottom-nav-btn.scale-110::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: linear-gradient(45deg, 
    #2563eb, 
    #0284c7, 
    #60a5fa, 
    #38bdf8
  );
  background-size: 400% 400%;
  animation: gradient-shift 3s ease infinite;
  z-index: -1;
  opacity: 0.3;
}

/* Animations */
@keyframes slideInStagger {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bounceInUp {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  60% {
    opacity: 1;
    transform: translateY(-5px) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .mobile-nav-btn:hover {
    transform: none;
  }
  
  .mobile-nav-btn:active {
    transform: scale(0.98);
  }
  
  .bottom-nav-btn:hover {
    transform: none;
  }
}

/* Accessibility: Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .hamburger-line,
  .mobile-nav-btn,
  .bottom-nav-btn {
    transition: none;
  }
  
  .mobile-nav-item,
  .bottom-nav-item {
    animation: none;
  }
  
  .bottom-nav-btn.scale-110::before {
    animation: none;
  }
  
  .mobile-nav-btn:hover,
  .mobile-nav-btn:active,
  .bottom-nav-btn:hover,
  .bottom-nav-btn:active {
    transform: none;
  }
}
</style>