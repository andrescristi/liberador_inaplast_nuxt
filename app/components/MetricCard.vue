<template>
  <Card :hover="clickable" @click="handleClick">
    <div class="flex items-center">
      <div :class="iconClasses" class="flex-shrink-0">
        <Icon :name="icon" class="w-6 h-6" />
      </div>
      <div class="ml-4 flex-1">
        <p class="text-sm font-medium text-slate-600">{{ title }}</p>
        <p class="text-2xl font-bold text-slate-900">{{ value }}</p>
        <div v-if="trend" class="flex items-center mt-1">
          <Icon 
            :name="trend.direction === 'up' ? 'lucide:trending-up' : 'lucide:trending-down'" 
            :class="trendIconClasses"
            class="w-4 h-4 mr-1"
          />
          <span :class="trendTextClasses" class="text-sm font-medium">
            {{ trend.value }}% from last month
          </span>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
interface Trend {
  value: number
  direction: 'up' | 'down'
}

interface Props {
  title: string
  value: string | number
  icon: string
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  trend?: Trend
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  clickable: false
})

const emit = defineEmits<{
  click: []
}>()

const iconClasses = computed(() => {
  const baseClasses = 'w-12 h-12 rounded-lg flex items-center justify-center'
  
  const colors = {
    primary: 'bg-blue-100 text-blue-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-amber-100 text-amber-600',
    error: 'bg-red-100 text-red-600',
    info: 'bg-indigo-100 text-indigo-600'
  }
  
  return [baseClasses, colors[props.color]].join(' ')
})

const trendIconClasses = computed(() => {
  return props.trend?.direction === 'up' ? 'text-green-500' : 'text-red-500'
})

const trendTextClasses = computed(() => {
  return props.trend?.direction === 'up' ? 'text-green-600' : 'text-red-600'
})

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>