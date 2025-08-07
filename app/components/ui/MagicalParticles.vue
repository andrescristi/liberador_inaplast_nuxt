<template>
  <div v-if="enabled" class="magical-particles">
    <div
      v-for="i in count"
      :key="i"
      class="particle"
      :style="getParticleStyle(i)"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number
  enabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  count: 20,
  enabled: true
})

const getParticleStyle = (index: number) => {
  const x = Math.random() * 100
  const y = Math.random() * 100
  const delay = Math.random() * 2
  const duration = 2 + Math.random() * 3
  
  return {
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}
</script>

<style scoped>
.magical-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: linear-gradient(45deg, #ffd700, #ff69b4);
  border-radius: 50%;
  animation: float 3s infinite ease-in-out;
  opacity: 0.7;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.7;
  }
}
</style>