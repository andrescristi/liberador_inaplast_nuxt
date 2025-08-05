<template>
  <component
    :is="is"
    :to="to"
    :href="href"
    :type="htmlType"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <div v-if="loading" class="animate-spin mr-2">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
    </div>
    
    <component v-if="leadingIcon && !loading" :is="leadingIcon" class="w-4 h-4 mr-2" />
    
    <slot />
    
    <component v-if="trailingIcon" :is="trailingIcon" class="w-4 h-4 ml-2" />
  </component>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'solid' | 'outline' | 'ghost' | 'link'
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'gray'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  to?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  leadingIcon?: any
  trailingIcon?: any
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  color: 'primary',
  size: 'md',
  type: 'button'
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const is = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'button'
})

const htmlType = computed(() => is.value === 'button' ? props.type : undefined)

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    solid: {
      primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
      success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
      gray: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500'
    },
    outline: {
      primary: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
      secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
      success: 'border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
      danger: 'border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
      warning: 'border border-yellow-600 text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500',
      gray: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
    },
    ghost: {
      primary: 'text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
      secondary: 'text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
      success: 'text-green-600 hover:bg-green-50 focus:ring-green-500',
      danger: 'text-red-600 hover:bg-red-50 focus:ring-red-500',
      warning: 'text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500',
      gray: 'text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
    },
    link: {
      primary: 'text-indigo-600 hover:text-indigo-500 underline-offset-4 hover:underline',
      secondary: 'text-gray-700 hover:text-gray-500 underline-offset-4 hover:underline',
      success: 'text-green-600 hover:text-green-500 underline-offset-4 hover:underline',
      danger: 'text-red-600 hover:text-red-500 underline-offset-4 hover:underline',
      warning: 'text-yellow-600 hover:text-yellow-500 underline-offset-4 hover:underline',
      gray: 'text-gray-700 hover:text-gray-500 underline-offset-4 hover:underline'
    }
  }
  
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs rounded',
    sm: 'px-3 py-2 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-4 py-2 text-base rounded-md',
    xl: 'px-6 py-3 text-base rounded-md'
  }
  
  const classes = [
    base,
    variants[props.variant][props.color],
    sizes[props.size]
  ]
  
  if (props.block) {
    classes.push('w-full')
  }
  
  return classes.join(' ')
})

const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>