<template>
  <BaseModal :show="true" @close="$emit('close')">
    <div class="p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-6">
        Crear Plan de Muestreo
      </h3>

      <form class="space-y-4" @submit.prevent="createPlan">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <BaseInput
            v-model="form.codigo"
            label="Código del Plan"
            placeholder="Ej: A, B, C..."
            :error="!!errors.codigo"
            required
          />
          
          <BaseInput
            v-model="form.aql"
            label="AQL (Nivel de Calidad Aceptable)"
            placeholder="Ej: 0,065, 0,10, 1,5..."
            :error="!!errors.aql"
            required
          />
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
                Información del Plan de Muestreo
              </h3>
              <div class="mt-2 text-sm text-blue-700 space-y-1">
                <p><strong>Código:</strong> Identificador único del plan (letras A-Z típicamente)</p>
                <p><strong>AQL:</strong> Porcentaje máximo de defectos aceptables en el lote</p>
                <p><strong>Tamaño de Muestra:</strong> Cantidad de unidades a inspeccionar del lote</p>
                <p><strong>Máximo de Fallas:</strong> Si se excede este número, el lote se rechaza</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview del plan -->
        <div v-if="form.codigo && form.aql" class="bg-gray-50 border border-gray-200 rounded-md p-4">
          <h4 class="text-sm font-medium text-gray-900 mb-2">Vista Previa del Plan</h4>
          <div class="text-sm text-gray-600">
            <p>Plan <strong>{{ form.codigo }}-{{ form.aql }}</strong></p>
            <p v-if="form.tamano_muestra">
              Inspeccionar {{ form.tamano_muestra }} unidades del lote
            </p>
            <p v-if="form.numero_maximo_fallas !== undefined">
              Rechazar si hay más de {{ form.numero_maximo_fallas }} 
              {{ form.numero_maximo_fallas === 1 ? 'defecto' : 'defectos' }}
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
            {{ loading ? 'Creando...' : 'Crear Plan' }}
          </BaseButton>
        </div>
      </form>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import type { CreatePlanMuestreoForm } from '~/types'

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
const form = ref<CreatePlanMuestreoForm>({
  codigo: '',
  aql: '',
  tamano_muestra: undefined,
  numero_maximo_fallas: 0
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)

// Validation
const validateForm = () => {
  errors.value = {}

  if (!form.value.codigo.trim()) {
    errors.value.codigo = 'El código es requerido'
  } else if (!/^[A-Z0-9]+$/i.test(form.value.codigo.trim())) {
    errors.value.codigo = 'El código solo puede contener letras y números'
  }

  if (!form.value.aql.trim()) {
    errors.value.aql = 'El AQL es requerido'
  } else if (!/^\d+([,.]\d+)*$/.test(form.value.aql.trim())) {
    errors.value.aql = 'El AQL debe ser un número válido (ej: 0,065 o 1.5)'
  }

  if (form.value.tamano_muestra !== undefined && form.value.tamano_muestra < 1) {
    errors.value.tamano_muestra = 'El tamaño de muestra debe ser mayor a 0'
  }

  if (form.value.numero_maximo_fallas !== undefined && form.value.numero_maximo_fallas < 0) {
    errors.value.numero_maximo_fallas = 'El número de fallas no puede ser negativo'
  }

  return Object.keys(errors.value).length === 0
}

// Methods
const createPlan = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    // Limpiar y formatear los datos
    const planData = {
      codigo: form.value.codigo.trim().toUpperCase(),
      aql: form.value.aql.trim(),
      tamano_muestra: form.value.tamano_muestra,
      numero_maximo_fallas: form.value.numero_maximo_fallas
    }

    await muestreoAPI.createPlanMuestreo(planData)
    emit('created')
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al crear el plan de muestreo'
    
    // Manejar errores específicos de duplicación
    if (errorMessage.includes('duplicate') || errorMessage.includes('already exists')) {
      errors.value.codigo = 'Ya existe un plan con este código y AQL'
      toast.error('Error', 'Ya existe un plan de muestreo con este código y AQL')
    } else {
      toast.error('Error', errorMessage)
    }
  } finally {
    loading.value = false
  }
}

// Auto-focus en el primer campo
onMounted(() => {
  nextTick(() => {
    const firstInput = document.querySelector('input') as HTMLInputElement
    if (firstInput) {
      firstInput.focus()
    }
  })
})
</script>