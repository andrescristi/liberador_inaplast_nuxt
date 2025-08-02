<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden">
    <!-- Magical Particles -->
    <MagicalParticles :count="30" :enabled="true" />
    
    <!-- Main error content -->
    <div class="glass-card-magical p-12 max-w-2xl mx-4 text-center relative z-10">
      <!-- Animated error icon -->
      <div class="relative mb-8">
        <div class="glass-icon-container w-24 h-24 mx-auto animate-bounce">
          <div class="text-4xl" v-if="is404">🎭</div>
          <div class="text-4xl" v-else>🔮</div>
        </div>
        
        <!-- Floating sparkles around icon -->
        <div class="absolute inset-0">
          <div class="sparkle-orbit" v-for="i in 6" :key="i" :style="{ animationDelay: (i * 0.5) + 's' }">
            ✨
          </div>
        </div>
      </div>
      
      <!-- Error title with personality -->
      <h1 class="text-4xl font-bold text-glass mb-4 animate-pulse">
        <span v-if="is404">¡Oops! Página no encontrada</span>
        <span v-else>¡Algo mágico salió mal!</span>
      </h1>
      
      <!-- Fun error message -->
      <p class="text-xl text-glass-secondary mb-8 leading-relaxed">
        <span v-if="is404">
          Parece que esta página se fue de aventura 🗺️<br>
          ¡Pero no te preocupes, podemos ayudarte a encontrar tu camino!
        </span>
        <span v-else>
          Nuestros duendes digitales están trabajando para arreglar esto 🧚‍♂️<br>
          {{ error.message || 'Error inesperado' }}
        </span>
      </p>
      
      <!-- Error details (for development) -->
      <details v-if="isDev && error.stack" class="glass-card p-4 mb-8 text-left">
        <summary class="cursor-pointer text-glass font-medium mb-2">
          🔍 Detalles técnicos (desarrollo)
        </summary>
        <pre class="text-xs text-glass-muted overflow-auto">{{ error.stack }}</pre>
      </details>
      
      <!-- Action buttons -->
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="magical"
            size="lg"
            @click="goHome"
            :sparkle="true"
            class="transform hover:scale-105"
          >
            <Icon name="lucide:home" class="w-5 h-5 mr-2" />
            Ir al inicio
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            @click="goBack"
            class="transform hover:scale-105"
          >
            <Icon name="lucide:arrow-left" class="w-5 h-5 mr-2" />
            Volver atrás
          </Button>
        </div>
        
        <!-- Fun reload button -->
        <Button
          variant="ghost"
          @click="tryAgain"
          class="transform hover:scale-105"
          :loading="reloading"
        >
          <Icon v-if="!reloading" name="lucide:refresh-cw" class="w-4 h-4 mr-2" />
          {{ reloading ? 'Haciendo magia...' : 'Intentar de nuevo' }}
        </Button>
      </div>
      
      <!-- Easter egg counter -->
      <div class="mt-8">
        <button 
          @click="handleEasterEgg"
          class="text-glass-muted hover:text-glass transition-colors text-sm"
        >
          💫 ¿Necesitas un poco de magia? ({{ easterEggClicks }}/5)
        </button>
      </div>
    </div>
    
    <!-- Confetti for easter egg -->
    <ConfettiCelebration ref="confettiRef" />
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

interface Props {
  error: NuxtError
}

const props = defineProps<Props>()

const confettiRef = ref()
const reloading = ref(false)
const easterEggClicks = ref(0)
const isDev = process.dev

const is404 = computed(() => props.error.statusCode === 404)

const goHome = () => {
  clearError({ redirect: '/' })
}

const goBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    goHome()
  }
}

const tryAgain = async () => {
  reloading.value = true
  
  // Add a delay for dramatic effect
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  try {
    await clearError()
  } catch {
    // If still error, go home
    goHome()
  } finally {
    reloading.value = false
  }
}

const handleEasterEgg = () => {
  easterEggClicks.value++
  
  if (easterEggClicks.value >= 5) {
    // Trigger celebration
    if (confettiRef.value) {
      confettiRef.value.celebrate()
    }
    
    // Add konami class for fun
    document.body.classList.add('konami-activated')
    
    setTimeout(() => {
      document.body.classList.remove('konami-activated')
      easterEggClicks.value = 0
    }, 3000)
  }
}

// Set page title
useSeoMeta({
  title: is404.value ? 'Página no encontrada' : 'Error',
  description: 'Algo inesperado ha ocurrido, pero estamos aquí para ayudarte.'
})
</script>

<style scoped>
.sparkle-orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  margin: -60px 0 0 -60px;
  animation: orbit 4s linear infinite;
  font-size: 1.2rem;
}

.sparkle-orbit:nth-child(1) { animation-duration: 3s; }
.sparkle-orbit:nth-child(2) { animation-duration: 4s; animation-direction: reverse; }
.sparkle-orbit:nth-child(3) { animation-duration: 5s; }
.sparkle-orbit:nth-child(4) { animation-duration: 6s; animation-direction: reverse; }
.sparkle-orbit:nth-child(5) { animation-duration: 4.5s; }
.sparkle-orbit:nth-child(6) { animation-duration: 3.5s; animation-direction: reverse; }

@keyframes orbit {
  0% {
    transform: rotate(0deg) translateX(60px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: rotate(360deg) translateX(60px) rotate(-360deg);
    opacity: 0.3;
  }
}

details summary::-webkit-details-marker {
  display: none;
}

details summary::before {
  content: '▶ ';
  transition: transform 0.2s;
}

details[open] summary::before {
  transform: rotate(90deg);
}
</style>