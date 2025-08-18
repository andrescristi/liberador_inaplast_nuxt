<template>
  <div :class="alertClasses">
    <div class="flex">
      <div class="flex-shrink-0">
        <Icon :name="iconName" :class="iconClasses" />
      </div>
      <div class="ml-3">
        <h3 v-if="title || $slots.title" :class="titleClasses">
          <slot v-if="$slots.title" name="title" />
          <template v-else>{{ title }}</template>
        </h3>
        <div :class="descriptionClasses">
          <p v-if="description">{{ description }}</p>
          <slot v-else-if="$slots.default" />
        </div>
      </div>
      <div v-if="closable" class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            type="button"
            :class="closeButtonClasses"
            @click="$emit('close')"
          >
            <span class="sr-only">Dismiss</span>
            <Icon name="bx:x" class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Icons are now provided by @nuxt/icon

interface Props {
  variant?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  description?: string
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  title: '',
  description: '',
  closable: false
})

defineEmits<{
  close: []
}>()

const iconName = computed(() => {
  const icons = {
    success: 'bx:check-circle',
    error: 'bx:x-circle',
    warning: 'bx:error',
    info: 'bx:info-circle'
  }
  return icons[props.variant]
})

const alertClasses = computed(() => {
  const base = 'rounded-md p-4'
  
  const variants = {
    success: 'bg-green-50 border border-green-200',
    error: 'bg-red-50 border border-red-200',
    warning: 'bg-yellow-50 border border-yellow-200',
    info: 'bg-blue-50 border border-blue-200'
  }
  
  return [base, variants[props.variant]].join(' ')
})

const iconClasses = computed(() => {
  const variants = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  }
  
  return ['h-5 w-5', variants[props.variant]].join(' ')
})

const titleClasses = computed(() => {
  const variants = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  }
  
  return ['text-sm font-medium', variants[props.variant]].join(' ')
})

const descriptionClasses = computed(() => {
  const base = 'text-sm'
  
  const variants = {
    success: 'text-green-700',
    error: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700'
  }
  
  const classes = [base, variants[props.variant]]
  
  if (props.title) {
    classes.push('mt-1')
  }
  
  return classes.join(' ')
})

const closeButtonClasses = computed(() => {
  const base = 'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    success: 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50',
    error: 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50',
    warning: 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50',
    info: 'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-blue-50'
  }
  
  return [base, variants[props.variant]].join(' ')
})
</script>