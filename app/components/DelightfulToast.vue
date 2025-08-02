<template>
  <teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div
        v-if="visible"
        class="fixed bottom-4 right-4 z-50 max-w-sm"
        :class="toastClasses"
        @click="hide"
      >
        <div class="flex items-center p-4">
          <div class="flex-shrink-0 mr-3">
            <div class="glass-icon-container w-8 h-8" :class="iconClasses">
              <component :is="iconComponent" class="w-5 h-5" />
            </div>
          </div>
          <div class="flex-1">
            <p class="font-medium text-glass">{{ title }}</p>
            <p v-if="message" class="text-sm text-glass-secondary">{{ message }}</p>
          </div>
          <button
            @click.stop="hide"
            class="ml-3 glass-icon-container w-6 h-6 hover:scale-110 transition-transform"
          >
            <Icon name="lucide:x" class="w-4 h-4 text-glass-muted" />
          </button>
        </div>
        
        <!-- Magic sparkles for success -->
        <div v-if="type === 'success'" class="sparkle-overlay">
          <div class="sparkle" style="top: 20%; left: 20%; animation-delay: 0s;">✨</div>
          <div class="sparkle" style="top: 60%; left: 80%; animation-delay: 0.3s;">⭐</div>
          <div class="sparkle" style="top: 80%; left: 30%; animation-delay: 0.6s;">💫</div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { Icon } from '#components'

interface ToastProps {
  type?: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  autoHide?: boolean
}

const props = withDefaults(defineProps<ToastProps>(), {
  type: 'info',
  duration: 5000,
  autoHide: true
})

const visible = ref(false)
let timeoutId: NodeJS.Timeout | null = null

const iconComponents = {
  success: 'lucide:check-circle',
  error: 'lucide:x-circle',
  warning: 'lucide:alert-triangle',
  info: 'lucide:info'
}

const iconComponent = computed(() => iconComponents[props.type])

const toastClasses = computed(() => {
  const baseClasses = 'glass-card cursor-pointer relative overflow-hidden'
  const typeClasses = {
    success: 'glass-success border-green-400/30 shadow-lg shadow-green-400/20',
    error: 'glass-error border-red-400/30 shadow-lg shadow-red-400/20',
    warning: 'border-yellow-400/30 shadow-lg shadow-yellow-400/20',
    info: 'border-blue-400/30 shadow-lg shadow-blue-400/20'
  }
  
  return `${baseClasses} ${typeClasses[props.type]}`
})

const iconClasses = computed(() => {
  const classes = {
    success: 'text-green-400 animate-bounce',
    error: 'text-red-400 animate-pulse',
    warning: 'text-yellow-400 animate-bounce',
    info: 'text-blue-400 animate-pulse'
  }
  
  return classes[props.type]
})

const show = () => {
  visible.value = true
  
  if (props.autoHide) {
    timeoutId = setTimeout(() => {
      hide()
    }, props.duration)
  }
}

const hide = () => {
  visible.value = false
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

// Auto-show when component mounts
onMounted(() => {
  show()
})

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})

defineExpose({
  show,
  hide
})
</script>

<style scoped>
.sparkle-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  font-size: 0.8rem;
  animation: sparkle-twinkle 2s ease-in-out infinite;
}

@keyframes sparkle-twinkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
}
</style>