<template>
  <BaseModal
:show="true"
size="lg"
@close="$emit('close')">
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-medium text-gray-900">
          Plan de Muestreo {{ plan.codigo }}-{{ plan.aql }}
        </h3>
        <BaseBadge color="blue" variant="outline">
          AQL {{ plan.aql }}
        </BaseBadge>
      </div>

      <!-- Información del Plan -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <BaseCard>
          <div class="p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Icon name="bx:clipboard-check" class="w-5 h-5 mr-2 text-blue-500" />
              Parámetros del Plan
            </h4>
            <dl class="space-y-2">
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Código:</dt>
                <dd class="text-sm font-medium text-gray-900">{{ plan.codigo }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">AQL:</dt>
                <dd class="text-sm font-medium text-green-600">{{ plan.aql }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Tamaño de Muestra:</dt>
                <dd class="text-sm font-medium text-gray-900">
                  {{ plan.tamano_muestra || 'No especificado' }}
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500">Máximo de Fallas:</dt>
                <dd class="text-sm font-medium text-red-600">
                  {{ plan.numero_maximo_fallas ?? 'No especificado' }}
                </dd>
              </div>
            </dl>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Icon name="bx:calculator" class="w-5 h-5 mr-2 text-green-500" />
              Interpretación
            </h4>
            <div class="text-sm text-gray-600 space-y-2">
              <p v-if="plan.tamano_muestra">
                <strong>Muestreo:</strong> Inspeccionar {{ plan.tamano_muestra }} 
                {{ plan.tamano_muestra === 1 ? 'unidad' : 'unidades' }} de cada lote
              </p>
              <p v-if="plan.numero_maximo_fallas !== undefined">
                <strong>Criterio de aceptación:</strong> 
                {{ plan.numero_maximo_fallas === 0 ? 'Cero defectos permitidos' :
                   `Máximo ${plan.numero_maximo_fallas} ${plan.numero_maximo_fallas === 1 ? 'defecto' : 'defectos'}` }}
              </p>
              <p>
                <strong>Nivel de calidad:</strong> AQL {{ plan.aql }} significa que se acepta 
                hasta {{ plan.aql }}% de productos defectuosos en el lote
              </p>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Grupos Asociados -->
      <div v-if="gruposAsociados.length > 0" class="mb-6">
        <BaseCard>
          <div class="p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Icon name="bx:group" class="w-5 h-5 mr-2 text-purple-500" />
              Grupos de Muestreo Asociados ({{ gruposAsociados.length }})
            </h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Rango de Lote
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Nivel Inspección
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Tipo Inspección
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="grupo in gruposAsociados" :key="`${grupo.tamano_lote_desde}-${grupo.nivel_inspeccion}`">
                    <td class="px-3 py-2 text-sm text-gray-900">
                      {{ grupo.tamano_lote_desde }} - {{ grupo.tamano_lote_hasta || '∞' }}
                    </td>
                    <td class="px-3 py-2 text-sm">
                      <BaseBadge color="blue" size="sm">{{ grupo.nivel_inspeccion }}</BaseBadge>
                    </td>
                    <td class="px-3 py-2 text-sm text-gray-600">
                      {{ grupo.tipo_de_inspeccion || 'No especificado' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Ejemplo de Aplicación -->
      <div class="mb-6">
        <BaseCard>
          <div class="p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Icon name="bx:test-tube" class="w-5 h-5 mr-2 text-orange-500" />
              Ejemplo de Aplicación
            </h4>
            <div class="bg-gray-50 rounded-md p-3 text-sm text-gray-700">
              <p class="mb-2">
                <strong>Escenario:</strong> Lote de producción con {{ plan.tamano_muestra || 'N' }} unidades inspeccionadas
              </p>
              <p class="mb-2">
                <strong>Proceso:</strong>
              </p>
              <ol class="list-decimal list-inside space-y-1 ml-4">
                <li>Seleccionar aleatoriamente {{ plan.tamano_muestra || 'N' }} unidades del lote</li>
                <li>Inspeccionar cada unidad según los criterios de calidad</li>
                <li>Contar el número de unidades defectuosas encontradas</li>
                <li v-if="plan.numero_maximo_fallas !== undefined">
                  {{ plan.numero_maximo_fallas === 0 ? 
                     'Si hay cualquier defecto, rechazar el lote' :
                     `Si hay más de ${plan.numero_maximo_fallas} defectos, rechazar el lote` }}
                </li>
                <li>Si el número de defectos está dentro del límite, aceptar el lote</li>
              </ol>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Recomendador de Muestreo -->
      <div class="mb-6">
        <BaseCard>
          <div class="p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Icon name="bx:bulb" class="w-5 h-5 mr-2 text-yellow-500" />
              Recomendador de Muestreo
            </h4>
            <div class="flex items-center space-x-3">
              <BaseInput
                v-model.number="tamanoLoteTest"
                type="number"
                min="1"
                placeholder="Tamaño del lote"
                class="flex-1"
              />
              <BaseButton
                variant="outline"
                size="sm"
                :disabled="!tamanoLoteTest || tamanoLoteTest < 1"
                @click="testRecomendacion"
              >
                Verificar Aplicabilidad
              </BaseButton>
            </div>
            <div v-if="recomendacionResult" class="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
              <p class="text-sm text-green-800">
                <strong>✓ Aplicable:</strong> {{ recomendacionResult }}
              </p>
            </div>
            <div v-else-if="recomendacionResult === null && tamanoLoteTest" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p class="text-sm text-red-800">
                <strong>✗ No aplicable:</strong> Este plan no se recomienda para lotes de {{ tamanoLoteTest }} unidades
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
import type { PlanDeMuestreo, GrupoMuestreo } from '~/types'

// Import components explicitly
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseModal from '~/components/ui/BaseModal.vue'

const props = defineProps<{
  plan: PlanDeMuestreo
}>()

const emit = defineEmits<{
  close: []
}>()

const muestreoAPI = useMuestreoAPI()

// Reactive data
const gruposAsociados = ref<GrupoMuestreo[]>([])
const tamanoLoteTest = ref<number | undefined>()
const recomendacionResult = ref<string | null>('')

// Methods
const loadGruposAsociados = async () => {
  try {
    // Simular la carga de grupos asociados
    // En una implementación real, harías una query específica
    const response = await muestreoAPI.getGruposMuestreo({
      codigo_plan_muestreo: props.plan.codigo
    })
    gruposAsociados.value = response.data
  } catch (error) {
    console.error('Error loading associated groups:', error)
  }
}

const testRecomendacion = async () => {
  if (!tamanoLoteTest.value) return

  try {
    const recomendacion = await muestreoAPI.getRecomendacionMuestreo(
      tamanoLoteTest.value,
      'I', // Nivel de inspección por defecto
      props.plan.aql
    )

    if (recomendacion && recomendacion.plan.codigo === props.plan.codigo) {
      recomendacionResult.value = recomendacion.justificacion
    } else {
      recomendacionResult.value = null
    }
  } catch (error) {
    console.error('Error testing recommendation:', error)
    recomendacionResult.value = null
  }
}

// Lifecycle
onMounted(() => {
  loadGruposAsociados()
})

// Watchers
watch(tamanoLoteTest, () => {
  recomendacionResult.value = ''
})
</script>