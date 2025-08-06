<template>
  <TransitionRoot as="template" :show="show">
    <Dialog
as="div"
class="relative z-10"
@close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel :class="panelClasses">
              <div v-if="$slots.header" class="px-6 py-4 border-b border-gray-200">
                <slot name="header" />
              </div>
              
              <div class="px-6 py-4">
                <slot />
              </div>
              
              <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200">
                <slot name="footer" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

interface Props {
  show: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

defineEmits<{
  close: []
}>()

const panelClasses = computed(() => {
  const base = 'relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all'
  
  const sizes = {
    sm: 'sm:my-8 sm:w-full sm:max-w-sm',
    md: 'sm:my-8 sm:w-full sm:max-w-md',
    lg: 'sm:my-8 sm:w-full sm:max-w-lg',
    xl: 'sm:my-8 sm:w-full sm:max-w-xl',
    full: 'sm:my-8 sm:w-full sm:max-w-7xl'
  }
  
  return [base, sizes[props.size]].join(' ')
})
</script>