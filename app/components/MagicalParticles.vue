<template>
  <div class="particles-container" ref="particlesContainer">
    <!-- Floating magical particles -->
    <div
      v-for="particle in particles"
      :key="particle.id"
      class="particle"
      :style="{
        left: particle.x + 'px',
        top: particle.y + 'px',
        animationDelay: particle.delay + 's',
        animationDuration: particle.duration + 's'
      }"
    />
  </div>
</template>

<script setup lang="ts">
interface Particle {
  id: number
  x: number
  y: number
  delay: number
  duration: number
}

const particlesContainer = ref<HTMLElement>()
const particles = ref<Particle[]>([])

// Props
const props = withDefaults(defineProps<{
  count?: number
  enabled?: boolean
}>(), {
  count: 20,
  enabled: true
})

// Generate magical particles
const generateParticles = () => {
  if (!props.enabled) return
  
  particles.value = Array.from({ length: props.count }, (_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 4
  }))
}

// Regenerate particles on window resize
const handleResize = () => {
  generateParticles()
}

onMounted(() => {
  generateParticles()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Watch enabled prop
watch(() => props.enabled, (enabled) => {
  if (enabled) {
    generateParticles()
  } else {
    particles.value = []
  }
})
</script>

<style scoped>
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float-particles 8s linear infinite;
  opacity: 0.8;
}

.particle:nth-child(2n) {
  background: rgba(252, 211, 77, 0.4);
  width: 2px;
  height: 2px;
}

.particle:nth-child(3n) {
  background: rgba(147, 51, 234, 0.3);
  width: 4px;
  height: 4px;
}

.particle:nth-child(5n) {
  background: rgba(34, 197, 94, 0.3);
  animation-duration: 12s;
}

@keyframes float-particles {
  0% {
    transform: translateY(100vh) translateX(0px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-10vh) translateX(200px) rotate(360deg);
    opacity: 0;
  }
}
</style>