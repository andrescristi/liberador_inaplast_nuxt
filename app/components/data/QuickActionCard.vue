<template>
  <Card hover @click="$emit('click')">
    <div class="text-center py-6">
      <div :class="iconClasses" class="mx-auto mb-4">
        <Icon :name="icon" class="w-8 h-8" />
      </div>
      <h3 class="text-lg font-semibold text-slate-900 mb-2">{{ title }}</h3>
      <p class="text-sm text-slate-600 mb-4">{{ description }}</p>
      <Button size="sm" :variant="buttonVariant">
        Get Started
        <Icon name="lucide:arrow-right" class="w-4 h-4 ml-2" />
      </Button>
    </div>
  </Card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  icon: string
  color?: 'primary' | 'secondary' | 'accent'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary'
})

defineEmits<{
  click: []
}>()

const iconClasses = computed(() => {
  const baseClasses = 'w-16 h-16 rounded-full flex items-center justify-center'
  
  const colors = {
    primary: 'bg-blue-100 text-blue-600',
    secondary: 'bg-teal-100 text-teal-600',
    accent: 'bg-purple-100 text-purple-600'
  }
  
  return [baseClasses, colors[props.color]].join(' ')
})

const buttonVariant = computed(() => {
  const variants = {
    primary: 'primary',
    secondary: 'secondary',
    accent: 'primary'
  }
  
  return variants[props.color] as 'primary' | 'secondary'
})
</script>