<template>
  <BaseModal
:show="true"
size="xl"
@close="$emit('close')">
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-medium text-gray-900">
          Planes Asignados al Grupo {{ grupo.tamano_lote_desde }}-{{ grupo.nivel_inspeccion }}
        </h3>
        <BaseBadge color="blue" variant="solid">
          {{ planesAsignados.length }} planes
        </BaseBadge>
      </div>

      <!-- Información del Grupo -->
      <BaseCard class="mb-6">
        <div class="p-4">
          <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Icon name="bx:info-circle" class="w-5 h-5 mr-2 text-blue-500" />
            Información del Grupo
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span class="text-gray-500">Rango:</span>
              <span class="ml-2 font-medium">
                {{ grupo.tamano_lote_desde }} - {{ grupo.tamano_lote_hasta || '∞' }}
              </span>
            </div>
            <div>
              <span class="text-gray-500">Nivel:</span>
              <span class="ml-2 font-medium">{{ grupo.nivel_inspeccion }}</span>
            </div>
            <div>
              <span class="text-gray-500">Tipo:</span>
              <span class="ml-2 font-medium">{{ grupo.tipo_de_inspeccion || 'No especificado' }}</span>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Asignar Nuevo Plan -->
      <BaseCard class="mb-6">
        <div class="p-4">
          <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Icon name="bx:plus" class="w-5 h-5 mr-2 text-green-500" />
            Asignar Plan al Grupo
          </h4>
          <div class="flex items-center space-x-3">
            <div class="flex-1">
              <select
                v-model="planSeleccionado"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                :disabled="loadingPlanes"
              >
                <option value="">Selecciona un plan para asignar</option>
                <option
                  v-for="plan in planesDisponiblesParaAsignar"
                  :key="plan.codigo"
                  :value="plan.codigo"
                >
                  {{ plan.codigo }} - AQL {{ plan.aql }}
                  <span v-if="plan.tamano_muestra">({{ plan.tamano_muestra }} muestras)</span>
                </option>
              </select>
            </div>
            <BaseButton
              :disabled="!planSeleccionado || loadingAsignacion"
              variant="solid"
              color="primary"
              @click="asignarPlan"
            >
              <Icon
                v-if="loadingAsignacion"
                name="bx:loader-alt"
                class="animate-spin -ml-1 mr-2 h-4 w-4"
              />
              {{ loadingAsignacion ? 'Asignando...' : 'Asignar' }}
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <!-- Lista de Planes Asignados -->
      <BaseCard>
        <div class="p-4">
          <h4 class="text-sm font-medium text-gray-900 mb-4 flex items-center">
            <Icon name="bx:list-ul" class="w-5 h-5 mr-2 text-purple-500" />
            Planes Actualmente Asignados
          </h4>

          <div v-if="loading" class="text-center py-8">
            <Icon name="bx:loader-alt" class="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
            <p class="text-gray-500">Cargando planes asignados...</p>
          </div>

          <div v-else-if="planesAsignados.length === 0" class="text-center py-8 text-gray-500">
            <Icon name="bx:package" class="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No hay planes asignados a este grupo</p>
            <p class="text-sm">Usa el formulario superior para asignar planes</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="relacion in relacionesConPlan"
              :key="`${relacion.codigo_plan}-${relacion.grupo_tamano_lote_desde}`"
              class="bg-gray-50 border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3">
                    <BaseBadge color="blue" variant="solid">
                      {{ relacion.plan_info.codigo }}
                    </BaseBadge>
                    <span class="font-medium">AQL {{ relacion.plan_info.aql }}</span>
                  </div>
                  <div class="mt-2 text-sm text-gray-600">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div v-if="relacion.plan_info.tamano_muestra">
                        <Icon name="bx:package" class="w-4 h-4 inline mr-1" />
                        {{ relacion.plan_info.tamano_muestra }} muestras
                      </div>
                      <div v-if="relacion.plan_info.numero_maximo_fallas !== undefined">
                        <Icon name="bx:x" class="w-4 h-4 inline mr-1" />
                        Máx. {{ relacion.plan_info.numero_maximo_fallas }} defectos
                      </div>
                      <div v-if="relacion.fecha_asignacion">
                        <Icon name="bx:time" class="w-4 h-4 inline mr-1" />
                        {{ formatearFecha(relacion.fecha_asignacion) }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    title="Ver detalles del plan"
                    @click="verPlan(relacion.plan_info)"
                  >
                    <Icon name="bx:show" class="w-5 h-5" />
                  </button>
                  <button
                    class="text-red-600 hover:text-red-800 text-sm font-medium"
                    title="Desasignar plan"
                    :disabled="loadingDesasignacion"
                    @click="confirmarDesasignar(relacion)"
                  >
                    <Icon name="bx:trash" class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Acciones del Modal -->
      <div class="flex justify-end space-x-3 mt-6">
        <BaseButton variant="outline" @click="$emit('close')">
          Cerrar
        </BaseButton>
      </div>
    </div>

    <!-- Modal de Confirmación para Desasignar -->
    <BaseModal
      :show="showConfirmDesasignar"
      size="sm"
      @close="showConfirmDesasignar = false"
    >
      <div class="p-6">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <Icon name="bx:error-circle" class="h-6 w-6 text-red-600" />
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-medium text-gray-900">
              Confirmar Desasignación
            </h3>
          </div>
        </div>
        <p class="text-sm text-gray-500 mb-6">
          ¿Estás seguro de que deseas desasignar el plan 
          <strong>{{ relacionADesasignar?.plan_info.codigo }}</strong> 
          de este grupo?
        </p>
        <div class="flex justify-end space-x-3">
          <BaseButton 
            variant="outline" 
            @click="showConfirmDesasignar = false"
          >
            Cancelar
          </BaseButton>
          <BaseButton 
            color="danger" 
            :disabled="loadingDesasignacion"
            @click="desasignarPlan"
          >
            <Icon
              v-if="loadingDesasignacion"
              name="bx:loader-alt"
              class="animate-spin -ml-1 mr-2 h-4 w-4"
            />
            {{ loadingDesasignacion ? 'Desasignando...' : 'Desasignar' }}
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </BaseModal>
</template>

<script setup lang="ts">
import type { GrupoMuestreo, PlanDeMuestreo, GrupoPlanes } from '~/types'

// Import components explicitly
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseModal from '~/components/ui/BaseModal.vue'

interface RelacionConPlan extends GrupoPlanes {
  plan_info: PlanDeMuestreo
}

const props = defineProps<{
  grupo: GrupoMuestreo
}>()

const emit = defineEmits<{
  close: []
  updated: []
}>()

const muestreoAPI = useMuestreoAPI()
const toast = useToast()

// Reactive data
const loading = ref(false)
const loadingPlanes = ref(false)
const loadingAsignacion = ref(false)
const loadingDesasignacion = ref(false)
const planesAsignados = ref<PlanDeMuestreo[]>([])
const planesDisponibles = ref<PlanDeMuestreo[]>([])
const relacionesConPlan = ref<RelacionConPlan[]>([])
const planSeleccionado = ref('')
const showConfirmDesasignar = ref(false)
const relacionADesasignar = ref<RelacionConPlan | null>(null)

// Computed
const planesDisponiblesParaAsignar = computed(() => {
  const codigosAsignados = new Set(planesAsignados.value.map(p => p.codigo))
  return planesDisponibles.value.filter(plan => !codigosAsignados.has(plan.codigo))
})

// Methods
const cargarPlanesAsignados = async () => {
  loading.value = true
  try {
    // Obtener relaciones del grupo con información de planes
    const response = await muestreoAPI.getRelacionesGrupoPlanes(
      props.grupo.tamano_lote_desde,
      props.grupo.nivel_inspeccion
    )
    
    relacionesConPlan.value = response
    planesAsignados.value = response.map(r => r.plan_info)
  } catch (error) {
    console.error('Error loading assigned plans:', error)
    toast.error('Error', 'No se pudieron cargar los planes asignados')
  } finally {
    loading.value = false
  }
}

const cargarPlanesDisponibles = async () => {
  loadingPlanes.value = true
  try {
    const response = await muestreoAPI.getPlanesMuestreo({}, 1, 100)
    planesDisponibles.value = response.data
  } catch (error) {
    console.error('Error loading available plans:', error)
    toast.error('Error', 'No se pudieron cargar los planes disponibles')
  } finally {
    loadingPlanes.value = false
  }
}

const asignarPlan = async () => {
  if (!planSeleccionado.value) return

  loadingAsignacion.value = true
  try {
    await muestreoAPI.asignarPlanAGrupo(
      props.grupo.tamano_lote_desde,
      props.grupo.nivel_inspeccion,
      planSeleccionado.value
    )

    planSeleccionado.value = ''
    await cargarPlanesAsignados()
    emit('updated')
    toast.success('Éxito', 'Plan asignado correctamente al grupo')
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al asignar el plan'
    toast.error('Error', errorMessage)
  } finally {
    loadingAsignacion.value = false
  }
}

const confirmarDesasignar = (relacion: RelacionConPlan) => {
  relacionADesasignar.value = relacion
  showConfirmDesasignar.value = true
}

const desasignarPlan = async () => {
  if (!relacionADesasignar.value) return

  loadingDesasignacion.value = true
  try {
    await muestreoAPI.desasignarPlanDeGrupo(
      relacionADesasignar.value.grupo_tamano_lote_desde,
      relacionADesasignar.value.grupo_nivel_inspeccion,
      relacionADesasignar.value.codigo_plan
    )

    showConfirmDesasignar.value = false
    relacionADesasignar.value = null
    await cargarPlanesAsignados()
    emit('updated')
    toast.success('Éxito', 'Plan desasignado correctamente del grupo')
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al desasignar el plan'
    toast.error('Error', errorMessage)
  } finally {
    loadingDesasignacion.value = false
  }
}

const verPlan = (plan: PlanDeMuestreo) => {
  // Mostrar información del plan en un toast o modal simple
  toast.info('Plan ' + plan.codigo, `AQL: ${plan.aql} | Muestra: ${plan.tamano_muestra || 'N/A'} | Máx. defectos: ${plan.numero_maximo_fallas ?? 'N/A'}`)
}

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  Promise.all([
    cargarPlanesAsignados(),
    cargarPlanesDisponibles()
  ])
})
</script>