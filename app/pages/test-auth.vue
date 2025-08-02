<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Authentication Debug</h1>
    
    <div class="bg-gray-100 p-4 rounded mb-4">
      <h2 class="font-bold mb-2">Environment Variables:</h2>
      <p><strong>SUPABASE_URL:</strong> {{ config.public.supabase.url }}</p>
      <p><strong>SUPABASE_KEY:</strong> {{ config.public.supabase.key?.substring(0, 20) }}...</p>
    </div>

    <div class="bg-gray-100 p-4 rounded mb-4">
      <h2 class="font-bold mb-2">Supabase Client Status:</h2>
      <p><strong>Client exists:</strong> {{ !!supabase }}</p>
      <p><strong>Current user:</strong> {{ user ? user.email : 'None' }}</p>
    </div>

    <div class="bg-gray-100 p-4 rounded mb-4">
      <h2 class="font-bold mb-2">Test Login:</h2>
      <form @submit.prevent="testLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium">Email:</label>
          <input 
            v-model="testEmail" 
            type="email" 
            required 
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label class="block text-sm font-medium">Password:</label>
          <input 
            v-model="testPassword" 
            type="password" 
            required 
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <button 
          type="submit" 
          :disabled="loading"
          class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {{ loading ? 'Testing...' : 'Test Login' }}
        </button>
      </form>
    </div>

    <div v-if="result" class="bg-gray-100 p-4 rounded">
      <h2 class="font-bold mb-2">Result:</h2>
      <pre class="text-sm">{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  auth: false
})

const config = useRuntimeConfig()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const testEmail = ref('')
const testPassword = ref('')
const loading = ref(false)
const result = ref(null)

const testLogin = async () => {
  loading.value = true
  result.value = null

  try {
    console.log('Testing login with:', testEmail.value)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail.value,
      password: testPassword.value
    })

    result.value = {
      success: !error,
      data: data ? {
        user: data.user ? { id: data.user.id, email: data.user.email } : null,
        session: data.session ? { access_token: data.session.access_token?.substring(0, 20) + '...' } : null
      } : null,
      error: error ? { message: error.message, code: error.status } : null
    }

    console.log('Test result:', result.value)
  } catch (err) {
    console.error('Test error:', err)
    result.value = {
      success: false,
      error: { message: err.message }
    }
  } finally {
    loading.value = false
  }
}
</script>