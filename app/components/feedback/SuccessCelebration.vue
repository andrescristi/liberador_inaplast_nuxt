<template>
  <div class="success-celebration-container fixed inset-0 pointer-events-none z-50" :class="{ 'active': isActive }">
    <!-- Inaplast Brand Confetti -->
    <div v-for="(particle, index) in particles" :key="index" 
         class="confetti-particle" 
         :style="particle.style"
         :class="particle.class" />
    
    <!-- Success Message with Brand Colors -->
    <transition name="success-message">
      <div v-if="showMessage" class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div class="glass-primary-strong p-6 rounded-glass-xl border-2 border-primary-300/50 animate-primary-glow shadow-primary-xl">
          <div class="flex items-center justify-center space-x-3">
            <div class="glass-icon-container w-12 h-12 bg-primary-500/30 border-primary-400/50 animate-bounce">
              <Icon name="lucide:check-circle" class="w-6 h-6 text-primary-200" />
            </div>
            <div class="text-center">
              <h3 class="text-lg font-bold text-white mb-1">¡Éxito!</h3>
              <p class="text-primary-200 text-sm">{{ message }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string
  duration?: number
  particleCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Operación completada exitosamente',
  duration: 3000,
  particleCount: 25
})

const isActive = ref(false)
const showMessage = ref(false)
const particles = ref([])
const message = ref(props.message)

// Inaplast brand colors for particles
const brandColors = [
  'bg-primary-400',   // Main brand color
  'bg-primary-300',   // Lighter variant
  'bg-secondary-400', // Orange complement
  'bg-accent-400',    // Cyan accent
  'bg-accent-purple-400', // Purple accent
  'bg-success-400',   // Success green
]

const celebrate = (customMessage?: string) => {
  if (customMessage) {
    message.value = customMessage
  }
  
  isActive.value = true
  showMessage.value = true
  
  // Create brand-colored confetti particles
  createParticles()
  
  // Play success sound if available
  playSuccessSound()
  
  // Auto-hide after duration
  setTimeout(() => {
    isActive.value = false
    showMessage.value = false
    particles.value = []
  }, props.duration)
}

const createParticles = () => {
  particles.value = []
  
  for (let i = 0; i < props.particleCount; i++) {
    const particle = {
      style: {
        left: Math.random() * 100 + '%',
        animationDelay: Math.random() * 2 + 's',
        animationDuration: (Math.random() * 3 + 2) + 's',
      },
      class: [
        'animate-confetti-fall',
        brandColors[Math.floor(Math.random() * brandColors.length)],
        Math.random() > 0.5 ? 'rounded-full' : 'rounded-sm'
      ]
    }
    particles.value.push(particle)
  }
}

const playSuccessSound = () => {
  // Create a subtle success sound using Web Audio API
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1)
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  } catch (error) {
    // Silently fail if Web Audio API is not supported
    console.log('🔇 Audio not available, visual celebration only')
  }
}

// Expose methods for parent components
defineExpose({
  celebrate
})
</script>

<style scoped>
.success-celebration-container {
  transition: all 0.3s ease;
}

.success-celebration-container.active {
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

.confetti-particle {
  position: fixed;
  width: 8px;
  height: 8px;
  top: -10px;
  pointer-events: none;
  z-index: 1000;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.animate-confetti-fall {
  animation: confetti-fall linear forwards;
}

/* Success Message Transitions */
.success-message-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.success-message-leave-active {
  transition: all 0.3s ease-in;
}

.success-message-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.3);
}

.success-message-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}

.success-message-enter-to {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
</style>