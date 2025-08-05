<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'solid' | 'outline' | 'soft'
  color?: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  color: 'gray',
  size: 'md'
})

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center font-medium'
  
  const variants = {
    solid: {
      gray: 'bg-gray-100 text-gray-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      indigo: 'bg-indigo-100 text-indigo-800',
      purple: 'bg-purple-100 text-purple-800',
      pink: 'bg-pink-100 text-pink-800'
    },
    outline: {
      gray: 'border border-gray-200 text-gray-700',
      red: 'border border-red-200 text-red-700',
      yellow: 'border border-yellow-200 text-yellow-700',
      green: 'border border-green-200 text-green-700',
      blue: 'border border-blue-200 text-blue-700',
      indigo: 'border border-indigo-200 text-indigo-700',
      purple: 'border border-purple-200 text-purple-700',
      pink: 'border border-pink-200 text-pink-700'
    },
    soft: {
      gray: 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10',
      red: 'bg-red-50 text-red-600 ring-1 ring-inset ring-red-500/10',
      yellow: 'bg-yellow-50 text-yellow-600 ring-1 ring-inset ring-yellow-500/10',
      green: 'bg-green-50 text-green-600 ring-1 ring-inset ring-green-500/10',
      blue: 'bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-500/10',
      indigo: 'bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-500/10',
      purple: 'bg-purple-50 text-purple-600 ring-1 ring-inset ring-purple-500/10',
      pink: 'bg-pink-50 text-pink-600 ring-1 ring-inset ring-pink-500/10'
    }
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs rounded-full',
    md: 'px-2.5 py-0.5 text-sm rounded-full',
    lg: 'px-3 py-1 text-sm rounded-full'
  }
  
  return [
    base,
    variants[props.variant][props.color],
    sizes[props.size]
  ].join(' ')
})
</script>