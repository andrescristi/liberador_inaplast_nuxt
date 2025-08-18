<template>
  <BaseModal :show="true" @close="$emit('close')" size="lg">
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-medium text-gray-900">
          Grupo de Muestreo {{ grupo.tamano_lote_desde }}-{{ grupo.nivel_inspeccion }}
        </h3>
        <BaseBadge color="blue" variant="solid">
          Nivel {{ grupo.nivel_inspeccion }}
        </BaseBadge>
      </div>

      <!-- Información del Grupo -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <BaseCard>
          <div class="p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Icon name="bx:ruler" class="w-5 h-5 mr-2 text-purple-500" />
              Parámetros del Grupo
            </h4>
            <dl class="space-y-2">
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Rango de Lote:</dt>
                <dd class="text-sm font-medium text-gray-900">
                  {{ grupo.tamano_lote_desde }} - {{ grupo.tamano_lote_hasta || '∞' }}
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Nivel de Inspección:</dt>
                <dd class="text-sm font-medium text-blue-600">{{ grupo.nivel_inspeccion }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Tipo de Inspección:</dt>
                <dd class="text-sm font-medium text-gray-900">
                  {{ grupo.tipo_de_inspeccion || 'No especificado' }}
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Plan Recomendado:</dt>
                <dd class="text-sm font-medium text-green-600">
                  {{ grupo.codigo_plan_muestreo || 'Sin asignar' }}
                </dd>
              </div>
            </dl>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Icon name="bx:info-circle" class="w-5 h-5 mr-2 text-blue-500" />
              Interpretación
            </h4>
            <div class="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Aplicable para lotes de:</strong> {{ grupo.tamano_lote_desde }} 
                a {{ grupo.tamano_lote_hasta || 'infinitas' }} unidades
              </p>
              <p>
                <strong>Nivel {{ grupo.nivel_inspeccion }}:</strong> 
                {{ getNivelDescription(grupo.nivel_inspeccion) }}
              </p>
              <p v-if="grupo.tipo_de_inspeccion">
                <strong>Tipo {{ grupo.tipo_de_inspeccion }}:</strong>
                {{ getTipoDescription(grupo.tipo_de_inspeccion) }}
              </p>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Plan Recomendado -->
      <div v-if="grupo.codigo_plan_muestreo" class="mb-6">
        <BaseCard>
          <div class="p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Icon name="bx:clipboard-check" class="w-5 h-5 mr-2 text-green-500" />
              Plan de Muestreo Recomendado
            </h4>
            <div v-if="planRecomendado" class="bg-green-50 border border-green-200 rounded-md p-3">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium">Plan {{ planRecomendado.codigo }}</span>
                <BaseBadge color="green" size="sm">AQL {{ planRecomendado.aql }}</BaseBadge>
              </div>
              <div class="text-sm text-gray-600 space-y-1">
                <p v-if="planRecomendado.tamano_muestra">
                  <strong>Muestra:</strong> {{ planRecomendado.tamano_muestra }} unidades
                </p>
                <p v-if="planRecomendado.numero_maximo_fallas !== undefined">
                  <strong>Máx. defectos:</strong> {{ planRecomendado.numero_maximo_fallas }}
                </p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Planes Asociados -->
      <div v-if="planesAsociados.length > 0" class="mb-6">
        <BaseCard>
          <div class="p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Icon name="bx:link" class="w-5 h-5 mr-2 text-orange-500" />
              Planes Asociados ({{ planesAsociados.length }})
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div 
                v-for="plan in planesAsociados" 
                :key="`${plan.codigo}-${plan.aql}`"
                class="bg-gray-50 border border-gray-200 rounded-md p-3"
              >
                <div class="flex items-center justify-between">
                  <span class="font-medium">{{ plan.codigo }}</span>
                  <BaseBadge color="blue" size="sm">{{ plan.aql }}</BaseBadge>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  {{ plan.tamano_muestra || 'N/A' }} muestras, 
                  {{ plan.numero_maximo_fallas ?? 'N/A' }} máx. fallas
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Calculadora de Aplicabilidad -->
      <div class="mb-6">
        <BaseCard>
          <div class="p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Icon name="bx:calculator" class="w-5 h-5 mr-2 text-yellow-500" />
              Verificador de Aplicabilidad
            </h4>
            <div class="flex items-center space-x-3">
              <BaseInput
                v-model.number="tamanoLoteTest"
                type="number"
                min="1"
                placeholder="Ingresa el tamaño del lote"
                class="flex-1"
              />
              <BaseButton
                variant="outline"
                size="sm"
                @click="testAplicabilidad"
                :disabled="!tamanoLoteTest || tamanoLoteTest < 1"
              >
                Verificar
              </BaseButton>
            </div>
            <div v-if="aplicabilidadResult" class="mt-3 p-3 rounded-md" :class="aplicabilidadResult.aplicable ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
              <p class="text-sm" :class="aplicabilidadResult.aplicable ? 'text-green-800' : 'text-red-800'">
                <strong>{{ aplicabilidadResult.aplicable ? '✓ Aplicable' : '✗ No aplicable' }}:</strong>
                {{ aplicabilidadResult.mensaje }}
              </p>
            </div>
          </div>
        </BaseCard>
      </div>

      <div class="flex justify-end space-x-3">
        <BaseButton variant="outline" @click="$emit('close')">
          Cerrar
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import type { GrupoMuestreo, PlanDeMuestreo } from '~/types'

// Import components explicitly
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseModal from '~/components/ui/BaseModal.vue'

const props = defineProps<{
  grupo: GrupoMuestreo
}>()

defineEmits<{
  close: []
}>()

const muestreoAPI = useMuestreoAPI()

// Reactive data
const planRecomendado = ref<PlanDeMuestreo | null>(null)
const planesAsociados = ref<PlanDeMuestreo[]>([])
const tamanoLoteTest = ref<number | undefined>()
const aplicabilidadResult = ref<{ aplicable: boolean; mensaje: string } | null>(null)

// Methods
const getNivelDescription = (nivel: string) => {
  const descriptions: Record<string, string> = {
    'S1': 'Inspección especial reducida nivel 1',
    'S2': 'Inspección especial reducida nivel 2', 
    'S3': 'Inspección especial reducida nivel 3',
    'S4': 'Inspección especial reducida nivel 4',
    'I': 'Inspección general nivel 1 (más permisiva)',
    'II': 'Inspección general nivel 2 (estándar)',
    'III': 'Inspección general nivel 3 (más rigurosa)'
  }
  return descriptions[nivel] || 'Nivel de inspección estándar'
}

const getTipoDescription = (tipo: string) => {
  const descriptions: Record<string, string> = {
    'General': 'Inspección estándar para la mayoría de productos',
    'Especial': 'Inspección para productos críticos o especiales',
    'Reducida': 'Inspección con menor rigor para proveedores confiables',
    'Rigurosa': 'Inspección intensiva para casos de dudas de calidad'
  }
  return descriptions[tipo] || 'Tipo de inspección personalizado'
}

const loadPlanRecomendado = async () => {
  if (!props.grupo.codigo_plan_muestreo) return

  try {
    // Buscar el plan recomendado entre todos los planes
    const response = await muestreoAPI.getPlanesMuestreo({
      codigo: props.grupo.codigo_plan_muestreo
    }, 1, 10)
    
    if (response.data.length > 0) {
      planRecomendado.value = response.data[0]
    }
  } catch (error) {
    console.error('Error loading recommended plan:', error)
  }
}

const loadPlanesAsociados = async () => {
  try {
    // Simular la carga de planes asociados a través de grupos_planes
    // En una implementación real, harías una query más específica
    const response = await muestreoAPI.getPlanesMuestreo({}, 1, 50)
    planesAsociados.value = response.data.slice(0, 6) // Mostrar algunos planes como ejemplo
  } catch (error) {
    console.error('Error loading associated plans:', error)
  }
}

const testAplicabilidad = () => {
  if (!tamanoLoteTest.value) return

  const lote = tamanoLoteTest.value
  const esAplicable = lote >= props.grupo.tamano_lote_desde && 
    (props.grupo.tamano_lote_hasta === null || props.grupo.tamano_lote_hasta === undefined || lote <= props.grupo.tamano_lote_hasta)

  if (esAplicable) {
    aplicabilidadResult.value = {
      aplicable: true,
      mensaje: `Este grupo es aplicable para lotes de ${lote} unidades con nivel de inspección ${props.grupo.nivel_inspeccion}`
    }
  } else {
    let razon = ''
    if (lote < props.grupo.tamano_lote_desde) {
      razon = `el lote es menor al mínimo (${props.grupo.tamano_lote_desde})`
    } else if (props.grupo.tamano_lote_hasta && lote > props.grupo.tamano_lote_hasta) {
      razon = `el lote es mayor al máximo (${props.grupo.tamano_lote_hasta})`
    }
    
    aplicabilidadResult.value = {
      aplicable: false,
      mensaje: `Este grupo no es aplicable porque ${razon}`
    }
  }
}

// Lifecycle
onMounted(() => {
  loadPlanRecomendado()
  loadPlanesAsociados()
})

// Watchers
watch(tamanoLoteTest, () => {
  aplicabilidadResult.value = null
})
</script>