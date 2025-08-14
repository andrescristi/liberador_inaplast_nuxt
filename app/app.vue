<template>
  <div>
    <CoreAppNavigation v-if="user && !isAuthRoute" />
    <NuxtLayout>
      
      <NuxtPage />
    </NuxtLayout>
    <UiToastContainer />
  </div>
</template>

<script setup lang="ts">
// Import global styles if needed
const user = useSupabaseUser()
const route = useRoute()

// Check if current route is an auth route
const isAuthRoute = computed(() => {
  return route.path.startsWith('/auth')
})
</script>