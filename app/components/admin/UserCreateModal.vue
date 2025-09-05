<template>
  <BaseModal
    :show="true"
    size="md"
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
            v-model="form.first_name"
            type="text"
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
            type="text"
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
        <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
        <div class="relative">
          <BaseInput
            v-model="form.password"
            type="password"
            placeholder="Contraseña temporal"
            :error="hasFieldError('password')"
            @blur="validateField('password')"
          />
          <button
            type="button"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
            @click="generatePassword"
          >
            Generar
          </button>
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
          v-model="form.user_role"
          class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
          :class="{
            'border-red-300 focus:ring-red-500 focus:border-red-500': hasFieldError('user_role'),
            'border-gray-300': !hasFieldError('user_role')
          }"
          @change="validateField('user_role')"
        >
          <option value="">Selecciona un rol</option>
          <option value="Admin">Administrador</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Inspector">Inspector</option>
        </select>
        <p v-if="getFieldError('user_role')" class="mt-1 text-sm text-red-600">{{ getFieldError('user_role') }}</p>
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
  // resetForm
} = useModalForm<CreateUserForm>({
  schema: createUserSchema,
  initialData: {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    user_role: 'Inspector' // Valor por defecto
  },
  onSubmit: createUser,
  onSuccess: () => {
    emit('created')
  }
})

// Métodos
async function createUser(data: CreateUserForm) {
  await $fetch('/api/admin/users', {
    method: 'POST',
    body: {
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
      user_role: data.user_role
    }
  })
}

// Generar contraseña segura
const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  
  // Asegurar al menos un caracter de cada tipo
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(Math.random() * 26)) // Mayúscula
  password += 'abcdefghijklmnopqrstuvwxyz'.charAt(Math.floor(Math.random() * 26)) // Minúscula  
  password += '0123456789'.charAt(Math.floor(Math.random() * 10)) // Número
  password += '!@#$%^&*'.charAt(Math.floor(Math.random() * 8)) // Especial
  
  // Completar hasta 12 caracteres
  for (let i = 4; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  // Mezclar caracteres
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
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  
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