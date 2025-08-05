<template>
  <div class="min-h-screen bg-gray-50">
    <AppNavigation />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Orders</h1>
          <p class="mt-2 text-gray-600">
            Manage and track all your orders
          </p>
        </div>
        <UButton 
          icon="i-heroicons-plus"
          size="lg"
          @click="navigateTo('/orders/new')"
        >
          New Order
        </UButton>
      </div>

      <!-- Orders Content -->
      <UCard>
        <div class="text-center py-12">
          <div class="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-shopping-cart" class="w-8 h-8 text-indigo-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Orders Management</h3>
          <p class="text-gray-600 mb-6">This page will contain the full orders management interface</p>
          <div class="space-y-3">
            <p class="text-sm text-gray-500">Features coming soon:</p>
            <ul class="text-sm text-gray-500 space-y-1">
              <li>• Order listing with search and filters</li>
              <li>• Order status tracking</li>
              <li>• Order details and editing</li>
              <li>• Order fulfillment workflow</li>
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
  title: 'Orders - Inaplast',
  description: 'Manage and track all your orders with our comprehensive order management system.'
})
</script>