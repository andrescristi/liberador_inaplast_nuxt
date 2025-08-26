<template>
  <TransitionRoot as="template" :show="show">
    <Dialog
as="div"
class="relative z-10"
@close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel :class="panelClasses">
              <div v-if="$slots.header" class="px-6 py-4 border-b border-gray-200">
                <slot name="header" />
              </div>
              
              <div class="px-6 py-4">
                <slot />
              </div>
              
              <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200">
                <slot name="footer" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
/**
 * Componente BaseModal - Modal reutilizable con transiciones suaves y múltiples tamaños
 * 
 * Características principales:
 * - Basado en Headless UI para accesibilidad completa
 * - 5 tamaños predefinidos: sm, md, lg, xl, full
 * - Transiciones CSS optimizadas para entrada/salida
 * - Backdrop con desenfoque (backdrop-blur)
 * - Slots estructurados: header, default, footer
 * - Auto-manejo de foco y escape key
 * - Click fuera del modal para cerrar
 * 
 * @example
 * <BaseModal :show="isModalOpen" size="md" @close="closeModal">
 *   <template #header>
 *     <h3 class="text-lg font-medium">Título del Modal</h3>
 *   </template>
 *   
 *   <p>Contenido principal del modal</p>
 *   
 *   <template #footer>
 *     <div class="flex justify-end space-x-2">
 *       <BaseButton @click="closeModal">Cancelar</BaseButton>
 *       <BaseButton color="primary">Confirmar</BaseButton>
 *     </div>
 *   </template>
 * </BaseModal>
 */
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

/**
 * Props del componente BaseModal
 */
interface Props {
  /** Controla la visibilidad del modal */
  show: boolean
  /** Tamaño del modal que determina el ancho máximo */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

/**
 * Eventos emitidos por el componente BaseModal
 */
interface Emits {
  /** Emitido cuando el modal debe cerrarse (click fuera, escape key, etc.) */
  (e: 'close'): void
}

defineEmits<Emits>()

/**
 * Clases CSS del panel del modal basadas en el tamaño seleccionado
 * Combina estilos base con tamaños responsivos
 * @returns String con clases CSS para el panel del modal
 */
const panelClasses = computed(() => {
  const base = 'relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all'
  
  const sizes = {
    sm: 'sm:my-8 sm:w-full sm:max-w-sm',
    md: 'sm:my-8 sm:w-full sm:max-w-md',
    lg: 'sm:my-8 sm:w-full sm:max-w-lg',
    xl: 'sm:my-8 sm:w-full sm:max-w-xl',
    full: 'sm:my-8 sm:w-full sm:max-w-7xl'
  }
  
  return [base, sizes[props.size]].join(' ')
})
</script>