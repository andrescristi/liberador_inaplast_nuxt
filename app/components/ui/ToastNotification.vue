<template>
  <div
    v-if="visible"
    :class="toastClasses"
    @click="close"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <component :is="iconComponent" :class="iconClasses" />
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium text-gray-900">
          {{ title }}
        </p>
        <p v-if="description" class="mt-1 text-sm text-gray-500">
          {{ description }}
        </p>
      </div>
      <div class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            type="button"
            class="inline-flex rounded-md bg-white p-1.5 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click.stop="close"
          >
            <span class="sr-only">Dismiss</span>
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

interface Props {
  id: string
  title: string
  description?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 5000
})

const emit = defineEmits<{
  close: [id: string]
}>()

const visible = ref(true)

const iconComponent = computed(() => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  }
  return icons[props.type]
})

const toastClasses = computed(() => {
  const base = 'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105'
  
  return base
})

const iconClasses = computed(() => {
  const variants = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  }
  
  return ['h-6 w-6', variants[props.type]].join(' ')
})

const close = () => {
  visible.value = false
  setTimeout(() => {
    emit('close', props.id)
  }, 300)
}

// Auto close after duration
onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})
</script>