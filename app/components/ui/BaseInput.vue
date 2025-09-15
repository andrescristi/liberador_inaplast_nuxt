<template>
  <div class="relative">
    <!-- Focus Ring Animation -->
    <div 
      v-if="isFocused && !props.error" 
      class="input-focus-ring"
    />
    <component
      :is="tag"
      ref="inputElement"
      v-bind="inputAttrs"
      :value="modelValue"
      :class="inputClasses"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    
    <!-- Leading icon -->
    <div v-if="leadingIcon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon :name="leadingIcon" class="h-5 w-5 text-gray-400" />
    </div>
    
    <!-- Trailing icon or button -->
    <div v-if="trailingIcon || $slots.trailing" class="absolute inset-y-0 right-0 pr-3 flex items-center z-20">
      <slot name="trailing">
        <Icon
v-if="trailingIcon"
:name="trailingIcon"
class="h-5 w-5 text-gray-400" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Componente BaseInput - Campo de entrada versátil con soporte para múltiples tipos y estados
 * 
 * Características principales:
 * - Soporte para input y textarea automático
 * - 3 tamaños: sm, md, lg con touch targets optimizados para móvil (44px mínimo)
 * - Estados visuales: normal, error, focus, disabled
 * - Iconos opcionales (leading/trailing) con slots personalizables
 * - Efectos visuales: focus ring animado, success animation
 * - Optimizaciones móviles: inputmode automático, teclado específico
 * - Validaciones numéricas: min, max, step
 * - Animaciones de interacción: scale en focus, success feedback
 * 
 * @example
 * <BaseInput
 *   v-model="email"
 *   type="email"
 *   placeholder="Ingrese su email"
 *   leading-icon="bx:envelope"
 *   :error="emailError"
 *   @blur="validateEmail"
 * />
 * 
 * @example
 * <BaseInput
 *   v-model="description"
 *   type="textarea"
 *   placeholder="Descripción del producto"
 *   :rows="4"
 *   size="lg"
 * />
 */

/**
 * Props del componente BaseInput
 */
interface Props {
  /** Valor del campo vinculado con v-model */
  modelValue?: string | number
  /** Tipo de input HTML o 'textarea' para área de texto */
  type?: string
  /** Texto placeholder mostrado cuando el campo está vacío */
  placeholder?: string
  /** Estado deshabilitado que previene edición */
  disabled?: boolean
  /** Estado de error que aplica estilos de validación fallida */
  error?: boolean
  /** Tamaño del campo que afecta padding y altura mínima */
  size?: 'sm' | 'md' | 'lg'
  /** Icono mostrado al inicio del campo */
  leadingIcon?: string
  /** Icono mostrado al final del campo */
  trailingIcon?: string
  /** Número de filas para textarea */
  rows?: number
  /** Valor mínimo para inputs numéricos */
  min?: string | number
  /** Valor máximo para inputs numéricos */
  max?: string | number
  /** Incremento para inputs numéricos */
  step?: string | number
  /** Optimizaciones específicas para móviles */
  mobileOptimized?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  error: false,
  size: 'md',
  leadingIcon: undefined,
  trailingIcon: undefined,
  rows: undefined,
  min: undefined,
  max: undefined,
  step: undefined,
  mobileOptimized: false
})

// Reactive state
const isFocused = ref(false)
const showSuccessAnimation = ref(false)
const inputElement = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)

/**
 * Eventos emitidos por el componente BaseInput
 */
interface Emits {
  /** Emitido cuando el valor del campo cambia (v-model) */
  (e: 'update:modelValue', value: string | number): void
  /** Emitido cuando el campo recibe o pierde foco */
  (e: 'focus' | 'blur', event: FocusEvent): void
}

const emit = defineEmits<Emits>()
const slots = useSlots()

/**
 * Determina el tag HTML a renderizar (input o textarea)
 * @returns 'textarea' para tipo textarea, 'input' para todos los demás
 */
const tag = computed(() => {
  return props.type === 'textarea' ? 'textarea' : 'input'
})

/**
 * Atributos HTML dinámicos basados en el tipo de input
 * @returns Objeto con atributos específicos del tipo de campo
 */
const inputAttrs = computed(() => {
  const attrs: Record<string, string | number | undefined> = {}
  
  if (props.type !== 'textarea') {
    attrs.type = props.type
  }
  
  if (props.type === 'textarea' && props.rows) {
    attrs.rows = props.rows
  }
  
  if (props.min !== undefined) {
    attrs.min = props.min
  }
  
  if (props.max !== undefined) {
    attrs.max = props.max
  }
  
  if (props.step !== undefined) {
    attrs.step = props.step
  }
  
  return attrs
})

/**
 * Clases CSS del input combinando estilos base, tamaño, estado y iconos
 * @returns String con todas las clases CSS aplicables al elemento input
 */
const inputClasses = computed(() => {
  const base = 'block w-full border-gray-300 rounded-md shadow-sm focus:ring-transparent focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300 touch-manipulation relative z-10 bg-white'
  
  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-3 py-2.5 text-sm min-h-[44px]', // Mobile-friendly 44px touch target
    lg: 'px-4 py-3 text-base min-h-[48px]'
  }
  
  const classes = [base, sizes[props.size]]
  
  if (props.error) {
    classes.push('border-red-300 text-red-900 placeholder-red-300')
  } else if (isFocused.value) {
    classes.push('border-indigo-300 text-gray-900')
  } else {
    classes.push('border-gray-300 text-gray-900')
  }
  
  if (props.leadingIcon) {
    classes.push('pl-10')
  }
  
  if (props.trailingIcon || slots.trailing) {
    classes.push('pr-10')
  }
  
  return classes.join(' ')
})

/**
 * Maneja cambios en el valor del input
 * Emite evento update:modelValue y gestiona animación de éxito
 * @param event - Evento de input nativo
 */
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  
  // Show success animation briefly when user types
  if (target.value && !props.error) {
    showSuccessAnimation.value = true
    setTimeout(() => {
      showSuccessAnimation.value = false
    }, 1500)
  } else {
    showSuccessAnimation.value = false
  }
}

/**
 * Maneja el evento focus del input
 * Activa estado visual y animación sutil de escala
 * @param event - Evento de focus nativo
 */
const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  
  // Add a subtle scale animation to the input
  if (inputElement.value) {
    inputElement.value.style.transform = 'scale(1.02)'
    setTimeout(() => {
      if (inputElement.value) {
        inputElement.value.style.transform = 'scale(1)'
      }
    }, 200)
  }
  
  emit('focus', event)
}

/**
 * Maneja el evento blur del input
 * Desactiva estado de foco visual
 * @param event - Evento de blur nativo
 */
const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

/**
 * Watcher para optimizaciones de teclado móvil
 * Configura automáticamente el inputmode apropiado según el tipo
 */
watch(() => props.type, (newType) => {
  if (import.meta.client && inputElement.value) {
    // Set appropriate input modes for mobile keyboards
    const inputModes: Record<string, string> = {
      email: 'email',
      tel: 'tel',
      number: 'numeric',
      url: 'url',
      search: 'search'
    }
    
    if (inputModes[newType]) {
      inputElement.value.setAttribute('inputmode', inputModes[newType])
    }
  }
})
</script>

