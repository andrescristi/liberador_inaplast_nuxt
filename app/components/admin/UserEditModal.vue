<template>
  <BaseModal :show="true" @close="$emit('close')">
    <div class="p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-6">
        Editar Usuario
      </h3>

      <form class="space-y-4" @submit.prevent="updateUser">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <BaseInput
            v-model="form.first_name"
            label="Nombre"
            placeholder="Ingresa el nombre"
            :error="errors.first_name"
            required
          />
          
          <BaseInput
            v-model="form.last_name"
            label="Apellido"
            placeholder="Ingresa el apellido"
            :error="errors.last_name"
            required
          />
        </div>

        <BaseInput
          v-model="form.email"
          label="Email"
          type="email"
          placeholder="usuario@ejemplo.com"
          :error="errors.email"
          required
        />

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Rol
          </label>
          <select
            v-model="form.user_role"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            :class="{ 'border-red-300': errors.user_role }"
            :disabled="user.user_role === 'Admin'"
            required
          >
            <option value="">Selecciona un rol</option>
            <option value="Admin">Administrador</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Inspector">Inspector</option>
          </select>
          <p v-if="errors.user_role" class="mt-1 text-sm text-red-600">
            {{ errors.user_role }}
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
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-between pt-4">
          <BaseButton
variant="outline"
type="button"
:disabled="loading"
@click="resetPassword">
            Restablecer Contraseña
          </BaseButton>
          <div class="flex space-x-3">
            <BaseButton
variant="outline"
type="button"
@click="$emit('close')">
              Cancelar
            </BaseButton>
            <BaseButton type="submit" :disabled="loading">
              <svg
v-if="loading"
class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
fill="none"
viewBox="0 0 24 24">
                <circle
class="opacity-25"
cx="12"
cy="12"
r="10"
stroke="currentColor"
stroke-width="4"/>
                <path
class="opacity-75"
fill="currentColor"
d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              {{ loading ? 'Actualizando...' : 'Actualizar Usuario' }}
            </BaseButton>
          </div>
        </div>
      </form>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import type { Profile, UpdateProfileForm } from '~/types'

const props = defineProps<{
  user: Profile
}>()

const emit = defineEmits<{
  close: []
  updated: []
}>()

const userAdmin = useAdminUserManager()
const toast = useToast()

// Form data
const form = ref({
  first_name: props.user.first_name,
  last_name: props.user.last_name,
  email: props.user.email || '',
  user_role: props.user.user_role
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)

// Validation
const validateForm = () => {
  errors.value = {}

  if (!form.value.first_name.trim()) {
    errors.value.first_name = 'El nombre es requerido'
  }

  if (!form.value.last_name.trim()) {
    errors.value.last_name = 'El apellido es requerido'
  }

  if (!form.value.email.trim()) {
    errors.value.email = 'El email es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Formato de email inválido'
  }

  if (!form.value.user_role) {
    errors.value.user_role = 'El rol es requerido'
  }

  return Object.keys(errors.value).length === 0
}

// Methods
const updateUser = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    const updateData: UpdateProfileForm = {}
    
    if (form.value.first_name !== props.user.first_name) {
      updateData.first_name = form.value.first_name
    }
    
    if (form.value.last_name !== props.user.last_name) {
      updateData.last_name = form.value.last_name
    }
    
    if (form.value.user_role !== props.user.user_role && props.user.user_role !== 'Admin') {
      updateData.user_role = form.value.user_role
    }

    let emailToUpdate: string | undefined
    if (form.value.email !== props.user.email) {
      emailToUpdate = form.value.email
    }

    if (Object.keys(updateData).length === 0 && !emailToUpdate) {
      toast.info('Info', 'No hay cambios para guardar')
      return
    }

    await userAdmin.updateUser(props.user.user_id, updateData, emailToUpdate)
    emit('updated')
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el usuario'
    toast.error('Error', errorMessage)
  } finally {
    loading.value = false
  }
}

const resetPassword = async () => {
  if (!confirm('¿Estás seguro de que deseas restablecer la contraseña de este usuario?')) {
    return
  }

  loading.value = true
  try {
    await userAdmin.resetUserPassword(props.user.user_id)
    toast.success('Éxito', 'Se ha enviado un email para restablecer la contraseña')
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al restablecer la contraseña'
    toast.error('Error', errorMessage)
  } finally {
    loading.value = false
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