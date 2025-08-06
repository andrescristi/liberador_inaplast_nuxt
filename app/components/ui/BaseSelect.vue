<template>
  <Listbox v-model="internalValue" :disabled="disabled">
    <div class="relative">
      <ListboxButton
        class="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm touch-manipulation"
        :class="[
          disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : '',
          error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '',
          sizeClasses
        ]"
      >
        <span class="flex items-center">
          <span
            class="block truncate"
            :class="!internalValue ? 'text-gray-500' : ''"
          >
            {{ selectedLabel || placeholder }}
          </span>
        </span>
        <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-for="option in options"
            :key="option.value"
            v-slot="{ active, selected }"
            :value="option.value"
            :disabled="option.disabled"
            as="template"
          >
            <li
              :class="[
                active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                'relative cursor-default select-none py-2 pl-3 pr-9 touch-manipulation',
                option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              ]"
            >
              <div class="flex items-center">
                <span
                  :class="[
                    selected ? 'font-semibold' : 'font-normal',
                    'block truncate'
                  ]"
                >
                  {{ option.label }}
                </span>
              </div>

              <span
                v-if="selected"
                :class="[
                  active ? 'text-white' : 'text-indigo-600',
                  'absolute inset-y-0 right-0 flex items-center pr-4'
                ]"
              >
                <CheckIcon class="h-5 w-5" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue: string | number | null
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  error?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Selecciona una opción',
  disabled: false,
  error: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

const internalValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectedLabel = computed(() => {
  if (!props.modelValue) return ''
  const option = props.options.find(opt => opt.value === props.modelValue)
  return option?.label || ''
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'text-sm py-1.5 min-h-[36px]',
    md: 'text-sm py-2 min-h-[44px]',
    lg: 'text-base py-3 min-h-[48px]'
  }
  return sizes[props.size]
})
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
  }
}
</style>