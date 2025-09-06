<template>
  <OrderWizard />
</template>

<script setup lang="ts">
// Meta and middleware
definePageMeta({
  middleware: ['auth']
})

// Head management
useHead({
  title: 'Nuevo Liberador - Inaplast',
  meta: [
    { name: 'description', content: 'Crear un nuevo liberador de producto en el sistema Inaplast' }
  ]
})
</script>