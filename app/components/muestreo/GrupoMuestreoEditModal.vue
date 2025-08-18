<template>
  <BaseModal :show="true" @close="$emit('close')">
    <div class="p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-6">
        Editar Grupo de Muestreo
      </h3>

      <form class="space-y-4" @submit.prevent="updateGrupo">
        <!-- Información no editable -->
        <div class="bg-gray-50 border border-gray-200 rounded-md p-4">
          <h4 class="text-sm font-medium text-gray-900 mb-2">Identificador del Grupo</h4>
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
            <div>
              <span class="text-gray-500">Lote desde:</span>
              <span class="ml-2 font-medium">{{ grupo.tamano_lote_desde }}</span>
            </div>
            <div>
              <span class="text-gray-500">Nivel:</span>
              <span class="ml-2 font-medium">{{ grupo.nivel_inspeccion }}</span>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            Estos campos forman parte de la clave primaria y no se pueden modificar
          </p>
        </div>

        <BaseInput
          v-model.number="form.tamano_lote_hasta"
          label="Tamaño de Lote Hasta"
          type="number"
          :min="grupo.tamano_lote_desde + 1"
          placeholder="Valor máximo (opcional para ∞)"
          :error="!!errors.tamano_lote_hasta"
        />

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Inspección
          </label>
          <select
            v-model="form.tipo_de_inspeccion"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Sin tipo específico</option>
            <option value="General">General</option>
            <option value="Especial">Especial</option>
            <option value="Reducida">Reducida</option>
            <option value="Rigurosa">Rigurosa</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Plan de Muestreo Recomendado
          </label>
          <select
            v-model="form.codigo_plan_muestreo"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            :disabled="loadingPlanes"
          >
            <option value="">Sin plan específico</option>
            <option v-for="plan in planesDisponibles" :key="plan.codigo" :value="plan.codigo">
              {{ plan.codigo }} - AQL {{ plan.aql }}
            </option>
          </select>
        </div>

        <!-- Mostrar cambios -->
        <div v-if="hasChanges" class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <Icon name="bx:edit" class="h-5 w-5 text-yellow-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800">
                Cambios Detectados
              </h3>
              <div class="mt-2 text-sm text-yellow-700">
                <ul class="list-disc list-inside space-y-1">
                  <li v-if="tamanoHastaChanged">
                    Lote hasta: {{ grupo.tamano_lote_hasta || '∞' }} → {{ form.tamano_lote_hasta || '∞' }}
                  </li>
                  <li v-if="tipoChanged">
                    Tipo: {{ grupo.tipo_de_inspeccion || 'Sin especificar' }} → {{ form.tipo_de_inspeccion || 'Sin especificar' }}
                  </li>
                  <li v-if="planChanged">
                    Plan: {{ grupo.codigo_plan_muestreo || 'Sin asignar' }} → {{ form.codigo_plan_muestreo || 'Sin asignar' }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <BaseButton
            variant="outline"
            type="button"
            @click="$emit('close')"
          >
            Cancelar
          </BaseButton>
          <BaseButton type="submit" :disabled="loading || !hasChanges">
            <Icon
              v-if="loading"
              name="bx:loader-alt"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            />
            {{ loading ? 'Actualizando...' : 'Actualizar Grupo' }}
          </BaseButton>
        </div>
      </form>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import type { GrupoMuestreo, UpdateGrupoMuestreoForm, PlanDeMuestreo } from '~/types'

// Import components explicitly
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseModal from '~/components/ui/BaseModal.vue'

const props = defineProps<{
  grupo: GrupoMuestreo
}>()

const emit = defineEmits<{
  close: []
  updated: []
}>()

const muestreoAPI = useMuestreoAPI()
const toast = useToast()

// Form data
const form = ref<UpdateGrupoMuestreoForm>({
  tamano_lote_hasta: props.grupo.tamano_lote_hasta,
  tipo_de_inspeccion: props.grupo.tipo_de_inspeccion || '',
  codigo_plan_muestreo: props.grupo.codigo_plan_muestreo || ''
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)
const loadingPlanes = ref(false)
const planesDisponibles = ref<PlanDeMuestreo[]>([])

// Computed properties for change detection
const hasChanges = computed(() => {
  return tamanoHastaChanged.value || tipoChanged.value || planChanged.value
})

const tamanoHastaChanged = computed(() => {
  return form.value.tamano_lote_hasta !== props.grupo.tamano_lote_hasta
})

const tipoChanged = computed(() => {
  const formTipo = form.value.tipo_de_inspeccion || undefined
  return formTipo !== props.grupo.tipo_de_inspeccion
})

const planChanged = computed(() => {
  const formPlan = form.value.codigo_plan_muestreo || undefined
  return formPlan !== props.grupo.codigo_plan_muestreo
})

// Validation
const validateForm = () => {
  errors.value = {}

  if (form.value.tamano_lote_hasta && form.value.tamano_lote_hasta <= props.grupo.tamano_lote_desde) {
    errors.value.tamano_lote_hasta = 'El tamaño máximo debe ser mayor al mínimo'
  }

  return Object.keys(errors.value).length === 0
}

// Methods
const loadPlanesDisponibles = async () => {
  loadingPlanes.value = true
  try {
    const response = await muestreoAPI.getPlanesMuestreo({}, 1, 100)
    planesDisponibles.value = response.data
  } catch (error) {
    console.error('Error loading planes:', error)
  } finally {
    loadingPlanes.value = false
  }
}

const updateGrupo = async () => {
  if (!validateForm()) return

  if (!hasChanges.value) {
    toast.info('Info', 'No hay cambios para guardar')
    return
  }

  loading.value = true
  try {
    const updateData = {
      tamano_lote_hasta: form.value.tamano_lote_hasta,
      tipo_de_inspeccion: form.value.tipo_de_inspeccion || undefined,
      codigo_plan_muestreo: form.value.codigo_plan_muestreo || undefined
    }

    await muestreoAPI.updateGrupoMuestreo(
      props.grupo.tamano_lote_desde,
      props.grupo.nivel_inspeccion,
      updateData
    )
    emit('updated')
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el grupo de muestreo'
    toast.error('Error', errorMessage)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadPlanesDisponibles()
})
</script>