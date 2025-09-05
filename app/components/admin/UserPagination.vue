<template>
  <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
    <div class="text-sm text-gray-700">
      Mostrando {{ startItem }} a {{ endItem }} de {{ totalUsers }} usuarios
    </div>
    <div class="flex space-x-2">
      <BaseButton
        :disabled="currentPage === 1"
        variant="outline"
        @click="$emit('previousPage')"
      >
        Anterior
      </BaseButton>
      <BaseButton
        :disabled="currentPage === totalPages"
        variant="outline"
        @click="$emit('nextPage')"
      >
        Siguiente
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
// Components are auto-imported by Nuxt

interface Props {
  currentPage: number
  totalPages: number
  totalUsers: number
  pageSize: number
}

interface Emits {
  (e: 'nextPage' | 'previousPage'): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const startItem = computed(() => ((props.currentPage - 1) * props.pageSize) + 1)
const endItem = computed(() => Math.min(props.currentPage * props.pageSize, props.totalUsers))
</script>