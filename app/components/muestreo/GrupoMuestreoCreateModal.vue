<template>
  <BaseModal :show="true" @close="$emit('close')">
    <div class="p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-6">
        Crear Grupo de Muestreo
      </h3>

      <form class="space-y-4" @submit.prevent="createGrupo">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <BaseInput
            v-model.number="form.tamano_lote_desde"
            label="Tamaño de Lote Desde"
            type="number"
            min="1"
            placeholder="Valor mínimo del rango"
            :error="!!errors.tamano_lote_desde"
            required
          />
          
          <BaseInput
            v-model.number="form.tamano_lote_hasta"
            label="Tamaño de Lote Hasta"
            type="number"
            :min="form.tamano_lote_desde || 1"
            placeholder="Valor máximo (opcional para ∞)"
            :error="!!errors.tamano_lote_hasta"
          />
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nivel de Inspección
            </label>
            <select
              v-model="form.nivel_inspeccion"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              :class="{ 'border-red-300': errors.nivel_inspeccion }"
              required
            >
              <option value="">Selecciona un nivel</option>
              <option value="S1">S1 - Especial Reducido</option>
              <option value="S2">S2 - Especial Reducido</option>
              <option value="S3">S3 - Especial Reducido</option>
              <option value="S4">S4 - Especial Reducido</option>
              <option value="I">I - General Nivel 1</option>
              <option value="II">II - General Nivel 2</option>
              <option value="III">III - General Nivel 3</option>
            </select>
            <p v-if="errors.nivel_inspeccion" class="mt-1 text-sm text-red-600">
              {{ errors.nivel_inspeccion }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Inspección
            </label>
            <select
              v-model="form.tipo_de_inspeccion"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Selecciona un tipo (opcional)</option>
              <option value="General">General</option>
              <option value="Especial">Especial</option>
              <option value="Reducida">Reducida</option>
              <option value="Rigurosa">Rigurosa</option>
            </select>
          </div>
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
            <option value="">Sin plan específico (opcional)</option>
            <option v-for="plan in planesDisponibles" :key="plan.codigo" :value="plan.codigo">
              {{ plan.codigo }} - AQL {{ plan.aql }}
              <span v-if="plan.tamano_muestra">({{ plan.tamano_muestra }} muestras)</span>
            </option>
          </select>
          <p class="mt-1 text-xs text-gray-500">
            El plan recomendado se usará como sugerencia para lotes en este rango
          </p>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <Icon name="bx:info-circle" class="h-5 w-5 text-blue-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">
                Información del Grupo de Muestreo
              </h3>
              <div class="mt-2 text-sm text-blue-700 space-y-1">
                <p><strong>Rango de Lote:</strong> Define el tamaño mínimo y máximo de lotes aplicables</p>
                <p><strong>Nivel de Inspección:</strong> Determina la rigurosidad del muestreo</p>
                <p><strong>Tipo de Inspección:</strong> Contexto específico del proceso de calidad</p>
                <p><strong>Plan Recomendado:</strong> Código del plan sugerido para este rango</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview del grupo -->
        <div v-if="form.tamano_lote_desde && form.nivel_inspeccion" class="bg-gray-50 border border-gray-200 rounded-md p-4">
          <h4 class="text-sm font-medium text-gray-900 mb-2">Vista Previa del Grupo</h4>
          <div class="text-sm text-gray-600">
            <p>
              <strong>Rango:</strong> {{ form.tamano_lote_desde }} - 
              {{ form.tamano_lote_hasta || '∞' }} unidades
            </p>
            <p><strong>Nivel:</strong> {{ form.nivel_inspeccion }}</p>
            <p v-if="form.tipo_de_inspeccion">
              <strong>Tipo:</strong> {{ form.tipo_de_inspeccion }}
            </p>
            <p v-if="form.codigo_plan_muestreo">
              <strong>Plan recomendado:</strong> {{ form.codigo_plan_muestreo }}
            </p>
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
          <BaseButton type="submit" :disabled="loading">
            <Icon
              v-if="loading"
              name="bx:loader-alt"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            />
            {{ loading ? 'Creando...' : 'Crear Grupo' }}
          </BaseButton>
        </div>
      </form>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import type { CreateGrupoMuestreoForm, PlanDeMuestreo } from '~/types'

// Import components explicitly
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseModal from '~/components/ui/BaseModal.vue'

const emit = defineEmits<{
  close: []
  created: []
}>()

const muestreoAPI = useMuestreoAPI()
const toast = useToast()

// Form data
const form = ref<CreateGrupoMuestreoForm>({
  tamano_lote_desde: 1,
  tamano_lote_hasta: undefined,
  nivel_inspeccion: '',
  tipo_de_inspeccion: '',
  codigo_plan_muestreo: ''
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)
const loadingPlanes = ref(false)
const planesDisponibles = ref<PlanDeMuestreo[]>([])

// Validation
const validateForm = () => {
  errors.value = {}

  if (!form.value.tamano_lote_desde || form.value.tamano_lote_desde < 1) {
    errors.value.tamano_lote_desde = 'El tamaño de lote inicial debe ser mayor a 0'
  }

  if (!form.value.nivel_inspeccion.trim()) {
    errors.value.nivel_inspeccion = 'El nivel de inspección es requerido'
  }

  if (form.value.tamano_lote_hasta && form.value.tamano_lote_hasta <= form.value.tamano_lote_desde) {
    errors.value.tamano_lote_hasta = 'El tamaño máximo debe ser mayor al mínimo'
  }

  return Object.keys(errors.value).length === 0
}

// Methods
const loadPlanesDisponibles = async () => {
  loadingPlanes.value = true
  try {
    const response = await muestreoAPI.getPlanesMuestreo({}, 1, 100) // Cargar primeros 100 planes
    planesDisponibles.value = response.data
  } catch (error) {
    console.error('Error loading planes:', error)
    toast.error('Error', 'No se pudieron cargar los planes disponibles')
  } finally {
    loadingPlanes.value = false
  }
}

const createGrupo = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    // Limpiar y formatear los datos
    const grupoData = {
      tamano_lote_desde: form.value.tamano_lote_desde,
      tamano_lote_hasta: form.value.tamano_lote_hasta,
      nivel_inspeccion: form.value.nivel_inspeccion.trim(),
      tipo_de_inspeccion: form.value.tipo_de_inspeccion?.trim() || undefined,
      codigo_plan_muestreo: form.value.codigo_plan_muestreo?.trim() || undefined
    }

    await muestreoAPI.createGrupoMuestreo(grupoData)
    emit('created')
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al crear el grupo de muestreo'
    
    // Manejar errores específicos de duplicación
    if (errorMessage.includes('duplicate') || errorMessage.includes('already exists')) {
      errors.value.tamano_lote_desde = 'Ya existe un grupo con este tamaño de lote y nivel de inspección'
      toast.error('Error', 'Ya existe un grupo de muestreo con estos parámetros')
    } else {
      toast.error('Error', errorMessage)
    }
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadPlanesDisponibles()
  
  // Auto-focus en el primer campo
  nextTick(() => {
    const firstInput = document.querySelector('input[type="number"]') as HTMLInputElement
    if (firstInput) {
      firstInput.focus()
    }
  })
})
</script>