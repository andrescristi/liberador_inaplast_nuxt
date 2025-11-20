<template>
  <Teleport to="body">
    <div
      v-if="toasts && toasts.length > 0"
      class="fixed inset-0 z-50 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end"
    >
      <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
        <TransitionGroup
          enter-active-class="transform ease-out duration-300 transition"
          enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ToastNotification
            v-for="toast in toasts"
            :key="toast.id"
            :id="toast.id"
            :title="toast.title"
            :description="toast.description"
            :type="toast.type"
            :duration="toast.duration"
            @close="removeToast"
          />
        </TransitionGroup>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, removeToast } = useToast()
</script>