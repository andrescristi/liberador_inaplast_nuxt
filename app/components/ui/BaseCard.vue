<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" :class="headerClasses">
      <slot name="header" />
    </div>
    
    <div v-if="$slots.default" :class="bodyClasses">
      <slot />
    </div>
    
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Componente BaseCard - Contenedor versátil para agrupación de contenido con estilos configurables
 * 
 * Características principales:
 * - 5 niveles de sombra: none, sm, md, lg, xl
 * - 5 niveles de border-radius: none, sm, md, lg, xl
 * - 4 niveles de padding: none, sm, md, lg
 * - Bordes opcionales con color configurable
 * - Efectos hover opcionales con transiciones suaves
 * - Slots estructurados: header, default (body), footer
 * - Separadores automáticos entre secciones
 * 
 * @example
 * <BaseCard shadow="md" rounded="lg" padding="md" :hover="true">
 *   <template #header>
 *     <h2 class="text-lg font-semibold">Título de la Tarjeta</h2>
 *   </template>
 *   
 *   <p>Contenido principal de la tarjeta</p>
 *   
 *   <template #footer>
 *     <div class="flex justify-between">
 *       <span class="text-sm text-gray-500">Información adicional</span>
 *       <BaseButton size="sm">Acción</BaseButton>
 *     </div>
 *   </template>
 * </BaseCard>
 */

/**
 * Props del componente BaseCard
 */
interface Props {
  /** Nivel de sombra aplicada a la tarjeta */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  /** Nivel de border-radius para esquinas redondeadas */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  /** Nivel de padding interno para el contenido */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Si debe mostrar borde alrededor de la tarjeta */
  border?: boolean
  /** Si debe aplicar efectos hover con transiciones */
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  shadow: 'sm',
  rounded: 'lg',
  padding: 'md',
  border: true,
  hover: false
})

/**
 * Clases CSS principales de la tarjeta combinando estilos base y configuraciones
 * @returns String con todas las clases CSS aplicables al contenedor principal
 */
const cardClasses = computed(() => {
  const base = 'bg-white overflow-hidden'
  
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  }
  
  const rounded = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  }
  
  const classes = [
    base,
    shadows[props.shadow],
    rounded[props.rounded]
  ]
  
  if (props.border) {
    classes.push('border border-gray-200')
  }
  
  if (props.hover) {
    classes.push('hover:shadow-md transition-shadow duration-200')
  }
  
  return classes.join(' ')
})

/**
 * Clases CSS para la sección header con borde inferior y padding
 * @returns String con clases CSS para el header de la tarjeta
 */
const headerClasses = computed(() => {
  const base = 'border-b border-gray-200'
  
  const paddings = {
    none: '',
    sm: 'px-3 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6'
  }
  
  return [base, paddings[props.padding]].join(' ')
})

/**
 * Clases CSS para la sección body (contenido principal)
 * @returns String con clases CSS para el contenido principal de la tarjeta
 */
const bodyClasses = computed(() => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return paddings[props.padding]
})

/**
 * Clases CSS para la sección footer con borde superior y padding
 * @returns String con clases CSS para el footer de la tarjeta
 */
const footerClasses = computed(() => {
  const base = 'border-t border-gray-200'
  
  const paddings = {
    none: '',
    sm: 'px-3 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6'
  }
  
  return [base, paddings[props.padding]].join(' ')
})
</script>