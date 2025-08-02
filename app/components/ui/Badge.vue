<template>
  <span :class="badgeClasses">
    <Icon v-if="icon" :name="icon" class="w-3 h-3 mr-1" />
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'pending' | 'processing' | 'completed' | 'cancelled' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md'
})

const badgeClasses = computed(() => {
  const baseClasses = 'inline-flex items-center font-semibold rounded-full transition-colors duration-200'
  
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    pending: 'status-pending',
    processing: 'bg-indigo-100 text-indigo-700',
    completed: 'status-completed',
    cancelled: 'status-cancelled',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm'
  }
  
  return [baseClasses, variants[props.variant], sizes[props.size]].join(' ')
})
</script>