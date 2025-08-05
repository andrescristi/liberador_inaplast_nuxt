<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" :class="headerClasses">
      <slot name="header" />
    </div>
    
    <div v-if="$slots.default" :class="bodyClasses">
      <slot />
    </div>
    
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  border?: boolean
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  shadow: 'sm',
  rounded: 'lg',
  padding: 'md',
  border: true,
  hover: false
})

const cardClasses = computed(() => {
  const base = 'bg-white overflow-hidden'
  
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  }
  
  const rounded = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  }
  
  const classes = [
    base,
    shadows[props.shadow],
    rounded[props.rounded]
  ]
  
  if (props.border) {
    classes.push('border border-gray-200')
  }
  
  if (props.hover) {
    classes.push('hover:shadow-md transition-shadow duration-200')
  }
  
  return classes.join(' ')
})

const headerClasses = computed(() => {
  const base = 'border-b border-gray-200'
  
  const paddings = {
    none: '',
    sm: 'px-3 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6'
  }
  
  return [base, paddings[props.padding]].join(' ')
})

const bodyClasses = computed(() => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return paddings[props.padding]
})

const footerClasses = computed(() => {
  const base = 'border-t border-gray-200'
  
  const paddings = {
    none: '',
    sm: 'px-3 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6'
  }
  
  return [base, paddings[props.padding]].join(' ')
})
</script>