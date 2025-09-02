<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
    <ClientOnly>
      <slot />
      <template #fallback>
        <div class="min-h-screen flex items-center justify-center">
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
              <Icon name="bx:bxs-factory" class="w-8 h-8 text-white" />
            </div>
            <p class="text-gray-600">Cargando...</p>
          </div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
// Layout específico para páginas de autenticación
// Sin navegación principal para evitar distracciones
// Envolvemos en ClientOnly para evitar problemas de hidratación con Supabase
</script>