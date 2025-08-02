<template>
  <div class="flex items-center justify-between">
    <div class="text-sm text-slate-700">
      Showing {{ startItem }} to {{ endItem }} of {{ total }} results
    </div>
    
    <div class="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        :disabled="modelValue <= 1"
        @click="goToPage(modelValue - 1)"
      >
        <Icon name="lucide:chevron-left" class="w-4 h-4" />
        Previous
      </Button>
      
      <div class="flex items-center space-x-1">
        <!-- First page -->
        <button
          v-if="showFirstPage"
          class="pagination-button"
          :class="{ active: modelValue === 1 }"
          @click="goToPage(1)"
        >
          1
        </button>
        
        <!-- Left ellipsis -->
        <span v-if="showLeftEllipsis" class="px-2 text-slate-500">...</span>
        
        <!-- Page numbers around current page -->
        <button
          v-for="page in visiblePages"
          :key="page"
          class="pagination-button"
          :class="{ active: modelValue === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        
        <!-- Right ellipsis -->
        <span v-if="showRightEllipsis" class="px-2 text-slate-500">...</span>
        
        <!-- Last page -->
        <button
          v-if="showLastPage"
          class="pagination-button"
          :class="{ active: modelValue === totalPages }"
          @click="goToPage(totalPages)"
        >
          {{ totalPages }}
        </button>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        :disabled="modelValue >= totalPages"
        @click="goToPage(modelValue + 1)"
      >
        Next
        <Icon name="lucide:chevron-right" class="w-4 h-4" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: number
  totalPages: number
  total: number
  perPage: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [page: number]
  change: [page: number]
}>()

const startItem = computed(() => {
  return (props.modelValue - 1) * props.perPage + 1
})

const endItem = computed(() => {
  return Math.min(props.modelValue * props.perPage, props.total)
})

const visiblePages = computed(() => {
  const pages = []
  const current = props.modelValue
  const total = props.totalPages
  
  // Always show current page and 2 pages before and after
  const start = Math.max(2, current - 2)
  const end = Math.min(total - 1, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const showFirstPage = computed(() => {
  return props.totalPages > 1 && !visiblePages.value.includes(1)
})

const showLastPage = computed(() => {
  return props.totalPages > 1 && !visiblePages.value.includes(props.totalPages)
})

const showLeftEllipsis = computed(() => {
  return visiblePages.value.length > 0 && visiblePages.value[0] > 2
})

const showRightEllipsis = computed(() => {
  return visiblePages.value.length > 0 && visiblePages.value[visiblePages.value.length - 1] < props.totalPages - 1
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.modelValue) {
    emit('update:modelValue', page)
    emit('change', page)
  }
}
</script>

<style scoped>
.pagination-button {
  @apply w-8 h-8 flex items-center justify-center text-sm rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors duration-150;
}

.pagination-button.active {
  @apply bg-blue-500 border-blue-500 text-white hover:bg-blue-600;
}
</style>