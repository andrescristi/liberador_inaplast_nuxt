<template>
  <div class="magical-loader-container" v-if="visible">
    <div class="magical-loader">
      <!-- Main spinner with glass effect -->
      <div class="glass-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring delay-1"></div>
        <div class="spinner-ring delay-2"></div>
      </div>
      
      <!-- Floating sparkles -->
      <div class="sparkles">
        <div class="sparkle" v-for="i in 6" :key="i" :style="{ animationDelay: (i * 0.3) + 's' }">✨</div>
      </div>
      
      <!-- Loading text with personality -->
      <div class="loading-text">
        <p class="text-glass font-medium">{{ currentMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  visible?: boolean
  messages?: string[]
}>(), {
  visible: false,
  messages: () => [
    '✨ Preparando la magia...',
    '🎭 Organizando elementos...',
    '🌟 Creando experiencias...',
    '🎨 Puliendo detalles...',
    '🚀 Casi listo...'
  ]
})

const currentMessage = ref('')
let messageInterval: NodeJS.Timeout | null = null

const startMessageRotation = () => {
  let index = 0
  currentMessage.value = props.messages[index]
  
  messageInterval = setInterval(() => {
    index = (index + 1) % props.messages.length
    currentMessage.value = props.messages[index]
  }, 1500)
}

const stopMessageRotation = () => {
  if (messageInterval) {
    clearInterval(messageInterval)
    messageInterval = null
  }
}

watch(() => props.visible, (visible) => {
  if (visible) {
    startMessageRotation()
  } else {
    stopMessageRotation()
  }
}, { immediate: true })

onUnmounted(() => {
  stopMessageRotation()
})
</script>

<style scoped>
.magical-loader-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.magical-loader {
  position: relative;
  text-align: center;
}

.glass-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
}

.spinner-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: magical-spin 2s linear infinite;
}

.spinner-ring.delay-1 {
  animation-delay: 0.3s;
  border-top-color: rgba(252, 211, 77, 0.8);
  transform: scale(0.8);
}

.spinner-ring.delay-2 {
  animation-delay: 0.6s;
  border-top-color: rgba(147, 51, 234, 0.8);
  transform: scale(0.6);
}

.sparkles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
}

.sparkle {
  position: absolute;
  font-size: 1rem;
  animation: sparkle-orbit 3s linear infinite;
  opacity: 0.7;
}

.sparkle:nth-child(1) { top: 0; left: 50%; transform: translateX(-50%); }
.sparkle:nth-child(2) { top: 25%; right: 0; }
.sparkle:nth-child(3) { bottom: 0; right: 25%; }
.sparkle:nth-child(4) { bottom: 0; left: 50%; transform: translateX(-50%); }
.sparkle:nth-child(5) { bottom: 25%; left: 0; }
.sparkle:nth-child(6) { top: 25%; left: 0; }

.loading-text {
  margin-top: 1rem;
  animation: text-pulse 2s ease-in-out infinite;
}

@keyframes magical-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes sparkle-orbit {
  0% {
    opacity: 0.3;
    transform: scale(0.5) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
  100% {
    opacity: 0.3;
    transform: scale(0.5) rotate(360deg);
  }
}

@keyframes text-pulse {
  0%, 100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}
</style>