<template>
  <div class="success-celebration-container fixed inset-0 pointer-events-none z-50" :class="{ 'active': isActive }">
    <!-- Enhanced Mobile-Optimized Confetti -->
    <div v-for="(particle, index) in particles" :key="index" 
         class="confetti-particle mobile-optimized" 
         :style="particle.style"
         :class="particle.class" />
    
    <!-- Floating Success Emojis -->
    <div v-for="(emoji, index) in successEmojis" :key="'emoji-' + index"
         class="floating-emoji"
         :style="emoji.style">
      {{ emoji.char }}
    </div>
    
    <!-- Ripple Effect Background -->
    <div v-if="showRipple" class="success-ripple" />
    
    <!-- Enhanced Success Message with Mobile Touch -->
    <transition name="success-message">
      <div v-if="showMessage" class="success-message-wrapper">
        <div class="success-card" @touchstart="handleTouch" @click="handleTouch">
          <!-- Glow Effect -->
          <div class="success-glow" />
          
          <div class="success-content">
            <!-- Animated Checkmark -->
            <div class="checkmark-container">
              <div class="checkmark-circle">
                <svg class="checkmark-svg" viewBox="0 0 52 52">
                  <circle class="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none"/>
                  <path class="checkmark-check" fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>
            </div>
            
            <!-- Message Text -->
            <div class="message-text">
              <h3 class="success-title">{{ displayTitle }}</h3>
              <p class="success-description">{{ displayMessage }}</p>
            </div>
            
            <!-- Pulse Indicator for Mobile -->
            <div class="mobile-pulse-indicator">
              <div class="pulse-dot" />
              <span class="pulse-text">Tap to celebrate more!</span>
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
const showRipple = ref(false)
const particles = ref([])
const successEmojis = ref([])
const message = ref(props.message)
const displayTitle = ref('¡Éxito!')
const displayMessage = ref('')
const titleIndex = ref(0)
const messageIndex = ref(0)
const touchCount = ref(0)

// Enhanced brand colors for particles
const brandColors = [
  'bg-indigo-400',   // Primary
  'bg-indigo-300',   // Light primary  
  'bg-green-400',    // Success
  'bg-emerald-400',  // Success variant
  'bg-purple-400',   // Accent
  'bg-blue-400',     // Blue accent
  'bg-yellow-400',   // Warning/celebration
  'bg-pink-400'      // Fun accent
]

const celebrate = (customMessage?: string) => {
  if (customMessage) {
    message.value = customMessage
  }
  
  isActive.value = true
  showMessage.value = true
  showRipple.value = true
  touchCount.value = 0
  
  // Start ripple effect
  setTimeout(() => {
    showRipple.value = false
  }, 1000)
  
  // Create enhanced particles and emojis
  createParticles()
  createSuccessEmojis()
  
  // Start typewriter effect
  startTypewriter()
  
  // Mobile haptic feedback
  triggerHapticFeedback('success')
  
  // Play success sound
  playSuccessSound()
  
  // Auto-hide after duration
  setTimeout(() => {
    isActive.value = false
    showMessage.value = false
    particles.value = []
    successEmojis.value = []
    resetTypewriter()
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
        '--rotation': Math.random() * 360 + 'deg',
        '--scale': (0.5 + Math.random() * 0.8).toString()
      },
      class: [
        'animate-confetti-fall',
        brandColors[Math.floor(Math.random() * brandColors.length)],
        Math.random() > 0.5 ? 'rounded-full' : 'rounded-sm',
        Math.random() > 0.7 ? 'particle-glow' : ''
      ]
    }
    particles.value.push(particle)
  }
}

const createSuccessEmojis = () => {
  const emojis = ['🎉', '✨', '🌟', '💫', '🎊', '👏', '🥳', '🎈']
  successEmojis.value = []
  
  for (let i = 0; i < 6; i++) {
    const emoji = {
      char: emojis[Math.floor(Math.random() * emojis.length)],
      style: {
        left: Math.random() * 100 + '%',
        animationDelay: Math.random() * 1.5 + 's',
        animationDuration: (Math.random() * 2 + 3) + 's',
        '--float-distance': Math.random() * 50 + 20 + 'px'
      }
    }
    successEmojis.value.push(emoji)
  }
}

const startTypewriter = () => {
  displayTitle.value = ''
  displayMessage.value = ''
  titleIndex.value = 0
  messageIndex.value = 0
  
  const typeTitle = () => {
    if (titleIndex.value < '¡Éxito!'.length) {
      displayTitle.value += '¡Éxito!'[titleIndex.value]
      titleIndex.value++
      setTimeout(typeTitle, 100)
    } else {
      setTimeout(typeMessage, 300)
    }
  }
  
  const typeMessage = () => {
    if (messageIndex.value < message.value.length) {
      displayMessage.value += message.value[messageIndex.value]
      messageIndex.value++
      setTimeout(typeMessage, 30)
    }
  }
  
  setTimeout(typeTitle, 600)
}

const resetTypewriter = () => {
  displayTitle.value = ''
  displayMessage.value = ''
  titleIndex.value = 0
  messageIndex.value = 0
}

const handleTouch = () => {
  touchCount.value++
  
  // Create more particles on touch
  if (touchCount.value <= 3) {
    createParticles()
    triggerHapticFeedback('light')
    
    // Show encouraging messages
    const encouragements = [
      '¡Increíble trabajo!',
      '¡Sigue así!', 
      '¡Eres fantástico!'
    ]
    
    if (encouragements[touchCount.value - 1]) {
      displayMessage.value = encouragements[touchCount.value - 1]
    }
  }
}

const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' | 'success') => {
  if (process.client && 'vibrate' in navigator) {
    const patterns = {
      light: [50],
      medium: [100],
      heavy: [200],
      success: [100, 50, 100, 50, 200]
    }
    navigator.vibrate(patterns[type])
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
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.success-celebration-container.active {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Enhanced Confetti Particles */
.confetti-particle {
  position: fixed;
  width: 10px;
  height: 10px;
  top: -20px;
  pointer-events: none;
  z-index: 1000;
  transform: rotate(var(--rotation)) scale(var(--scale));
}

.confetti-particle.mobile-optimized {
  width: 12px;
  height: 12px;
}

.confetti-particle.particle-glow {
  box-shadow: 0 0 8px currentColor;
  filter: brightness(1.3);
}

/* Floating Emojis */
.floating-emoji {
  position: fixed;
  font-size: 2rem;
  top: 20%;
  pointer-events: none;
  z-index: 999;
  animation: floatUp linear forwards;
}

/* Success Ripple Effect */
.success-ripple {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%);
  animation: rippleExpand 1s ease-out forwards;
  transform: translate(-50%, -50%);
}

/* Success Message Wrapper */
.success-message-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
}

.success-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 300px;
  text-align: center;
}

.success-card:active {
  transform: scale(0.98);
}

.success-glow {
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: linear-gradient(45deg, #10b981, #34d399, #6ee7b7, #10b981);
  background-size: 400% 400%;
  animation: gradientShift 3s ease infinite;
  opacity: 0.6;
  z-index: -1;
}

.success-content {
  position: relative;
  z-index: 1;
}

/* Checkmark Animation */
.checkmark-container {
  margin-bottom: 1.5rem;
}

.checkmark-circle {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  position: relative;
}

.checkmark-svg {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: block;
  stroke-width: 3;
  stroke: #10b981;
  stroke-miterlimit: 10;
  filter: drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3));
}

.checkmark-circle-bg {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 3;
  stroke-miterlimit: 10;
  stroke: #10b981;
  fill: rgba(16, 185, 129, 0.1);
  animation: checkmarkCircle 0.8s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark-check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke-width: 4;
  stroke-linecap: round;
  animation: checkmarkCheck 0.4s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

/* Message Text */
.message-text {
  margin-bottom: 1.5rem;
}

.success-title {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #065f46 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
  min-height: 2.25rem;
}

.success-description {
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 500;
}

/* Mobile Pulse Indicator */
.mobile-pulse-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  opacity: 0.7;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.pulse-text {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

/* Animations */
@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg) scale(var(--scale));
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(var(--rotation)) scale(0);
    opacity: 0;
  }
}

@keyframes floatUp {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(calc(-1 * var(--float-distance))) rotate(10deg);
    opacity: 0;
  }
}

@keyframes rippleExpand {
  0% {
    width: 0;
    height: 0;
    opacity: 0.8;
  }
  100% {
    width: 600px;
    height: 600px;
    opacity: 0;
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes checkmarkCircle {
  0% {
    stroke-dashoffset: 166;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes checkmarkCheck {
  0% {
    stroke-dashoffset: 48;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.animate-confetti-fall {
  animation: confetti-fall linear forwards;
}

/* Success Message Transitions */
.success-message-enter-active {
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.success-message-leave-active {
  transition: all 0.4s ease-in;
}

.success-message-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.5) rotate(10deg);
}

.success-message-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8) rotate(-5deg);
}

.success-message-enter-to {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1) rotate(0deg);
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .success-card {
    min-width: 280px;
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .checkmark-circle {
    width: 60px;
    height: 60px;
  }
  
  .checkmark-svg {
    width: 60px;
    height: 60px;
  }
  
  .success-title {
    font-size: 1.5rem;
  }
  
  .success-description {
    font-size: 0.875rem;
  }
  
  .floating-emoji {
    font-size: 1.5rem;
  }
}

/* Accessibility: Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .success-celebration-container,
  .confetti-particle,
  .floating-emoji,
  .success-ripple,
  .success-glow,
  .checkmark-circle-bg,
  .checkmark-check,
  .pulse-dot {
    animation: none;
  }
  
  .success-card:active {
    transform: none;
  }
  
  .checkmark-circle-bg,
  .checkmark-check {
    stroke-dashoffset: 0;
  }
}
</style>