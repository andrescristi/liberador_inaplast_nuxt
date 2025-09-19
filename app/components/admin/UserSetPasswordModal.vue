<template>
  <BaseModal
    :show="true"
    size="md"
    @close="$emit('close')"
  >
    <template #header>
      <h3 class="text-lg font-medium leading-6 text-gray-900">
        Establecer Nueva Contraseña
      </h3>
    </template>
      <div class="space-y-6">
        <!-- Información del usuario -->
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <Icon name="bx:user" class="h-10 w-10 text-gray-400" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ user.fullName || `${user.firstName} ${user.lastName}` }}
              </p>
              <p class="text-sm text-gray-500">{{ user.email }}</p>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="8"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingrese la nueva contraseña"
              >
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="showPassword = !showPassword"
              >
                <Icon
                  :name="showPassword ? 'bx:hide' : 'bx:show'"
                  class="h-5 w-5 text-gray-400"
                />
              </button>
            </div>
            <p class="mt-1 text-xs text-gray-500">
              La contraseña debe tener al menos 8 caracteres
            </p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              required
              minlength="8"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirme la nueva contraseña"
            >
          </div>

          <!-- Advertencia de seguridad -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <div class="flex">
              <div class="flex-shrink-0">
                <Icon name="bx:info-circle" class="h-5 w-5 text-yellow-400" />
              </div>
              <div class="ml-3">
                <p class="text-sm text-yellow-700">
                  <strong>Importante:</strong> Esta acción establecerá inmediatamente la nueva contraseña.
                  El usuario podrá iniciar sesión con la nueva contraseña sin necesidad de confirmación por email.
                </p>
              </div>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-3">
            <div class="flex">
              <div class="flex-shrink-0">
                <Icon name="bx:error" class="h-5 w-5 text-red-400" />
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ errorMessage }}</p>
              </div>
            </div>
          </div>
        </form>
      </div>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <BaseButton
          variant="ghost"
          color="gray"
          :disabled="loading"
          @click="$emit('close')"
        >
          Cancelar
        </BaseButton>
        <BaseButton
          color="indigo"
          :loading="loading"
          :disabled="!isFormValid"
          @click="handleSubmit"
        >
          Establecer Contraseña
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { ProfileResponse } from '~/types'
import BaseModal from '~/components/ui/BaseModal.vue'
import BaseButton from '~/components/ui/BaseButton.vue'

interface Props {
  user: ProfileResponse
}

interface Emits {
  (e: 'close' | 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const isFormValid = computed(() => {
  return password.value.length >= 8 &&
         password.value === confirmPassword.value &&
         !loading.value
})

const handleSubmit = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Por favor complete todos los campos correctamente'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await $fetch(`/api/admin/users/${props.user.userId}/set-password`, {
      method: 'POST',
      body: {
        password: password.value
      }
    })

    emit('success')
  } catch (error: unknown) {
    const errorMsg = error && typeof error === 'object' && 'statusMessage' in error
      ? (error.statusMessage as string)
      : 'Error al establecer la contraseña'
    errorMessage.value = errorMsg
  } finally {
    loading.value = false
  }
}

// Limpiar el formulario cuando se cierre el modal
watch(() => props.user, () => {
  password.value = ''
  confirmPassword.value = ''
  showPassword.value = false
  errorMessage.value = ''
})
</script>