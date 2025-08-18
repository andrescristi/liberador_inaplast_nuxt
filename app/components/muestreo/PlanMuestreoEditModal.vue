<template>
  <BaseModal :show="true" @close="$emit('close')">
    <div class="p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-6">
        Editar Plan de Muestreo
      </h3>

      <form class="space-y-4" @submit.prevent="updatePlan">
        <!-- Información no editable -->
        <div class="bg-gray-50 border border-gray-200 rounded-md p-4">
          <h4 class="text-sm font-medium text-gray-900 mb-2">Plan de Muestreo</h4>
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
            <div>
              <span class="text-gray-500">Código:</span>
              <span class="ml-2 font-medium">{{ plan.codigo }}</span>
            </div>
            <div>
              <span class="text-gray-500">AQL:</span>
              <span class="ml-2 font-medium">{{ plan.aql }}</span>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            El código y AQL no se pueden modificar ya que forman parte de la clave primaria
          </p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <BaseInput
            v-model.number="form.tamano_muestra"
            label="Tamaño de Muestra"
            type="number"
            min="1"
            placeholder="Número de unidades a inspeccionar"
            :error="!!errors.tamano_muestra"
          />
          
          <BaseInput
            v-model.number="form.numero_maximo_fallas"
            label="Número Máximo de Fallas"
            type="number"
            min="0"
            placeholder="Máximo de defectos permitidos"
            :error="!!errors.numero_maximo_fallas"
          />
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <Icon name="bx:info-circle" class="h-5 w-5 text-blue-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">
                Información del Plan
              </h3>
              <div class="mt-2 text-sm text-blue-700 space-y-1">
                <p><strong>Tamaño de Muestra:</strong> Cantidad de unidades a inspeccionar del lote</p>
                <p><strong>Máximo de Fallas:</strong> Si se excede este número, el lote se rechaza</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview actualizado -->
        <div class="bg-gray-50 border border-gray-200 rounded-md p-4">
          <h4 class="text-sm font-medium text-gray-900 mb-2">Vista Previa</h4>
          <div class="text-sm text-gray-600">
            <p>Plan <strong>{{ plan.codigo }}-{{ plan.aql }}</strong></p>
            <p v-if="form.tamano_muestra">
              Inspeccionar {{ form.tamano_muestra }} unidades del lote
            </p>
            <p v-if="form.numero_maximo_fallas !== undefined">
              Rechazar si hay más de {{ form.numero_maximo_fallas }} 
              {{ form.numero_maximo_fallas === 1 ? 'defecto' : 'defectos' }}
            </p>
          </div>
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
                  <li v-if="tamanoMuestraChanged">
                    Tamaño de muestra: {{ plan.tamano_muestra || 'N/A' }} → {{ form.tamano_muestra || 'N/A' }}
                  </li>
                  <li v-if="numeroFallasChanged">
                    Máximo fallas: {{ plan.numero_maximo_fallas ?? 'N/A' }} → {{ form.numero_maximo_fallas ?? 'N/A' }}
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
            {{ loading ? 'Actualizando...' : 'Actualizar Plan' }}
          </BaseButton>
        </div>
      </form>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import type { PlanDeMuestreo, UpdatePlanMuestreoForm } from '~/types'

// Import components explicitly
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseModal from '~/components/ui/BaseModal.vue'

const props = defineProps<{
  plan: PlanDeMuestreo
}>()

const emit = defineEmits<{
  close: []
  updated: []
}>()

const muestreoAPI = useMuestreoAPI()
const toast = useToast()

// Form data
const form = ref<UpdatePlanMuestreoForm>({
  tamano_muestra: props.plan.tamano_muestra,
  numero_maximo_fallas: props.plan.numero_maximo_fallas
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)

// Computed properties for change detection
const hasChanges = computed(() => {
  return tamanoMuestraChanged.value || numeroFallasChanged.value
})

const tamanoMuestraChanged = computed(() => {
  return form.value.tamano_muestra !== props.plan.tamano_muestra
})

const numeroFallasChanged = computed(() => {
  return form.value.numero_maximo_fallas !== props.plan.numero_maximo_fallas
})

// Validation
const validateForm = () => {
  errors.value = {}

  if (form.value.tamano_muestra !== undefined && form.value.tamano_muestra < 1) {
    errors.value.tamano_muestra = 'El tamaño de muestra debe ser mayor a 0'
  }

  if (form.value.numero_maximo_fallas !== undefined && form.value.numero_maximo_fallas < 0) {
    errors.value.numero_maximo_fallas = 'El número de fallas no puede ser negativo'
  }

  return Object.keys(errors.value).length === 0
}

// Methods
const updatePlan = async () => {
  if (!validateForm()) return

  if (!hasChanges.value) {
    toast.info('Info', 'No hay cambios para guardar')
    return
  }

  loading.value = true
  try {
    await muestreoAPI.updatePlanMuestreo(
      props.plan.codigo,
      props.plan.aql,
      form.value
    )
    emit('updated')
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el plan de muestreo'
    toast.error('Error', errorMessage)
  } finally {
    loading.value = false
  }
}

// Auto-focus en el primer campo
onMounted(() => {
  nextTick(() => {
    const firstInput = document.querySelector('input[type="number"]') as HTMLInputElement
    if (firstInput) {
      firstInput.focus()
    }
  })
})
</script>