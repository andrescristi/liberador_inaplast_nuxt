<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <UiBaseCard class="backdrop-blur-sm shadow-xl">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Icon name="bx:bxs-factory" class="w-8 h-8 text-white" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Iniciar Sesión
          </h1>
          <p class="text-gray-600">
            Accede a tu cuenta de Inaplast
          </p>
        </div>
        
        <!-- Login Form -->
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <UiBaseInput
              id="email"
              v-model="formState.email"
              type="email"
              placeholder="tu@email.com"
              leading-icon="bx:envelope"
              size="lg"
              :disabled="loading"
              autocomplete="email"
              :error="!!emailError"
            />
            <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <UiBaseInput
              id="password"
              v-model="formState.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Ingresa tu contraseña"
              size="lg"
              :disabled="loading"
              autocomplete="current-password"
              :error="!!passwordError"
            >
              <template #trailing>
                <button
                  v-show="formState.password !== ''"
                  type="button"
                  class="text-gray-400 hover:text-gray-500"
                  @click="showPassword = !showPassword"
                >
                  <Icon :name="showPassword ? 'bx:hide' : 'bx:show'" class="h-5 w-5" />
                </button>
              </template>
            </UiBaseInput>
            <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
          </div>
          
          <!-- Forgot Password -->
          <div class="flex justify-end">
            <UiBaseButton
              variant="link"
              color="primary"
              size="sm"
              :disabled="loading"
              @click="showResetPassword = true"
            >
              ¿Olvidaste tu contraseña?
            </UiBaseButton>
          </div>
          
          <!-- Submit Button -->
          <UiBaseButton
            type="submit"
            block
            size="lg"
            :loading="loading"
            :disabled="!isFormValid"
            class="font-medium"
            :leading-icon="!loading ? 'bx:log-in' : undefined"
          >
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </UiBaseButton>
          
          <!-- Authentication Error -->
          <UiBaseAlert
            v-if="error"
            variant="error"
            title="Error de autenticación"
            :description="error"
            closable
            @close="error = ''"
          />
        </form>
      </UiBaseCard>
      
      <!-- Reset Password Modal -->
      <UiBaseModal :show="showResetPassword" @close="cancelReset">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Icon name="bx:envelope" class="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  Restablecer Contraseña
                </h3>
                <p class="text-sm text-gray-500">
                  Te enviaremos un enlace para restablecer tu contraseña
                </p>
              </div>
            </div>
            <UiBaseButton
              variant="ghost"
              color="gray"
              leading-icon="bx:x"
              @click="cancelReset"
            />
          </div>
        </template>
        
        <form class="space-y-4" @submit.prevent="handleResetPassword">
          <div>
            <label for="reset-email" class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <UiBaseInput
              id="reset-email"
              v-model="resetState.email"
              type="email"
              placeholder="tu@email.com"
              leading-icon="bx:envelope"
              size="lg"
              :disabled="resetLoading"
              :error="!!resetEmailError"
            />
            <p v-if="resetEmailError" class="mt-1 text-sm text-red-600">{{ resetEmailError }}</p>
          </div>
          
          <div class="flex gap-3 pt-4">
            <UiBaseButton
              variant="outline"
              block
              :disabled="resetLoading"
              @click="cancelReset"
            >
              Cancelar
            </UiBaseButton>
            <UiBaseButton
              type="submit"
              block
              :loading="resetLoading"
            >
              Enviar Enlace
            </UiBaseButton>
          </div>
        </form>
      </UiBaseModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

// Usar nuxt-auth-utils
const { loggedIn, user, session, fetch: fetchSession, clear } = useUserSession()
const toast = useToast()

// Usar layout de autenticación sin navegación
definePageMeta({
  layout: 'auth',
  auth: false
})

// Form schemas
const loginSchema = z.object({
  email: z.string().email('Ingresa un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

const resetSchema = z.object({
  email: z.string().email('Ingresa un email válido')
})

// Form state
const formState = reactive({
  email: '',
  password: ''
})

const resetState = reactive({
  email: ''
})

// Component state
const loading = ref(false)
const resetLoading = ref(false)
const error = ref('')
const showResetPassword = ref(false)
const showPassword = ref(false)

// Validation errors
const emailError = ref('')
const passwordError = ref('')
const resetEmailError = ref('')

// Enhanced form validation
const isFormValid = computed(() => {
  try {
    const emailValid = formState.email && 
                      formState.email.includes('@') && 
                      formState.email.includes('.') && 
                      formState.email.length > 5
    const passwordValid = formState.password && 
                         formState.password.length >= 6
    return emailValid && passwordValid
  } catch (error) {
    console.warn('[Login] Form validation error:', error)
    return false
  }
})

// Validation
const validateForm = () => {
  emailError.value = ''
  passwordError.value = ''
  
  try {
    loginSchema.parse(formState)
    return true
  } catch (err: unknown) {
    const zodError = err as { errors?: Array<{ path: string[]; message: string }> }
    zodError.errors?.forEach((error) => {
      if (error.path[0] === 'email') {
        emailError.value = error.message
      } else if (error.path[0] === 'password') {
        passwordError.value = error.message
      }
    })
    return false
  }
}

const validateResetForm = () => {
  resetEmailError.value = ''
  
  try {
    resetSchema.parse(resetState)
    return true
  } catch (err: unknown) {
    const zodError = err as { errors?: Array<{ path: string[]; message: string }> }
    zodError.errors?.forEach((error) => {
      if (error.path[0] === 'email') {
        resetEmailError.value = error.message
      }
    })
    return false
  }
}

// Nuevo handler con nuxt-auth-utils
const handleLogin = async () => {
  console.log('handleLogin called!')
  console.log('Form state:', formState)
  
  if (!validateForm()) {
    console.log('Form validation failed')
    return
  }
  
  loading.value = true
  error.value = ''
  console.log('Starting login process...')

  try {
    // Usar el endpoint personalizado de credenciales
    const response = await $fetch('/api/auth/credentials', {
      method: 'POST',
      body: {
        email: formState.email.trim(),
        password: formState.password
      }
    })
    
    console.log('[Login] Response:', response)
    
    // Refrescar sesión para obtener datos actualizados
    await fetchSession()
    
    // Success toast
    toast.success('¡Bienvenido!', 'Has iniciado sesión correctamente')
    
    console.log('[Login] Iniciando navegación al dashboard...')
    
    // Navegación simple - nuxt-auth-utils maneja el estado automáticamente
    await navigateTo('/', { replace: true })
    console.log('[Login] Navegación exitosa')
    
  } catch (err: unknown) {
    console.error('Login error:', err)
    const errorObj = err as { data?: { statusMessage?: string }, statusMessage?: string }
    error.value = errorObj?.data?.statusMessage || errorObj?.statusMessage || 'Error al iniciar sesión. Verifica tus credenciales.'
    
    // Auto-clear error after 5 seconds
    setTimeout(() => {
      error.value = ''
    }, 5000)
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  if (!validateResetForm()) return
  
  resetLoading.value = true

  try {
    // TODO: Implementar reset password con nuxt-auth-utils cuando sea necesario
    toast.info('Función en desarrollo', 'El restablecimiento de contraseña se implementará próximamente')
    
    showResetPassword.value = false
    resetState.email = ''
    
  } catch (err: unknown) {
    toast.error('Error', (err as { message?: string }).message || 'Error al enviar el enlace')
  } finally {
    resetLoading.value = false
  }
}

const cancelReset = () => {
  showResetPassword.value = false
  Object.assign(resetState, { email: '' })
  resetEmailError.value = ''
}

// No se necesita inicialización manual

// SEO
useSeoMeta({
  title: 'Iniciar Sesión - Inaplast',
  description: 'Accede a tu cuenta de Inaplast para gestionar pedidos y clientes con nuestro sistema moderno y eficiente.'
})
</script>