<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header Section -->
    <div class="relative">
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-blue-600/5 to-purple-600/10"/>
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0); background-size: 32px 32px;"/>
      
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div class="text-center">
          <div class="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
            <Icon name="bx:user-circle" class="w-4 h-4 mr-2" />
            Información Personal
          </div>
          <h1 class="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-900 bg-clip-text text-transparent">
            Mi Perfil
          </h1>
          <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Gestiona tu información personal y mantén tu cuenta actualizada
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div class="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 overflow-hidden">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-16 px-8">
          <div class="relative">
            <div class="w-20 h-20 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Icon name="bx:loader" class="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
            <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-2xl blur-lg"/>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Cargando información</h3>
          <p class="text-gray-600">Obteniendo los datos de tu perfil...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-16 px-8">
          <div class="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Icon name="bx:error-circle" class="w-10 h-10 text-red-500" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3">Oops, algo salió mal</h3>
          <p class="text-red-600 mb-6 leading-relaxed">{{ error }}</p>
          <button 
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-200 transform hover:scale-105"
            @click="loadProfile"
          >
            <Icon name="bx:refresh" class="w-4 h-4 mr-2" />
            Reintentar
          </button>
        </div>

        <!-- Profile Content -->
        <div v-else-if="profile">
          <!-- Profile Header -->
          <div class="relative bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-600 px-8 pt-12 pb-20">
            <div class="absolute inset-0 bg-black/10"/>
            <div class="absolute inset-0 opacity-10">
              <div class="w-full h-full" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 20px 20px;"/>
            </div>
            
            <div class="relative text-center">
              <!-- Avatar -->
              <div class="relative inline-block">
                <div class="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl">
                  <Icon name="bx:user-circle" class="w-14 h-14 text-white" />
                </div>
                <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                  <Icon name="bx:check" class="w-4 h-4 text-white" />
                </div>
              </div>
              
              <!-- Name and Role -->
              <div class="mt-6">
                <h2 class="text-2xl font-bold text-white">
                  {{ profile.full_name || 'Sin nombre configurado' }}
                </h2>
                <div class="inline-flex items-center mt-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <Icon name="bx:briefcase" class="w-4 h-4 text-white/80 mr-2" />
                  <span class="text-white/90 font-medium">{{ profile.user_role }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Information Section -->
          <div class="px-8 py-8 -mt-12 relative z-10">
            <!-- Content Card -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <!-- Edit Mode -->
              <form 
                v-if="isEditing" 
                class="space-y-6" 
                @submit.prevent="saveProfile"
              >
                <div class="mb-8">
                  <div class="flex items-center mb-6">
                    <div class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                      <Icon name="bx:edit" class="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">Editar Información</h3>
                      <p class="text-sm text-gray-600">Actualiza tus datos personales</p>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label for="firstName" class="block text-sm font-semibold text-gray-800">
                      Nombre *
                    </label>
                    <div class="relative">
                      <input
                        id="firstName"
                        v-model="editForm.first_name"
                        type="text"
                        required
                        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-200"
                        :disabled="saving"
                        placeholder="Ingresa tu nombre"
                      >
                      <Icon name="bx:user" class="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label for="lastName" class="block text-sm font-semibold text-gray-800">
                      Apellido *
                    </label>
                    <div class="relative">
                      <input
                        id="lastName"
                        v-model="editForm.last_name"
                        type="text"
                        required
                        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-200"
                        :disabled="saving"
                        placeholder="Ingresa tu apellido"
                      >
                      <Icon name="bx:user" class="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-800">
                    Email
                  </label>
                  <div class="relative">
                    <input
                      type="email"
                      :value="profile.email"
                      disabled
                      class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                    >
                    <Icon name="bx:envelope" class="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                  </div>
                  <div class="flex items-center mt-2">
                    <Icon name="bx:info-circle" class="w-4 h-4 text-amber-500 mr-2" />
                    <p class="text-xs text-gray-600">El email no se puede modificar por seguridad</p>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-3 pt-6">
                  <button
                    type="submit"
                    :disabled="saving"
                    class="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Icon 
                      v-if="saving" 
                      name="bx:loader" 
                      class="w-4 h-4 mr-2 animate-spin" 
                    />
                    <Icon 
                      v-else 
                      name="bx:check" 
                      class="w-4 h-4 mr-2" 
                    />
                    <span v-if="saving">Guardando...</span>
                    <span v-else>Guardar Cambios</span>
                  </button>
                  
                  <button
                    type="button"
                    :disabled="saving"
                    class="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    @click="cancelEdit"
                  >
                    <Icon name="bx:x" class="w-4 h-4 mr-2" />
                    Cancelar
                  </button>
                </div>
              </form>

              <!-- View Mode -->
              <div v-else class="space-y-8">
                <div class="flex items-center mb-6">
                  <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <Icon name="bx:info-circle" class="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">Información Personal</h3>
                    <p class="text-sm text-gray-600">Detalles de tu cuenta</p>
                  </div>
                </div>

                <!-- Information Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 p-6 rounded-xl border border-gray-200/50">
                    <div class="flex items-start">
                      <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                        <Icon name="bx:user" class="w-4 h-4 text-indigo-600" />
                      </div>
                      <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
                        <p class="text-gray-900 font-semibold">{{ profile.first_name || 'No especificado' }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 p-6 rounded-xl border border-gray-200/50">
                    <div class="flex items-start">
                      <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                        <Icon name="bx:user" class="w-4 h-4 text-indigo-600" />
                      </div>
                      <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Apellido</label>
                        <p class="text-gray-900 font-semibold">{{ profile.last_name || 'No especificado' }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 p-6 rounded-xl border border-gray-200/50">
                    <div class="flex items-start">
                      <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                        <Icon name="bx:envelope" class="w-4 h-4 text-blue-600" />
                      </div>
                      <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <p class="text-gray-900 font-semibold text-sm break-all">{{ profile.email || 'No especificado' }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="bg-gradient-to-br from-gray-50 to-gray-100/50 p-6 rounded-xl border border-gray-200/50">
                    <div class="flex items-start">
                      <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 mt-1">
                        <Icon name="bx:briefcase" class="w-4 h-4 text-purple-600" />
                      </div>
                      <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Rol</label>
                        <div class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-full">
                          {{ profile.user_role }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Edit Button -->
                <div class="pt-4">
                  <button
                    class="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                    @click="startEdit"
                  >
                    <Icon name="bx:edit" class="w-5 h-5 mr-2" />
                    <span>Editar Información</span>
                    <Icon name="bx:chevron-right" class="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Info Section -->
      <div class="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mr-4">
            <Icon name="bx:shield-check" class="w-5 h-5 text-amber-600" />
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900">Seguridad de tu cuenta</h4>
            <p class="text-sm text-gray-600 mt-1">
              Tu información está protegida y encriptada. Solo tú puedes modificar estos datos.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Profile, UpdateProfileForm } from '~/types'

const { getCurrentProfile, updateProfile } = useProfile()

// Reactive state
const profile = ref<Profile | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const isEditing = ref(false)
const saving = ref(false)

// Configuration for loading experience
const LOADING_CONFIG = {
  messages: [
    '🚀 Preparando tu perfil...',
    '✨ Organizando tu información...',
    '🎯 Casi listo...',
    '💫 Últimos detalles...'
  ],
  messageInterval: 800
}

const currentLoadingMessage = ref(0)

// Edit form
const editForm = ref<UpdateProfileForm>({
  first_name: '',
  last_name: ''
})

// Load profile data with delightful loading
const loadProfile = async () => {
  try {
    loading.value = true
    error.value = null
    currentLoadingMessage.value = 0
    
    // Cycle through loading messages for a delightful experience
    const messageInterval = setInterval(() => {
      currentLoadingMessage.value = (currentLoadingMessage.value + 1) % LOADING_CONFIG.messages.length
    }, LOADING_CONFIG.messageInterval)
    
    profile.value = await getCurrentProfile()
    
    clearInterval(messageInterval)
    
    if (!profile.value) {
      error.value = 'No se pudo cargar el perfil del usuario'
    }
  } catch (err) {
    error.value = 'Error al cargar el perfil: ' + (err as Error).message
  } finally {
    loading.value = false
  }
}

// Start editing with smooth transition
const startEdit = () => {
  if (profile.value) {
    editForm.value = {
      first_name: profile.value.first_name,
      last_name: profile.value.last_name
    }
    isEditing.value = true
    
    // Add a small delay to allow the animation to be visible
    nextTick(() => {
      const firstInput = document.querySelector('#firstName') as HTMLInputElement
      if (firstInput) {
        firstInput.focus()
      }
    })
  }
}

// Cancel editing with smooth transition
const cancelEdit = () => {
  isEditing.value = false
  editForm.value = {
    first_name: '',
    last_name: ''
  }
}

// Save profile with celebration
const saveProfile = async () => {
  try {
    saving.value = true
    const updatedProfile = await updateProfile(editForm.value)
    profile.value = updatedProfile
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    
    isEditing.value = false
    
    // Show success message with celebration
    const toast = useToast()
    if (toast) {
      toast.success('🎉 ¡Perfil actualizado exitosamente!')
    }
    
    // Trigger confetti effect (if available)
    triggerCelebration()
    
  } catch (err) {
    error.value = 'Error al actualizar el perfil: ' + (err as Error).message
  } finally {
    saving.value = false
  }
}

// Celebration effect configuration
const CELEBRATION_CONFIG = {
  confettiCount: 50,
  colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
  duration: 3000,
  delayBetweenConfetti: 50
}

const createConfettiElement = (color: string): HTMLElement => {
  const confetti = document.createElement('div')
  
  // Apply styles directly to avoid TypeScript issues
  confetti.style.cssText = `
    position: fixed;
    top: 20%;
    left: ${Math.random() * 100}%;
    width: 8px;
    height: 8px;
    background: ${color};
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    animation: confetti-fall 3s ease-in-out forwards;
  `
  
  return confetti
}

const triggerCelebration = () => {
  for (let i = 0; i < CELEBRATION_CONFIG.confettiCount; i++) {
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * CELEBRATION_CONFIG.colors.length)
      const randomColor = CELEBRATION_CONFIG.colors[randomIndex]!
      const confetti = createConfettiElement(randomColor)
      
      document.body.appendChild(confetti)
      
      setTimeout(() => {
        confetti.remove()
      }, CELEBRATION_CONFIG.duration)
    }, i * CELEBRATION_CONFIG.delayBetweenConfetti)
  }
}

// Load profile on component mount
onMounted(() => {
  loadProfile()
})

definePageMeta({
  middleware: 'auth'
})

useSeoMeta({
  title: 'Perfil - Inaplast',
  description: 'Gestiona la información de tu perfil personal.'
})
</script>

<style>
@import '~/assets/css/profile.css';
</style>