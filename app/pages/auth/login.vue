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
            :disabled="!isFormValid || !isClientReady || !!initializationError"
            class="font-medium"
            :leading-icon="!loading ? 'bx:log-in' : undefined"
          >
            {{ 
              initializationError ? 'Sistema no disponible' :
              loading ? 'Iniciando sesión...' : 
              !isClientReady ? 'Cargando...' :
              'Iniciar Sesión' 
            }}
          </UiBaseButton>
          
          <!-- Initialization Error -->
          <UiBaseAlert
            v-if="initializationError"
            variant="error"
            title="Error de inicialización"
            :description="initializationError + '. Recarga la página para continuar.'"
            :closable="false"
          />
          
          <!-- Authentication Error -->
          <UiBaseAlert
            v-else-if="error"
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
import { useAuth } from '~/composables/auth'
import { useToast } from '~/composables/ui'
import { useAuthState } from '~/composables/auth/useAuthState'

// Defensive composable initialization
let auth: ReturnType<typeof useAuth> | null = null
let toast: ReturnType<typeof useToast> | null = null
let authState: ReturnType<typeof useAuthState> | null = null

// Client readiness tracking
const isClientReady = ref(false)
const initializationError = ref('')

// Improved initialization with retry mechanism
const initializeComposables = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      // Wait for proper DOM and Vue readiness
      await nextTick()
      
      // Verify Nuxt app is ready
      const nuxtApp = useNuxtApp()
      if (!nuxtApp.$supabase) {
        throw new Error('Supabase not initialized')
      }
      
      // Initialize composables
      auth = useAuth()
      toast = useToast()
      authState = useAuthState()
      
      // Verify they're working
      if (!auth || !toast || !authState) {
        throw new Error('Composables failed to initialize')
      }
      
      isClientReady.value = true
      initializationError.value = ''
      console.log('[Login] Composables initialized successfully')
      return
      
    } catch (error) {
      console.warn(`[Login] Initialization attempt ${i + 1} failed:`, error)
      
      if (i === retries - 1) {
        initializationError.value = `Initialization failed after ${retries} attempts`
        isClientReady.value = false
      } else {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)))
      }
    }
  }
}

// Client-side initialization
if (import.meta.client) {
  onMounted(() => {
    initializeComposables()
  })
}

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
  // Prevent computation during SSR or if not ready
  if (import.meta.server || !isClientReady.value || initializationError.value) {
    return false
  }
  
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

// Enhanced form handlers with better error recovery
const handleLogin = async () => {
  // Prevent execution during SSR
  if (import.meta.server) {
    console.warn('[Login] Attempted during SSR - ignored')
    return
  }
  
  // Check if initialization failed
  if (initializationError.value) {
    error.value = 'Sistema no inicializado correctamente. Recarga la página.'
    return
  }
  
  // Wait for client readiness or try to re-initialize
  if (!isClientReady.value || !auth || !toast || !authState) {
    console.warn('[Login] Composables not ready, attempting re-initialization')
    loading.value = true
    
    try {
      await initializeComposables(1) // Single retry
      if (!auth || !toast || !authState) {
        throw new Error('Re-initialization failed')
      }
    } catch {
      error.value = 'Error de inicialización. Recarga la página.'
      loading.value = false
      return
    }
    
    loading.value = false
  }
  
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
    const _result = await auth.signIn(formState.email.trim(), formState.password)
    
    // Success toast
    toast.success('¡Bienvenido!', 'Has iniciado sesión correctamente')
    
    // IMPORTANTE: Actualizar el estado de autenticación después del login exitoso
    console.log('[Login] Actualizando estado de autenticación después del login...')
    try {
      await authState.fetchUser(true) // Forzar refresh del estado
      console.log('[Login] Estado de autenticación actualizado correctamente')
    } catch (authError) {
      console.warn('[Login] Error actualizando estado de autenticación:', authError)
      // No fallar el login por esto, pero sí loggearlo
    }
    
    // Navegación robusta post-login con múltiples métodos de fallback
    console.log('[Login] Iniciando navegación al dashboard...')
    
    // Pequeño delay para permitir que el estado se actualice completamente
    await new Promise(resolve => setTimeout(resolve, 300))
    
    try {
      // Método 1: Usar navigateTo de Nuxt (preferido)
      await navigateTo('/', { 
        replace: true,
        external: false 
      })
      console.log('[Login] Navegación exitosa con navigateTo')
    } catch (navError) {
      console.warn('[Login] navigateTo falló, usando fallback:', navError)
      
      // Método 2: Fallback usando window.location (para SSR: false)
      if (typeof window !== 'undefined') {
        window.location.replace('/')
        console.log('[Login] Navegación exitosa con window.location.replace')
      } else {
        console.error('[Login] No se pudo navegar - entorno no soportado')
      }
    }
    
  } catch (err: unknown) {
    console.error('Login error:', err)
    // Handle login error silently or use proper error reporting
    error.value = (err as { message?: string }).message || 'Error al iniciar sesión. Verifica tus credenciales.'
    
    // Auto-clear error after 5 seconds
    setTimeout(() => {
      error.value = ''
    }, 5000)
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  // Prevent execution during SSR
  if (import.meta.server) return
  
  // Check initialization state  
  if (initializationError.value || !isClientReady.value || !auth || !toast) {
    toast?.error?.('Error', 'Sistema no inicializado correctamente')
    return
  }
  
  if (!validateResetForm()) return
  
  resetLoading.value = true

  try {
    await auth.resetPassword(resetState.email)
    
    // Success
    toast.success('Enlace enviado', 'Se ha enviado un enlace de restablecimiento a tu email')
    
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