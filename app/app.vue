<template>
  <div>
    <NuxtLayout>
      <!-- Solo mostrar navegación si no es layout de auth -->
      <CoreAppNavigation v-if="!isAuthLayout" />
      <NuxtPage />
    </NuxtLayout>

    <!-- Contenedor de notificaciones toast -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
// Detectar si estamos en layout de autenticación
const route = useRoute()
const isAuthLayout = computed(() => {
  // Verificar si la página usa layout 'auth'
  return route.meta.layout === 'auth'
})
</script>