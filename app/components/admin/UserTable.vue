<template>
  <BaseCard>
    <div class="px-4 py-5 sm:p-6">
      <BaseTable
        :columns="tableHeaders"
        :rows="users"
      >
        <template #user_role-data="{ row }">
          <BaseBadge
            :color="getRoleBadgeVariant((row as unknown as Profile).user_role)"
          >
            {{ getRoleLabel((row as unknown as Profile).user_role) }}
          </BaseBadge>
        </template>
        <template #created_at-data="{ row }">
          {{ formatDate((row as unknown as Profile).created_at) }}
        </template>
        <template #actions-data="{ row }">
          <div class="flex flex-wrap gap-1">
            <BaseButton
              variant="ghost"
              color="primary"
              size="xs"
              leading-icon="bx:edit"
              @click="$emit('edit', row as unknown as Profile)"
              class="min-w-0 px-2"
            >
              Editar
            </BaseButton>
            <BaseButton
              variant="ghost"
              color="warning"
              size="xs"
              leading-icon="bx:key"
              @click="$emit('resetPassword', row as unknown as Profile)"
              class="min-w-0 px-2"
            >
              Resetear
            </BaseButton>
            <BaseButton
              v-if="(row as unknown as Profile).user_role !== 'Admin'"
              variant="ghost"
              color="danger"
              size="xs"
              leading-icon="bx:trash"
              @click="$emit('delete', row as unknown as Profile)"
              class="min-w-0 px-2"
            >
              Eliminar
            </BaseButton>
          </div>
        </template>
      </BaseTable>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { Profile, ProfileRole } from '~/types'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseTable from '~/components/ui/BaseTable.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseButton from '~/components/ui/BaseButton.vue'

interface Props {
  users: Profile[]
}

interface Emits {
  (e: 'edit' | 'delete' | 'resetPassword', user: Profile): void
}

defineProps<Props>()
defineEmits<Emits>()

const tableHeaders = [
  { key: 'full_name', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  { key: 'user_role', label: 'Rol' },
  { key: 'created_at', label: 'Fecha de Creación' },
  { key: 'actions', label: 'Acciones', width: 'w-48' }
]

const getRoleBadgeVariant = (role: ProfileRole) => {
  switch (role) {
    case 'Admin': return 'blue'
    case 'Supervisor': return 'green'
    case 'Inspector': return 'yellow'
    default: return 'gray'
  }
}

const getRoleLabel = (role: ProfileRole) => {
  switch (role) {
    case 'Admin': return 'Administrador'
    case 'Supervisor': return 'Supervisor'
    case 'Inspector': return 'Inspector'
    default: return role
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>