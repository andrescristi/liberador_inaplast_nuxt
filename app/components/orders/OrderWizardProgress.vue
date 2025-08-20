<template>
  <div class="mb-8">
    <div class="bg-gray-200 rounded-full h-3">
      <div 
        class="bg-indigo-600 h-3 rounded-full transition-all duration-300" 
        :style="`width: ${(currentStep / totalSteps) * 100}%`"
      />
    </div>
    <div class="flex justify-between text-sm text-gray-600 mt-2">
      <span 
        v-for="(step, index) in steps" 
        :key="index"
        :class="currentStep >= (index + 1) ? 'font-medium text-indigo-600' : ''"
      >
        {{ step }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentStep: number
  totalSteps: number
  steps: string[]
}

defineProps<Props>()
</script>