<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Restablecer Contraseña
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Ingresa tu nueva contraseña
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleUpdatePassword">
        <div class="space-y-4">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Nueva Contraseña
            </label>
            <UiBaseInput
              id="password"
              v-model="form.password"
              type="password"
              required
              class="mt-1"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </label>
            <UiBaseInput
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="mt-1"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <UiBaseButton
            type="submit"
            class="w-full"
            :disabled="loading"
          >
            <span v-if="loading">Actualizando...</span>
            <span v-else>Actualizar Contraseña</span>
          </UiBaseButton>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  auth: false
})

const { updatePassword } = useAuth()

const form = reactive({
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')

const handleUpdatePassword = async () => {
  loading.value = true
  error.value = ''

  // Validación básica del lado del cliente
  if (form.password !== form.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    loading.value = false
    return
  }

  try {
    await updatePassword(form.password)
    await navigateTo('/')
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Error al actualizar la contraseña'
  } finally {
    loading.value = false
  }
}
</script>