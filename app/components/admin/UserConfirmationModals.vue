<template>
  <!-- Delete Confirmation Modal -->
  <BaseModal
    :show="showDeleteModal"
    @close="$emit('close:delete')"
  >
    <div class="p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        Confirmar Eliminación
      </h3>
      <p class="text-sm text-gray-500 mb-6">
        ¿Estás seguro de que deseas eliminar a <strong>{{ userToDelete?.full_name }}</strong>? Esta acción no se puede deshacer.
      </p>
      <div class="flex justify-end space-x-3">
        <BaseButton variant="outline" @click="$emit('close:delete')">
          Cancelar
        </BaseButton>
        <BaseButton color="danger" @click="$emit('confirm:delete')">
          Eliminar
        </BaseButton>
      </div>
    </div>
  </BaseModal>

  <!-- Reset Password Confirmation Modal -->
  <BaseModal
    :show="showResetPasswordModal"
    @close="$emit('close:resetPassword')"
  >
    <div class="p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        Confirmar Reset de Contraseña
      </h3>
      <p class="text-sm text-gray-500 mb-6">
        ¿Estás seguro de que deseas resetear la contraseña de <strong>{{ userToResetPassword?.full_name }}</strong>? Se enviará un email de recuperación a su correo electrónico.
      </p>
      <div class="flex justify-end space-x-3">
        <BaseButton variant="outline" @click="$emit('close:resetPassword')">
          Cancelar
        </BaseButton>
        <BaseButton color="warning" @click="$emit('confirm:resetPassword')">
          Resetear Contraseña
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import type { Profile } from '~/types'
import BaseModal from '~/components/ui/BaseModal.vue'
import BaseButton from '~/components/ui/BaseButton.vue'

interface Props {
  showDeleteModal: boolean
  showResetPasswordModal: boolean
  userToDelete: Profile | null
  userToResetPassword: Profile | null
}

interface Emits {
  (e: 'close:delete' | 'close:resetPassword' | 'confirm:delete' | 'confirm:resetPassword'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>