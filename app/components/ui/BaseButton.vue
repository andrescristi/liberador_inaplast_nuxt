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
        class="ripple-effect"
        :style="rippleStyle"
      />
      
      <!-- Button Content -->
      <div class="relative z-10 flex items-center justify-center">
        <!-- Loading with enhanced animation -->
        <div v-if="loading" class="mr-2">
          <div class="loading-dots flex space-x-1">
            <div class="loading-dot" />
            <div class="loading-dot" style="animation-delay: 0.1s" />
            <div class="loading-dot" style="animation-delay: 0.2s" />
          </div>
        </div>
        
        <!-- Leading Icon with bounce -->
        <Icon 
          v-if="leadingIcon && !loading" 
          :name="leadingIcon" 
          :class="[
            'w-4 h-4 mr-2 transition-transform duration-200',
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
interface Props {
  variant?: 'solid' | 'outline' | 'ghost' | 'link'
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'gray'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  to?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  leadingIcon?: string
  trailingIcon?: string
  mobileOptimized?: boolean // New prop for mobile-specific styling
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
  mobileOptimized: false
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const is = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'button'
})

const htmlType = computed(() => is.value === 'button' ? props.type : undefined)

// Touch interaction state
const isPressed = ref(false)
const showRipple = ref(false)
const rippleStyle = ref({})

const buttonClasses = computed(() => {
  const base = 'relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-[1.02] active:scale-95 touch-manipulation select-none'
  
  const variants = {
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
  }
  
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs rounded min-h-[32px]',
    sm: 'px-3 py-2 text-sm rounded-md min-h-[36px]',
    md: 'px-4 py-2.5 text-sm rounded-md min-h-[44px]', // Mobile-friendly 44px touch target
    lg: 'px-5 py-3 text-base rounded-md min-h-[48px]',
    xl: 'px-6 py-3.5 text-base rounded-md min-h-[52px]'
  }
  
  const classes = [
    base,
    variants[props.variant][props.color],
    sizes[props.size]
  ]
  
  if (props.block) {
    classes.push('w-full')
  }
  
  return classes.join(' ')
})

// Touch and mouse interaction handlers
const handleTouchStart = (event: TouchEvent) => {
  if (props.disabled || props.loading) return
  isPressed.value = true
  createRippleEffect(event.touches[0])
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

const createRippleEffect = (event: TouchEvent['touches'][0] | MouseEvent) => {
  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  
  const size = Math.max(rect.width, rect.height)
  const x = 'clientX' in event ? event.clientX - rect.left - size / 2 : event.pageX - rect.left - size / 2
  const y = 'clientY' in event ? event.clientY - rect.top - size / 2 : event.pageY - rect.top - size / 2
  
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

<style scoped>
/* Ripple Effect Animation */
.ripple-effect {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  pointer-events: none;
  animation: ripple 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* Enhanced Loading Animation */
.loading-dots {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: currentColor;
  animation: loading-bounce 1.4s ease-in-out infinite both;
}

@keyframes loading-bounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Mobile-specific touch optimizations */
@media (hover: none) {
  .ripple-effect {
    background-color: rgba(0, 0, 0, 0.1);
  }
}

/* Accessibility: Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .ripple-effect {
    animation: none;
    opacity: 0;
  }
  
  .loading-dot {
    animation: none;
  }
  
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
</style>