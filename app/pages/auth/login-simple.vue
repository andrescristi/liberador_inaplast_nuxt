<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Login Simple Test
        </h1>
      </div>
      
      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="tu@email.com"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Password"
          />
        </div>
        
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        
        <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// Layout sin navegación
definePageMeta({
  layout: 'auth',
  auth: false
})

// Estado simple sin composables
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

// Función de login simple
const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Test básico - solo mostrar los valores
    console.log('Login attempt:', { email: email.value, password: '***' })
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Test exitoso
    console.log('Login successful')
    await navigateTo('/')
    
  } catch (err: unknown) {
    error.value = (err as { message?: string }).message || 'Login error'
  } finally {
    loading.value = false
  }
}

// SEO
useSeoMeta({
  title: 'Simple Login Test - Inaplast'
})
</script>