<template>
  <article 
    :class="computedClasses"
    :role="role"
    :aria-labelledby="title ? titleId : undefined"
    :aria-describedby="description ? descriptionId : undefined"
    :tabindex="interactive ? 0 : undefined"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <figure 
      v-if="image || $slots.image" 
      class="px-6 pt-6"
      :aria-hidden="!imageAlt"
    >
      <slot name="image">
        <img 
          v-if="image" 
          :src="image" 
          :alt="imageAlt || ''" 
          class="rounded-xl object-cover w-full h-48"
          loading="lazy"
          :class="{ 'aspect-video': !imageAlt }"
        />
      </slot>
    </figure>
    
    <div class="daisy-card-body">
      <h2 
        v-if="title" 
        :id="titleId"
        class="daisy-card-title text-primary-800"
        :class="titleClasses"
      >
        {{ title }}
        <div 
          v-if="badge" 
          class="daisy-badge daisy-badge-primary glass-badge-primary"
          :aria-label="`Badge: ${badge}`"
        >
          {{ badge }}
        </div>
      </h2>
      
      <slot name="content">
        <p 
          v-if="description" 
          :id="descriptionId"
          class="text-primary-600 leading-relaxed"
        >
          {{ description }}
        </p>
      </slot>
      
      <slot />
      
      <div 
        v-if="$slots.actions || actions?.length" 
        class="daisy-card-actions justify-end"
        role="group"
        :aria-label="actionsLabel"
      >
        <slot name="actions">
          <template v-for="(action, index) in actions" :key="action.label || index">
            <DaisyButton 
              :variant="action.variant || 'primary'"
              :size="action.size || 'sm'"
              :glass="glass"
              :disabled="action.disabled"
              :loading="action.loading"
              :aria-label="action.ariaLabel"
              @click="action.onClick"
            >
              {{ action.label }}
            </DaisyButton>
          </template>
        </slot>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
// Import DaisyButton component and types
import DaisyButton, { type DaisyButtonVariant, type DaisyButtonSize } from './DaisyButton.vue'

// Enhanced type definitions for better developer experience
export type DaisyCardVariant = 'default' | 'compact' | 'side' | 'image-full'
export type DaisyCardSize = 'sm' | 'md' | 'lg'

export interface CardAction {
  label: string
  onClick: () => void | Promise<void>
  variant?: DaisyButtonVariant
  size?: DaisyButtonSize
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
}

interface Props {
  /** Card title */
  title?: string
  /** Card description */
  description?: string
  /** Image source URL */
  image?: string
  /** Image alt text for accessibility */
  imageAlt?: string
  /** Badge text to display */
  badge?: string
  /** Array of action buttons to display */
  actions?: CardAction[]
  /** Card variant/layout */
  variant?: DaisyCardVariant
  /** Card size */
  size?: DaisyCardSize
  /** Enable glassmorphism effects */
  glass?: boolean
  /** Show border around card */
  bordered?: boolean
  /** Show shadow effect */
  shadow?: boolean
  /** Enable interactive states (hover, focus) */
  interactive?: boolean
  /** Custom CSS classes */
  customClass?: string
  /** ARIA role for the card */
  role?: string
  /** Accessible label for card actions */
  actionsLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  glass: true,
  bordered: true,
  shadow: true,
  interactive: false,
  role: 'article',
  actionsLabel: 'Card actions'
})

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent]
}>()

// Generate unique IDs for accessibility
const titleId = computed(() => props.title ? `card-title-${Math.random().toString(36).substr(2, 9)}` : '')
const descriptionId = computed(() => props.description ? `card-desc-${Math.random().toString(36).substr(2, 9)}` : '')

// Get DaisyUI utilities with #799EFF integration
const { mergeClasses, createClasses, config, getPrimaryColorVariants, getGlassColorVariants } = useDaisyUI({
  enableGlassEffects: props.glass,
  enableAnimations: true,
  enablePrimaryColors: true,
  glassIntensity: 'medium'
})

// Enhanced computed classes with better performance
const computedClasses = computed(() => {
  const baseDaisyClasses = 'daisy-card w-full'
  
  // Build DaisyUI variant classes
  const variantClasses = createClasses('', {
    'daisy-card-compact': props.variant === 'compact',
    'daisy-card-side': props.variant === 'side',
    'image-full': props.variant === 'image-full'
  })
  
  // Build modifier classes
  const modifierClasses = createClasses('', {
    'daisy-card-bordered': props.bordered,
    'daisy-shadow-xl': props.shadow && !props.glass,
    'cursor-pointer': props.interactive,
    'transition-all': config.enableAnimations,
    'duration-200': config.enableAnimations,
    'hover:scale-[1.02]': props.interactive && config.enableAnimations,
    'focus:scale-[1.02]': props.interactive && config.enableAnimations,
    'focus:outline-none': props.interactive,
    'focus-visible:ring-2': props.interactive,
    'focus-visible:ring-glass-border': props.interactive && props.glass
  })
  
  // Enhanced glass styling with #799EFF primary color integration
  const glassClasses = props.glass && config.enableGlassEffects
    ? createClasses('', {
        'backdrop-blur-glass-md': true,
        'bg-glass-bg-primary': true,
        'border-glass-border-primary': true,
        'shadow-primary': true,
        'hover:shadow-primary-lg': props.interactive,
        'hover:bg-glass-bg-primary-medium': props.interactive,
        'hover:border-primary-400': props.interactive,
        'hover:transform': props.interactive && config.enableAnimations,
        'hover:-translate-y-1': props.interactive && config.enableAnimations,
        'focus:shadow-primary-lg': props.interactive,
        'focus:bg-glass-bg-primary-medium': props.interactive,
        'focus:border-primary-400': props.interactive,
        'focus:ring-2': props.interactive,
        'focus:ring-primary-300': props.interactive,
        'focus:ring-offset-2': props.interactive
      })
    : ''
  
  const daisyClasses = `${baseDaisyClasses} ${variantClasses} ${modifierClasses}`.trim()
  const allClasses = mergeClasses(daisyClasses, glassClasses, 'glass')
  
  return props.customClass ? `${allClasses} ${props.customClass}` : allClasses
})

// Title classes based on size
const titleClasses = computed(() => {
  const sizeMap: Record<DaisyCardSize, string> = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }
  return sizeMap[props.size] || sizeMap.md
})

// Event handlers with better accessibility
const handleClick = (event: MouseEvent) => {
  if (!props.interactive) return
  emit('click', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.interactive) return
  
  // Handle Enter and Space keys for accessibility
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('click', event)
  }
}

// Provide better error handling for actions
const validateActions = () => {
  if (!props.actions) return
  
  props.actions.forEach((action, index) => {
    if (!action.label) {
      console.warn(`[DaisyCard] Action at index ${index} is missing a label`)
    }
    if (typeof action.onClick !== 'function') {
      console.warn(`[DaisyCard] Action "${action.label}" has invalid onClick handler`)
    }
  })
}

// Validate actions on mount and when actions change
onMounted(validateActions)
watch(() => props.actions, validateActions, { deep: true })
</script>

<style scoped>
/* Enhanced glass effect styling with #799EFF primary integration */
.daisy-card.backdrop-blur-glass-md {
  -webkit-backdrop-filter: var(--blur-md);
  backdrop-filter: var(--blur-md);
  position: relative;
  overflow: hidden;
}

/* Primary glass card highlight effect */
.daisy-card.bg-glass-bg-primary::before {
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

/* Enhanced primary card styling */
.daisy-card.bg-glass-bg-primary {
  background: var(--glass-bg-primary) !important;
  border-color: var(--glass-border-primary) !important;
  box-shadow: 0 4px 20px rgba(121, 158, 255, 0.15);
}

/* Enhanced primary glass badge styling */
.glass-badge-primary {
  backdrop-filter: var(--blur-sm);
  -webkit-backdrop-filter: var(--blur-sm);
  background: var(--glass-bg-primary-light);
  border: 1px solid var(--glass-border-primary-light);
  color: var(--primary-700);
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
}

.glass-badge-primary:hover {
  background: var(--primary-100);
  border-color: var(--primary-300);
  color: var(--primary-800);
}

/* Primary-themed card title styling */
.daisy-card .daisy-card-title.text-primary-800 {
  color: var(--primary-800);
  font-weight: 600;
  line-height: 1.3;
  text-shadow: 0 1px 2px rgba(121, 158, 255, 0.1);
}

/* Primary-themed card body text */
.daisy-card .text-primary-600 {
  color: var(--primary-600);
  line-height: 1.6;
}

/* Enhanced interactive states with primary color theming */
.daisy-card.cursor-pointer:hover {
  background: var(--glass-bg-primary-medium) !important;
  border-color: var(--primary-400) !important;
  box-shadow: 0 8px 32px rgba(121, 158, 255, 0.25) !important;
  transform: translateY(-4px);
}

.daisy-card.cursor-pointer:active {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(121, 158, 255, 0.2) !important;
}

/* Enhanced focus styles with primary color theming */
.daisy-card:focus-visible {
  outline: 2px solid var(--primary-400);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(121, 158, 255, 0.2);
}

.daisy-card.bg-glass-bg-primary:focus-visible {
  background: var(--glass-bg-primary-medium) !important;
  border-color: var(--primary-400) !important;
}

/* Image optimization */
.daisy-card img {
  transition: transform 0.2s ease-in-out;
}

.daisy-card:hover img {
  transform: scale(1.05);
}

/* Card actions spacing */
.daisy-card-actions {
  gap: 0.5rem;
  margin-top: 1rem;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .daisy-card-actions {
    flex-direction: column;
  }
  
  .daisy-card-actions .daisy-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Animation performance optimization */
.daisy-card.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, box-shadow;
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  .daisy-card.transition-all {
    transition: none;
  }
  
  .daisy-card:hover {
    transform: none;
  }
}
</style>