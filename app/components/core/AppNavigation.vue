<template>
  <!-- Top Navigation -->
  <nav class="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200" style="z-index: var(--z-sticky)">
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
                <span class="hidden lg:inline">{{ user?.email?.split('@')[0] || 'Usuario' }}</span>
                <Icon name="bx:bxs-chevron-down" class="w-4 h-4" />
              </div>
            </template>
            
            <template #account>
              <div class="text-left">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ user?.email?.split('@')[0] || 'Usuario' }}
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
            <div class="hamburger-icon flex flex-col justify-around w-5 h-5 cursor-pointer" :class="{ 'open': mobileMenuOpen }">
              <span class="hamburger-line block h-0.5 w-full bg-current rounded-sm" />
              <span class="hamburger-line block h-0.5 w-full bg-current rounded-sm" />
              <span class="hamburger-line block h-0.5 w-full bg-current rounded-sm" />
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
                    {{ user?.email?.split('@')[0] || 'Usuario' }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">
                    {{ user?.email }}
                  </p>
                </div>
              </div>
              
              <div class="space-y-1">
                <UiBaseButton
                  :to="'/auth/profile'"
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
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-2 py-2 mobile-bottom-nav" style="z-index: var(--z-fixed)">
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
            item.special ? 'mx-1 scale-110 nav-gradient-button' : ''
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
import type { Profile } from '~/types'

// Icons are now provided by @nuxt/icon

// Composables
const user = useSupabaseUser()
const { signOut, getCurrentUserProfile } = useAuth()
const toast = useToast()

// State
const signingOut = ref(false)
const mobileMenuOpen = ref(false)
const userProfile = ref<Profile | null>(null)

// Get user profile
watchEffect(async () => {
  if (user.value) {
    try {
      userProfile.value = await getCurrentUserProfile()
    } catch {
      // Error fetching user profile - handled silently
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
      label: 'Perfil',
      icon: 'bx:user-circle',
      to: '/auth/profile'
    }]
  ]


  menuItems.push([{
    label: signingOut.value ? 'Cerrando sesión...' : 'Cerrar Sesión',
    icon: 'bx:exit',
    click: handleSignOut,
    disabled: signingOut.value
  }])

  return menuItems
})

// Sign out handler
const handleSignOut = async () => {
  try {
    signingOut.value = true
    
    // Add smooth UX delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    await signOut()
    
    toast.success('Sesión cerrada correctamente')
    
  } catch {
    // Handle sign out error silently or use proper error reporting
    toast.error('Error al cerrar sesión', 'Por favor intenta de nuevo.')
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

