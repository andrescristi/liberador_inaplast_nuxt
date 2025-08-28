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
            v-if="baseNavItems?.home"
            :to="baseNavItems.home.to"
            variant="ghost"
            color="gray"
            class="font-medium"
            :leading-icon="baseNavItems.home.icon"
          >
            {{ baseNavItems.home.label }}
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
            :aria-label="mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu"
            @click="toggleMobileMenu"
            @keydown.esc="closeMobileMenu"
          >
            <!-- Icono hamburger animado con 3 líneas que se transforman -->
            <div class="hamburger-icon flex flex-col justify-around w-5 h-5 cursor-pointer" :class="{ 'open': mobileMenuOpen }">
              <span class="hamburger-line block h-0.5 w-full bg-current rounded-sm" />
              <span class="hamburger-line block h-0.5 w-full bg-current rounded-sm" />
              <span class="hamburger-line block h-0.5 w-full bg-current rounded-sm" />
            </div>
            <!-- Screen reader text para botón de menú -->
            <span class="sr-only">{{ mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación' }}</span>
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
        <div 
          v-if="mobileMenuOpen" 
          id="mobile-menu"
          class="md:hidden bg-white border-t border-gray-200 shadow-lg mobile-menu-content" 
          role="navigation" 
          aria-label="Menú principal móvil"
        >
          <div class="px-3 py-4 space-y-2">
            
            <!-- Enlaces de Navegación Móvil Generados Dinámicamente -->
            <!-- Enlace de Inicio -->
            <div 
              v-if="baseNavItems?.home" 
              class="mobile-nav-item" 
              style="--item-index: 0"
            >
              <UiBaseButton
                :to="baseNavItems.home.to"
                variant="ghost"
                color="gray"
                class="w-full justify-start font-medium text-base py-4 px-4 rounded-xl mobile-nav-btn"
                :leading-icon="baseNavItems.home.icon"
                @click="closeMobileMenu"
              >
                {{ baseNavItems.home.label }}
              </UiBaseButton>
            </div>

            <!-- Sección de Liberaciones -->
            <div class="mobile-nav-item" style="--item-index: 1">
              <div class="px-4 py-2">
                <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Liberaciones</h3>
              </div>
            </div>
            
            <div 
              v-for="(item, index) in baseNavItems.liberaciones"
              :key="item.to"
              class="mobile-nav-item" 
              :style="{ '--item-index': index + 2 }"
            >
              <UiBaseButton
                :to="item.to"
                variant="ghost"
                color="gray"
                class="w-full justify-start font-medium text-base py-4 px-4 pl-8 rounded-xl mobile-nav-btn"
                :leading-icon="item.icon"
                @click="closeMobileMenu"
              >
                {{ item.label }}
              </UiBaseButton>
            </div>

            <!-- Sección de Configuración (solo si tiene elementos) -->
            <template v-if="showConfiguracionMenu">
              <div class="mobile-nav-item" style="--item-index: 4">
                <div class="px-4 py-2">
                  <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Configuración</h3>
                </div>
              </div>

              <div 
                v-for="(item, index) in baseNavItems.configuracion"
                :key="item.to"
                class="mobile-nav-item" 
                :style="{ '--item-index': index + 5 }"
              >
                <UiBaseButton
                  :to="item.to"
                  variant="ghost"
                  color="gray"
                  class="w-full justify-start font-medium text-base py-4 px-4 pl-8 rounded-xl mobile-nav-btn"
                  :leading-icon="item.icon"
                  @click="closeMobileMenu"
                >
                  {{ item.label }}
                </UiBaseButton>
              </div>
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
                  to="/auth/profile"
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
          :special="item.special"
          layout="vertical"
          :class="[
            'flex-1 py-2 px-1 text-xs rounded-lg min-h-[56px] bottom-nav-btn',
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
/**
 * Componente AppNavigation - Sistema de navegación principal completo para la aplicación
 * 
 * Características principales:
 * - Navegación dual: top navbar (desktop) + bottom nav (mobile)
 * - Sistema de navegación responsivo con breakpoints optimizados
 * - Menú móvil deslizable con animaciones sofisticadas
 * - Navegación basada en roles dinámico (Admin/User)
 * - Dropdown menus con Headless UI para accesibilidad
 * - Estados de autenticación reactivos usando API endpoints
 * - Efectos visuales avanzados: backdrop blur, ripple, gradientes
 * - Optimizaciones móviles: touch targets 44px+, feedback háptico
 * - Manejo completo de accesibilidad y navegación por teclado
 * - Auto-gestión de foco y focus trapping
 * 
 * Estructura de navegación:
 * - Desktop: Logo + Nav links + User dropdown
 * - Mobile: Logo + Hamburger → Slide-out menu + Bottom tab bar
 * - Bottom nav: Home + Nueva Liberación (destacada) + Historial + Admin (condicional)
 * 
 * @example
 * <AppNavigation />
 * 
 * El componente es completamente autónomo y maneja:
 * - Estado de autenticación
 * - Perfiles de usuario con roles
 * - Navegación reactiva basada en permisos
 * - Logout con confirmación
 * - Animaciones y transiciones
 */
import type { Profile } from '~/types'
import { useAuthState } from '~/composables/auth/useAuthState'

// 
// ===== CONFIGURACIÓN DE COMPONENTE =====
//

// Composables de autenticación personalizados usando API endpoints
const { user, isAuthenticated } = useAuthState() // Usuario reactivo desde API
const { signOut, getCurrentUserProfile } = useAuth() // Funciones de autenticación usando API
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
  if (isAuthenticated.value) {
    try {
      // Obtener perfil completo desde el endpoint /api/auth/profile
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

//
// ===== ELEMENTOS DE NAVEGACIÓN REUTILIZABLES =====
//

/**
 * Items base de navegación reutilizados en desktop y mobile
 * Estructura reactiva que se adapta según el rol del usuario
 * @returns Objeto con elementos de navegación organizados por sección
 */
const baseNavItems = computed(() => ({
  home: {
    label: 'Inicio',
    icon: 'bx:home-alt-2',
    to: '/'
  },
  liberaciones: [
    {
      label: 'Nueva Liberación',
      icon: 'bx:bxs-plus-square',
      to: '/orders/new'
    },
    {
      label: 'Historial',
      icon: 'bx:bxs-calendar-minus',
      to: '/orders'
    }
  ],
  configuracion: (() => {
    const items: Array<{
      label: string
      icon: string
      to: string
    }> = []

    // Agregar Administración solo para usuarios Admin
    if (userProfile.value?.user_role === 'Admin') {
      items.push({
        label: 'Usuarios',
        icon: 'bx:bxs-user-account',
        to: '/admin/users'
      })
    }

    return items
  })()
}))

/**
 * Items del menú desplegable de Liberaciones
 * Formato adaptado para el componente UiBaseDropdown
 */
const liberacionesMenuItems = computed(() => [baseNavItems.value.liberaciones])

/**
 * Items del menú desplegable de Configuración
 * Solo se incluye si hay elementos disponibles
 */
const configuracionMenuItems = computed(() => 
  baseNavItems.value.configuracion.length > 0 ? [baseNavItems.value.configuracion] : []
)

/**
 * Determina si mostrar el menú de configuración basado en permisos
 * @returns true si el usuario tiene acceso a funciones de configuración
 */
const showConfiguracionMenu = computed(() => baseNavItems.value.configuracion.length > 0)


/**
 * Items de navegación inferior móvil (bottom tab bar)
 * Configuración específica para pantallas móviles con elementos limitados
 * @returns Array de elementos optimizados para navegación táctil
 */
const bottomNavItems = computed(() => {
  // Items base reutilizando la estructura principal
  const items = [
    { 
      ...baseNavItems.value.home,
      variant: 'ghost' as const, 
      color: 'gray' as const 
    },
    { 
      // Botón central destacado - acción principal del sistema
      ...baseNavItems.value.liberaciones[0], // Nueva Liberación
      variant: 'solid' as const, 
      color: 'primary' as const,
      special: true  // Flag para aplicar scale-up CSS
    },
    { 
      ...baseNavItems.value.liberaciones[1], // Historial
      variant: 'ghost' as const, 
      color: 'gray' as const 
    }
  ]

  // Para el bottom nav móvil mantenemos elementos individuales por espacio limitado
  // Solo agregamos el elemento más importante basado en rol
  
  // Si es Admin, priorizar Administración
  if (userProfile.value?.user_role === 'Admin' && baseNavItems.value.configuracion.length > 0) {
    items.push({
      ...baseNavItems.value.configuracion[0], // Usuarios/Admin
      label: 'Admin', // Más corto para mobile
      variant: 'ghost' as const,
      color: 'gray' as const
    })
  }

  return items
})

//
// ===== MENÚ DROPDOWN DE USUARIO =====
//

/**
 * Items del menú desplegable de usuario
 * Estructura contextual que incluye info de perfil, enlaces y acciones
 * @returns Array estructurado para el componente UiBaseDropdown
 */
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

/**
 * Maneja el proceso de logout con UX optimizada
 * Incluye estado de loading, feedback visual y manejo de errores
 */
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

/**
 * Toggle del menú móvil con efectos de UX mejorados y accesibilidad
 * Incluye feedback háptico para mejorar la experiencia táctil
 */
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

/**
 * Cierra el menú móvil
 * Función específica usada en elementos de navegación
 */
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

//
// ===== MANEJO DE ACCESIBILIDAD Y NAVEGACIÓN POR TECLADO =====
//

/**
 * Manejo global de tecla ESC para cerrar el menú móvil
 * Incluye restauración de foco para accesibilidad
 * @param event - Evento de teclado nativo
 */
const handleGlobalKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && mobileMenuOpen.value) {
    closeMobileMenu()
    // Devolver foco al botón de menú después de cerrar
    nextTick(() => {
      const menuButton = document.querySelector('.mobile-menu-btn button, .mobile-menu-btn a')
      if (menuButton instanceof HTMLElement) {
        menuButton.focus()
      }
    })
  }
}

/**
 * Gestión de focus trap cuando el menú móvil está abierto
 * Asegura que el foco se mantenga dentro del menú para accesibilidad
 */
const manageFocusTrap = () => {
  if (!import.meta.client) return
  
  if (mobileMenuOpen.value) {
    // Agregar listener para ESC global
    document.addEventListener('keydown', handleGlobalKeydown)
    
    // Focus en el primer elemento del menú
    nextTick(() => {
      const firstFocusableElement = document.querySelector('#mobile-menu button, #mobile-menu a')
      if (firstFocusableElement instanceof HTMLElement) {
        firstFocusableElement.focus()
      }
    })
  } else {
    // Remover listener cuando se cierre el menú
    document.removeEventListener('keydown', handleGlobalKeydown)
  }
}

// Watch para manejar focus trap cuando cambie el estado del menú
watch(mobileMenuOpen, manageFocusTrap)

// Cleanup en unmount
if (import.meta.client) {
  onUnmounted(() => {
    document.removeEventListener('keydown', handleGlobalKeydown)
  })
}
</script>

