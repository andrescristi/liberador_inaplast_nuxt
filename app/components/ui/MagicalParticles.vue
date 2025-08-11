<template>
  <div 
    v-if="enabled" 
    class="magical-particles" 
    style="z-index: var(--z-particles)"
  >
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

const { count = 20, enabled = true } = defineProps<Props>()

const getParticleStyle = (_index: number) => {
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

