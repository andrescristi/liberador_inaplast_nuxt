<template>
  <BaseCard>
    <div class="px-4 py-5 sm:p-6">
      <!-- Vista Desktop: Tabla -->
      <div class="hidden md:block">
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
                class="min-w-0 px-2"
                @click="$emit('edit', row as unknown as Profile)"
              >
                Editar
              </BaseButton>
              <BaseButton
                variant="ghost"
                color="warning"
                size="xs"
                leading-icon="bx:key"
                class="min-w-0 px-2"
                @click="$emit('resetPassword', row as unknown as Profile)"
              >
                Resetear
              </BaseButton>
              <BaseButton
                v-if="(row as unknown as Profile).user_role !== 'Admin'"
                variant="ghost"
                color="danger"
                size="xs"
                leading-icon="bx:trash"
                class="min-w-0 px-2"
                @click="$emit('delete', row as unknown as Profile)"
              >
                Eliminar
              </BaseButton>
            </div>
          </template>
        </BaseTable>
      </div>

      <!-- Vista Móvil: Tarjetas -->
      <div class="md:hidden space-y-4">
        <div 
          v-for="user in users" 
          :key="user.id"
          class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
        >
          <!-- Header de la tarjeta -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1 min-w-0 mr-3">
              <h3 class="font-medium text-gray-900 truncate">{{ user.full_name }}</h3>
              <p class="text-sm text-gray-500 truncate">{{ user.email }}</p>
            </div>
            <div class="flex-shrink-0">
              <BaseBadge
                :color="getRoleBadgeVariant(user.user_role)"
                class="whitespace-nowrap"
              >
                {{ getRoleLabel(user.user_role) }}
              </BaseBadge>
            </div>
          </div>

          <!-- Información adicional -->
          <div class="mb-4">
            <p class="text-xs text-gray-500">
              Creado: {{ formatDate(user.created_at) }}
            </p>
          </div>

          <!-- Acciones -->
          <div class="flex flex-wrap gap-2">
            <BaseButton
              variant="ghost"
              color="primary"
              size="sm"
              leading-icon="bx:edit"
              class="flex-1"
              @click="$emit('edit', user)"
            >
              Editar
            </BaseButton>
            <BaseButton
              variant="ghost"
              color="warning"
              size="sm"
              leading-icon="bx:key"
              class="flex-1"
              @click="$emit('resetPassword', user)"
            >
              Resetear
            </BaseButton>
            <BaseButton
              v-if="user.user_role !== 'Admin'"
              variant="ghost"
              color="danger"
              size="sm"
              leading-icon="bx:trash"
              class="flex-1"
              @click="$emit('delete', user)"
            >
              Eliminar
            </BaseButton>
          </div>
        </div>

        <!-- Estado vacío para móvil -->
        <div v-if="users.length === 0" class="text-center py-8">
          <Icon name="bx:user-x" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
          <p class="text-gray-500">No se encontraron registros.</p>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { Profile, ProfileRole } from '~/types'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseTable from '~/components/ui/BaseTable.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'
// Components are auto-imported by Nuxt

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