<template>
  <div>
    <CoreAppNavigation v-if="user" />
    <NuxtLayout>
      
      <NuxtPage />
    </NuxtLayout>
    <UiToastContainer />
  </div>
</template>

<script setup lang="ts">
// Import global styles if needed
const user = useSupabaseUser()
</script>