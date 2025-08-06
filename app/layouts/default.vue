<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <AppNavigation />

    <!-- Main Content with Mobile-First Padding -->
    <main class="px-3 py-4 sm:px-4 sm:py-6 lg:px-8 pb-20 md:pb-6">
      <!-- Mobile-optimized container -->
      <div class="max-w-7xl mx-auto">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>