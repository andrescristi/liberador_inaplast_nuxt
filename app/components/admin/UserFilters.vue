<template>
  <BaseCard class="mb-6">
    <div class="p-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="sm:col-span-2">
          <BaseInput
            :model-value="searchTerm"
            placeholder="Buscar por nombre o email..."
            @input="handleSearchInput"
          >
            <template #prepend>
              <svg
                class="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </template>
          </BaseInput>
        </div>
        <div>
          <select
            :value="selectedRole"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            @change="handleRoleChange"
          >
            <option value="">Todos los roles</option>
            <option value="Admin">Administrador</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Inspector">Inspector</option>
          </select>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { ProfileRole } from '~/types'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseInput from '~/components/ui/BaseInput.vue'

interface Props {
  searchTerm: string
  selectedRole: ProfileRole | ''
}

interface Emits {
  (e: 'update:searchTerm', value: string): void
  (e: 'update:selectedRole', value: ProfileRole | ''): void
  (e: 'search' | 'roleChange'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:searchTerm', target.value)
  emit('search')
}

const handleRoleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:selectedRole', target.value as ProfileRole | '')
  emit('roleChange')
}
</script>