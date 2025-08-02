<template>
  <div class="space-y-2">
    <label v-if="label" :for="inputId" class="form-label" :class="{ required }">
      {{ label }}
    </label>
    
    <div class="relative">
      <input
        :id="inputId"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="inputClasses"
        v-bind="$attrs"
        @blur="handleBlur"
        @input="handleInput"
      >
      
      <div v-if="icon" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
        <Icon :name="icon" class="w-4 h-4" />
      </div>
      
      <div v-if="loading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <Icon name="lucide:loader-2" class="w-4 h-4 animate-spin text-slate-400" />
      </div>
    </div>
    
    <div v-if="error" class="error-message">
      <Icon name="lucide:alert-circle" class="w-4 h-4" />
      {{ error }}
    </div>
    
    <div v-else-if="hint" class="text-sm text-slate-500">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
  hint?: string
  icon?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  input: [event: Event]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const inputValue = computed({
  get: () => props.modelValue || '',
  set: (value) => {
    const parsedValue = props.type === 'number' ? Number(value) : value
    emit('update:modelValue', parsedValue)
  }
})

const inputClasses = computed(() => {
  const baseClasses = 'form-input'
  const iconPadding = props.icon ? 'pl-10' : ''
  const loadingPadding = props.loading ? 'pr-10' : ''
  const errorClasses = props.error ? 'input-error' : ''
  
  return [baseClasses, iconPadding, loadingPadding, errorClasses].filter(Boolean).join(' ')
})

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleInput = (event: Event) => {
  emit('input', event)
}
</script>