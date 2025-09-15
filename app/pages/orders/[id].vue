<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <div class="skeleton h-8 w-64"/>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="card p-6">
            <div class="skeleton h-6 w-32 mb-4"/>
            <div class="space-y-2">
              <div class="skeleton h-4 w-full"/>
              <div class="skeleton h-4 w-3/4"/>
              <div class="skeleton h-4 w-1/2"/>
            </div>
          </div>
        </div>
        <div class="space-y-6">
          <div class="card p-6">
            <div class="skeleton h-6 w-32 mb-4"/>
            <div class="skeleton h-20 w-full"/>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Content -->
    <div v-else-if="orderData" class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="navigateTo('/orders')"
          >
            <Icon name="bx:arrow-back" class="w-4 h-4 mr-2" />
            Volver a Órdenes
          </button>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Orden #{{ orderId }}</h1>
            <p class="text-gray-600 mt-1">{{ formatDate(orderData.orden.createdAt) }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <span 
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            :class="statusBadgeClass"
          >
            <Icon :name="statusIcon" class="w-4 h-4 mr-1" />
            {{ orderData.resumenInspeccion.statusFinal }}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Información de la Orden -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Información de la Orden</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Cliente</label>
                <p class="mt-1 text-sm text-gray-900">{{ orderData.orden.cliente }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Producto</label>
                <p class="mt-1 text-sm text-gray-900">{{ orderData.orden.producto }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Código de Producto</label>
                <p class="mt-1 text-sm text-gray-900">{{ orderData.orden.codigoProducto }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Pedido</label>
                <p class="mt-1 text-sm text-gray-900">{{ orderData.orden.pedido }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Lote</label>
                <p class="mt-1 text-sm text-gray-900">{{ orderData.orden.lote || 'N/A' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Fecha de Fabricación</label>
                <p class="mt-1 text-sm text-gray-900">{{ formatDate(orderData.orden.fechaFabricacion) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Turno</label>
                <p class="mt-1 text-sm text-gray-900">{{ orderData.orden.turno }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Máquina</label>
                <p class="mt-1 text-sm text-gray-900">{{ orderData.orden.maquina }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Número de Operario</label>
                <p class="mt-1 text-sm text-gray-900">{{ orderData.orden.numeroOperario }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Inspector de Calidad</label>
                <p class="mt-1 text-sm text-gray-900">{{ orderData.orden.inspectorCalidad }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Jefe de Turno</label>
                <p class="mt-1 text-sm text-gray-900">{{ orderData.orden.jefeTurno || 'N/A' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Orden de Compra</label>
                <p class="mt-1 text-sm text-gray-900">{{ orderData.orden.ordenCompra || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Información de Producción -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Información de Producción</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <p class="text-2xl font-bold text-blue-600">{{ orderData.resumenInspeccion.unidadesPorEmbalaje }}</p>
                <p class="text-sm text-blue-600">Unidades por Embalaje</p>
              </div>
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <p class="text-2xl font-bold text-green-600">{{ orderData.resumenInspeccion.cantidadEmbalajes }}</p>
                <p class="text-sm text-green-600">Cantidad de Embalajes</p>
              </div>
              <div class="text-center p-4 bg-purple-50 rounded-lg">
                <p class="text-2xl font-bold text-purple-600">{{ orderData.resumenInspeccion.muestreoReal }}</p>
                <p class="text-sm text-purple-600">Muestreo Realizado</p>
              </div>
            </div>
          </div>

          <!-- Resultados de Tests -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Resultados de Tests de Calidad</h3>
            <div class="space-y-4">
              <div
                v-for="test in orderData.tests"
                :key="test.id"
                class="flex items-center justify-between p-4 border rounded-lg"
                :class="test.aprobado ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'"
              >
                <div class="flex items-center space-x-3">
                  <Icon 
                    :name="test.aprobado ? 'bx:check-circle' : 'bx:x-circle'" 
                    class="w-5 h-5"
                    :class="test.aprobado ? 'text-green-500' : 'text-red-500'"
                  />
                  <div>
                    <p class="font-medium" :class="test.aprobado ? 'text-green-900' : 'text-red-900'">
                      {{ test.tests?.name || `Test ${test.tests?.id}` }}
                    </p>
                    <p class="text-sm" :class="test.aprobado ? 'text-green-700' : 'text-red-700'">
                      {{ test.aprobado ? 'Aprobado' : 'Rechazado' }}
                      <span v-if="test.cantidadUnidadesConFalla > 0">
                        - {{ test.cantidadUnidadesConFalla }} {{ test.cantidadUnidadesConFalla === 1 ? 'unidad' : 'unidades' }} con falla
                      </span>
                      <span v-else-if="!test.aprobado && test.cantidadUnidadesConFalla === 0">
                        - Falla general del test
                      </span>
                    </p>
                  </div>
                </div>
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="test.aprobado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ test.aprobado ? 'PASS' : 'FAIL' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Resumen de Inspección -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Resumen de Inspección</h3>
            <div class="space-y-4">
              <div
                class="text-center p-4 rounded-lg"
                :class="orderData.resumenInspeccion.statusFinal === 'Aprobado' ? 'bg-green-50' : 'bg-red-50'"
              >
                <p
                  class="text-3xl font-bold mb-1"
                  :class="orderData.resumenInspeccion.statusFinal === 'Aprobado' ? 'text-green-600' : 'text-red-600'"
                >
                  {{ orderData.resumenInspeccion.statusFinal }}
                </p>
                <p
                  class="text-sm"
                  :class="orderData.resumenInspeccion.statusFinal === 'Aprobado' ? 'text-green-600' : 'text-red-600'"
                >
                  Estado Final
                </p>
              </div>
              
              <div class="grid grid-cols-2 gap-4 text-center">
                <div class="p-3 bg-green-50 rounded-lg">
                  <p class="text-xl font-bold text-green-600">{{ orderData.resumenInspeccion.testsAprobados }}</p>
                  <p class="text-xs text-green-600">Aprobados</p>
                </div>
                <div class="p-3 bg-red-50 rounded-lg">
                  <p class="text-xl font-bold text-red-600">{{ orderData.resumenInspeccion.testsReprobados }}</p>
                  <p class="text-xs text-red-600">Rechazados</p>
                </div>
              </div>

              <div class="border-t pt-4">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Total de Tests:</span>
                  <span class="font-medium">{{ orderData.resumenInspeccion.testsTotal }}</span>
                </div>
                <div class="flex justify-between text-sm mt-2">
                  <span class="text-gray-600">Unidades con Falla:</span>
                  <span class="font-medium">{{ orderData.resumenInspeccion.totalUnidadesConFalla }}</span>
                </div>
                <div class="flex justify-between text-sm mt-2">
                  <span class="text-gray-600">Inspector:</span>
                  <span class="font-medium">{{ orderData.resumenInspeccion.inspector }}</span>
                </div>
                <div class="flex justify-between text-sm mt-2">
                  <span class="text-gray-600">Fecha de Inspección:</span>
                  <span class="font-medium">{{ formatDate(orderData.resumenInspeccion.fechaInspeccion) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Acciones -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Acciones</h3>
            <div class="space-y-3">
              <button 
                class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="exportToPDF"
              >
                <Icon name="bx:download" class="w-4 h-4 mr-2" />
                Exportar PDF
              </button>
              <button
                class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="printReport"
              >
                <Icon name="bx:printer" class="w-4 h-4 mr-2" />
                Imprimir Reporte
              </button>
              <button
                class="w-full inline-flex justify-center items-center px-4 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                @click="exportQRCodePDF"
              >
                <Icon name="bx:qr-scan" class="w-4 h-4 mr-2" />
                Descargar Código QR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <Icon name="bx:error-circle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Error al cargar la orden</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button 
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        @click="fetchOrder"
      >
        Reintentar
      </button>
    </div>

    <!-- Not Found State -->
    <div v-else class="text-center py-12">
      <Icon name="bx:file-blank" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Orden no encontrada</h3>
      <p class="text-gray-600 mb-4">
        La orden que buscas no existe o ha sido eliminada.
      </p>
      <button 
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        @click="navigateTo('/orders')"
      >
        Volver a Órdenes
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface OrderData {
  orden: {
    id: number
    cliente: string
    producto: string
    codigoProducto: string
    pedido: string
    lote?: string
    fechaFabricacion: string
    turno: string
    maquina: string
    numeroOperario: string
    inspectorCalidad: string
    jefeTurno?: string
    ordenCompra?: string
    unidadesPorEmbalaje: number
    cantidadEmbalajes: number
    muestreoReal: number
    status: string
    createdAt: string
  }
  tests: Array<{
    id: number
    aprobado: boolean
    cantidadUnidadesConFalla: number
    tests?: {
      id: number
      name: string
      type?: string
    }
  }>
  resumenInspeccion: {
    statusFinal: string
    testsTotal: number
    testsAprobados: number
    testsReprobados: number
    totalUnidadesConFalla: number
    unidadesPorEmbalaje: number
    cantidadEmbalajes: number
    muestreoReal: number
    fechaInspeccion: string
    inspector: string
  }
}

const route = useRoute()
const orderId = route.params.id as string

const orderData = ref<OrderData | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const statusBadgeClass = computed(() => {
  if (!orderData.value) return ''
  
  const status = orderData.value.resumenInspeccion.statusFinal
  return status === 'Aprobado' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800'
})

const statusIcon = computed(() => {
  if (!orderData.value) return 'bx:question-mark'
  
  const status = orderData.value.resumenInspeccion.statusFinal
  return status === 'Aprobado' ? 'bx:check-circle' : 'bx:x-circle'
})

const fetchOrder = async () => {
  loading.value = true
  error.value = null
  
  try {
    const { data } = await $fetch<{ success: boolean, data: OrderData }>(`/api/orders/${orderId}`)
    orderData.value = data
  } catch (err: unknown) {
    error.value = (err as any)?.data?.message || 'Error al cargar la orden'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) {
    return 'Fecha no disponible'
  }
  
  const date = new Date(dateString)
  
  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) {
    return 'Fecha inválida'
  }
  
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const exportToPDF = async () => {
  if (!orderData.value) {
    alert('No hay datos de orden para exportar')
    return
  }

  try {
    const { jsPDF } = await import('jspdf')
    
    // Crear un nuevo documento PDF
    const doc = new jsPDF('p', 'mm', 'a4')

    // Configuración del documento
    const margin = 20
    let yPosition = margin
    
    // Título del documento
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(`Orden #${orderId}`, margin, yPosition)
    yPosition += 15
    
    // Fecha de creación
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Fecha: ${formatDate(orderData.value.orden.createdAt)}`, margin, yPosition)
    yPosition += 10
    
    // Estado de la orden
    doc.setFont('helvetica', 'bold')
    doc.text(`Estado: ${orderData.value.resumenInspeccion.statusFinal}`, margin, yPosition)
    yPosition += 15
    
    // Información de la Orden
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('INFORMACIÓN DE LA ORDEN', margin, yPosition)
    yPosition += 10
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    const orderInfo = [
      ['Cliente:', orderData.value.orden.cliente],
      ['Producto:', orderData.value.orden.producto],
      ['Código de Producto:', orderData.value.orden.codigoProducto],
      ['Pedido:', orderData.value.orden.pedido],
      ['Lote:', orderData.value.orden.lote || 'N/A'],
      ['Fecha de Fabricación:', formatDate(orderData.value.orden.fechaFabricacion)],
      ['Turno:', orderData.value.orden.turno],
      ['Máquina:', orderData.value.orden.maquina],
      ['Número de Operario:', orderData.value.orden.numeroOperario],
      ['Inspector de Calidad:', orderData.value.orden.inspectorCalidad],
      ['Jefe de Turno:', orderData.value.orden.jefeTurno || 'N/A'],
      ['Orden de Compra:', orderData.value.orden.ordenCompra || 'N/A']
    ]
    
    orderInfo.forEach(([label, value]) => {
      doc.text(`${label} ${value}`, margin, yPosition)
      yPosition += 6
    })
    
    yPosition += 10
    
    // Información de Producción
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('INFORMACIÓN DE PRODUCCIÓN', margin, yPosition)
    yPosition += 10
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    const productionInfo = [
      ['Unidades por Embalaje:', orderData.value.resumenInspeccion.unidadesPorEmbalaje.toString()],
      ['Cantidad de Embalajes:', orderData.value.resumenInspeccion.cantidadEmbalajes.toString()],
      ['Muestreo Realizado:', orderData.value.resumenInspeccion.muestreoReal.toString()]
    ]
    
    productionInfo.forEach(([label, value]) => {
      doc.text(`${label} ${value}`, margin, yPosition)
      yPosition += 6
    })
    
    yPosition += 10
    
    // Resumen de Inspección
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('RESUMEN DE INSPECCIÓN', margin, yPosition)
    yPosition += 10
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    const inspectionInfo = [
      ['Total de Tests:', orderData.value.resumenInspeccion.testsTotal.toString()],
      ['Tests Aprobados:', orderData.value.resumenInspeccion.testsAprobados.toString()],
      ['Tests Rechazados:', orderData.value.resumenInspeccion.testsReprobados.toString()],
      ['Unidades con Falla:', orderData.value.resumenInspeccion.totalUnidadesConFalla.toString()],
      ['Inspector:', orderData.value.resumenInspeccion.inspector],
      ['Fecha de Inspección:', formatDate(orderData.value.resumenInspeccion.fechaInspeccion)]
    ]
    
    inspectionInfo.forEach(([label, value]) => {
      doc.text(`${label} ${value}`, margin, yPosition)
      yPosition += 6
    })
    
    yPosition += 10
    
    // Verificar si necesitamos una nueva página
    const pageHeight = doc.internal.pageSize.getHeight()
    if (yPosition > pageHeight - 50) {
      doc.addPage()
      yPosition = margin
    }
    
    // Resultados de Tests
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('RESULTADOS DE TESTS DE CALIDAD', margin, yPosition)
    yPosition += 10
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    orderData.value.tests.forEach((test, index) => {
      const currentPageHeight = doc.internal.pageSize.getHeight()
      if (yPosition > currentPageHeight - 30) {
        doc.addPage()
        yPosition = margin
      }
      
      const testName = test.tests?.name || `Test ${test.tests?.id}`
      const status = test.aprobado ? 'APROBADO' : 'RECHAZADO'
      const failUnits = test.cantidadUnidadesConFalla > 0 
        ? ` - ${test.cantidadUnidadesConFalla} ${test.cantidadUnidadesConFalla === 1 ? 'unidad' : 'unidades'} con falla`
        : ''
      
      doc.setFont('helvetica', 'bold')
      doc.text(`${index + 1}. ${testName}`, margin, yPosition)
      yPosition += 5
      
      doc.setFont('helvetica', 'normal')
      doc.text(`Estado: ${status}${failUnits}`, margin + 5, yPosition)
      yPosition += 8
    })
    
    // Guardar el PDF
    const fileName = `orden-${orderId}-${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
    
  } catch {
    alert('Error al generar el PDF. Por favor, inténtalo de nuevo.')
  }
}

const printReport = () => {
  window.print()
}

const exportQRCodePDF = async () => {
  if (!orderData.value) {
    alert('No hay datos de orden para generar el código QR')
    return
  }

  try {
    const { jsPDF } = await import('jspdf')
    const QRCode = await import('qrcode')

    // Obtener el dominio según el entorno
    const appConfig = useAppConfig()
    const isDevelopment = process.env.NODE_ENV === 'development' || import.meta.dev

    // En desarrollo, obtener la IP real del servidor
    let baseDomain: string
    if (isDevelopment) {
      try {
        const serverIpResponse = await $fetch<{ success: boolean, ip: string }>('/api/server-ip')
        const serverIp = serverIpResponse.success ? serverIpResponse.ip : 'localhost'
        const currentPort = window.location.port || '3000'
        baseDomain = `http://${serverIp}:${currentPort}`
      } catch (error) {
        // Fallback si falla la API
        baseDomain = window.location.origin
      }
    } else {
      baseDomain = appConfig.domain?.production || window.location.origin
    }

    // Generar la URL completa de la orden
    const orderURL = `${baseDomain}/orders/${orderId}`

    // Crear un nuevo documento PDF
    const doc = new jsPDF('p', 'mm', 'a4')

    // Configuración del documento
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let yPosition = margin + 20

    // Título del documento
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('Etiqueta QR - Orden', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 20

    // Información básica de la orden
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')

    const orderInfo = [
      `Número de Pedido: ${orderData.value.orden.pedido}`,
      `Cliente: ${orderData.value.orden.cliente}`,
      `Estado: ${orderData.value.resumenInspeccion.statusFinal}`,
      `Fecha: ${formatDate(orderData.value.orden.createdAt)}`
    ]

    orderInfo.forEach(info => {
      doc.text(info, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 8
    })

    yPosition += 10

    // Generar código QR
    const qrCodeDataURL = await QRCode.toDataURL(orderURL, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    // Agregar código QR al PDF (centrado)
    const qrSize = 60
    const qrX = (pageWidth - qrSize) / 2
    doc.addImage(qrCodeDataURL, 'PNG', qrX, yPosition, qrSize, qrSize)

    // Guardar el PDF
    const fileName = `qr-orden-${orderData.value.orden.pedido}-${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error al generar el PDF con código QR:', error)
    alert('Error al generar el PDF con código QR. Por favor, inténtalo de nuevo.')
  }
}

onMounted(() => {
  fetchOrder()
})

useSeoMeta({
  title: `Orden ${orderId} - Sistema de Inspección`,
  description: `Detalles de la orden ${orderId} incluyendo resultados de inspección y tests de calidad.`
})

definePageMeta({
  middleware: ['auth']
})
</script>