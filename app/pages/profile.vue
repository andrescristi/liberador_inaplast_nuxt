<template>
  <div>
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Profile</h1>
        <p class="mt-2 text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div class="bg-white shadow rounded-lg">
        <div class="text-center py-12">
          <div class="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Icon name="bx:user-circle" class="w-8 h-8 text-indigo-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Profile Settings</h3>
          <p class="text-gray-600 mb-6">This page will contain user profile management</p>
          <p class="text-sm text-gray-500">User: {{ user?.email || 'Loading...' }}</p>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
// Icons are now provided by @nuxt/icon

const user = useSupabaseUser()

definePageMeta({
  middleware: 'auth'
})

useSeoMeta({
  title: 'Profile - Inaplast',
  description: 'Manage your account settings and preferences.'
})
</script>