<template>
  <!-- Modal Backdrop -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <!-- Modal Container -->
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-6">
          Crear Nuevo Usuario
        </h3>

        <form class="space-y-4" @submit.prevent="createUser">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                v-model="form.first_name"
                type="text"
                placeholder="Ingresa el nombre"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-300': errors.first_name }"
              >
              <p v-if="errors.first_name" class="mt-1 text-sm text-red-600">{{ errors.first_name }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                v-model="form.last_name"
                type="text"
                placeholder="Ingresa el apellido"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-300': errors.last_name }"
              >
              <p v-if="errors.last_name" class="mt-1 text-sm text-red-600">{{ errors.last_name }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="usuario@ejemplo.com"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-300': errors.email }"
            >
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Contraseña temporal"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-300': errors.password }"
            >
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select
              v-model="form.user_role"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-300': errors.user_role }"
              required
            >
              <option value="">Selecciona un rol</option>
              <option value="Admin">Administrador</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Inspector">Inspector</option>
            </select>
            <p v-if="errors.user_role" class="mt-1 text-sm text-red-600">{{ errors.user_role }}</p>
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

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="$emit('close')"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <svg
                v-if="loading"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
                fill="none"
                viewBox="0 0 24 24"
              >
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
              {{ loading ? 'Creando...' : 'Crear Usuario' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProfileRole } from '~/types'

const emit = defineEmits<{
  close: []
  created: []
}>()

const userAdmin = useAdminUserManager()
const toast = useToast()

// Form data
const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  user_role: '' as ProfileRole | ''
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

  if (!form.value.password.trim()) {
    errors.value.password = 'La contraseña es requerida'
  } else if (form.value.password.length < 8) {
    errors.value.password = 'La contraseña debe tener al menos 8 caracteres'
  }

  if (!form.value.user_role) {
    errors.value.user_role = 'El rol es requerido'
  }

  return Object.keys(errors.value).length === 0
}

// Methods
const createUser = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    await userAdmin.createUser(
      form.value.email,
      form.value.password,
      {
        first_name: form.value.first_name,
        last_name: form.value.last_name,
        user_role: form.value.user_role as ProfileRole
      }
    )

    emit('created')
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al crear el usuario'
    toast.error('Error', errorMessage)
  } finally {
    loading.value = false
  }
}

// Generate secure password suggestion
const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  form.value.password = password
}

onMounted(() => {
  // Auto-generate a secure password
  generatePassword()
})
</script>