<template>
  <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
    <table class="min-w-full divide-y divide-gray-300">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="(row, rowIndex) in rows"
          :key="rowIndex"
          :class="[
            'hover:bg-gray-50',
            selectable ? 'cursor-pointer' : ''
          ]"
          @click="selectable && $emit('select', row)"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
          >
            <slot 
              :name="column.key + '-data'" 
              :row="row" 
              :column="column"
              :value="row[column.key]"
            >
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
        
        <!-- Empty state -->
        <tr v-if="rows.length === 0">
          <td :colspan="columns.length" class="px-6 py-12 text-center text-gray-500">
            <slot name="empty">
              <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No data</h3>
                <p class="mt-1 text-sm text-gray-500">No records found.</p>
              </div>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string
  label: string
}

interface Props {
  rows: any[]
  columns: Column[]
  selectable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false
})

defineEmits<{
  select: [row: any]
}>()
</script>