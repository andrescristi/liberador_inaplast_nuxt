<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :disabled="disabled || loading"
    v-bind="$attrs"
    @click="handleClick"
    ref="buttonRef"
  >
    <div 
      v-if="loading" 
      class="spinner-magical mr-2" 
    />
    <Icon 
      v-else-if="icon" 
      :name="icon" 
      :class="iconClasses" 
    />
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline' | 'magical'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: string
  iconOnly?: boolean
  tag?: string
  ripple?: boolean
  sparkle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  iconOnly: false,
  tag: 'button',
  ripple: true,
  sparkle: false
})

const buttonRef = ref<HTMLElement>()

const emit = defineEmits<{
  click: [event: Event]
}>()

const buttonClasses = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden'
  
  const variants = {
    primary: 'btn-glass-primary',
    secondary: 'btn-glass-secondary', 
    destructive: 'btn-destructive-glass',
    ghost: 'hover:bg-glass-light text-glass-secondary hover:text-glass focus:ring-glass-border',
    outline: 'border-2 border-glass-border hover:border-glass-border-strong bg-glass hover:bg-glass-light text-glass focus:ring-glass-border',
    magical: 'btn-glass-sparkle'
  }
  
  const sizes = {
    sm: props.iconOnly ? 'p-2' : 'px-3 py-2 text-sm',
    md: props.iconOnly ? 'p-2.5' : 'px-4 py-2.5 text-sm',
    lg: props.iconOnly ? 'p-3' : 'px-6 py-3 text-base'
  }
  
  return [
    baseClasses,
    variants[props.variant],
    sizes[props.size]
  ].join(' ')
})

const iconClasses = computed(() => {
  if (props.iconOnly) return 'w-4 h-4'
  return 'w-4 h-4 mr-2'
})

const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    // Add ripple effect
    if (props.ripple && buttonRef.value) {
      createRipple(event)
    }
    
    // Add sparkle effect for magical variant
    if (props.sparkle || props.variant === 'magical') {
      createSparkle()
    }
    
    emit('click', event)
  }
}

const createRipple = (event: Event) => {
  const button = buttonRef.value
  if (!button) return
  
  const mouseEvent = event as MouseEvent
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = mouseEvent.clientX - rect.left - size / 2
  const y = mouseEvent.clientY - rect.top - size / 2
  
  const ripple = document.createElement('span')
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
  `
  
  button.appendChild(ripple)
  
  setTimeout(() => {
    ripple.remove()
  }, 600)
}

const createSparkle = () => {
  const button = buttonRef.value
  if (!button) return
  
  // Create multiple sparkles
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const sparkle = document.createElement('span')
      sparkle.innerHTML = '✨'
      sparkle.style.cssText = `
        position: absolute;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        font-size: 0.8rem;
        animation: sparkle-burst 1s ease-out forwards;
        pointer-events: none;
        z-index: 10;
      `
      
      button.appendChild(sparkle)
      
      setTimeout(() => {
        sparkle.remove()
      }, 1000)
    }, i * 100)
  }
}
</script>