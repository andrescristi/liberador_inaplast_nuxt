<template>
  <div
    aria-live="assertive"
    class="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end"
    style="z-index: var(--z-toast)"
  >
    <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
      <TransitionGroup
        name="toast"
        tag="div"
        class="w-full flex flex-col items-center space-y-4 sm:items-end"
      >
        <UiToastNotification
          v-for="toast in toasts"
          :key="toast.id"
          v-bind="toast"
          @close="removeToast"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
const { toasts, removeToast } = useToast()
</script>

