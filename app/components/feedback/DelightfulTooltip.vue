<template>
  <div class="relative inline-block" ref="triggerRef">
    <!-- Trigger slot -->
    <div
      @mouseenter="show"
      @mouseleave="hide"
      @focus="show"
      @blur="hide"
    >
      <slot />
    </div>
    
    <!-- Tooltip -->
    <teleport to="body">
      <transition name="tooltip">
        <div
          v-if="visible"
          ref="tooltipRef"
          :class="tooltipClasses"
          :style="tooltipStyle"
        >
          <!-- Tooltip content -->
          <div class="flex items-center">
            <span v-if="icon" class="text-lg mr-2">{{ icon }}</span>
            <div>
              <div class="font-medium text-glass">{{ title }}</div>
              <div v-if="description" class="text-sm text-glass-secondary">{{ description }}</div>
            </div>
          </div>
          
          <!-- Tooltip arrow -->
          <div :class="arrowClasses"></div>
          
          <!-- Sparkle effect for magic tooltips -->
          <div v-if="magical" class="tooltip-sparkles">
            <div class="sparkle" v-for="i in 3" :key="i" :style="{ animationDelay: (i * 0.3) + 's' }">✨</div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description?: string
  icon?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  magical?: boolean
  delay?: number
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'top',
  magical: false,
  delay: 300,
  variant: 'default'
})

const triggerRef = ref<HTMLElement>()
const tooltipRef = ref<HTMLElement>()
const visible = ref(false)
const tooltipStyle = ref({})

let showTimeout: NodeJS.Timeout | null = null
let hideTimeout: NodeJS.Timeout | null = null

const tooltipClasses = computed(() => {
  const baseClasses = 'tooltip-magical fixed z-50 px-3 py-2 text-sm rounded-lg pointer-events-none transition-all duration-200'
  
  const variants = {
    default: 'glass-card',
    success: 'glass-card border-green-400/30 shadow-green-400/20',
    warning: 'glass-card border-yellow-400/30 shadow-yellow-400/20',
    error: 'glass-card border-red-400/30 shadow-red-400/20',
    info: 'glass-card border-blue-400/30 shadow-blue-400/20'
  }
  
  return `${baseClasses} ${variants[props.variant]}`
})

const arrowClasses = computed(() => {
  const baseClasses = 'absolute w-0 h-0 border-solid'
  
  const placements = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-glass-border',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-glass-border',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-glass-border',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-glass-border'
  }
  
  return `${baseClasses} ${placements[props.placement]}`
})

const calculatePosition = () => {
  if (!triggerRef.value || !tooltipRef.value) return
  
  const triggerRect = triggerRef.value.getBoundingClientRect()
  const tooltipRect = tooltipRef.value.getBoundingClientRect()
  
  let top = 0
  let left = 0
  
  switch (props.placement) {
    case 'top':
      top = triggerRect.top - tooltipRect.height - 8
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      break
    case 'bottom':
      top = triggerRect.bottom + 8
      left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
      break
    case 'left':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.left - tooltipRect.width - 8
      break
    case 'right':
      top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
      left = triggerRect.right + 8
      break
  }
  
  // Keep tooltip within viewport
  const padding = 8
  top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding))
  left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding))
  
  tooltipStyle.value = {
    top: `${top}px`,
    left: `${left}px`
  }
}

const show = () => {
  if (hideTimeout) {
    clearTimeout(hideTimeout)
    hideTimeout = null
  }
  
  showTimeout = setTimeout(() => {
    visible.value = true
    nextTick(() => {
      calculatePosition()
    })
  }, props.delay)
}

const hide = () => {
  if (showTimeout) {
    clearTimeout(showTimeout)
    showTimeout = null
  }
  
  hideTimeout = setTimeout(() => {
    visible.value = false
  }, 100)
}

onUnmounted(() => {
  if (showTimeout) clearTimeout(showTimeout)
  if (hideTimeout) clearTimeout(hideTimeout)
})

// Recalculate position on window resize
onMounted(() => {
  window.addEventListener('resize', calculatePosition)
  window.addEventListener('scroll', calculatePosition)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculatePosition)
  window.removeEventListener('scroll', calculatePosition)
})
</script>

<style scoped>
.tooltip-sparkles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  font-size: 0.6rem;
  animation: sparkle-float 2s ease-in-out infinite;
}

.sparkle:nth-child(1) {
  top: 10%;
  left: 20%;
}

.sparkle:nth-child(2) {
  top: 60%;
  right: 20%;
}

.sparkle:nth-child(3) {
  bottom: 10%;
  left: 50%;
}

.tooltip-enter-active {
  transition: all 0.2s ease-out;
}

.tooltip-leave-active {
  transition: all 0.15s ease-in;
}

.tooltip-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(4px);
}

.tooltip-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(4px);
}

@keyframes sparkle-float {
  0%, 100% {
    opacity: 0.3;
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: translateY(-3px) rotate(180deg);
  }
}
</style>