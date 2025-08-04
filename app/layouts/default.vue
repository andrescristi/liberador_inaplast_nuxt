<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Simple Header -->
    <AppNavigation />

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>