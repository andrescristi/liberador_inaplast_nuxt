<template>
  <teleport to="body">
    <transition name="celebration" appear>
      <div v-if="visible" class="celebration-overlay" @click="hide">
        <!-- Main celebration content -->
        <div class="celebration-content glass-card-magical p-8 text-center" @click.stop>
          <!-- Animated success icon -->
          <div class="success-icon-container mb-6">
            <div class="glass-icon-container w-20 h-20 mx-auto animate-bounce">
              <Icon name="lucide:check-circle" class="w-10 h-10 text-green-400" />
            </div>
            
            <!-- Floating success sparkles -->
            <div class="success-sparkles">
              <div class="sparkle success-sparkle" v-for="i in 8" :key="i" :style="sparkleStyle(i)">
                {{ sparkleEmojis[i % sparkleEmojis.length] }}
              </div>
            </div>
          </div>
          
          <!-- Success message -->
          <h2 class="text-3xl font-bold text-glass mb-4 animate-pulse">
            {{ title || '¡Excelente trabajo!' }}
          </h2>
          
          <p class="text-lg text-glass-secondary mb-8">
            {{ message || 'Tu acción se completó exitosamente' }}
          </p>
          
          <!-- Action buttons -->
          <div class="space-y-4">
            <Button
              variant="magical"
              size="lg"
              @click="handlePrimaryAction"
              :sparkle="true"
              class="transform hover:scale-105"
            >
              {{ primaryActionText || 'Continuar' }}
            </Button>
            
            <Button
              v-if="showSecondaryAction"
              variant="ghost"
              @click="handleSecondaryAction"
              class="transform hover:scale-105"
            >
              {{ secondaryActionText || 'Cerrar' }}
            </Button>
          </div>
        </div>
        
        <!-- Background confetti -->
        <div class="celebration-confetti">
          <div
            v-for="piece in confettiPieces"
            :key="piece.id"
            class="confetti-piece"
            :style="confettiStyle(piece)"
          />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  primaryActionText?: string
  secondaryActionText?: string
  showSecondaryAction?: boolean
  autoHide?: boolean
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  showSecondaryAction: true,
  autoHide: false,
  duration: 5000
})\n\nconst emit = defineEmits<{\n  primaryAction: []\n  secondaryAction: []\n  hide: []\n}>()\n\nconst visible = ref(false)\nconst confettiPieces = ref<Array<{ id: number; x: number; color: string; delay: number; duration: number }>>([])\n\nconst sparkleEmojis = ['✨', '⭐', '💫', '🌟', '💎', '🎊', '🎉', '🔥']\nconst confettiColors = ['#FFD700', '#FF69B4', '#00CED1', '#98FB98', '#DDA0DD', '#F0E68C', '#FF6347', '#40E0D0']\n\nconst sparkleStyle = (index: number) => {\n  const angle = (360 / 8) * index\n  const delay = index * 0.2\n  \n  return {\n    transform: `rotate(${angle}deg) translateX(50px)`,\n    animationDelay: `${delay}s`\n  }\n}\n\nconst confettiStyle = (piece: any) => {\n  return {\n    left: piece.x + 'px',\n    backgroundColor: piece.color,\n    animationDelay: piece.delay + 's',\n    animationDuration: piece.duration + 's'\n  }\n}\n\nconst generateConfetti = () => {\n  confettiPieces.value = Array.from({ length: 50 }, (_, i) => ({\n    id: i,\n    x: Math.random() * window.innerWidth,\n    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],\n    delay: Math.random() * 2,\n    duration: 3 + Math.random() * 2\n  }))\n}\n\nconst show = () => {\n  visible.value = true\n  generateConfetti()\n  \n  if (props.autoHide) {\n    setTimeout(() => {\n      hide()\n    }, props.duration)\n  }\n}\n\nconst hide = () => {\n  visible.value = false\n  emit('hide')\n}\n\nconst handlePrimaryAction = () => {\n  emit('primaryAction')\n  hide()\n}\n\nconst handleSecondaryAction = () => {\n  emit('secondaryAction')\n  hide()\n}\n\n// Expose methods\ndefineExpose({\n  show,\n  hide\n})\n</script>\n\n<style scoped>\n.celebration-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.6);\n  backdrop-filter: blur(8px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 9999;\n  padding: 1rem;\n}\n\n.celebration-content {\n  max-width: 500px;\n  width: 100%;\n  position: relative;\n  animation: celebration-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);\n}\n\n.success-icon-container {\n  position: relative;\n}\n\n.success-sparkles {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: 120px;\n  height: 120px;\n}\n\n.success-sparkle {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  font-size: 1.5rem;\n  animation: success-sparkle-dance 2s ease-in-out infinite;\n  transform-origin: center;\n}\n\n.celebration-confetti {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n}\n\n.confetti-piece {\n  position: absolute;\n  width: 8px;\n  height: 8px;\n  animation: celebration-confetti-fall linear forwards;\n  top: -10px;\n}\n\n/* Transitions */\n.celebration-enter-active {\n  transition: all 0.3s ease-out;\n}\n\n.celebration-leave-active {\n  transition: all 0.2s ease-in;\n}\n\n.celebration-enter-from,\n.celebration-leave-to {\n  opacity: 0;\n  transform: scale(0.8);\n}\n\n/* Animations */\n@keyframes celebration-bounce {\n  0% {\n    opacity: 0;\n    transform: scale(0.3) translateY(50px);\n  }\n  50% {\n    opacity: 1;\n    transform: scale(1.05) translateY(-10px);\n  }\n  70% {\n    transform: scale(0.95) translateY(0px);\n  }\n  100% {\n    opacity: 1;\n    transform: scale(1) translateY(0px);\n  }\n}\n\n@keyframes success-sparkle-dance {\n  0%, 100% {\n    opacity: 0.5;\n    transform: scale(0.8) rotate(0deg);\n  }\n  50% {\n    opacity: 1;\n    transform: scale(1.2) rotate(180deg);\n  }\n}\n\n@keyframes celebration-confetti-fall {\n  0% {\n    transform: translateY(-100vh) rotate(0deg);\n    opacity: 1;\n  }\n  100% {\n    transform: translateY(100vh) rotate(720deg);\n    opacity: 0;\n  }\n}\n</style>"
                
              