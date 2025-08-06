<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton :class="buttonClasses">
        <slot name="button">
          <span>Options</span>
          <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" />
        </slot>
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems :class="menuClasses">
        <div
v-for="(section, sectionIndex) in items"
:key="sectionIndex"
class="py-1">
          <template v-for="(item, itemIndex) in section" :key="itemIndex">
            <MenuItem 
              v-if="!item.slot" 
              v-slot="{ active, close }"
              :as="item.to ? 'template' : 'div'"
            >
              <NuxtLink
                v-if="item.to"
                :to="item.to"
                :class="[
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'group flex items-center px-4 py-2 text-sm w-full text-left',
                  item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                ]"
                @click="close"
              >
                <slot
:name="item.key || `item-${sectionIndex}-${itemIndex}`"
:item="item"
:active="active">
                  <component
:is="item.icon"
v-if="item.icon"
class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  {{ item.label }}
                </slot>
              </NuxtLink>
              <button
                v-else
                :class="[
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'group flex items-center px-4 py-2 text-sm w-full text-left',
                  item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                ]"
                :disabled="item.disabled"
                @click="item.click && item.click(); close()"
              >
                <slot
:name="item.key || `item-${sectionIndex}-${itemIndex}`"
:item="item"
:active="active">
                  <component
:is="item.icon"
v-if="item.icon"
class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  {{ item.label }}
                </slot>
              </button>
            </MenuItem>
            <div v-else :class="item.class || 'px-4 py-2'">
              <slot :name="item.slot" :item="item" />
            </div>
          </template>
          <div v-if="sectionIndex < items.length - 1" class="border-t border-gray-100" />
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

interface DropdownItem {
  label?: string
  icon?: object
  to?: string
  click?: () => void
  disabled?: boolean
  slot?: string
  key?: string
  class?: string
}

interface Props {
  items: DropdownItem[][]
  align?: 'left' | 'right'
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  align: 'right',
  width: 'w-56'
})

const buttonClasses = computed(() => {
  return 'inline-flex w-full justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100'
})

const menuClasses = computed(() => {
  const base = 'absolute z-10 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
  
  const alignment = props.align === 'left' ? 'left-0' : 'right-0'
  
  return [base, alignment, props.width].join(' ')
})
</script>