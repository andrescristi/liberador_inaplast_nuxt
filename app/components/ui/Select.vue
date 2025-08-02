<template>
  <div class="space-y-2">
    <label v-if="label" :for="selectId" class="form-label" :class="{ required }">
      {{ label }}
    </label>
    
    <div class="relative">
      <select
        :id="selectId"
        v-model="selectedValue"
        :disabled="disabled"
        :class="selectClasses"
        @change="handleChange"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      
      <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <Icon name="lucide:chevron-down" class="w-4 h-4 text-slate-400" />
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
interface Option {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue?: string | number
  options: Option[]
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [event: Event]
}>()

const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)

const selectedValue = computed({
  get: () => props.modelValue || '',
  set: (value) => emit('update:modelValue', value)
})

const selectClasses = computed(() => {
  const baseClasses = 'w-full px-4 py-3 pr-10 border-2 border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed appearance-none'
  const errorClasses = props.error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
  
  return [baseClasses, errorClasses].filter(Boolean).join(' ')
})

const handleChange = (event: Event) => {
  emit('change', event)
}
</script>