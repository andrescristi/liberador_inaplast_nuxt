<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="flex items-center space-x-4 mb-8">
      <Button
variant="ghost"
size="sm"
@click="navigateTo('/customers')">
        <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
        Back to Customers
      </Button>
    </div>

    <!-- Customer Form -->
    <CustomerForm />
  </div>
</template>

<script setup lang="ts">
// SEO
useSeoMeta({
  title: 'Add New Customer - Order Management',
  description: 'Register a new customer with contact information and address details.'
})
</script>