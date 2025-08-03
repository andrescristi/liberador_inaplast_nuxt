<template>
  <!-- Magical Particles Background -->
  <MagicalParticles :count="10" :enabled="!loading" />
  
  <!-- Success celebration for save actions -->
  <ConfettiCelebration ref="confettiRef" />
  
  <!-- Profile Avatar Sparkles -->
  <div v-if="avatarSparkles" class="avatar-sparkles-container">
    <div 
      v-for="sparkle in avatarSparklesList" 
      :key="sparkle.id"
      class="avatar-sparkle"
      :style="{
        left: sparkle.x + 'px',
        top: sparkle.y + 'px',
        animationDelay: sparkle.delay + 's'
      }"
    >
      {{ sparkle.emoji }}
    </div>
  </div>
  
  <!-- Floating Hearts -->
  <div v-if="showFloatingHearts" class="floating-hearts-container">
    <div 
      v-for="heart in floatingHeartsList" 
      :key="heart.id"
      class="floating-heart"
      :style="{
        left: heart.x + 'px',
        top: heart.y + 'px',
        animationDelay: (heart.id * 0.2) + 's'
      }"
    >
      💖
    </div>
  </div>
  
  <!-- Magical Cursor Trail -->
  <div v-if="magicalCursor" class="cursor-trail" :style="{ left: mouseCursor.x + 'px', top: mouseCursor.y + 'px' }">
    <div class="cursor-sparkle">✨</div>
  </div>
  
  <!-- Profile Energy Bar -->
  <div class="profile-energy-container" v-if="!loading">
    <div class="profile-energy-bar">
      <div class="profile-energy-label">Energía del Perfil</div>
      <div class="energy-bar-container">
        <div 
          class="energy-bar-fill" 
          :style="{ 
            width: profileEnergy + '%', 
            backgroundColor: getProfileEnergyColor(),
            boxShadow: `0 0 10px ${getProfileEnergyColor()}50`
          }"
        ></div>
        <div class="energy-bar-text">{{ profileEnergy }}%</div>
      </div>
    </div>
    
    <!-- XP Progress -->
    <div class="xp-progress-container" v-if="profileXP > 0">
      <div class="xp-label">Nivel {{ Math.floor(profileXP / 100) + 1 }} - XP: {{ profileXP % 100 }}/100</div>
      <div class="xp-bar-container">
        <div 
          class="xp-bar-fill" 
          :style="{ width: (profileXP % 100) + '%' }"
          :class="{ 'level-up': levelUpEffect }"
        ></div>
      </div>
    </div>
  </div>
  
  <!-- Profile Load Animation Overlay -->
  <div v-if="profileLoadAnimation" class="profile-load-overlay">
    <div class="profile-load-content">
      <div class="magical-loader"></div>
      <p class="load-text">Cargando perfil mágico...</p>
    </div>
  </div>
  
  <div class="min-h-screen relative z-10">
    <!-- Navigation -->
    <AppNavigation />

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header with Breadcrumb -->
      <div class="mb-8">
        <nav class="flex text-sm text-glass-muted mb-4" aria-label="Breadcrumb">
          <NuxtLink to="/" class="hover:text-glass transition-colors duration-200">
            Dashboard
          </NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-glass">Mi Perfil</span>
        </nav>
        <h1 class="text-3xl font-bold text-glass mb-2">Mi Perfil</h1>
        <p class="text-glass-secondary">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="glass-card p-8 text-center">
        <div class="flex items-center justify-center space-x-3">
          <div class="spinner-magical"></div>
          <p class="text-glass-secondary animate-pulse">Cargando tu perfil...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="glass-card p-8 text-center">
        <div class="glass-icon-container w-16 h-16 mx-auto mb-4">
          <Icon name="lucide:alert-triangle" class="w-8 h-8 text-red-400" />
        </div>
        <h3 class="text-lg font-semibold text-glass mb-2">Error al cargar el perfil</h3>
        <p class="text-glass-secondary mb-4">{{ error }}</p>
        <button @click="loadProfile" class="btn-glass-primary">
          <Icon name="lucide:refresh-cw" class="w-4 h-4 mr-2" />
          Reintentar
        </button>
      </div>

      <!-- Profile Content -->
      <div v-else-if="profile" class="profile-container">
        <!-- Profile Hero Section -->
        <div class="glass-card-magical profile-hero mb-8">
          <div class="profile-hero-content">
            <!-- Avatar Area -->
            <div class="profile-avatar-container">
              <div class="profile-avatar-wrapper">
                <div 
                  class="profile-avatar magical-avatar"
                  @click="onAvatarClick"
                  @mouseenter="onAvatarHover"
                  :class="{ 
                    'avatar-excited': avatarClickCount >= 3, 
                    'avatar-dancing': avatarClickCount >= 5,
                    'avatar-sleeping': isProfileSleeping,
                    'avatar-energetic': profileEnergy > 80,
                    'avatar-tired': profileEnergy < 20,
                    [`avatar-aura-${profileAura}`]: profileAura !== 'none'
                  }"
                >
                  {{ getInitials(profile.full_name || profile.first_name + ' ' + profile.last_name) }}
                  <div class="avatar-glow"></div>
                  <div class="avatar-pulse"></div>
                  
                  <!-- Avatar mood indicator -->
                  <div class="avatar-mood-indicator" :class="`mood-${profileMood}`">
                    <span v-if="profileMood === 'happy'">😊</span>
                    <span v-else-if="profileMood === 'excited'">🤩</span>
                    <span v-else-if="profileMood === 'sleepy'">😴</span>
                  </div>
                  
                  <!-- Energy level indicator -->
                  <div class="avatar-energy-ring" :style="{ strokeDasharray: `${profileEnergy * 2.83}, 283` }">
                    <svg width="100" height="100" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        :stroke="getProfileEnergyColor()" 
                        stroke-width="3" 
                        stroke-linecap="round"
                        transform="rotate(-90 50 50)"
                        class="energy-progress-circle"
                      />
                    </svg>
                  </div>
                </div>
                <div 
                  :class="['role-badge', 'magical-role-badge', profile.user_role.toLowerCase()]"
                  @click="onRoleBadgeClick"
                  :title="getRoleDescription(profile.user_role)"
                >
                  <Icon :name="getRoleIcon(profile.user_role)" class="w-3 h-3 mr-1" />
                  {{ getRoleDisplayName(profile.user_role) }}
                  <div class="role-shimmer"></div>
                </div>
              </div>
            </div>
            
            <!-- Basic Info -->
            <div class="profile-basic-info">
              <h1 class="profile-name">{{ profile.full_name || `${profile.first_name} ${profile.last_name}` }}</h1>
              <p class="profile-email">{{ profile.email }}</p>
              <p class="profile-meta">
                Cuenta creada: {{ formatDate(profile.created_at) }}
              </p>
            </div>
            
            <!-- Quick Actions -->
            <div class="profile-actions">
              <button 
                v-if="!editMode" 
                @click="enableEdit" 
                class="btn-glass-secondary magical-edit-btn"
                :disabled="saving"
              >
                <Icon name="lucide:edit" class="w-4 h-4 mr-1 edit-icon" />
                Editar Perfil
                <div class="btn-magical-sparkle"></div>
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="profile-content-grid">
          <!-- Personal Information Card -->
          <div 
            class="glass-card profile-info-card magical-card"
            @mouseenter="onCardHover('info', true)"
            @mouseleave="onCardHover('info', false)"
            :class="{ 'card-glowing': cardHoverStates.info }"
          >
            <div class="card-header">
              <div class="card-header-content">
                <div class="card-icon-container magical-icon-container">
                  <Icon name="lucide:user" class="w-5 h-5 text-blue-400 magical-icon" />
                  <div class="icon-particles"></div>
                </div>
                <h3 class="card-title magical-title">Información Personal</h3>
              </div>
              <button 
                v-if="!editMode" 
                @click="enableEdit" 
                class="btn-glass-secondary text-sm"
                :disabled="saving"
              >
                <Icon name="lucide:edit" class="w-4 h-4 mr-1" />
                Editar
              </button>
            </div>
            
            <div class="card-content">
              <!-- View Mode -->
              <div v-if="!editMode" class="info-display">
                <div class="info-item">
                  <label class="info-label">Nombre</label>
                  <p class="info-value">{{ profile.first_name }}</p>
                </div>
                <div class="info-item">
                  <label class="info-label">Apellido</label>
                  <p class="info-value">{{ profile.last_name }}</p>
                </div>
                <div class="info-item">
                  <label class="info-label">Email</label>
                  <p class="info-value">{{ profile.email }}</p>
                </div>
              </div>
              
              <!-- Edit Mode -->
              <form v-else @submit.prevent="saveChanges" class="edit-form">
                <div class="form-group">
                  <label class="form-label-glass required">Nombre</label>
                  <input
                    v-model="editData.first_name"
                    type="text"
                    class="form-input-magical"
                    :class="{ 'border-red-500 shake': validationErrors.first_name }"
                    placeholder="Ingresa tu nombre"
                    required
                    @input="clearValidationError('first_name')"
                  />
                  <div v-if="validationErrors.first_name" class="error-message">
                    {{ validationErrors.first_name }}
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label-glass required">Apellido</label>
                  <input
                    v-model="editData.last_name"
                    type="text"
                    class="form-input-magical"
                    :class="{ 'border-red-500 shake': validationErrors.last_name }"
                    placeholder="Ingresa tu apellido"
                    required
                    @input="clearValidationError('last_name')"
                  />
                  <div v-if="validationErrors.last_name" class="error-message">
                    {{ validationErrors.last_name }}
                  </div>
                </div>
                <div class="form-actions">
                  <button 
                    type="button" 
                    @click="cancelEdit" 
                    class="btn-glass-secondary"
                    :disabled="saving"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    class="btn-glass-primary magical-save-btn" 
                    :disabled="saving || !isFormValid"
                    :class="{ 'btn-saving': saving, 'btn-ready': isFormValid && !saving }"
                    @click="onSaveClick"
                  >
                    <span v-if="saving" class="flex items-center">
                      <div class="spinner-magical mr-2"></div>
                      <span class="saving-text">{{ getSavingMessage() }}</span>
                    </span>
                    <span v-else class="flex items-center save-content">
                      <Icon name="lucide:save" class="w-4 h-4 mr-1 save-icon" />
                      Guardar Cambios
                      <div class="btn-success-particles"></div>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Role & Permissions Card -->
          <div 
            class="glass-card profile-role-card magical-card"
            @mouseenter="onCardHover('role', true)"
            @mouseleave="onCardHover('role', false)"
            :class="{ 'card-glowing': cardHoverStates.role }"
          >
            <div class="card-header">
              <div class="card-header-content">
                <div class="card-icon-container magical-icon-container">
                  <Icon name="lucide:user-check" class="w-5 h-5 text-purple-400 magical-icon" />
                  <div class="icon-particles"></div>
                </div>
                <h3 class="card-title magical-title">Rol y Permisos</h3>
              </div>
            </div>
            
            <div class="card-content">
              <div class="role-section">
                <div class="current-role magical-role-display">
                  <div 
                    :class="['role-badge-large', 'interactive-role-badge', profile.user_role.toLowerCase()]"
                    @click="onLargeRoleBadgeClick"
                    @mouseenter="startRoleGlow"
                    @mouseleave="stopRoleGlow"
                  >
                    <Icon :name="getRoleIcon(profile.user_role)" class="w-5 h-5 mr-2 role-icon" />
                    {{ getRoleDisplayName(profile.user_role) }}
                    <div class="role-crown" v-if="profile.user_role === 'Admin'">👑</div>
                    <div class="role-magic-circle"></div>
                  </div>
                  <p class="role-description magical-description">
                    {{ getRoleDescription(profile.user_role) }}
                  </p>
                </div>
                
                <div class="permissions-list">
                  <h4 class="permissions-title">Permisos disponibles:</h4>
                  <ul class="permissions-items">
                    <li 
                      v-for="permission in getUserPermissions(profile.user_role)" 
                      :key="permission" 
                      class="permission-item"
                    >
                      <Icon name="lucide:check" class="w-4 h-4 text-green-400" />
                      {{ permission }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Settings Card -->
          <div 
            class="glass-card profile-security-card magical-card"
            @mouseenter="onCardHover('security', true)"
            @mouseleave="onCardHover('security', false)"
            :class="{ 'card-glowing': cardHoverStates.security }"
          >
            <div class="card-header">
              <div class="card-header-content">
                <div class="card-icon-container magical-icon-container">
                  <Icon name="lucide:shield-check" class="w-5 h-5 text-green-400 magical-icon" />
                  <div class="icon-particles"></div>
                </div>
                <h3 class="card-title magical-title">Configuración de Seguridad</h3>
              </div>
            </div>
            
            <div class="card-content">
              <div class="security-section">
                <div class="security-item">
                  <div class="security-item-info">
                    <h4 class="security-item-title">Contraseña</h4>
                    <p class="security-item-description">
                      Mantén tu cuenta segura con una contraseña fuerte
                    </p>
                  </div>
                  <button 
                    @click="showPasswordModal = true" 
                    class="btn-glass-secondary magical-security-btn"
                    :disabled="saving"
                  >
                    <Icon name="lucide:key" class="w-4 h-4 mr-1 security-key-icon" />
                    Cambiar
                    <div class="security-shield-glow"></div>
                  </button>
                </div>
                
                <div class="security-status">
                  <div class="status-indicator success">
                    <Icon name="lucide:check-circle" class="w-4 h-4 mr-2" />
                    Cuenta segura
                  </div>
                  <p class="status-description">
                    Tu cuenta cumple con todos los requisitos de seguridad.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Activity Summary Card (Optional) -->
          <div 
            class="glass-card profile-activity-card magical-card"
            @mouseenter="onCardHover('activity', true)"
            @mouseleave="onCardHover('activity', false)"
            :class="{ 'card-glowing': cardHoverStates.activity }"
          >
            <div class="card-header">
              <div class="card-header-content">
                <div class="card-icon-container magical-icon-container">
                  <Icon name="lucide:activity" class="w-5 h-5 text-indigo-400 magical-icon" />
                  <div class="icon-particles"></div>
                </div>
                <h3 class="card-title magical-title">Resumen de Actividad</h3>
              </div>
            </div>
            
            <div class="card-content">
              <div class="activity-stats">
                <div class="activity-stat">
                  <div class="activity-stat-icon">
                    <Icon name="lucide:calendar" class="w-4 h-4 text-blue-400" />
                  </div>
                  <div class="activity-stat-content">
                    <span class="activity-stat-label">Miembro desde</span>
                    <span class="activity-stat-value">{{ getRelativeTime(profile.created_at) }}</span>
                  </div>
                </div>
                <div class="activity-stat">
                  <div class="activity-stat-icon">
                    <Icon name="lucide:clock" class="w-4 h-4 text-green-400" />
                  </div>
                  <div class="activity-stat-content">
                    <span class="activity-stat-label">Última actualización</span>
                    <span class="activity-stat-value">{{ getRelativeTime(profile.updated_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Password Change Modal -->
    <PasswordChangeModal 
      v-if="showPasswordModal" 
      @close="showPasswordModal = false"
      @success="onPasswordChangeSuccess"
    />

    <!-- Toast Notifications -->
    <DelightfulToast 
      v-if="toast.show"
      :type="toast.type"
      :message="toast.message"
      @close="toast.show = false"
    />
  </div>
</template>

<script setup lang="ts">
import type { Profile, UpdateProfileForm } from '~/types'

// Composables
const { getCurrentProfile, updateProfile } = useProfile()
const { updatePassword } = useAuth()

// Page meta
definePageMeta({
  middleware: 'auth'
})

// SEO
useSeoMeta({
  title: 'Mi Perfil - Order Management',
  description: 'Gestiona tu información personal y configuración de cuenta.'
})

// Reactive state
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const profile = ref<Profile | null>(null)
const editMode = ref(false)
const showPasswordModal = ref(false)
const confettiRef = ref()

// Delightful interaction states
const avatarClickCount = ref(0)
const avatarSparkles = ref(false)
const avatarSparklesList = ref<Array<{id: number, x: number, y: number, delay: number, emoji: string}>>([])
const konamiSequence = ref<string[]>([])
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']
const showEasterEgg = ref(false)
const savingMessageIndex = ref(0)

// New delightful interaction states
const profileEnergy = ref(100)
const lastInteractionTime = ref(Date.now())
const isProfileSleeping = ref(false)
const profileMood = ref('happy')
const mouseCursor = ref({ x: 0, y: 0 })
const showFloatingHearts = ref(false)
const floatingHeartsList = ref<Array<{id: number, x: number, y: number}>>([])
const profileLoadAnimation = ref(true)
const cardHoverStates = ref<Record<string, boolean>>({})
const magicalCursor = ref(false)
const profileAura = ref('none')
const easterEggUnlocked = ref(false)
const profileXP = ref(0)
const levelUpEffect = ref(false)

// Edit form data
const editData = ref<UpdateProfileForm>({
  first_name: '',
  last_name: ''
})

// Validation
const validationErrors = ref<Record<string, string>>({})

// Toast notifications
const toast = ref({
  show: false,
  type: 'success' as 'success' | 'error' | 'info',
  message: ''
})

// Computed
const isFormValid = computed(() => {
  return editData.value.first_name?.trim() && 
         editData.value.last_name?.trim() &&
         Object.keys(validationErrors.value).length === 0
})

// Lifecycle
onMounted(async () => {
  await loadProfile()
})

// Methods
const loadProfile = async () => {
  try {
    loading.value = true
    error.value = null
    
    const userProfile = await getCurrentProfile()
    if (userProfile) {
      profile.value = userProfile
    } else {
      error.value = 'No se pudo cargar tu perfil'
    }
  } catch (err) {
    console.error('Error loading profile:', err)
    error.value = err instanceof Error ? err.message : 'Error desconocido'
  } finally {
    loading.value = false
  }
}

const enableEdit = () => {
  if (!profile.value) return
  
  editMode.value = true
  editData.value = {
    first_name: profile.value.first_name,
    last_name: profile.value.last_name
  }
  validationErrors.value = {}
}

const cancelEdit = () => {
  editMode.value = false
  editData.value = { first_name: '', last_name: '' }
  validationErrors.value = {}
}

const validateForm = (): boolean => {
  const errors: Record<string, string> = {}
  
  // First name validation
  if (!editData.value.first_name?.trim()) {
    errors.first_name = 'El nombre es requerido'
  } else if (editData.value.first_name.trim().length < 2) {
    errors.first_name = 'El nombre debe tener al menos 2 caracteres'
  } else if (editData.value.first_name.trim().length > 50) {
    errors.first_name = 'El nombre no puede tener más de 50 caracteres'
  } else if (!/^[a-zA-ZáéíóúñÑ\s]+$/.test(editData.value.first_name.trim())) {
    errors.first_name = 'Solo se permiten letras y espacios'
  }
  
  // Last name validation
  if (!editData.value.last_name?.trim()) {
    errors.last_name = 'El apellido es requerido'
  } else if (editData.value.last_name.trim().length < 2) {
    errors.last_name = 'El apellido debe tener al menos 2 caracteres'
  } else if (editData.value.last_name.trim().length > 50) {
    errors.last_name = 'El apellido no puede tener más de 50 caracteres'
  } else if (!/^[a-zA-ZáéíóúñÑ\s]+$/.test(editData.value.last_name.trim())) {
    errors.last_name = 'Solo se permiten letras y espacios'
  }
  
  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

const clearValidationError = (field: string) => {
  if (validationErrors.value[field]) {
    delete validationErrors.value[field]
  }
}

const saveChanges = async () => {
  if (!validateForm() || !profile.value) return
  
  try {
    saving.value = true
    
    const updateData: UpdateProfileForm = {
      first_name: editData.value.first_name?.trim(),
      last_name: editData.value.last_name?.trim()
    }
    
    const updatedProfile = await updateProfile(updateData)
    
    // Update local profile data
    profile.value = {
      ...profile.value,
      ...updatedProfile,
      full_name: `${updatedProfile.first_name} ${updatedProfile.last_name}`
    }
    
    // Exit edit mode
    editMode.value = false
    
    // Show success animation
    if (confettiRef.value) {
      confettiRef.value.celebrate()
    }
    
    // Trigger avatar celebration
    triggerAvatarCelebration()
    
    // Award XP for updating profile
    awardXP(50)
    
    // Show success toast with random delightful message
    const successMessages = [
      '✨ ¡Tu perfil brilla con nueva información!',
      '🎉 ¡Cambios guardados con éxito mágico!',
      '🌟 ¡Tu perfil está más genial que nunca!',
      '💫 ¡Actualización completada con estilo!',
      '🎊 ¡Perfil renovado y reluciente!',
      '🌈 ¡Datos actualizados con magia arcoíris!',
      '⚡ ¡Perfil cargado con energía positiva!',
      '🎭 ¡Tu nueva identidad está lista para brillar!'
    ]
    const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)]
    showToast('success', randomMessage)
    
    // Set profile aura for a few seconds
    profileAura.value = 'success'
    setTimeout(() => {
      profileAura.value = 'none'
    }, 3000)
    
  } catch (err) {
    console.error('Error updating profile:', err)
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
    showToast('error', `❌ Error al actualizar: ${errorMessage}`)
  } finally {
    saving.value = false
  }
}

const onPasswordChangeSuccess = () => {
  showPasswordModal.value = false
  showToast('success', '🔐 Contraseña actualizada exitosamente')
}

const showToast = (type: 'success' | 'error' | 'info', message: string) => {
  toast.value = { show: true, type, message }
  
  // Auto-hide toast after 5 seconds
  setTimeout(() => {
    toast.value.show = false
  }, 5000)
}

// Utility functions
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getRoleDisplayName = (role: string): string => {
  const roleNames = {
    'Admin': 'Administrador',
    'Supervisor': 'Supervisor',
    'Inspector': 'Inspector'
  }
  return roleNames[role as keyof typeof roleNames] || role
}

const getRoleDescription = (role: string): string => {
  const descriptions = {
    'Admin': 'Acceso completo al sistema, gestión de usuarios y configuración.',
    'Supervisor': 'Supervisión de operaciones, gestión de equipos y reportes.',
    'Inspector': 'Inspección de órdenes, control de calidad y seguimiento.'
  }
  return descriptions[role as keyof typeof descriptions] || 'Sin descripción disponible'
}

const getUserPermissions = (role: string): string[] => {
  const permissions = {
    'Admin': [
      'Gestionar usuarios y roles',
      'Configurar sistema',
      'Acceso a todos los módulos',
      'Generar reportes avanzados',
      'Administrar base de datos'
    ],
    'Supervisor': [
      'Supervisar órdenes',
      'Gestionar equipos',
      'Generar reportes',
      'Aprobar cambios',
      'Ver métricas avanzadas'
    ],
    'Inspector': [
      'Crear y editar órdenes',
      'Inspeccionar productos',
      'Actualizar estados',
      'Ver reportes básicos',
      'Gestionar clientes'
    ]
  }
  return permissions[role as keyof typeof permissions] || []
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getRelativeTime = (dateString: string): string => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Hoy'
  if (diffInDays === 1) return 'Ayer'
  if (diffInDays < 7) return `Hace ${diffInDays} días`
  if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`
  if (diffInDays < 365) return `Hace ${Math.floor(diffInDays / 30)} meses`
  return `Hace ${Math.floor(diffInDays / 365)} años`
}

// Delightful interaction methods
const onAvatarClick = () => {
  avatarClickCount.value++
  updateProfileEnergy(5)
  
  // Avatar personality responses based on mood and clicks
  const responses = {
    happy: [
      '😊 ¡Hola! ¡Me encanta que me visites!',
      '😄 ¡Cada clic me hace más feliz!',
      '🤗 ¡Abrazo virtual para ti!'
    ],
    excited: [
      '🤩 ¡WOOOHOOO! ¡Esto es genial!',
      '🎉 ¡Estoy súper emocionado!',
      '⚡ ¡Siento la energía!'
    ],
    sleepy: [
      '😴 Zzz... ¿eh? ¡Oh, hola!',
      '🥱 *bosteza* ¿Necesitas algo?',
      '💤 Estaba descansando un poquito...'
    ]
  }
  
  if (avatarClickCount.value === 1) {
    const mood = isProfileSleeping.value ? 'sleepy' : profileMood.value
    const moodResponses = responses[mood] || responses.happy
    const randomResponse = moodResponses[Math.floor(Math.random() * moodResponses.length)]
    showToast('info', randomResponse)
    
    // Wake up if sleeping
    if (isProfileSleeping.value) {
      wakeUpProfile()
    }
  } else if (avatarClickCount.value === 3) {
    profileMood.value = 'excited'
    showToast('info', '😄 ¡Te gusta hacer clic! ¡Sigue así!')
    triggerAvatarSparkles()
    triggerFloatingHearts()
  } else if (avatarClickCount.value === 5) {
    showToast('info', '🕺 ¡Ahora estoy bailando! ¡Eres increíble!')
    awardXP(25)
  } else if (avatarClickCount.value === 7) {
    magicalCursor.value = true
    showToast('info', '✨ ¡Has desbloqueado el cursor mágico!')
    setTimeout(() => {
      magicalCursor.value = false
    }, 10000)
  } else if (avatarClickCount.value === 10) {
    showToast('success', '🎉 ¡LOGRO DESBLOQUEADO: Avatar Superfan!')
    awardXP(100)
    if (confettiRef.value) {
      confettiRef.value.celebrate()
    }
    easterEggUnlocked.value = true
  }
  
  // Reset after 20 clicks
  if (avatarClickCount.value >= 20) {
    avatarClickCount.value = 0
    profileMood.value = 'happy'
    showToast('info', '🔄 Contador reiniciado. ¡Comencemos de nuevo!')
  }
}

const onAvatarHover = () => {
  if (avatarClickCount.value >= 3) {
    triggerAvatarSparkles()
  }
}

const triggerAvatarSparkles = () => {
  const sparkleEmojis = ['✨', '⭐', '💫', '🌟', '💥', '🎇', '🎆']
  avatarSparkles.value = true
  
  avatarSparklesList.value = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 200,
    y: Math.random() * 200,
    delay: Math.random() * 1,
    emoji: sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)]
  }))
  
  setTimeout(() => {
    avatarSparkles.value = false
    avatarSparklesList.value = []
  }, 3000)
}

const triggerAvatarCelebration = () => {
  triggerAvatarSparkles()
  setTimeout(() => {
    triggerAvatarSparkles()
  }, 500)
}

const onRoleBadgeClick = () => {
  const roleMessages = {
    'Admin': '👑 ¡Eres el jefe aquí! ¡Poder total!',
    'Supervisor': '🎯 ¡Supervisor extraordinario en acción!',
    'Inspector': '🔍 ¡Inspector detective al rescate!'
  }
  const message = roleMessages[profile.value?.user_role as keyof typeof roleMessages] || '🌟 ¡Rol genial!'
  showToast('info', message)
}

const onLargeRoleBadgeClick = () => {
  const funFacts = {
    'Admin': '¿Sabías que los admins tienen poderes especiales? ¡Como hacer que los botones brillen! ✨',
    'Supervisor': '¡Los supervisores son como los superhéroes del sistema! 🦸‍♂️',
    'Inspector': '¡Los inspectores tienen ojos de águila para los detalles! 🦅'
  }
  const fact = funFacts[profile.value?.user_role as keyof typeof funFacts] || '¡Tu rol es increíble!'
  showToast('info', fact)
}

const startRoleGlow = () => {
  // CSS handles the glow animation
}

const stopRoleGlow = () => {
  // CSS handles the glow animation
}

const onSaveClick = () => {
  // Add some anticipation before the actual save
  savingMessageIndex.value = 0
}

const getSavingMessage = () => {
  const messages = [
    'Guardando magia...',
    'Aplicando cambios...',
    'Sincronizando datos...',
    'Finalizando...',
    'Casi listo...'
  ]
  
  // Cycle through messages during save
  setTimeout(() => {
    if (saving.value && savingMessageIndex.value < messages.length - 1) {
      savingMessageIndex.value++
    }
  }, 800)
  
  return messages[savingMessageIndex.value] || 'Guardando...'
}

const getRoleIcon = (role: string): string => {
  const icons = {
    'Admin': 'lucide:crown',
    'Supervisor': 'lucide:shield-check',
    'Inspector': 'lucide:search'
  }
  return icons[role as keyof typeof icons] || 'lucide:user'
}

// Easter egg - Konami Code
const handleKeyDown = (event: KeyboardEvent) => {
  konamiSequence.value.push(event.code)
  
  // Keep only the last 10 keys
  if (konamiSequence.value.length > 10) {
    konamiSequence.value = konamiSequence.value.slice(-10)
  }
  
  // Check if konami code was entered
  if (konamiSequence.value.join(',') === konamiCode.join(',')) {
    triggerKonamiEasterEgg()
    konamiSequence.value = []
  }
}

const triggerKonamiEasterEgg = () => {
  showEasterEgg.value = true
  showToast('success', '🎮 ¡CÓDIGO KONAMI ACTIVADO! ¡Eres un verdadero gamer!')
  
  if (confettiRef.value) {
    confettiRef.value.celebrate()
  }
  
  // Add special class to body for magical effects
  document.body.classList.add('konami-mode')
  
  setTimeout(() => {
    showEasterEgg.value = false
    document.body.classList.remove('konami-mode')
  }, 10000)
}

// New delightful methods
const updateProfileEnergy = (amount: number) => {
  profileEnergy.value = Math.min(100, Math.max(0, profileEnergy.value + amount))
  lastInteractionTime.value = Date.now()
  
  if (profileEnergy.value > 80) {
    profileMood.value = 'excited'
  } else if (profileEnergy.value < 20) {
    profileMood.value = 'sleepy'
  } else {
    profileMood.value = 'happy'
  }
}

const checkProfileSleep = () => {
  const timeSinceLastInteraction = Date.now() - lastInteractionTime.value
  const sleepTime = 60000 // 1 minute
  
  if (timeSinceLastInteraction > sleepTime && !isProfileSleeping.value) {
    isProfileSleeping.value = true
    profileMood.value = 'sleepy'
    showToast('info', '😴 Tu perfil se está durmiendo... ¡Dale un clic para despertarlo!')
  }
}

const wakeUpProfile = () => {
  isProfileSleeping.value = false
  profileMood.value = 'happy'
  updateProfileEnergy(20)
  triggerAvatarSparkles()
  showToast('info', '☀️ ¡Buenos días! ¡Estoy despierto y listo!')
}

const triggerFloatingHearts = () => {
  showFloatingHearts.value = true
  
  floatingHeartsList.value = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: Math.random() * 300,
    y: Math.random() * 200
  }))
  
  setTimeout(() => {
    showFloatingHearts.value = false
    floatingHeartsList.value = []
  }, 3000)
}

const handleMouseMove = (event: MouseEvent) => {
  mouseCursor.value = { x: event.clientX, y: event.clientY }
  updateProfileEnergy(0.5)
}

const onCardHover = (cardType: string, isHovering: boolean) => {
  cardHoverStates.value[cardType] = isHovering
  
  if (isHovering) {
    updateProfileEnergy(2)
    
    const hoverMessages = {
      'info': '📝 ¡Información personal lista para editar!',
      'role': '👑 ¡Tu rol es impresionante!',
      'security': '🔒 ¡Seguridad es nuestra prioridad!',
      'activity': '📊 ¡Mira toda tu actividad!'
    }
    
    if (Math.random() < 0.3) { // 30% chance to show message
      const message = hoverMessages[cardType] || '✨ ¡Elemento mágico detectado!'
      showToast('info', message)
    }
  }
}

const awardXP = (amount: number) => {
  const oldXP = profileXP.value
  profileXP.value += amount
  
  // Check for level up (every 100 XP)
  const oldLevel = Math.floor(oldXP / 100)
  const newLevel = Math.floor(profileXP.value / 100)
  
  if (newLevel > oldLevel) {
    levelUpEffect.value = true
    showToast('success', `🎊 ¡NIVEL ${newLevel + 1}! ¡Has subido de nivel!`)
    
    if (confettiRef.value) {
      confettiRef.value.celebrate()
    }
    
    setTimeout(() => {
      levelUpEffect.value = false
    }, 3000)
  }
}

const getProfileEnergyColor = () => {
  if (profileEnergy.value > 80) return '#10b981' // Green
  if (profileEnergy.value > 50) return '#f59e0b' // Yellow
  if (profileEnergy.value > 20) return '#f97316' // Orange
  return '#ef4444' // Red
}

const startProfileAnimations = () => {
  // Gradually fade in profile load animation
  setTimeout(() => {
    profileLoadAnimation.value = false
  }, 1000)
  
  // Start energy decay timer
  setInterval(() => {
    if (profileEnergy.value > 0) {
      updateProfileEnergy(-1)
    }
    checkProfileSleep()
  }, 30000) // Every 30 seconds
}

// Lifecycle for easter eggs and new features
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('mousemove', handleMouseMove)
  startProfileAnimations()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
/* Profile-specific styles following the design specification */
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.profile-content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

/* Profile Hero Section */
.profile-hero {
  background: var(--glass-bg-card);
  backdrop-filter: var(--blur-md);
  border: 1px solid var(--glass-border-light);
  border-radius: var(--radius-glass);
  position: relative;
  overflow: hidden;
  padding: 3rem 2rem;
}

.profile-hero-content {
  display: flex;
  align-items: center;
  gap: 2rem;
  position: relative;
  z-index: 2;
}

.profile-avatar-container {
  flex-shrink: 0;
}

.profile-avatar-wrapper {
  position: relative;
  display: inline-block;
}

.profile-avatar {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background: var(--glass-bg-light);
  backdrop-filter: var(--blur-sm);
  border: 2px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-glass);
  box-shadow: var(--shadow-glass);
  transition: all var(--duration-normal) var(--ease-out);
}

/* Enhanced Avatar Interactions */
.magical-avatar {
  cursor: pointer;
  position: relative;
  overflow: visible;
}

.magical-avatar:hover {
  transform: scale(1.08);
  box-shadow: var(--shadow-glass-lg), 0 0 30px rgba(147, 51, 234, 0.3);
  animation: avatar-hover-glow 2s ease-in-out infinite;
}

.magical-avatar.avatar-excited {
  animation: avatar-excited 1s ease-in-out infinite;
}

.magical-avatar.avatar-dancing {
  animation: avatar-dance 0.8s ease-in-out infinite;
}

.avatar-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: conic-gradient(from 0deg, transparent, rgba(147, 51, 234, 0.4), transparent, rgba(59, 130, 246, 0.4), transparent);
  border-radius: 50%;
  opacity: 0;
  animation: rotate-glow 3s linear infinite;
  transition: opacity 0.3s ease;
}

.magical-avatar:hover .avatar-glow {
  opacity: 1;
}

.avatar-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(147, 51, 234, 0.2);
  opacity: 0;
  pointer-events: none;
}

.magical-avatar:active .avatar-pulse {
  animation: avatar-pulse-click 0.4s ease-out;
}

/* Avatar Sparkles */
.avatar-sparkles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
}

.avatar-sparkle {
  position: absolute;
  font-size: 1.2rem;
  animation: sparkle-float 3s ease-out forwards;
  pointer-events: none;
}

/* Role Badge Enhancements */
.magical-role-badge {
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.magical-role-badge:hover {
  transform: scale(1.1) rotate(5deg);
  animation: role-badge-wobble 0.6s ease-in-out;
}

.role-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.magical-role-badge:hover .role-shimmer {
  left: 100%;
}

/* Interactive Role Badge Large */
.interactive-role-badge {
  cursor: pointer;
  position: relative;
  overflow: visible;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.interactive-role-badge:hover {
  transform: scale(1.1);
  animation: role-badge-glow 2s ease-in-out infinite;
}

.role-crown {
  position: absolute;
  top: -15px;
  right: -10px;
  font-size: 1.5rem;
  animation: crown-float 3s ease-in-out infinite;
}

.role-magic-circle {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 2px solid transparent;
  border-radius: 2rem;
  background: conic-gradient(from 0deg, currentColor, transparent, currentColor) border-box;
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  animation: rotate-slowly 4s linear infinite;
}

.interactive-role-badge:hover .role-magic-circle {
  opacity: 0.6;
}

/* Button Enhancements */
.magical-edit-btn {
  position: relative;
  overflow: hidden;
}

.magical-edit-btn:hover .edit-icon {
  animation: edit-icon-wiggle 0.5s ease-in-out;
}

.btn-magical-sparkle {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.magical-edit-btn:hover .btn-magical-sparkle {
  transform: translateX(100%);
}

.magical-save-btn {
  position: relative;
  overflow: hidden;
}

.magical-save-btn.btn-ready {
  animation: btn-ready-pulse 2s ease-in-out infinite;
}

.magical-save-btn:hover .save-icon {
  animation: save-icon-bounce 0.8s ease-in-out infinite;
}

.btn-success-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.magical-save-btn:active .btn-success-particles {
  animation: success-particle-burst 0.6s ease-out;
}

.saving-text {
  animation: saving-text-pulse 1.5s ease-in-out infinite;
}

/* Security Button Enhancement */
.magical-security-btn {
  position: relative;
  overflow: hidden;
}

.magical-security-btn:hover .security-key-icon {
  animation: key-unlock 0.8s ease-in-out;
}

.security-shield-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.magical-security-btn:hover .security-shield-glow {
  opacity: 1;
  animation: shield-pulse 2s ease-in-out infinite;
}

/* Permission Items Enhancement */
.permission-item:hover {
  background: var(--glass-bg-medium);
  border-color: var(--glass-border);
  transform: translateX(8px) scale(1.02);
  animation: permission-highlight 0.3s ease;
}

/* Activity Stats Enhancement */
.activity-stat:hover {
  background: var(--glass-bg-medium);
  border-color: var(--glass-border);
  transform: translateY(-2px);
  animation: stat-hover-bounce 0.4s ease;
}

/* Magical Description */
.magical-description {
  transition: all 0.3s ease;
}

.magical-role-display:hover .magical-description {
  color: var(--text-glass);
  transform: scale(1.02);
}

/* Konami Mode */
.konami-mode {
  animation: rainbow-background 3s ease-in-out infinite;
}

.konami-mode * {
  animation: konami-wiggle 0.1s ease-in-out infinite;
}

/* Enhanced profile animations */
.profile-avatar:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-glass-lg);
}

.role-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 1rem;
  border: 2px solid var(--glass-border);
  backdrop-filter: var(--blur-sm);
  animation: bobble 3s ease-in-out infinite;
}

.role-badge.admin {
  background: rgba(251, 191, 36, 0.15);
  border-color: rgba(251, 191, 36, 0.3);
  color: #fbbf24;
}

.role-badge.supervisor {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}

.role-badge.inspector {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.profile-name {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-glass);
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.profile-email {
  font-size: 1rem;
  color: var(--text-glass-secondary);
  margin-bottom: 0.25rem;
}

.profile-meta {
  font-size: 0.875rem;
  color: var(--text-glass-muted);
}

.profile-basic-info {
  flex: 1;
  min-width: 0;
}

.profile-actions {
  flex-shrink: 0;
  display: flex;
  gap: 1rem;
}

/* Information Cards */
.profile-info-card {
  height: fit-content;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0;
  margin-bottom: 1.5rem;
}

.card-header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.card-icon-container {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--glass-bg-light);
  backdrop-filter: var(--blur-sm);
  border: 1px solid var(--glass-border-light);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: breathe 4s ease-in-out infinite;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-glass);
  margin: 0;
}

.card-content {
  padding: 0 1.5rem 1.5rem;
}

.info-display {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-glass-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-glass);
  padding: 0.75rem 1rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border-light);
  border-radius: 0.5rem;
  margin: 0;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid var(--glass-border-light);
}

.form-actions .btn-glass-secondary {
  padding: 0.75rem 1.5rem;
}

.form-actions .btn-glass-primary {
  padding: 0.75rem 1.5rem;
}

/* Role Card */
.role-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.current-role {
  text-align: center;
  padding: 2rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border-light);
  border-radius: 1rem;
}

.role-badge-large {
  display: inline-block;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 2rem;
  margin-bottom: 1rem;
  backdrop-filter: var(--blur-sm);
  border: 2px solid;
  animation: magical-glow 3s ease-in-out infinite;
}

.role-badge-large.admin {
  background: rgba(251, 191, 36, 0.15);
  border-color: rgba(251, 191, 36, 0.3);
  color: #fbbf24;
}

.role-badge-large.supervisor {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}

.role-badge-large.inspector {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.role-description {
  color: var(--text-glass-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.permissions-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-glass);
  margin-bottom: 1rem;
}

.permissions-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border-light);
  border-radius: 0.5rem;
  color: var(--text-glass-secondary);
  font-size: 0.875rem;
  transition: all var(--duration-normal) var(--ease-out);
}

.permission-item:hover {
  background: var(--glass-bg-medium);
  border-color: var(--glass-border);
  transform: translateX(4px);
}

/* Security Section */
.security-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.security-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border-light);
  border-radius: 1rem;
}

.security-item-info {
  flex: 1;
}

.security-item-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-glass);
  margin-bottom: 0.5rem;
}

.security-item-description {
  font-size: 0.875rem;
  color: var(--text-glass-secondary);
  margin: 0;
}

.security-status {
  padding: 1rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border-light);
  border-radius: 0.75rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.status-indicator.success {
  color: #34d399;
}

.status-description {
  font-size: 0.875rem;
  color: var(--text-glass-secondary);
  margin: 0;
}

/* Activity Section */
.activity-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-stat {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border-light);
  border-radius: 0.75rem;
  transition: all var(--duration-normal) var(--ease-out);
}

.activity-stat:hover {
  background: var(--glass-bg-medium);
  border-color: var(--glass-border);
}

.activity-stat-icon {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border-light);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-stat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.activity-stat-label {
  font-size: 0.75rem;
  color: var(--text-glass-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.activity-stat-value {
  font-size: 0.875rem;
  color: var(--text-glass);
  font-weight: 500;
}

/* Error message styling */
.error-message {
  color: #ff6b6b;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: slide-up-fade 0.3s ease-out;
}

.error-message::before {
  content: '⚠️';
  font-size: 1rem;
}

/* Shake animation for validation errors */
.shake {
  animation: error-shake 0.5s ease-in-out;
}

/* Responsive Design */
@media (max-width: 1023px) {
  .profile-content-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

/* Keyframe Animations */
@keyframes avatar-hover-glow {
  0%, 100% { box-shadow: var(--shadow-glass-lg), 0 0 30px rgba(147, 51, 234, 0.3); }
  50% { box-shadow: var(--shadow-glass-lg), 0 0 50px rgba(147, 51, 234, 0.5); }
}

@keyframes avatar-excited {
  0%, 100% { transform: scale(1.05) rotate(0deg); }
  25% { transform: scale(1.1) rotate(2deg); }
  75% { transform: scale(1.1) rotate(-2deg); }
}

@keyframes avatar-dance {
  0%, 100% { transform: scale(1.05) rotate(0deg); }
  25% { transform: scale(1.15) rotate(5deg); }
  50% { transform: scale(1.1) rotate(0deg); }
  75% { transform: scale(1.15) rotate(-5deg); }
}

@keyframes rotate-glow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes avatar-pulse-click {
  0% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
}

@keyframes sparkle-float {
  0% {
    opacity: 1;
    transform: translateY(0) rotate(0deg) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-100px) rotate(360deg) scale(0.5);
  }
}

@keyframes role-badge-wobble {
  0%, 100% { transform: scale(1.1) rotate(5deg); }
  25% { transform: scale(1.15) rotate(-3deg); }
  50% { transform: scale(1.1) rotate(7deg); }
  75% { transform: scale(1.15) rotate(-1deg); }
}

@keyframes role-badge-glow {
  0%, 100% { box-shadow: 0 0 20px currentColor; }
  50% { box-shadow: 0 0 40px currentColor, 0 0 60px currentColor; }
}

@keyframes crown-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(10deg); }
}

@keyframes rotate-slowly {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes edit-icon-wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

@keyframes btn-ready-pulse {
  0%, 100% { box-shadow: var(--shadow-glass), 0 0 0 rgba(34, 197, 94, 0.4); }
  50% { box-shadow: var(--shadow-glass), 0 0 20px rgba(34, 197, 94, 0.6); }
}

@keyframes save-icon-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@keyframes success-particle-burst {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 200px;
    height: 200px;
    opacity: 0;
  }
}

@keyframes saving-text-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes key-unlock {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-15deg); }
  75% { transform: rotate(15deg); }
}

@keyframes shield-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
}

@keyframes permission-highlight {
  0% { background: var(--glass-bg-light); }
  50% { background: rgba(34, 197, 94, 0.1); }
  100% { background: var(--glass-bg-medium); }
}

@keyframes stat-hover-bounce {
  0%, 100% { transform: translateY(-2px); }
  50% { transform: translateY(-5px); }
}

@keyframes rainbow-background {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

@keyframes konami-wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(1deg); }
  75% { transform: rotate(-1deg); }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .magical-avatar,
  .magical-role-badge,
  .interactive-role-badge,
  .magical-edit-btn,
  .magical-save-btn,
  .magical-security-btn {
    animation: none !important;
  }
  
  .magical-avatar:hover,
  .interactive-role-badge:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
  }
}

@media (max-width: 767px) {
  .profile-hero {
    padding: 1.5rem 1rem;
  }
  
  .profile-hero-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  
  .profile-name {
    font-size: 1.75rem;
  }
  
  .profile-actions {
    width: 100%;
    justify-content: center;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions button {
    width: 100%;
  }
  
  .security-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .profile-content-grid {
    gap: 1rem;
  }
  
  /* Mobile-friendly avatar sparkles */
  .avatar-sparkle {
    font-size: 1rem;
  }
  
  .role-crown {
    font-size: 1.2rem;
    top: -10px;
    right: -5px;
  }
}
</style>