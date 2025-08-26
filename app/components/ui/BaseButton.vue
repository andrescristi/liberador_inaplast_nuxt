<template>
  <component
    :is="is"
    :to="to"
    :href="href"
    :type="htmlType"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseLeave"
  >
    <!-- Ripple Effect Container -->
    <div class="relative overflow-hidden">
      <!-- Ripple Animation -->
      <div 
        v-if="showRipple" 
        class="btn-ripple-effect"
        :style="rippleStyle"
      />
      
      <!-- Button Content -->
      <div
        :class="[
          'relative z-10 flex justify-center',
          props.layout === 'vertical' ? 'flex-col items-center' : 'items-center'
        ]"
      >
        <!-- Loading with enhanced animation -->
        <div v-if="loading" class="mr-2">
          <div class="flex space-x-1">
            <div class="btn-loading-dot" />
            <div class="btn-loading-dot" />
            <div class="btn-loading-dot" />
          </div>
        </div>
        
        <!-- Leading Icon with bounce -->
        <Icon 
          v-if="leadingIcon && !loading" 
          :name="leadingIcon" 
          :class="[
            'w-4 h-4 transition-transform duration-200',
            props.layout === 'vertical' ? 'mb-1' : 'mr-2',
            isPressed ? 'scale-90' : 'scale-100'
          ]" 
        />
        
        <!-- Content -->
        <span
:class="{
          'transform transition-transform duration-150': true,
          'scale-95': isPressed
        }">
          <slot />
        </span>
        
        <!-- Trailing Icon with bounce -->
        <Icon 
          v-if="trailingIcon" 
          :name="trailingIcon" 
          :class="[
            'w-4 h-4 ml-2 transition-transform duration-200',
            isPressed ? 'scale-90' : 'scale-100'
          ]" 
        />
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
/**
 * Componente BaseButton - Botón reutilizable con múltiples variantes, estilos y efectos interactivos
 * 
 * Características principales:
 * - Múltiples variantes: solid, outline, ghost, link
 * - 6 colores temáticos: primary, secondary, success, danger, warning, gray
 * - 5 tamaños: xs, sm, md, lg, xl
 * - Efectos visuales: ripple, hover, pressed states
 * - Soporte para iconos (leading/trailing)
 * - Optimizado para móviles con touch targets de 44px mínimo
 * - Estados: loading, disabled, block width
 * - Navegación: soporte para NuxtLink y enlaces externos
 * 
 * @example
 * <BaseButton variant="solid" color="primary" size="md" @click="handleClick">
 *   Botón Primario
 * </BaseButton>
 * 
 * @example
 * <BaseButton
 *   to="/users"
 *   variant="outline" 
 *   color="secondary"
 *   leading-icon="bx:user"
 *   :loading="isSubmitting"
 * >
 *   Ver Usuarios
 * </BaseButton>
 */

// Constantes fuera del componente para evitar re-creación en cada render
const BUTTON_VARIANTS = {
  solid: {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    gray: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500'
  },
  outline: {
    primary: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
    secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    success: 'border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
    danger: 'border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
    warning: 'border border-yellow-600 text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500',
    gray: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
  },
  ghost: {
    primary: 'text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
    secondary: 'text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    success: 'text-green-600 hover:bg-green-50 focus:ring-green-500',
    danger: 'text-red-600 hover:bg-red-50 focus:ring-red-500',
    warning: 'text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500',
    gray: 'text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
  },
  link: {
    primary: 'text-indigo-600 hover:text-indigo-500 underline-offset-4 hover:underline',
    secondary: 'text-gray-700 hover:text-gray-500 underline-offset-4 hover:underline',
    success: 'text-green-600 hover:text-green-500 underline-offset-4 hover:underline',
    danger: 'text-red-600 hover:text-red-500 underline-offset-4 hover:underline',
    warning: 'text-yellow-600 hover:text-yellow-500 underline-offset-4 hover:underline',
    gray: 'text-gray-700 hover:text-gray-500 underline-offset-4 hover:underline'
  }
} as const

const BUTTON_SIZES = {
  xs: 'px-2.5 py-1.5 text-xs rounded min-h-[32px]',
  sm: 'px-3 py-2 text-sm rounded-md min-h-[36px]',
  md: 'px-4 py-2.5 text-sm rounded-md min-h-[44px]', // Mobile-friendly 44px touch target
  lg: 'px-5 py-3 text-base rounded-md min-h-[48px]',
  xl: 'px-6 py-3.5 text-base rounded-md min-h-[52px]'
} as const

const BASE_BUTTON_CLASSES = 'relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-[1.02] active:scale-95 touch-manipulation select-none'

/**
 * Props del componente BaseButton
 */
interface Props {
  /** Variante visual del botón que define el estilo base */
  variant?: 'solid' | 'outline' | 'ghost' | 'link'
  /** Color temático del botón */
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'gray'
  /** Tamaño del botón que afecta padding, font-size y altura mínima */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Ruta de Nuxt para navegación interna (convierte el botón en NuxtLink) */
  to?: string
  /** URL externa (convierte el botón en anchor tag) */
  href?: string
  /** Tipo de botón HTML (solo aplica cuando no es link) */
  type?: 'button' | 'submit' | 'reset'
  /** Deshabilitado - previene interacción y aplica estilos de disabled */
  disabled?: boolean
  /** Estado de carga - muestra animación de puntos y deshabilita interacción */
  loading?: boolean
  /** Ocupa todo el ancho disponible del contenedor */
  block?: boolean
  /** Icono que se muestra antes del contenido */
  leadingIcon?: string
  /** Icono que se muestra después del contenido */
  trailingIcon?: string
  /** Optimización específica para móviles con touch targets más grandes */
  mobileOptimized?: boolean
  /** Estilos especiales como el botón central de navegación inferior */
  special?: boolean
  /** Dirección del layout del contenido interno */
  layout?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  color: 'primary',
  size: 'md',
  to: undefined,
  href: undefined,
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
  leadingIcon: undefined,
  trailingIcon: undefined,
  mobileOptimized: false,
  special: false,
  layout: 'horizontal'
})

/**
 * Eventos emitidos por el componente BaseButton
 */
interface Emits {
  /** Emitido cuando el botón es clickeado (solo si no está disabled o loading) */
  (e: 'click', event: Event): void
}

const emit = defineEmits<Emits>()

/**
 * Determina el componente/elemento HTML a renderizar basado en las props
 * @returns NuxtLink para navegación interna, 'a' para enlaces externos, 'button' por defecto
 */
const is = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'button'
})

/**
 * Tipo HTML del elemento (solo aplicable para elementos button)
 * @returns El tipo de botón HTML o undefined para links
 */
const htmlType = computed(() => is.value === 'button' ? props.type : undefined)

// Estado reactivo para interacciones táctiles y efectos visuales
const isPressed = ref(false)
const showRipple = ref(false)
const rippleStyle = ref({})

/**
 * Classes CSS para la variante y color seleccionados
 * Optimización: computed separado para evitar re-renders innecesarios
 */
const variantClasses = computed(() => BUTTON_VARIANTS[props.variant][props.color])

/**
 * Classes CSS para el tamaño seleccionado
 * Optimización: computed separado para evitar re-renders innecesarios
 */
const sizeClasses = computed(() => BUTTON_SIZES[props.size])

/**
 * Clases CSS finales del botón combinando base, variante, tamaño y modificadores
 * @returns String con todas las clases CSS aplicables
 */
const buttonClasses = computed(() => {
  const classes = [
    BASE_BUTTON_CLASSES,
    variantClasses.value,
    sizeClasses.value
  ]
  
  if (props.block) {
    classes.push('w-full')
  }
  
  return classes.join(' ')
})

/**
 * Maneja el inicio del toque en dispositivos móviles
 * Activa el estado pressed y crea el efecto ripple
 * @param event - Evento de touch nativo
 */
const handleTouchStart = (event: TouchEvent) => {
  if (props.disabled || props.loading) return
  isPressed.value = true
  if (event.touches[0]) {
    createRippleEffect(event.touches[0])
  }
}

const handleTouchEnd = () => {
  if (props.disabled || props.loading) return
  setTimeout(() => {
    isPressed.value = false
  }, 150)
}

const handleMouseDown = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  isPressed.value = true
  createRippleEffect(event)
}

const handleMouseUp = () => {
  if (props.disabled || props.loading) return
  setTimeout(() => {
    isPressed.value = false
  }, 150)
}

const handleMouseLeave = () => {
  isPressed.value = false
}

/**
 * Crea un efecto visual de ripple/onda en la posición del click/touch
 * Calcula la posición y tamaño óptimo para el efecto
 * @param event - Evento de Touch o MouseEvent con coordenadas
 */
const createRippleEffect = (event: Touch | MouseEvent) => {
  const button = (event.target as HTMLElement)?.closest('button') as HTMLElement
  if (!button) return
  
  const rect = button.getBoundingClientRect()
  
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2
  
  rippleStyle.value = {
    width: size + 'px',
    height: size + 'px',
    left: x + 'px',
    top: y + 'px'
  }
  
  showRipple.value = true
  
  setTimeout(() => {
    showRipple.value = false
  }, 600)
}

/**
 * Maneja el evento click del botón
 * Incluye feedback háptico simulado y emisión del evento
 * @param event - Evento de click nativo
 */
const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    // Add haptic feedback simulation with a subtle scale animation
    const target = event.currentTarget as HTMLElement
    target.style.transform = 'scale(0.95)'
    
    setTimeout(() => {
      target.style.transform = ''
    }, 100)
    
    emit('click', event)
  }
}
</script>

