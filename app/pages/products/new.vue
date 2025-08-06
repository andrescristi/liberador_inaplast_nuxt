<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="flex items-center space-x-4 mb-8">
      <Button
variant="ghost"
size="sm"
@click="navigateTo('/products')">
        <Icon name="lucide:arrow-left" class="w-4 h-4 mr-2" />
        Back to Products
      </Button>
    </div>

    <!-- Product Form -->
    <ProductForm />
  </div>
</template>

<script setup lang="ts">
// SEO
useSeoMeta({
  title: 'Add New Product - Order Management',
  description: 'Add a new product to your inventory with pricing and stock information.'
})
</script>