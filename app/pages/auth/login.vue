<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar Sesión
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Accede a tu cuenta de Inaplast
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="tu@email.com"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="current-password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <button
            type="button"
            class="text-sm text-blue-600 hover:text-blue-500"
            @click="showResetPassword = true"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <div>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading"
          >
            <span v-if="loading">Iniciando sesión...</span>
            <span v-else>Iniciar Sesión</span>
          </button>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>
      </form>

      <!-- Reset Password Modal -->
      <div v-if="showResetPassword" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" @click="showResetPassword = false">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          
          <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                Restablecer Contraseña
              </h3>
          <form @submit.prevent="handleResetPassword">
            <div class="space-y-4">
              <div>
                <label for="reset-email" class="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="reset-email"
                  v-model="resetEmail"
                  type="email"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
            
            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="showResetPassword = false"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                :disabled="resetLoading"
              >
                <span v-if="resetLoading">Enviando...</span>
                <span v-else>Enviar</span>
              </button>
            </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  auth: false
})

const { signIn, resetPassword } = useAuth()

const form = reactive({
  email: '',
  password: ''
})

const resetEmail = ref('')
const loading = ref(false)
const resetLoading = ref(false)
const error = ref('')
const showResetPassword = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  // Debug: Log form values
  console.log('Form data:', { email: form.email, password: form.password })
  
  // Validate form data before sending
  if (!form.email || !form.password) {
    error.value = 'Por favor completa todos los campos'
    loading.value = false
    return
  }

  if (!form.email.includes('@')) {
    error.value = 'Por favor ingresa un email válido'
    loading.value = false
    return
  }

  try {
    console.log('Attempting to sign in with:', form.email)
    await signIn(form.email.trim(), form.password)
    console.log('Sign in successful, redirecting...')
    await navigateTo('/')
  } catch (err: any) {
    console.error('Login error:', err)
    error.value = err.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  resetLoading.value = true

  try {
    await resetPassword(resetEmail.value)
    showResetPassword.value = false
    resetEmail.value = ''
    // Show success message
    alert('Se ha enviado un enlace de restablecimiento a tu email')
  } catch (err: any) {
    alert(err.message || 'Error al enviar el enlace de restablecimiento')
  } finally {
    resetLoading.value = false
  }
}
</script>