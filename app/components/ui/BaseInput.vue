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
        <component v-if="trailingIcon" :is="trailingIcon" class="h-5 w-5 text-gray-400" />
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
  leadingIcon?: any
  trailingIcon?: any
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const tag = computed(() => {
  return props.type === 'textarea' ? 'textarea' : 'input'
})

const inputAttrs = computed(() => {
  const attrs: any = {}
  
  if (props.type !== 'textarea') {
    attrs.type = props.type
  }
  
  if (props.type === 'textarea' && props.rows) {
    attrs.rows = props.rows
  }
  
  return attrs
})

const inputClasses = computed(() => {
  const base = 'block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500'
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }
  
  const classes = [base, sizes[props.size]]
  
  if (props.error) {
    classes.push('border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500')
  }
  
  if (props.leadingIcon) {
    classes.push('pl-10')
  }
  
  if (props.trailingIcon || props.$slots?.trailing) {
    classes.push('pr-10')
  }
  
  return classes.join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>