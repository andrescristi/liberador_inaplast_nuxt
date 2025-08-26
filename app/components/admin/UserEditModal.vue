<template>
  <BaseModal
    :show="true"
    size="md"
    @close="$emit('close')"
  >
    <template #header>
      <h3 class="text-lg font-medium text-gray-900">
        Editar Usuario
      </h3>
    </template>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <BaseInput
            v-model="form.first_name"
            placeholder="Ingresa el nombre"
            :error="hasFieldError('first_name')"
            @blur="validateField('first_name')"
          />
          <p v-if="getFieldError('first_name')" class="mt-1 text-sm text-red-600">{{ getFieldError('first_name') }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
          <BaseInput
            v-model="form.last_name"
            placeholder="Ingresa el apellido"
            :error="hasFieldError('last_name')"
            @blur="validateField('last_name')"
          />
          <p v-if="getFieldError('last_name')" class="mt-1 text-sm text-red-600">{{ getFieldError('last_name') }}</p>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <BaseInput
          v-model="form.email"
          type="email"
          placeholder="usuario@ejemplo.com"
          :error="hasFieldError('email')"
          @blur="validateField('email')"
        />
        <p v-if="getFieldError('email')" class="mt-1 text-sm text-red-600">{{ getFieldError('email') }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
        <select
          v-model="form.user_role"
          class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
          :class="{
            'border-red-300 focus:ring-red-500 focus:border-red-500': hasFieldError('user_role'),
            'border-gray-300': !hasFieldError('user_role')
          }"
          :disabled="user.user_role === 'Admin'"
          @change="validateField('user_role')"
        >
          <option value="">Selecciona un rol</option>
          <option value="Admin">Administrador</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Inspector">Inspector</option>
        </select>
        <p v-if="getFieldError('user_role')" class="mt-1 text-sm text-red-600">
          {{ getFieldError('user_role') }}
        </p>
        <p v-if="user.user_role === 'Admin'" class="mt-1 text-sm text-yellow-600">
          No se puede cambiar el rol de otros administradores
        </p>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
class="h-5 w-5 text-blue-400"
fill="currentColor"
viewBox="0 0 20 20">
              <path
fill-rule="evenodd"
d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">
              Información del Usuario
            </h3>
            <div class="mt-2 text-sm text-blue-700 space-y-1">
              <p><strong>Creado:</strong> {{ formatDate(user.created_at) }}</p>
              <p><strong>Última actualización:</strong> {{ formatDate(user.updated_at) }}</p>
              <p v-if="hasChanges" class="text-orange-600">
                <strong>⚠️ Hay cambios pendientes por guardar</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-between">
        <BaseButton
          variant="outline"
          type="button"
          :disabled="loading"
          @click="resetPassword"
        >
          Restablecer Contraseña
        </BaseButton>
        <div class="flex space-x-3">
          <BaseButton
            variant="outline"
            type="button"
            @click="$emit('close')"
          >
            Cancelar
          </BaseButton>
          <BaseButton 
            type="submit" 
            :disabled="loading || !isFormValid || !hasChanges"
            :loading="loading"
            @click="handleSubmit"
          >
            {{ loading ? 'Actualizando...' : 'Actualizar Usuario' }}
          </BaseButton>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { Profile } from '~/types'
import { updateUserSchema, type UpdateUserForm } from '~/schemas/user'

// Import components explicitly to fix SSR resolution issues
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseModal from '~/components/ui/BaseModal.vue'

const props = defineProps<{
  user: Profile
}>()

const emit = defineEmits<{
  close: []
  updated: []
}>()

const toast = useToast()

// Usar composable para formularios con Zod
const {
  form,
  loading,
  // errors,
  isFormValid,
  hasChanges,
  handleSubmit,
  validateField,
  getFieldError,
  hasFieldError,
  // resetForm
} = useModalForm<UpdateUserForm>({
  schema: updateUserSchema,
  initialData: {
    first_name: props.user.first_name,
    last_name: props.user.last_name,
    email: props.user.email || '',
    user_role: props.user.user_role
  },
  onSubmit: updateUser,
  onSuccess: () => {
    emit('updated')
  }
})

// Métodos
async function updateUser(data: UpdateUserForm) {
  const updateData: UpdateUserForm = {}
  
  // Solo incluir campos que han cambiado
  if (data.first_name !== props.user.first_name) {
    updateData.first_name = data.first_name
  }
  
  if (data.last_name !== props.user.last_name) {
    updateData.last_name = data.last_name
  }
  
  if (data.user_role !== props.user.user_role && props.user.user_role !== 'Admin') {
    updateData.user_role = data.user_role
  }

  let emailToUpdate: string | undefined
  if (data.email !== props.user.email) {
    emailToUpdate = data.email
  }

  if (Object.keys(updateData).length === 0 && !emailToUpdate) {
    toast.info('Info', 'No hay cambios para guardar')
    return
  }

  await $fetch(`/api/admin/users/${props.user.user_id}`, {
    method: 'PUT',
    body: {
      ...updateData,
      ...(emailToUpdate && { email: emailToUpdate })
    }
  })
}

const resetPassword = async () => {
  if (!confirm('¿Estás seguro de que deseas restablecer la contraseña de este usuario?')) {
    return
  }

  try {
    await $fetch(`/api/admin/users/${props.user.user_id}/reset-password`, {
      method: 'POST'
    })
    toast.success('Éxito', 'Se ha enviado un email para restablecer la contraseña')
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al restablecer la contraseña'
    toast.error('Error', errorMessage)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>