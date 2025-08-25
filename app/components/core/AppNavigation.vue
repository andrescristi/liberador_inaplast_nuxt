<template>
  <!-- 
    Navegación Principal Sticky 
    - Backdrop blur para efecto glass moderno
    - Z-index controlado por variable CSS para evitar conflictos
    - Semi-transparente para mostrar contenido deslizante debajo
  -->
  <nav class="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200" style="z-index: var(--z-sticky)">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
      <div class="flex justify-between h-14 sm:h-16">
        
        <!-- Logo y Marca Principal -->
        <div class="flex items-center">
          <div class="flex items-center space-x-2 sm:space-x-3">
            <!-- Logo con gradiente dinámico basado en theme -->
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center shadow-sm">
              <Icon name="bx:bxs-factory" class="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <!-- Enlace de marca clickeable con hover effect -->
            <NuxtLink to="/" class="text-lg sm:text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors">
              Inaplast
            </NuxtLink>
          </div>
        </div>

        <!-- 
          Enlaces de Navegación (Solo Desktop)
          Oculto en mobile para evitar sobrecarga UI - se usa bottom nav en su lugar
        -->
        <div class="hidden md:flex items-center space-x-1">
          <!-- Enlace de Inicio -->
          <UiBaseButton
            to="/"
            variant="ghost"
            color="gray"
            class="font-medium"
            :leading-icon="'bx:home-alt-2'"
          >
            Inicio
          </UiBaseButton>

          <!-- Dropdown de Liberaciones -->
          <UiBaseDropdown :items="liberacionesMenuItems">
            <template #button>
              <UiBaseButton
                variant="ghost"
                color="gray"
                class="font-medium"
                :leading-icon="'bx:bxs-package'"
                :trailing-icon="'bx:bxs-chevron-down'"
              >
                Liberaciones
              </UiBaseButton>
            </template>
          </UiBaseDropdown>

          <!-- Dropdown de Configuración (solo si tiene elementos) -->
          <UiBaseDropdown v-if="showConfiguracionMenu" :items="configuracionMenuItems">
            <template #button>
              <UiBaseButton
                variant="ghost"
                color="gray"
                class="font-medium"
                :leading-icon="'bx:bxs-cog'"
                :trailing-icon="'bx:bxs-chevron-down'"
              >
                Configuración
              </UiBaseButton>
            </template>
          </UiBaseDropdown>
        </div>

        <!-- 
          Menú de Usuario Desktop
          Dropdown con información de cuenta y acciones de usuario
          min-h para target de toque consistente (44px mínimo)
        -->
        <div class="hidden md:flex items-center">
          <UiBaseDropdown :items="userMenuItems">
            <template #button>
              <div class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors min-h-[44px]">
                <!-- Avatar circular con gradiente -->
                <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
                  <Icon name="bx:bxs-user" class="w-4 h-4 text-white" />
                </div>
                <!-- Username extraído del email (antes del @), visible solo en LG+ -->
                <span class="hidden lg:inline">{{ user?.email?.split('@')[0] || 'Usuario' }}</span>
                <Icon name="bx:bxs-chevron-down" class="w-4 h-4" />
              </div>
            </template>
            
            <!-- Slot personalizado para mostrar info de cuenta -->
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

        <!-- 
          Botón de Menú Móvil con Animación Hamburger
          Usa CSS classes dinámicas para transformar hamburger a X
        -->
        <div class="md:hidden flex items-center">
          <UiBaseButton
            variant="ghost"
            color="gray"
            size="lg"
            class="w-11 h-11 p-0 mobile-menu-btn"
            @click="toggleMobileMenu"
          >
            <!-- Icono hamburger animado con 3 líneas que se transforman -->
            <div class="hamburger-icon flex flex-col justify-around w-5 h-5 cursor-pointer" :class="{ 'open': mobileMenuOpen }">
              <span class="hamburger-line block h-0.5 w-full bg-current rounded-sm" />
              <span class="hamburger-line block h-0.5 w-full bg-current rounded-sm" />
              <span class="hamburger-line block h-0.5 w-full bg-current rounded-sm" />
            </div>
          </UiBaseButton>
        </div>
      </div>

      <!-- 
        Menú Móvil Deslizable con Animaciones Sofisticadas
        
        Transiciones configuradas para suavidad:
        - Enter: 400ms ease-out (más lento para sentirse natural)
        - Leave: 300ms ease-in (más rápido para responsividad)
        - Efectos combinados: opacity + translate + scale para profundidad
      -->
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
            
            <!-- Enlaces de Navegación Móvil con Animación Escalonada -->
            <!-- Enlace de Inicio -->
            <div class="mobile-nav-item" style="--item-index: 0">
              <UiBaseButton
                to="/"
                variant="ghost"
                color="gray"
                class="w-full justify-start font-medium text-base py-4 px-4 rounded-xl mobile-nav-btn"
                :leading-icon="'bx:home-alt-2'"
                @click="closeMobileMenu"
              >
                Inicio
              </UiBaseButton>
            </div>

            <!-- Sección de Liberaciones -->
            <div class="mobile-nav-item" style="--item-index: 1">
              <div class="px-4 py-2">
                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Liberaciones</h3>
              </div>
            </div>
            
            <div class="mobile-nav-item" style="--item-index: 2">
              <UiBaseButton
                to="/orders/new"
                variant="ghost"
                color="gray"
                class="w-full justify-start font-medium text-base py-4 px-4 pl-8 rounded-xl mobile-nav-btn"
                :leading-icon="'bx:bxs-plus-square'"
                @click="closeMobileMenu"
              >
                Nueva Liberación
              </UiBaseButton>
            </div>

            <div class="mobile-nav-item" style="--item-index: 3">
              <UiBaseButton
                to="/orders"
                variant="ghost"
                color="gray"
                class="w-full justify-start font-medium text-base py-4 px-4 pl-8 rounded-xl mobile-nav-btn"
                :leading-icon="'bx:bxs-calendar-minus'"
                @click="closeMobileMenu"
              >
                Historial
              </UiBaseButton>
            </div>

            <!-- Sección de Configuración (solo si tiene elementos) -->
            <template v-if="showConfiguracionMenu">
              <div class="mobile-nav-item" style="--item-index: 4">
                <div class="px-4 py-2">
                  <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Configuración</h3>
                </div>
              </div>

              <!-- Muestreo (si el usuario tiene permisos) -->
              <template v-if="userProfile?.user_role === 'Admin' || userProfile?.user_role === 'Supervisor'">
                <div class="mobile-nav-item" style="--item-index: 5">
                  <UiBaseButton
                    to="/muestreo"
                    variant="ghost"
                    color="gray"
                    class="w-full justify-start font-medium text-base py-4 px-4 pl-8 rounded-xl mobile-nav-btn"
                    :leading-icon="'bx:bxs-pie-chart-alt-2'"
                    @click="closeMobileMenu"
                  >
                    Muestreo
                  </UiBaseButton>
                </div>
              </template>

              <!-- Administración (solo para Admin) -->
              <template v-if="userProfile?.user_role === 'Admin'">
                <div class="mobile-nav-item" style="--item-index: 6">
                  <UiBaseButton
                    to="/admin/users"
                    variant="ghost"
                    color="gray"
                    class="w-full justify-start font-medium text-base py-4 px-4 pl-8 rounded-xl mobile-nav-btn"
                    :leading-icon="'bx:bxs-cog'"
                    @click="closeMobileMenu"
                  >
                    Administración
                  </UiBaseButton>
                </div>
              </template>
            </template>
            
            <!-- Separador Visual -->
            <div class="border-t border-gray-200 my-4"/>
            
            <!-- 
              Sección de Usuario con Tarjeta de Perfil
              Fondo sutil para destacar información personal
            -->
            <div class="px-4 py-3 bg-gray-50 rounded-xl">
              <!-- Header de información de usuario -->
              <div class="flex items-center space-x-3 mb-3">
                <!-- Avatar más grande para móvil -->
                <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
                  <Icon name="bx:bxs-user" class="w-5 h-5 text-white" />
                </div>
                <!-- Info de usuario con manejo de overflow -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ user?.email?.split('@')[0] || 'Usuario' }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">
                    {{ user?.email }}
                  </p>
                </div>
              </div>
              
              <!-- Acciones de Usuario -->
              <div class="space-y-1">
                <!-- Enlace a perfil -->
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
                
                <!-- Botón de logout con estado de carga y estilos rojos -->
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

  <!-- 
    Navegación Inferior Móvil (Bottom Tab Bar)
    
    Patrón iOS/Android estándar para navegación principal:
    - Fixed bottom para fácil acceso con pulgares
    - Backdrop blur para mantener legibilidad sobre contenido
    - Z-index alto para siempre estar visible
    - Botón central destacado ("Nueva Liberación") con scale-up
  -->
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
          <!-- Label debajo del icono para patrón mobile familiar -->
          <span class="mt-1">{{ item.label }}</span>
        </UiBaseButton>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { Profile } from '~/types'

// 
// ===== CONFIGURACIÓN DE COMPONENTE =====
//

// Composables de Nuxt/Supabase para autenticación y UI
const user = useSupabaseUser() // Usuario reactivo de Supabase Auth
const { signOut, getCurrentUserProfile } = useAuth() // Funciones de autenticación personalizada
const toast = useToast() // Sistema de notificaciones toast

// 
// ===== ESTADO REACTIVO LOCAL =====
//

const signingOut = ref(false) // Flag para mostrar loading durante logout
const mobileMenuOpen = ref(false) // Control del menú móvil deslizable
const userProfile = ref<Profile | null>(null) // Perfil completo con rol del usuario

//
// ===== GESTIÓN REACTIVA DE PERFIL DE USUARIO =====
//

// Auto-fetch del perfil cuando el usuario cambia (login/logout)
// Se ejecuta reactivamente cada vez que user.value cambia
watchEffect(async () => {
  if (user.value) {
    try {
      // Obtener perfil completo desde la tabla profiles (incluye rol)
      userProfile.value = await getCurrentUserProfile()
    } catch {
      // Error silencioso - el perfil no es crítico para la navegación básica
      // El usuario puede navegar aunque no se cargue el perfil completo
    }
  } else {
    // Limpiar perfil cuando usuario hace logout
    userProfile.value = null
  }
})

//
// ===== NAVEGACIÓN DINÁMICA BASADA EN ROLES =====
//

// Menú desplegable de Liberaciones
const liberacionesMenuItems = computed(() => [
  [{
    label: 'Nueva Liberación',
    icon: 'bx:bxs-plus-square',
    to: '/orders/new'
  }, {
    label: 'Historial',
    icon: 'bx:bxs-calendar-minus',
    to: '/orders'
  }]
])

// Menú desplegable de Configuración
const configuracionMenuItems = computed(() => {
  const items: Array<{
    label: string
    icon: string
    to: string
  }> = []

  // Agregar Muestreo para usuarios con permisos de calidad
  if (userProfile.value?.user_role === 'Admin' || userProfile.value?.user_role === 'Supervisor') {
    items.push({
      label: 'Muestreo',
      icon: 'bx:bxs-pie-chart-alt-2',
      to: '/muestreo'
    })
  }

  // Agregar Administración solo para usuarios Admin
  if (userProfile.value?.user_role === 'Admin') {
    items.push({
      label: 'Administración Usuarios',
      icon: 'bx:bxs-cog',
      to: '/admin/users'
    })
  }

  return items.length > 0 ? [items] : []
})

// Computed para verificar si mostrar el botón de configuración
const showConfiguracionMenu = computed(() => configuracionMenuItems.value.length > 0)


// Navegación inferior móvil con configuración de estilos específica
const bottomNavItems = computed(() => {
  // Items base con variants específicos para bottom navigation
  const baseItems = [
    { to: '/', label: 'Inicio', icon: 'bx:home-alt-2', variant: 'ghost' as const, color: 'gray' as const },
    { 
      // Botón central destacado - acción principal del sistema
      to: '/orders/new', 
      label: 'Nueva Liberación', 
      icon: 'bx:bxs-plus-square', 
      variant: 'solid' as const, 
      color: 'primary' as const,
      special: true  // Flag para aplicar scale-up CSS
    },
    { to: '/orders', label: 'Historial', icon: 'bx:bxs-calendar-minus', variant: 'ghost' as const, color: 'gray' as const }
  ]

  // Para el bottom nav móvil mantenemos elementos individuales por espacio limitado
  // Solo agregamos el elemento más importante basado en rol
  
  // Si es Admin, priorizar Administración
  if (userProfile.value?.user_role === 'Admin') {
    baseItems.push({
      to: '/admin/users',
      label: 'Admin', // Más corto para mobile
      icon: 'bx:bxs-cog',
      variant: 'ghost' as const,
      color: 'gray' as const
    })
  } 
  // Si es Supervisor (pero no Admin), mostrar Muestreo
  else if (userProfile.value?.user_role === 'Supervisor') {
    baseItems.push({
      to: '/muestreo',
      label: 'Calidad', // Más corto para mobile
      icon: 'bx:bxs-pie-chart-alt-2',
      variant: 'ghost' as const,
      color: 'gray' as const
    })
  }

  return baseItems
})

//
// ===== MENÚ DROPDOWN DE USUARIO =====
//

// Estructura de menú contextual para dropdown de usuario
const userMenuItems = computed(() => {
  const menuItems: Array<Array<{
    slot?: string
    disabled?: boolean
    label?: string
    icon?: string
    to?: string
    click?: () => void
  }>> = [
    // Primera sección: Info de cuenta (slot personalizado, no clickeable)
    [{
      slot: 'account',
      disabled: true
    }], 
    // Segunda sección: Enlaces de perfil
    [{
      label: 'Perfil',
      icon: 'bx:user-circle',
      to: '/auth/profile'
    }]
  ]

  // Tercera sección: Acción de logout con estado dinámico
  menuItems.push([{
    label: signingOut.value ? 'Cerrando sesión...' : 'Cerrar Sesión',
    icon: 'bx:exit',
    click: handleSignOut, // Función manejadora
    disabled: signingOut.value // Deshabilitado durante proceso
  }])

  return menuItems
})

//
// ===== MANEJADORES DE EVENTOS =====
//

// Función para manejar logout con UX optimizada
const handleSignOut = async () => {
  try {
    // Activar estado de loading para feedback inmediato
    signingOut.value = true
    
    // Delay mínimo para que el usuario vea el cambio de estado
    // Mejora la percepción de responsividad en lugar de cambio instantáneo
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Ejecutar logout real (redirige automáticamente a /auth/login)
    await signOut()
    
    // Mostrar confirmación de éxito
    toast.success('Sesión cerrada correctamente')
    
  } catch {
    // Manejo de errores de logout (poco común)
    // Error silencioso para no abrumar al usuario
    toast.error('Error al cerrar sesión', 'Por favor intenta de nuevo.')
  } finally {
    // Asegurar que el loading se desactive sin importar el resultado
    signingOut.value = false
  }
}

//
// ===== GESTIÓN DE MENÚ MÓVIL =====
//

// Toggle del menú móvil con efectos de UX mejorados
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  
  // Feedback háptico para devices que lo soporten
  // Mejora la sensación tactil en móviles
  if (import.meta.client) {
    // Vibración sutil (50ms) para confirmar acción
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }
}

// Función específica para cerrar menú (usada en navegación)
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

//
// ===== WATCHERS Y EFECTOS REACTIVOS =====
//

// Auto-cerrar menú móvil cuando el usuario navega
// Previene menú abierto en nueva página (UX confuso)
watch(() => useRoute().path, () => {
  mobileMenuOpen.value = false
})
</script>

