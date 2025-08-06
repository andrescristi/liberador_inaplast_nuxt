<template>
  <div class="relative">
    <component
      :is="tag"
      v-bind="inputAttrs"
      :value="modelValue"
      :class="inputClasses"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    
    <!-- Leading icon -->
    <div v-if="leadingIcon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <component :is="leadingIcon" class="h-5 w-5 text-gray-400" />
    </div>
    
    <!-- Trailing icon or button -->
    <div v-if="trailingIcon || $slots.trailing" class="absolute inset-y-0 right-0 pr-3 flex items-center">
      <slot name="trailing">
        <component
:is="trailingIcon"
v-if="trailingIcon"
class="h-5 w-5 text-gray-400" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  size?: 'sm' | 'md' | 'lg'
  leadingIcon?: object | Function
  trailingIcon?: object | Function
  rows?: number
  min?: string | number
  max?: string | number
  step?: string | number
  mobileOptimized?: boolean // New prop for mobile-specific styling
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  error: false,
  size: 'md',
  leadingIcon: undefined,
  trailingIcon: undefined,
  rows: undefined,
  min: undefined,
  max: undefined,
  step: undefined,
  mobileOptimized: false
})

// Reactive state
const isFocused = ref(false)
const showSuccessAnimation = ref(false)
const inputElement = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const tag = computed(() => {
  return props.type === 'textarea' ? 'textarea' : 'input'
})

const inputAttrs = computed(() => {
  const attrs: Record<string, string | number | undefined> = {}
  
  if (props.type !== 'textarea') {
    attrs.type = props.type
  }
  
  if (props.type === 'textarea' && props.rows) {
    attrs.rows = props.rows
  }
  
  if (props.min !== undefined) {
    attrs.min = props.min
  }
  
  if (props.max !== undefined) {
    attrs.max = props.max
  }
  
  if (props.step !== undefined) {
    attrs.step = props.step
  }
  
  return attrs
})

const inputClasses = computed(() => {
  const base = 'block w-full border-gray-300 rounded-md shadow-sm focus:ring-transparent focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300 touch-manipulation relative z-10 bg-white'
  
  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-3 py-2.5 text-sm min-h-[44px]', // Mobile-friendly 44px touch target
    lg: 'px-4 py-3 text-base min-h-[48px]'
  }
  
  const classes = [base, sizes[props.size]]
  
  if (props.error) {
    classes.push('border-red-300 text-red-900 placeholder-red-300')
  } else if (isFocused.value) {
    classes.push('border-indigo-300 text-gray-900')
  } else {
    classes.push('border-gray-300 text-gray-900')
  }
  
  if (props.leadingIcon) {
    classes.push('pl-10')
  }
  
  if (props.trailingIcon) {
    classes.push('pr-10')
  }
  
  return classes.join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  
  // Show success animation briefly when user types
  if (target.value && !props.error) {
    showSuccessAnimation.value = true
    setTimeout(() => {
      showSuccessAnimation.value = false
    }, 1500)
  } else {
    showSuccessAnimation.value = false
  }
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  
  // Add a subtle scale animation to the input
  if (inputElement.value) {
    inputElement.value.style.transform = 'scale(1.02)'
    setTimeout(() => {
      if (inputElement.value) {
        inputElement.value.style.transform = 'scale(1)'
      }
    }, 200)
  }
  
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

// Add mobile keyboard optimizations
watch(() => props.type, (newType) => {
  if (import.meta.client && inputElement.value) {
    // Set appropriate input modes for mobile keyboards
    const inputModes: Record<string, string> = {
      email: 'email',
      tel: 'tel',
      number: 'numeric',
      url: 'url',
      search: 'search'
    }
    
    if (inputModes[newType]) {
      inputElement.value.setAttribute('inputmode', inputModes[newType])
    }
  }
})
</script>

<style scoped>
/* Focus Ring Animation */
.input-container {
  position: relative;
}

.focus-ring {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 0.5rem;
  background: linear-gradient(45deg, #6366f1, #8b5cf6, #06b6d4, #10b981);
  background-size: 400% 400%;
  animation: gradient-shift 3s ease infinite, pulse-ring 2s ease-in-out infinite;
  z-index: 0;
  opacity: 0.6;
}

.focus-ring-error {
  background: linear-gradient(45deg, #ef4444, #f97316, #eab308);
  background-size: 400% 400%;
}

.focus-ring-success {
  background: linear-gradient(45deg, #10b981, #06b6d4, #8b5cf6);
  background-size: 400% 400%;
}

@keyframes gradient-shift {
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

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.02);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
}

/* Mobile touch optimizations */
@media (hover: none) {
  .focus-ring {
    animation-duration: 2s;
  }
}

/* Accessibility: Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .focus-ring {
    animation: none;
    opacity: 0.3;
  }
  
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
</style>