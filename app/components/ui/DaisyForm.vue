<template>
  <div :class="computedClasses">
    <form 
      @submit="handleSubmit"
      @reset="handleReset"
      :novalidate="novalidate"
      :autocomplete="autocomplete"
      :class="formClasses"
    >
      <!-- Form Header -->
      <div v-if="title || description || $slots.header" class="form-header mb-6">
        <slot name="header">
          <div v-if="title" class="glass-icon-container w-12 h-12 mb-4">
            <Icon :name="icon || 'lucide:form-input'" class="w-6 h-6 text-primary-600" />
          </div>
          <h2 v-if="title" class="text-2xl font-bold text-primary-800 mb-2">{{ title }}</h2>
          <p v-if="description" class="text-primary-600">{{ description }}</p>
        </slot>
      </div>

      <!-- Form Content -->
      <div class="form-content space-y-6">
        <slot name="form-content">
          <slot />
        </slot>
      </div>

      <!-- Form Actions -->
      <div v-if="$slots['form-actions'] || showDefaultActions" class="form-actions mt-8 pt-6 border-t border-primary-200">
        <slot name="form-actions">
          <div class="flex flex-col sm:flex-row gap-4 justify-end">
            <DaisyButton 
              v-if="showReset"
              type="reset" 
              variant="ghost" 
              :disabled="loading"
              @click="handleResetClick"
            >
              {{ resetLabel }}
            </DaisyButton>
            <DaisyButton 
              type="submit" 
              :variant="submitVariant"
              :loading="loading"
              :disabled="disabled"
              :icon="submitIcon"
            >
              {{ submitLabel }}
            </DaisyButton>
          </div>
        </slot>
      </div>

      <!-- Form Validation Summary -->
      <div v-if="showValidationSummary && validationErrors.length > 0" class="validation-summary mt-4">
        <div class="daisy-alert daisy-alert-error backdrop-blur-glass-md bg-error-100 border border-error-300">
          <Icon name="lucide:alert-triangle" class="w-5 h-5 text-error-600" />
          <div>
            <h3 class="font-semibold text-error-800 mb-2">Please fix the following errors:</h3>
            <ul class="list-disc list-inside space-y-1 text-sm">
              <li v-for="error in validationErrors" :key="error" class="text-error-700">
                {{ error }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
// Import DaisyButton types
import type { DaisyButtonVariant } from './DaisyButton.vue'

export type DaisyFormLayout = 'vertical' | 'horizontal' | 'inline'
export type DaisyFormSize = 'sm' | 'md' | 'lg'

interface Props {
  /** Form title */
  title?: string
  /** Form description */
  description?: string
  /** Icon for form header */
  icon?: string
  /** Form layout style */
  layout?: DaisyFormLayout
  /** Form size */
  size?: DaisyFormSize
  /** Enable glassmorphism effects */
  glass?: boolean
  /** Show form validation summary */
  showValidationSummary?: boolean
  /** Show default form actions */
  showDefaultActions?: boolean
  /** Show reset button */
  showReset?: boolean
  /** Submit button label */
  submitLabel?: string
  /** Reset button label */
  resetLabel?: string
  /** Submit button variant */
  submitVariant?: DaisyButtonVariant
  /** Submit button icon */
  submitIcon?: string
  /** Form is in loading state */
  loading?: boolean
  /** Form is disabled */
  disabled?: boolean
  /** Disable HTML5 validation */
  novalidate?: boolean
  /** Autocomplete behavior */
  autocomplete?: 'on' | 'off'
  /** Array of validation errors to display */
  validationErrors?: string[]
  /** Custom CSS classes */
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'vertical',
  size: 'md',
  glass: true,
  showValidationSummary: true,
  showDefaultActions: false,
  showReset: false,
  submitLabel: 'Submit',
  resetLabel: 'Reset',
  submitVariant: 'primary',
  submitIcon: 'lucide:send',
  loading: false,
  disabled: false,
  novalidate: true,
  autocomplete: 'on',
  validationErrors: () => []
})

const emit = defineEmits<{
  submit: [event: Event, data?: any]
  reset: [event: Event]
  'reset-click': [event: Event]
}>()

// Get DaisyUI utilities with #799EFF integration
const { mergeClasses, createClasses, config, getPrimaryColorVariants, getGlassColorVariants } = useDaisyUI({
  enableGlassEffects: props.glass,
  enableAnimations: true,
  enablePrimaryColors: true,
  glassIntensity: 'medium'
})

// Form container classes
const computedClasses = computed(() => {
  const baseClasses = 'daisy-form-container'
  
  const glassClasses = props.glass && config.enableGlassEffects
    ? createClasses('', {
        'glass-card': true,
        'p-8': true,
        'backdrop-blur-glass-md': true,
        'bg-glass-bg-primary': true,
        'border-glass-border-primary': true,
        'shadow-primary': true,
        'rounded-glass-lg': true
      })
    : 'bg-base-100 shadow-lg rounded-lg p-8'
  
  const sizeClasses = createClasses('', {
    'max-w-md': props.size === 'sm',
    'max-w-2xl': props.size === 'md',
    'max-w-4xl': props.size === 'lg'
  })
  
  const layoutClasses = createClasses('', {
    'w-full': props.layout === 'vertical',
    'flex flex-wrap': props.layout === 'horizontal',
    'flex flex-row items-end gap-4': props.layout === 'inline'
  })
  
  const allClasses = `${baseClasses} ${glassClasses} ${sizeClasses} ${layoutClasses}`.trim()
  return props.customClass ? `${allClasses} ${props.customClass}` : allClasses
})

// Form element classes
const formClasses = computed(() => {
  return createClasses('w-full', {
    'space-y-6': props.layout === 'vertical',
    'grid grid-cols-1 md:grid-cols-2 gap-6': props.layout === 'horizontal',
    'flex flex-wrap gap-4 items-end': props.layout === 'inline'
  })
})

// Event handlers
const handleSubmit = (event: Event) => {
  event.preventDefault()
  
  if (props.loading || props.disabled) {
    return
  }
  
  // Collect form data
  const formData = new FormData(event.target as HTMLFormElement)
  const data = Object.fromEntries(formData.entries())
  
  emit('submit', event, data)
}

const handleReset = (event: Event) => {
  emit('reset', event)
}

const handleResetClick = (event: Event) => {
  emit('reset-click', event)
}

// Form validation helpers
const validateForm = () => {
  // This could be expanded to integrate with form validation libraries
  const form = document.querySelector('form')
  if (!form) return true
  
  return form.checkValidity()
}

// Expose validation method
defineExpose({
  validateForm
})
</script>

<style scoped>
/* Enhanced form styling with glassmorphism */
.daisy-form-container {
  position: relative;
  width: 100%;
  margin: 0 auto;
}

/* Enhanced glass form with #799EFF primary styling */
.daisy-form-container.glass-card {
  border: 1px solid var(--glass-border-primary);
  backdrop-filter: var(--blur-md);
  -webkit-backdrop-filter: var(--blur-md);
  background: var(--glass-bg-primary) !important;
  box-shadow: 0 8px 32px rgba(121, 158, 255, 0.15);
}

.daisy-form-container.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(121, 158, 255, 0.4), transparent);
  opacity: 0.8;
  z-index: 1;
}

/* Form header styling */
.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  color: var(--primary-800);
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-shadow: 0 1px 2px rgba(121, 158, 255, 0.1);
}

.form-header p {
  color: var(--primary-600);
  max-width: 32rem;
  margin: 0 auto;
  line-height: 1.6;
}

/* Form content styling */
.form-content {
  width: 100%;
}

/* Enhanced form actions with primary theming */
.form-actions {
  border-top: 1px solid var(--primary-200);
  padding-top: 1.5rem;
  margin-top: 2rem;
  background: linear-gradient(180deg, transparent 0%, rgba(121, 158, 255, 0.02) 100%);
}

/* Validation summary styling */
.validation-summary {
  animation: slideInUp 0.3s ease-out;
}

.validation-summary .daisy-alert {
  border-radius: var(--radius-glass);
  backdrop-filter: var(--blur-md);
  -webkit-backdrop-filter: var(--blur-md);
}

.validation-summary ul {
  margin-left: 1rem;
}

/* Layout-specific styling */
.daisy-form-container[class*="horizontal"] .form-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.daisy-form-container[class*="inline"] .form-content {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: end;
}

.daisy-form-container[class*="inline"] .form-actions {
  border-top: none;
  padding-top: 0;
  margin-top: 0;
  margin-left: auto;
}

/* Enhanced form inputs with primary color theming */
.form-content :deep(.form-input-glass),
.form-content :deep(.daisy-input),
.form-content :deep(.daisy-select),
.form-content :deep(.daisy-textarea) {
  background: var(--glass-bg-primary-light);
  backdrop-filter: var(--blur-sm);
  -webkit-backdrop-filter: var(--blur-sm);
  border: 1px solid var(--glass-border-primary-light);
  color: var(--primary-800);
  border-radius: var(--radius-glass);
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 8px rgba(121, 158, 255, 0.05);
}

.form-content :deep(.form-input-glass:focus),
.form-content :deep(.daisy-input:focus),
.form-content :deep(.daisy-select:focus),
.form-content :deep(.daisy-textarea:focus) {
  background: var(--glass-bg-primary-medium);
  border-color: var(--primary-400);
  outline: none;
  box-shadow: 0 0 0 3px rgba(121, 158, 255, 0.2), 0 4px 12px rgba(121, 158, 255, 0.15);
  transform: translateY(-1px);
}

.form-content :deep(.form-input-glass::placeholder),
.form-content :deep(.daisy-input::placeholder),
.form-content :deep(.daisy-textarea::placeholder) {
  color: var(--primary-400);
  font-style: italic;
}

/* Enhanced form label styling with primary colors */
.form-content :deep(.form-label),
.form-content :deep(.daisy-label) {
  color: var(--primary-700);
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-content :deep(.form-label.required::after) {
  content: " *";
  color: var(--error-500);
  font-weight: 700;
}

/* Enhanced checkbox and radio styling with primary colors */
.form-content :deep(.daisy-checkbox),
.form-content :deep(.daisy-radio) {
  accent-color: var(--primary-500);
  transform: scale(1.1);
  transition: all 0.2s ease;
}

.form-content :deep(.daisy-checkbox:checked),
.form-content :deep(.daisy-radio:checked) {
  box-shadow: 0 0 0 2px rgba(121, 158, 255, 0.3);
}

/* Form group styling */
.form-content :deep(.form-group) {
  margin-bottom: 1.5rem;
}

.form-content :deep(.form-group:last-child) {
  margin-bottom: 0;
}

/* Enhanced error state styling */
.form-content :deep(.form-input-glass.error),
.form-content :deep(.daisy-input.error) {
  border-color: var(--error-400);
  background: var(--error-50);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.form-content :deep(.form-error) {
  color: var(--error-600);
  font-size: 0.75rem;
  margin-top: 0.25rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.form-content :deep(.form-error::before) {
  content: '⚠';
  font-size: 0.875rem;
}

/* Enhanced success state styling */
.form-content :deep(.form-input-glass.success),
.form-content :deep(.daisy-input.success) {
  border-color: var(--success-400);
  background: var(--success-50);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-content :deep(.form-success) {
  color: var(--success-600);
  font-size: 0.75rem;
  margin-top: 0.25rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.form-content :deep(.form-success::before) {
  content: '✓';
  font-size: 0.875rem;
  color: var(--success-500);
}

/* Loading state */
.daisy-form-container.loading {
  opacity: 0.7;
  pointer-events: none;
}

.daisy-form-container.loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 25%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s ease-in-out infinite;
  z-index: 1;
  border-radius: inherit;
}

/* Animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .daisy-form-container {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .daisy-btn {
    width: 100%;
    justify-content: center;
  }
  
  .daisy-form-container[class*="horizontal"] .form-content {
    grid-template-columns: 1fr;
  }
  
  .daisy-form-container[class*="inline"] {
    display: block;
  }
  
  .daisy-form-container[class*="inline"] .form-content {
    display: block;
  }
  
  .daisy-form-container[class*="inline"] .form-actions {
    margin-left: 0;
    margin-top: 1.5rem;
    border-top: 1px solid var(--glass-border-light);
    padding-top: 1.5rem;
  }
}

/* Accessibility enhancements */
@media (prefers-reduced-motion: reduce) {
  .validation-summary {
    animation: none;
  }
  
  .daisy-form-container.loading::before {
    animation: none;
  }
  
  .form-content :deep(*) {
    transition: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .form-content :deep(.form-input-glass),
  .form-content :deep(.daisy-input),
  .form-content :deep(.daisy-select),
  .form-content :deep(.daisy-textarea) {
    border-width: 2px;
  }
  
  .form-content :deep(.form-label),
  .form-content :deep(.daisy-label) {
    font-weight: 600;
  }
}
</style>