<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :disabled="disabled || loading"
    v-bind="$attrs"
    @click="handleClick"
  >
    <Icon 
      v-if="loading" 
      name="lucide:loader-2" 
      class="w-4 h-4 animate-spin mr-2" 
    />
    <Icon 
      v-else-if="icon" 
      :name="icon" 
      :class="iconClasses" 
    />
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: string
  iconOnly?: boolean
  tag?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  iconOnly: false,
  tag: 'button'
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const buttonClasses = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-sm hover:shadow-md focus:ring-blue-200',
    secondary: 'bg-white hover:bg-blue-50 text-blue-600 border-2 border-blue-200 hover:border-blue-300 focus:ring-blue-200',
    destructive: 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm focus:ring-red-200',
    ghost: 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-200',
    outline: 'border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-600 focus:ring-slate-200'
  }
  
  const sizes = {
    sm: props.iconOnly ? 'p-2' : 'px-3 py-2 text-sm',
    md: props.iconOnly ? 'p-2.5' : 'px-4 py-2.5 text-sm',
    lg: props.iconOnly ? 'p-3' : 'px-6 py-3 text-base'
  }
  
  return [
    baseClasses,
    variants[props.variant],
    sizes[props.size]
  ].join(' ')
})

const iconClasses = computed(() => {
  if (props.iconOnly) return 'w-4 h-4'
  return 'w-4 h-4 mr-2'
})

const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>