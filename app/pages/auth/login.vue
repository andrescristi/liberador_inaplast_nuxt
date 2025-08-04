<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <DaisyCard padding="lg" class="animate-fade-in">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="glass-icon-container w-16 h-16 mx-auto mb-4">
            <Icon name="lucide:layers" class="w-8 h-8 text-primary-400" />
          </div>
          <h1 class="text-2xl font-semibold text-glass mb-2">
            Iniciar Sesión
          </h1>
          <p class="text-glass-secondary">
            Accede a tu cuenta de Inaplast
          </p>
        </div>
        
        <!-- Login Form -->
        <DaisyForm 
          :loading="loading"
          :disabled="loading"
          spacing="lg"
          @submit="handleLogin"
        >
          <DaisyInput
            v-model="form.email"
            type="email"
            label="Email"
            placeholder="tu@email.com"
            left-icon="lucide:mail"
            autocomplete="email"
            required
            :error="fieldErrors.email"
            @blur="validateEmail"
          />
          
          <DaisyInput
            v-model="form.password"
            type="password"
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            autocomplete="current-password"
            required
            :error="fieldErrors.password"
            @blur="validatePassword"
          />
          
          <!-- Forgot Password -->
          <div class="flex justify-end">
            <button
              type="button"
              class="text-sm text-glass-secondary hover:text-glass transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400/50 rounded"
              @click="showResetPassword = true"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          
          <!-- Submit Button -->
          <DaisyButton
            type="submit"
            :loading="loading"
            :disabled="!isFormValid"
            full-width
            size="lg"
          >
            Iniciar Sesión
          </DaisyButton>
          
          <!-- Error Message -->
          <div v-if="error" class="animate-slide-up">
            <div class="bg-error-glass border border-error-border rounded-lg p-4">
              <div class="flex items-center gap-3">
                <Icon name="lucide:alert-triangle" class="w-5 h-5 text-red-400 flex-shrink-0" />
                <p class="text-sm text-red-300">{{ error }}</p>
              </div>
            </div>
          </div>
        </DaisyForm>
      </DaisyCard>
      
      <!-- Reset Password Modal -->
      <div v-if="showResetPassword" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <DaisyCard padding="lg" class="max-w-md w-full animate-fade-in">
          <div class="text-center mb-6">
            <div class="glass-icon-container w-12 h-12 mx-auto mb-3">
              <Icon name="lucide:mail" class="w-6 h-6 text-primary-400" />
            </div>
            <h3 class="text-lg font-semibold text-glass mb-2">
              Restablecer Contraseña
            </h3>
            <p class="text-sm text-glass-secondary">
              Te enviaremos un enlace para restablecer tu contraseña
            </p>
          </div>
          
          <DaisyForm 
            :loading="resetLoading"
            @submit="handleResetPassword"
          >
            <DaisyInput
              v-model="resetEmail"
              type="email"
              label="Email"
              placeholder="tu@email.com"
              left-icon="lucide:mail"
              required
              :error="resetEmailError"
            />
            
            <div class="flex gap-3">
              <DaisyButton
                type="button"
                variant="secondary"
                full-width
                @click="cancelReset"
                :disabled="resetLoading"
              >
                Cancelar
              </DaisyButton>
              <DaisyButton
                type="submit"
                :loading="resetLoading"
                full-width
              >
                Enviar Enlace
              </DaisyButton>
            </div>
          </DaisyForm>
        </DaisyCard>
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

// Form state
const form = reactive({
  email: '',
  password: ''
})

const resetEmail = ref('')
const loading = ref(false)
const resetLoading = ref(false)
const error = ref('')
const showResetPassword = ref(false)
const resetEmailError = ref('')

// Form validation
const fieldErrors = reactive({
  email: '',
  password: ''
})

const isFormValid = computed(() => {
  return form.email && 
         form.password && 
         !fieldErrors.email && 
         !fieldErrors.password
})

// Form validation methods
const validateEmail = () => {
  if (!form.email) {
    fieldErrors.email = ''
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    fieldErrors.email = 'Ingresa un email válido'
  } else {
    fieldErrors.email = ''
  }
}

const validatePassword = () => {
  if (!form.password) {
    fieldErrors.password = ''
    return
  }
  
  if (form.password.length < 6) {
    fieldErrors.password = 'La contraseña debe tener al menos 6 caracteres'
  } else {
    fieldErrors.password = ''
  }
}

// Form handlers
const handleLogin = async (event: Event, formData: FormData) => {
  loading.value = true
  error.value = ''
  
  // Final validation
  validateEmail()
  validatePassword()
  
  if (!isFormValid.value) {
    loading.value = false
    return
  }

  try {
    await signIn(form.email.trim(), form.password)
    
    // Success - redirect with delay for smooth UX
    await new Promise(resolve => setTimeout(resolve, 500))
    await navigateTo('/')
    
  } catch (err: any) {
    console.error('Login error:', err)
    error.value = err.message || 'Error al iniciar sesión. Verifica tus credenciales.'
    
    // Auto-clear error after 5 seconds
    setTimeout(() => {
      error.value = ''
    }, 5000)
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async (event: Event, formData: FormData) => {
  resetLoading.value = true
  resetEmailError.value = ''
  
  // Validate reset email
  if (!resetEmail.value) {
    resetEmailError.value = 'Ingresa tu email'
    resetLoading.value = false
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(resetEmail.value)) {
    resetEmailError.value = 'Ingresa un email válido'
    resetLoading.value = false
    return
  }

  try {
    await resetPassword(resetEmail.value)
    
    // Success - close modal and show success message
    showResetPassword.value = false
    resetEmail.value = ''
    
    // Show success notification (you could replace with a toast)
    alert('Se ha enviado un enlace de restablecimiento a tu email')
    
  } catch (err: any) {
    resetEmailError.value = err.message || 'Error al enviar el enlace'
  } finally {
    resetLoading.value = false
  }
}

const cancelReset = () => {
  showResetPassword.value = false
  resetEmail.value = ''
  resetEmailError.value = ''
}

// Clear errors when form values change
watch(() => form.email, () => {
  if (fieldErrors.email) validateEmail()
})

watch(() => form.password, () => {
  if (fieldErrors.password) validatePassword()
})

// SEO
useSeoMeta({
  title: 'Iniciar Sesión - Inaplast',
  description: 'Accede a tu cuenta de Inaplast para gestionar pedidos y clientes con nuestro sistema minimalista y eficiente.'
})
</script>

<style scoped>
/* Custom transitions for smooth UX */
.error-shake-enter-active {
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}

/* Modal backdrop blur enhancement */
.modal-backdrop {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>