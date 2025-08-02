<template>
  <div :class="cardClasses">
    <div v-if="title || $slots.header" class="border-b border-slate-200 p-6 pb-4">
      <slot name="header">
        <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
        <p v-if="description" class="text-sm text-slate-500 mt-1">{{ description }}</p>
      </slot>
    </div>
    
    <div :class="contentClasses">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="border-t border-slate-200 p-6 pt-4">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: boolean
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: true,
  hover: false
})

const cardClasses = computed(() => {
  const baseClasses = 'bg-white rounded-lg transition-all duration-200'
  
  const variants = {
    default: 'border border-slate-200 shadow-sm',
    elevated: 'shadow-md',
    outlined: 'border-2 border-slate-200'
  }
  
  const hoverClasses = props.hover ? 'hover:shadow-lg hover:border-blue-200 cursor-pointer' : ''
  
  return [baseClasses, variants[props.variant], hoverClasses].filter(Boolean).join(' ')
})

const contentClasses = computed(() => {
  return props.padding ? 'p-6' : ''
})
</script>