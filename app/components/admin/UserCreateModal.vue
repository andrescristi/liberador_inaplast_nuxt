<template>
  <BaseModal
    :show="true"
    size="xl"
    @close="$emit('close')"
  >
    <template #header>
      <h3 class="text-lg font-medium text-gray-900">
        Crear Nuevo Usuario
      </h3>
    </template>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <BaseInput
            v-model="form.firstName"
            type="text"
            placeholder="Ingresa el nombre"
            :error="hasFieldError('firstName')"
            @blur="validateField('firstName')"
          />
          <p v-if="getFieldError('firstName')" class="mt-1 text-sm text-red-600">{{ getFieldError('firstName') }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
          <BaseInput
            v-model="form.lastName"
            type="text"
            placeholder="Ingresa el apellido"
            :error="hasFieldError('lastName')"
            @blur="validateField('lastName')"
          />
          <p v-if="getFieldError('lastName')" class="mt-1 text-sm text-red-600">{{ getFieldError('lastName') }}</p>
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
        <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
        <div class="relative">
          <BaseInput
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Contraseña temporal"
            :error="hasFieldError('password')"
            @blur="validateField('password')"
          />
          <div class="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 z-20">
            <button
              type="button"
              class="p-1 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
              :title="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              @click="showPassword = !showPassword"
            >
              <Icon
                :name="showPassword ? 'bx:bx-hide' : 'bx:bx-show'"
                class="h-4 w-4"
              />
            </button>
            <div class="w-px h-4 bg-gray-300"/>
            <button
              type="button"
              class="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 focus:outline-none transition-colors"
              @click="generatePassword"
            >
              Generar
            </button>
          </div>
        </div>
        <p v-if="getFieldError('password')" class="mt-1 text-sm text-red-600">{{ getFieldError('password') }}</p>
        
        <!-- Indicador de fortaleza de contraseña -->
        <div v-if="form.password" class="mt-2">
          <div class="flex items-center space-x-2">
            <div class="flex-1 bg-gray-200 rounded-full h-1">
              <div 
                class="h-1 rounded-full transition-all duration-300"
                :class="passwordStrengthColor"
                :style="{ width: passwordStrengthPercentage + '%' }"
              />
            </div>
            <span class="text-xs" :class="passwordStrengthColor">{{ passwordStrengthText }}</span>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
        <select
          v-model="form.userRole"
          class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
          :class="{
            'border-red-300 focus:ring-red-500 focus:border-red-500': hasFieldError('userRole'),
            'border-gray-300': !hasFieldError('userRole')
          }"
          @change="validateField('userRole')"
        >
          <option value="">Selecciona un rol</option>
          <option value="Admin">Administrador</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Inspector">Inspector</option>
        </select>
        <p v-if="getFieldError('userRole')" class="mt-1 text-sm text-red-600">{{ getFieldError('userRole') }}</p>
      </div>

      <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
class="h-5 w-5 text-yellow-400"
fill="currentColor"
viewBox="0 0 20 20">
              <path
fill-rule="evenodd"
d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">Información Importante</h3>
            <div class="mt-2 text-sm text-yellow-700">
              <ul class="list-disc pl-5 space-y-1">
                <li>El usuario recibirá un email de confirmación automáticamente</li>
                <li>Deberá cambiar la contraseña temporal en su primer inicio de sesión</li>
                <li>Los permisos se aplicarán según el rol asignado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <BaseButton variant="outline" @click="$emit('close')">
          Cancelar
        </BaseButton>
        <BaseButton 
          type="submit" 
          :disabled="loading || !isFormValid" 
          :loading="loading"
          @click="handleSubmit"
        >
          {{ loading ? 'Creando...' : 'Crear Usuario' }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { createUserSchema, type CreateUserForm } from '~/schemas/admin/user'

// Components are auto-imported by Nuxt

interface ApiError {
  data?: {
    statusMessage?: string
  }
}

const emit = defineEmits<{
  close: []
  created: []
}>()

// Usar composable para formularios con Zod
const {
  form,
  loading,
  // errors,
  isFormValid,
  handleSubmit,
  validateField,
  getFieldError,
  hasFieldError,
  setFieldError,
  // resetForm
} = useModalForm<CreateUserForm>({
  schema: createUserSchema,
  initialData: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userRole: 'Inspector' // Valor por defecto
  },
  onSubmit: createUser,
  onSuccess: () => {
    emit('created')
  },
  onError: (error: Error) => {
    // Manejar errores específicos de validación
    if (error.message === 'DUPLICATE_EMAIL' && error.name === 'ValidationError') {
      setFieldError('email', 'Este email ya está registrado en el sistema')
    }
  }
})

// Métodos
async function createUser(data: CreateUserForm) {
  try {
    await $fetch('/api/admin/users', {
      method: 'POST',
      body: {
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        user_role: data.userRole
      }
    })
  } catch (error: unknown) {
    // Manejar errores específicos
    const apiError = error as ApiError
    if (apiError?.data?.statusMessage) {
      // Verificar si es un error de email duplicado
      if (apiError.data.statusMessage.includes('User already registered') ||
          apiError.data.statusMessage.includes('already been registered') ||
          apiError.data.statusMessage.includes('ya está registrado') ||
          apiError.data.statusMessage.includes('duplicate') ||
          apiError.data.statusMessage.includes('duplicado') ||
          apiError.data.statusMessage.includes('email address has already been')) {
        // Crear un error customizado para email duplicado
        const emailError = new Error('DUPLICATE_EMAIL')
        emailError.name = 'ValidationError'
        throw emailError
      }
      throw new Error(apiError.data.statusMessage)
    }

    // Error genérico
    throw new Error('Error al crear el usuario. Por favor, intenta nuevamente.')
  }
}

// Estado para mostrar/ocultar contraseña
const showPassword = ref(false)

// Generar contraseña segura
const generatePassword = () => {
  // Usar exactamente los mismos caracteres que permite el schema de validación
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const specialChars = '@$!%*?&.#+-' // Mismos caracteres especiales que el regex del schema
  const allChars = uppercase + lowercase + numbers + specialChars

  let password = ''

  // Asegurar al menos un caracter de cada tipo requerido
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length)) // Mayúscula
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length)) // Minúscula
  password += numbers.charAt(Math.floor(Math.random() * numbers.length)) // Número
  password += specialChars.charAt(Math.floor(Math.random() * specialChars.length)) // Especial

  // Completar hasta 12 caracteres con caracteres aleatorios
  for (let i = 4; i < 12; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length))
  }

  // Mezclar caracteres para evitar patrones predecibles
  password = password.split('').sort(() => Math.random() - 0.5).join('')

  form.value.password = password
  validateField('password')
}

// Calcular fortaleza de contraseña
const passwordStrength = computed(() => {
  const password = form.value.password || ''
  let score = 0
  
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[@$!%*?&.#+-]/.test(password)) score += 1
  
  return score
})

const passwordStrengthPercentage = computed(() => {
  return (passwordStrength.value / 6) * 100
})

const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 2) return 'text-red-500 bg-red-500'
  if (strength <= 4) return 'text-yellow-500 bg-yellow-500'
  return 'text-green-500 bg-green-500'
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 2) return 'Débil'
  if (strength <= 4) return 'Media'
  return 'Fuerte'
})

onMounted(() => {
  // Auto-generar contraseña segura al montar
  generatePassword()
})
</script>