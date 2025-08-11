<template>
  <teleport to="body">
    <div 
      v-if="showConfetti" 
      class="confetti-container" 
      style="z-index: var(--z-confetti)"
    >
      <div
        v-for="piece in confettiPieces"
        :key="piece.id"
        class="confetti-piece"
        :style="{
          left: piece.x + 'px',
          backgroundColor: piece.color,
          animationDelay: piece.delay + 's',
          animationDuration: piece.duration + 's'
        }"
      />
    </div>
  </teleport>
</template>

<script setup lang="ts">
interface ConfettiPiece {
  id: number
  x: number
  color: string
  delay: number
  duration: number
}

const showConfetti = ref(false)
const confettiPieces = ref<ConfettiPiece[]>([])

const colors = [
  '#FFD700', // Gold
  '#FF69B4', // Hot Pink
  '#00CED1', // Dark Turquoise
  '#98FB98', // Pale Green
  '#DDA0DD', // Plum
  '#F0E68C', // Khaki
  '#FF6347', // Tomato
  '#40E0D0'  // Turquoise
]

const celebrate = () => {
  showConfetti.value = true
  
  // Generate confetti pieces
  confettiPieces.value = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2
  }))
  
  // Hide confetti after animation
  setTimeout(() => {
    showConfetti.value = false
    confettiPieces.value = []
  }, 4000)
}

// Expose celebrate function
defineExpose({
  celebrate
})
</script>

