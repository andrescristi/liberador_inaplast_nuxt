<template>
  <div class="min-h-screen bg-gray-50">
    <AppNavigation />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Products</h1>
          <p class="mt-2 text-gray-600">
            Manage your product inventory
          </p>
        </div>
        <UButton 
          icon="i-heroicons-plus"
          size="lg" 
          @click="navigateTo('/products/new')"
        >
          Add Product
        </UButton>
      </div>

      <!-- Products Content -->
      <UCard>
        <div class="text-center py-12">
          <div class="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-cube" class="w-8 h-8 text-purple-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Product Management</h3>
          <p class="text-gray-600 mb-6">This page will contain the full product management interface</p>
          <div class="space-y-3">
            <p class="text-sm text-gray-500">Features coming soon:</p>
            <ul class="text-sm text-gray-500 space-y-1">
              <li>• Product catalog with search and filters</li>
              <li>• Inventory tracking and management</li>
              <li>• Product pricing and specifications</li>
              <li>• Stock alerts and reorder points</li>
            </ul>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppNavigation from '~/components/core/AppNavigation.vue'

definePageMeta({
  middleware: 'auth'
})

useSeoMeta({
  title: 'Products - Inaplast',
  description: 'Manage your product inventory and catalog.'
})
</script>