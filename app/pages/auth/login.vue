<template>
  <!-- Magical Particles Background -->
  <MagicalParticles :enabled="!loading" />
  
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="max-w-md w-full space-y-8 glass-card-magical p-8 animate-float" :class="{ 'glass-error': hasError, 'glass-success': showSuccess }">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-glass">
          Iniciar Sesión
        </h2>
        <p class="mt-2 text-center text-sm text-glass-secondary">
          Accede a tu cuenta de Inaplast
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-6">
          <div>
            <label for="email" class="form-label-glass">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              required
              class="form-input-magical"
              placeholder="tu@email.com"
              @focus="onInputFocus"
              @blur="onInputBlur"
            />
          </div>
          
          <div>
            <label for="password" class="form-label-glass">
              Contraseña
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="current-password"
              required
              class="form-input-magical"
              placeholder="••••••••"
              @focus="onInputFocus"
              @blur="onInputBlur"
              @keydown.enter="handleLogin"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <button
            type="button"
            class="text-sm text-glass-secondary hover:text-glass transition-colors duration-200"
            @click="showResetPassword = true"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <div>
          <button
            type="submit"
            class="w-full btn-glass-sparkle btn-ripple disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading"
            @click="onButtonClick"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <div class="spinner-magical mr-2"></div>
              <span class="animate-pulse">Iniciando sesión...</span>
            </span>
            <span v-else class="flex items-center justify-center">
              <Icon name="lucide:sparkles" class="w-4 h-4 mr-2" />
              Iniciar Sesión
            </span>
          </button>
        </div>

        <transition name="error-shake">
          <div v-if="error" class="bg-glass border border-error-border rounded-glass p-4 backdrop-filter backdrop-blur-sm glass-error relative">
            <div class="flex items-center">
              <Icon name="lucide:alert-circle" class="w-5 h-5 text-red-400 mr-2 animate-bounce" />
              <p class="text-sm text-red-300">{{ error }}</p>
            </div>
            <div class="absolute top-1 right-1 text-red-400 animate-ping">💥</div>
          </div>
        </transition>
      </form>

      <!-- Reset Password Modal -->
      <div v-if="showResetPassword" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" @click="showResetPassword = false">
            <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
          </div>
          
          <div class="inline-block align-bottom glass-card px-6 pt-6 pb-6 text-left overflow-hidden shadow-glass-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div>
              <h3 class="text-lg font-semibold text-glass mb-6">
                Restablecer Contraseña
              </h3>
          <form @submit.prevent="handleResetPassword">
            <div class="space-y-4">
              <div>
                <label for="reset-email" class="form-label-glass">
                  Email
                </label>
                <input
                  id="reset-email"
                  v-model="resetEmail"
                  type="email"
                  required
                  class="form-input-glass"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
            
            <div class="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                class="btn-glass-secondary btn-ripple"
                @click="showResetPassword = false"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn-glass-sparkle disabled:opacity-50"
                :disabled="resetLoading"
              >
                <span v-if="resetLoading" class="flex items-center">
                  <div class="spinner-magical mr-2"></div>
                  Enviando...
                </span>
                <span v-else class="flex items-center">
                  <Icon name="lucide:mail" class="w-4 h-4 mr-2" />
                  Enviar
                </span>
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
const showSuccess = ref(false)
const hasError = ref(false)

// Add some delightful interactions
const onInputFocus = () => {
  // Add subtle sparkle effect on focus
  console.log('✨ Input focused')
}

const onInputBlur = () => {
  // Remove focus effects
  console.log('👋 Input blurred')
}

const onButtonClick = (event: Event) => {
  // Add ripple effect
  const button = event.target as HTMLElement
  const ripple = document.createElement('span')
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2
  
  ripple.style.width = ripple.style.height = size + 'px'
  ripple.style.left = x + 'px'
  ripple.style.top = y + 'px'
  ripple.classList.add('ripple-effect')
  
  button.appendChild(ripple)
  
  setTimeout(() => {
    ripple.remove()
  }, 600)
}

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
    
    // Show success state with celebration
    showSuccess.value = true
    hasError.value = false
    
    // Add a small delay for the success animation
    setTimeout(async () => {
      await navigateTo('/')
    }, 800)
    
  } catch (err: any) {
    console.error('Login error:', err)
    error.value = err.message || 'Error al iniciar sesión'
    hasError.value = true
    showSuccess.value = false
    
    // Auto-clear error after 5 seconds
    setTimeout(() => {
      error.value = ''
      hasError.value = false
    }, 5000)
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
    // Show success state
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 2000)
    
    // You could replace this with a toast notification
    alert('✨ Se ha enviado un enlace de restablecimiento a tu email')
  } catch (err: any) {
    alert(err.message || 'Error al enviar el enlace de restablecimiento')
  } finally {
    resetLoading.value = false
  }
}
</script>