<template>
  <button
    ref="buttonElement"
    :class="computedClasses"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading"
    :aria-label="ariaLabel || undefined"
    :aria-describedby="ariaDescribedBy || undefined"
    :type="type"
    v-bind="$attrs"
    @click="handleClick"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <span 
      v-if="loading" 
      class="daisy-loading daisy-loading-spinner daisy-loading-sm"
      aria-hidden="true"
    ></span>
    <Icon 
      v-else-if="icon" 
      :name="icon" 
      :class="iconClasses"
      aria-hidden="true"
    />
    <span v-if="$slots.default" :class="{ 'sr-only': iconOnly }">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
// Enhanced type definitions with #799EFF integration
export type DaisyButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'link' | 'glass' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary-outline' | 'secondary-outline'
export type DaisyButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type DaisyButtonType = 'button' | 'submit' | 'reset'

interface Props {
  /** Button variant/style */
  variant?: DaisyButtonVariant
  /** Button size */
  size?: DaisyButtonSize
  /** Button type attribute */
  type?: DaisyButtonType
  /** Show loading state with spinner */
  loading?: boolean
  /** Disable button interactions */
  disabled?: boolean
  /** Icon name from Nuxt Icon */
  icon?: string
  /** Show only icon (hides text) */
  iconOnly?: boolean
  /** Outline style variant */
  outline?: boolean
  /** Wide button (full width) */
  wide?: boolean
  /** Enable glassmorphism overlay */
  glass?: boolean
  /** Accessible label for screen readers */
  ariaLabel?: string
  /** ID of element that describes this button */
  ariaDescribedBy?: string
  /** Enable ripple effect on click */
  ripple?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  loading: false,
  disabled: false,
  iconOnly: false,
  outline: false,
  wide: false,
  glass: true,
  ripple: true
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

// Refs for DOM access and state management
const buttonElement = ref<HTMLButtonElement>()
const isFocused = ref(false)

// Get DaisyUI utilities with enhanced #799EFF configuration
const { mergeClasses, createClasses, config, getPrimaryColorVariants, getGlassColorVariants } = useDaisyUI({
  enableGlassEffects: props.glass,
  enableAnimations: true,
  enablePrimaryColors: true,
  glassIntensity: 'medium'
})

// Enhanced computed classes with #799EFF primary integration
const computedClasses = computed(() => {
  const baseDaisyClasses = 'daisy-btn'
  
  // Build DaisyUI classes with enhanced variant support
  const daisyClasses = createClasses(baseDaisyClasses, {
    // Primary variants with #799EFF
    'daisy-btn-primary': props.variant === 'primary',
    'daisy-btn-secondary': props.variant === 'secondary', 
    'daisy-btn-accent': props.variant === 'accent',
    'daisy-btn-ghost': props.variant === 'ghost',
    'daisy-btn-link': props.variant === 'link',
    'daisy-btn-success': props.variant === 'success',
    'daisy-btn-warning': props.variant === 'warning',
    'daisy-btn-error': props.variant === 'error',
    'daisy-btn-info': props.variant === 'info',
    'daisy-btn-neutral': props.variant === 'neutral',
    
    // Size variants
    'daisy-btn-xs': props.size === 'xs',
    'daisy-btn-sm': props.size === 'sm',
    'daisy-btn-lg': props.size === 'lg',
    'daisy-btn-xl': props.size === 'xl',
    
    // Modifiers
    'daisy-btn-outline': props.outline || props.variant.includes('outline'),
    'daisy-btn-wide': props.wide,
    'daisy-btn-square': props.iconOnly
  })
  
  // Enhanced glass styling with primary color integration
  const glassClasses = (props.glass || props.variant === 'glass') && config.enableGlassEffects
    ? createClasses('', {
        // Base glass effects
        'backdrop-blur-glass-md': true,
        'bg-glass-bg-primary': props.variant === 'primary' || props.variant === 'glass',
        'bg-glass-bg-primary-light': props.variant === 'ghost',
        'border-glass-border-primary': props.variant === 'primary' || props.variant === 'glass',
        'border-glass-border-primary-light': props.variant !== 'primary' && props.variant !== 'glass',
        
        // Hover states with primary colors
        'hover:bg-primary-600': (props.variant === 'primary' || props.variant === 'glass') && !props.disabled && !props.loading,
        'hover:bg-glass-bg-primary-medium': props.variant === 'ghost' && !props.disabled && !props.loading,
        'hover:border-primary-500': !props.disabled && !props.loading,
        'hover:shadow-primary-lg': !props.disabled && !props.loading,
        'hover:transform': config.enableAnimations && !props.disabled && !props.loading,
        'hover:-translate-y-0.5': config.enableAnimations && !props.disabled && !props.loading,
        
        // Focus states
        'focus:bg-primary-600': (props.variant === 'primary' || props.variant === 'glass') && !props.disabled && !props.loading,
        'focus:shadow-primary-lg': !props.disabled && !props.loading,
        'focus:ring-2': true,
        'focus:ring-primary-300': true,
        'focus:ring-offset-2': true,
        'focus:ring-offset-transparent': true,
        
        // Text colors based on variant
        'text-white': props.variant === 'primary' || props.variant === 'glass',
        'text-primary-700': props.variant === 'ghost' || props.variant === 'link',
        'text-secondary-700': props.variant === 'secondary',
        'text-accent-700': props.variant === 'accent',
        
        // Animations
        'transition-all': config.enableAnimations,
        'duration-200': config.enableAnimations,
        'ease-out': config.enableAnimations,
        
        // Shadows
        'shadow-primary': props.variant === 'primary' || props.variant === 'glass',
        'shadow-glass': props.variant === 'ghost',
      })
    : ''
  
  // State-based classes with primary color theming
  const stateClasses = createClasses('', {
    'opacity-60': props.loading,
    'cursor-not-allowed': props.disabled,
    'pointer-events-none': props.disabled || props.loading,
    'ring-2 ring-primary-400': isFocused.value && props.glass,
    'animate-primary-pulse': props.loading && config.enableAnimations
  })
  
  return mergeClasses(daisyClasses, `${glassClasses} ${stateClasses}`.trim(), 'glass')
})

// Icon classes with enhanced responsiveness and XL size support
const iconClasses = computed(() => {
  const sizeMap: Record<DaisyButtonSize, string> = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  }
  
  const baseSize = sizeMap[props.size] || sizeMap.md
  const iconColor = props.variant === 'primary' || props.variant === 'glass' ? 'text-white' : 'text-primary-600'
  return props.iconOnly ? `${baseSize} ${iconColor}` : `${baseSize} ${iconColor} mr-2`
})

// Enhanced event handlers with better user experience
const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  
  // Add ripple effect if enabled
  if (props.ripple && buttonElement.value) {
    createRipple(event)
  }
  
  emit('click', event)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

// Enhanced ripple effect with better performance
const createRipple = (event: MouseEvent) => {
  const button = buttonElement.value
  if (!button || !config.enableAnimations) return
  
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2
  
  // Remove existing ripples to prevent accumulation
  const existingRipples = button.querySelectorAll('.button-ripple')
  existingRipples.forEach(ripple => ripple.remove())
  
  const ripple = document.createElement('span')
  ripple.className = 'button-ripple'
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    background-color: rgba(255, 255, 255, 0.3);
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    pointer-events: none;
    z-index: 1;
  `
  
  button.appendChild(ripple)
  
  // Clean up ripple element
  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.remove()
    }
  }, 600)
}
</script>

<style scoped>
/* Enhanced button animations and effects with #799EFF theming */
@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes primary-pulse {
  0%, 100% {
    background-color: var(--primary-500);
  }
  50% {
    background-color: var(--primary-400);
  }
}

.animate-primary-pulse {
  animation: primary-pulse 2s ease-in-out infinite;
}

/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Enhanced glass effects with #799EFF primary integration */
.daisy-btn.backdrop-blur-glass-md {
  -webkit-backdrop-filter: var(--blur-md);
  backdrop-filter: var(--blur-md);
}

/* Primary button glass effects */
.daisy-btn.bg-glass-bg-primary {
  background: var(--glass-bg-primary) !important;
  border-color: var(--glass-border-primary) !important;
}

.daisy-btn.bg-glass-bg-primary:hover {
  background: var(--primary-600) !important;
  border-color: var(--primary-500) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(121, 158, 255, 0.3);
}

/* Secondary button glass effects */
.daisy-btn-secondary.bg-glass-bg-primary-light {
  background: rgba(255, 179, 102, 0.15) !important;
  border-color: rgba(255, 179, 102, 0.3) !important;
  color: var(--secondary-700) !important;
}

.daisy-btn-secondary.bg-glass-bg-primary-light:hover {
  background: var(--secondary-200) !important;
  border-color: var(--secondary-400) !important;
  color: var(--secondary-800) !important;
}

/* Enhanced focus styles with primary color theming */
.daisy-btn:focus-visible {
  outline: 2px solid var(--primary-400);
  outline-offset: 2px;
}

.daisy-btn-primary:focus-visible,
.daisy-btn.bg-glass-bg-primary:focus-visible {
  outline: 2px solid var(--primary-300);
  box-shadow: 0 0 0 4px rgba(121, 158, 255, 0.2);
}

/* Smooth transitions for glass effects */
.daisy-btn.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced loading and disabled state styles */
.daisy-btn:disabled.opacity-60 {
  pointer-events: none;
  cursor: not-allowed;
}

.daisy-btn.pointer-events-none {
  user-select: none;
}

/* Primary button active state */
.daisy-btn-primary:active {
  background-color: var(--primary-700) !important;
  transform: translateY(0);
}

/* Glass button active state */
.daisy-btn.bg-glass-bg-primary:active {
  background: var(--primary-700) !important;
  transform: translateY(0);
}
</style>