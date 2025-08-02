<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="flex items-center space-x-4 mb-8">
      <Button variant="ghost" size="sm" @click="navigateTo('/orders')">
        <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
        Back to Orders
      </Button>
    </div>

    <!-- Order Form -->
    <OrderForm />
  </div>
</template>

<script setup lang="ts">
// SEO
useSeoMeta({
  title: 'Create New Order - Order Management',
  description: 'Create a new order for a customer with product selection and quantity management.'
})
</script>