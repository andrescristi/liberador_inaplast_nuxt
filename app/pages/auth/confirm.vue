<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div v-if="loading" class="space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"/>
          <h2 class="text-2xl font-bold text-gray-900">
            Confirmando...
          </h2>
          <p class="text-gray-600">
            Por favor espera mientras confirmamos tu cuenta.
          </p>
        </div>

        <div v-else-if="error" class="space-y-4">
          <div class="rounded-full h-12 w-12 bg-red-100 flex items-center justify-center mx-auto">
            <Icon name="lucide:x" class="h-6 w-6 text-red-600" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900">
            Error de Confirmación
          </h2>
          <p class="text-gray-600">
            {{ error }}
          </p>
          <Button @click="navigateTo('/auth/login')">
            Volver al Login
          </Button>
        </div>

        <div v-else class="space-y-4">
          <div class="rounded-full h-12 w-12 bg-green-100 flex items-center justify-center mx-auto">
            <Icon name="lucide:check" class="h-6 w-6 text-green-600" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900">
            ¡Confirmación Exitosa!
          </h2>
          <p class="text-gray-600">
            Tu cuenta ha sido confirmada correctamente.
          </p>
          <Button @click="navigateTo('/')">
            Ir al Dashboard
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  auth: false
})

const route = useRoute()
const supabase = useSupabaseClient()

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const { error: authError } = await supabase.auth.exchangeCodeForSession(String(route.query.code))
    
    if (authError) {
      error.value = authError.message
    }
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Error durante la confirmación'
  } finally {
    loading.value = false
  }
})
</script>