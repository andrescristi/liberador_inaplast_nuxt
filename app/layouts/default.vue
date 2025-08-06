<template>
  <div class="min-h-screen bg-gray-50">
    

    <!-- Main Content with Mobile-First Padding -->
    <main class="px-4 py-6 sm:px-6 lg:px-8">
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