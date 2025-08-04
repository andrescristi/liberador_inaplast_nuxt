<template>
  <teleport to="body">
    <transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to"
    >
      <div
        v-if="isOpen"
        class="modal-overlay"
        :class="{ 'modal-open': isOpen }"
        @click="handleOverlayClick"
        @keydown="handleKeydown"
        tabindex="-1"
        role="dialog"
        :aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="descriptionId"
      >
        <div
          ref="modalContent"
          :class="computedClasses"
          @click.stop
          role="document"
        >
          <!-- Modal Header -->
          <div v-if="title || $slots.header" class="modal-header">
            <slot name="header">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div v-if="icon" class="glass-icon-container w-10 h-10">
                    <Icon :name="icon" class="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 :id="titleId" class="modal-title">{{ title }}</h2>
                    <p v-if="subtitle" :id="descriptionId" class="modal-subtitle">{{ subtitle }}</p>
                  </div>
                </div>
                <button
                  v-if="closable"
                  class="modal-close-btn"
                  @click="close"
                  :aria-label="closeLabel"
                  type="button"
                >
                  <Icon name="lucide:x" class="w-5 h-5" />
                </button>
              </div>
            </slot>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <slot />
          </div>

          <!-- Modal Footer -->
          <div v-if="$slots.footer || showDefaultFooter" class="modal-footer">
            <slot name="footer">
              <div class="flex flex-col sm:flex-row gap-3 justify-end">
                <DaisyButton
                  v-if="showCancel"
                  variant="ghost"
                  :disabled="loading"
                  @click="cancel"
                  :size="buttonSize"
                >
                  {{ cancelLabel }}
                </DaisyButton>
                <DaisyButton
                  v-if="showConfirm"
                  :variant="confirmVariant"
                  :loading="loading"
                  @click="confirm"
                  :size="buttonSize"
                  :icon="confirmIcon"
                >
                  {{ confirmLabel }}
                </DaisyButton>
              </div>
            </slot>
          </div>

          <!-- Loading Overlay -->
          <div v-if="loading" class="modal-loading-overlay">
            <div class="loading-spinner">
              <div class="spinner-glass"></div>
              <p class="text-primary-700 mt-4">{{ loadingText }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
// Import DaisyButton types
import type { DaisyButtonVariant, DaisyButtonSize } from './DaisyButton.vue'

export type DaisyModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type DaisyModalPosition = 'center' | 'top' | 'bottom'

interface Props {
  /** Control modal visibility */
  modelValue: boolean
  /** Modal title */
  title?: string
  /** Modal subtitle */
  subtitle?: string
  /** Modal icon */
  icon?: string
  /** Modal size */
  size?: DaisyModalSize
  /** Modal position */
  position?: DaisyModalPosition
  /** Enable glassmorphism effects */
  glass?: boolean
  /** Allow closing by clicking overlay */
  closeOnOverlay?: boolean
  /** Allow closing with escape key */
  closeOnEscape?: boolean
  /** Show close button */
  closable?: boolean
  /** Show default footer */
  showDefaultFooter?: boolean
  /** Show cancel button */
  showCancel?: boolean
  /** Show confirm button */
  showConfirm?: boolean
  /** Cancel button label */
  cancelLabel?: string
  /** Confirm button label */
  confirmLabel?: string
  /** Confirm button variant */
  confirmVariant?: DaisyButtonVariant
  /** Confirm button icon */
  confirmIcon?: string
  /** Button size */
  buttonSize?: DaisyButtonSize
  /** Loading state */
  loading?: boolean
  /** Loading text */
  loadingText?: string
  /** Close button aria label */
  closeLabel?: string
  /** Prevent body scroll when modal is open */
  preventScroll?: boolean
  /** Custom CSS classes */
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  position: 'center',
  glass: true,
  closeOnOverlay: true,
  closeOnEscape: true,
  closable: true,
  showDefaultFooter: false,
  showCancel: true,
  showConfirm: true,
  cancelLabel: 'Cancel',
  confirmLabel: 'Confirm',
  confirmVariant: 'primary',
  buttonSize: 'md',
  loadingText: 'Loading...',
  closeLabel: 'Close modal',
  preventScroll: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
  'cancel': []
  'confirm': []
  'overlay-click': []
}>()

// Refs
const modalContent = ref<HTMLElement>()

// Computed properties
const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

// Generate unique IDs for accessibility
const titleId = computed(() => `modal-title-${Math.random().toString(36).substr(2, 9)}`)
const descriptionId = computed(() => `modal-desc-${Math.random().toString(36).substr(2, 9)}`)

// Get DaisyUI utilities with #799EFF integration
const { mergeClasses, createClasses, config, getPrimaryColorVariants, getGlassColorVariants } = useDaisyUI({
  enableGlassEffects: props.glass,
  enableAnimations: true,
  enablePrimaryColors: true,
  glassIntensity: 'strong'
})

// Modal classes
const computedClasses = computed(() => {
  const baseClasses = 'modal-content'
  
  // Size classes
  const sizeClasses = createClasses('', {
    'modal-xs': props.size === 'xs',
    'modal-sm': props.size === 'sm',
    'modal-md': props.size === 'md',
    'modal-lg': props.size === 'lg',
    'modal-xl': props.size === 'xl',
    'modal-full': props.size === 'full'
  })
  
  // Position classes
  const positionClasses = createClasses('', {
    'modal-center': props.position === 'center',
    'modal-top': props.position === 'top',
    'modal-bottom': props.position === 'bottom'
  })
  
  // Enhanced glass effect classes with #799EFF primary integration
  const glassClasses = props.glass && config.enableGlassEffects
    ? createClasses('', {
        'backdrop-blur-glass-lg': true,
        'bg-glass-bg-primary-strong': true,
        'border-glass-border-primary-strong': true,
        'shadow-primary-xl': true,
        'ring-1': true,
        'ring-primary-200': true
      })
    : 'bg-base-100 shadow-2xl'
  
  const allClasses = `${baseClasses} ${sizeClasses} ${positionClasses} ${glassClasses}`.trim()
  return props.customClass ? `${allClasses} ${props.customClass}` : allClasses
})

// Methods
const close = () => {
  isOpen.value = false
  emit('close')
}

const cancel = () => {
  emit('cancel')
  close()
}

const confirm = () => {
  emit('confirm')
}

const handleOverlayClick = (event: MouseEvent) => {
  emit('overlay-click')
  if (props.closeOnOverlay && !props.loading) {
    close()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEscape && !props.loading) {
    close()
  }
}

// Focus management
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

const trapFocus = (event: KeyboardEvent) => {
  if (event.key !== 'Tab' || !modalContent.value) return
  
  const focusables = modalContent.value.querySelectorAll(focusableElements)
  const firstFocusable = focusables[0] as HTMLElement
  const lastFocusable = focusables[focusables.length - 1] as HTMLElement
  
  if (event.shiftKey && document.activeElement === firstFocusable) {
    event.preventDefault()
    lastFocusable?.focus()
  } else if (!event.shiftKey && document.activeElement === lastFocusable) {
    event.preventDefault()
    firstFocusable?.focus()
  }
}

// Lifecycle management
const previouslyFocusedElement = ref<HTMLElement>()

const setupModal = () => {
  if (!isOpen.value) return
  
  // Store previously focused element
  previouslyFocusedElement.value = document.activeElement as HTMLElement
  
  // Prevent body scroll
  if (props.preventScroll) {
    document.body.style.overflow = 'hidden'
  }
  
  // Focus first focusable element
  nextTick(() => {
    const firstFocusable = modalContent.value?.querySelector(focusableElements) as HTMLElement
    firstFocusable?.focus()
  })
  
  // Add event listeners
  document.addEventListener('keydown', trapFocus)
}

const cleanupModal = () => {
  // Restore body scroll
  if (props.preventScroll) {
    document.body.style.overflow = ''
  }
  
  // Restore focus
  if (previouslyFocusedElement.value) {
    previouslyFocusedElement.value.focus()
  }
  
  // Remove event listeners
  document.removeEventListener('keydown', trapFocus)
}

// Watch for modal open/close
watch(isOpen, (newValue) => {
  if (newValue) {
    setupModal()
  } else {
    cleanupModal()
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (isOpen.value) {
    cleanupModal()
  }
})
</script>

<style scoped>
/* Enhanced modal overlay with primary color theming */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 41, 102, 0.4); /* Use primary-900 with opacity */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  overflow-y: auto;
  background-image: radial-gradient(circle at 50% 50%, rgba(121, 158, 255, 0.1) 0%, transparent 70%);
}

/* Enhanced modal content with #799EFF styling */
.modal-content {
  position: relative;
  width: 100%;
  max-height: calc(100vh - 2rem);
  overflow: hidden;
  border-radius: var(--radius-glass-lg);
  border: 1px solid var(--glass-border-primary-strong);
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 64px rgba(121, 158, 255, 0.3);
}

/* Enhanced glass effect with primary color integration */
.modal-content.backdrop-blur-glass-lg {
  -webkit-backdrop-filter: var(--blur-lg);
  backdrop-filter: var(--blur-lg);
  background: var(--glass-bg-primary-strong);
}

.modal-content.bg-glass-bg-primary-strong::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(121, 158, 255, 0.6), transparent);
  opacity: 0.8;
  z-index: 1;
}

/* Size variants */
.modal-xs { max-width: 20rem; }
.modal-sm { max-width: 24rem; }
.modal-md { max-width: 32rem; }
.modal-lg { max-width: 48rem; }
.modal-xl { max-width: 64rem; }
.modal-full { 
  max-width: none; 
  width: calc(100vw - 2rem);
  height: calc(100vh - 2rem);
  max-height: none;
}

/* Position variants */
.modal-center { 
  margin: auto;
}
.modal-top { 
  margin-top: 2rem;
  margin-bottom: auto;
}
.modal-bottom { 
  margin-top: auto;
  margin-bottom: 2rem;
}

/* Enhanced modal sections with primary theming */
.modal-header {
  padding: 1.5rem 1.5rem 0 1.5rem;
  border-bottom: 1px solid var(--glass-border-primary-light);
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  background: linear-gradient(180deg, rgba(121, 158, 255, 0.03) 0%, transparent 100%);
}

.modal-body {
  padding: 0 1.5rem;
  flex: 1;
  overflow-y: auto;
  max-height: calc(70vh - 8rem);
}

.modal-footer {
  padding: 1.5rem 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid var(--glass-border-primary-light);
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  background: linear-gradient(180deg, transparent 0%, rgba(121, 158, 255, 0.03) 100%);
}

/* Enhanced modal title and subtitle with primary colors */
.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-800);
  margin: 0;
  line-height: 1.3;
  text-shadow: 0 1px 2px rgba(121, 158, 255, 0.1);
}

.modal-subtitle {
  font-size: 0.875rem;
  color: var(--primary-600);
  margin: 0.25rem 0 0 0;
  line-height: 1.4;
  opacity: 0.9;
}

/* Enhanced close button with primary styling */
.modal-close-btn {
  background: var(--glass-bg-primary-light);
  backdrop-filter: var(--blur-sm);
  -webkit-backdrop-filter: var(--blur-sm);
  border: 1px solid var(--glass-border-primary-light);
  border-radius: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 8px rgba(121, 158, 255, 0.1);
}

.modal-close-btn:hover {
  background: var(--glass-bg-primary-medium);
  color: var(--primary-700);
  border-color: var(--primary-400);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(121, 158, 255, 0.2);
}

.modal-close-btn:focus {
  outline: 2px solid var(--primary-400);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(121, 158, 255, 0.2);
}

/* Enhanced loading overlay with primary theming */
.modal-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(121, 158, 255, 0.1);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: inherit;
}

.loading-spinner {
  text-align: center;
  color: var(--primary-700);
}

.spinner-glass {
  border: 3px solid var(--glass-border-primary-light);
  border-top: 3px solid var(--primary-500);
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  animation: spin 1s linear infinite;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(121, 158, 255, 0.2);
}

/* Animations */
.modal-enter-active, .modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(-20px);
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .modal-content {
    max-height: calc(100vh - 1rem);
  }
  
  .modal-xs,
  .modal-sm,
  .modal-md {
    max-width: none;
    width: 100%;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .modal-footer .flex {
    flex-direction: column;
  }
  
  .modal-footer .daisy-btn {
    width: 100%;
    justify-content: center;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .modal-overlay {
    background: rgba(0, 0, 0, 0.8);
  }
  
  .modal-content {
    border-width: 2px;
  }
  
  .modal-close-btn {
    border-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active,
  .modal-enter-active .modal-content,
  .modal-leave-active .modal-content {
    transition: opacity 0.2s ease-in-out;
  }
  
  .modal-enter-from .modal-content,
  .modal-leave-to .modal-content {
    transform: none;
  }
  
  .modal-close-btn:hover {
    transform: none;
  }
  
  .spinner-glass {
    animation: none;
    border-top-color: var(--text-glass);
  }
}

/* Print styles */
@media print {
  .modal-overlay {
    display: none;
  }
}

/* Focus management */
.modal-content:focus {
  outline: none;
}

/* Better scrollbar styling for modal body */
.modal-body::-webkit-scrollbar {
  width: 4px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background: var(--glass-border-primary-light);
  border-radius: 2px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: var(--primary-400);
}
</style>