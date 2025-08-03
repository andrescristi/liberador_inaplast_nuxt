<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container glass-card-magical" @click.stop>
      <div class="modal-header">
        <div class="modal-header-content">
          <div class="modal-icon-container magical-key-container">
            <Icon name="lucide:key" class="w-6 h-6 text-indigo-400 magical-key" />
            <div class="key-sparkles"></div>
          </div>
          <h3 class="modal-title">Cambiar Contraseña</h3>
        </div>
        <button @click="$emit('close')" class="modal-close-btn" :disabled="saving">
          <Icon name="lucide:x" class="w-5 h-5" />
        </button>
      </div>

      <div class="modal-content">
        <p class="modal-description">
          Ingresa tu contraseña actual y luego tu nueva contraseña para actualizar tu seguridad.
        </p>

        <form @submit.prevent="changePassword" class="password-form">
          <!-- Current Password -->
          <div class="form-group">
            <label class="form-label-glass required">Contraseña Actual</label>
            <div class="password-input-container">
              <input
                v-model="formData.currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                class="form-input-magical"
                :class="{ 'border-red-500 shake': validationErrors.currentPassword }"
                placeholder="Ingresa tu contraseña actual"
                required
                @input="clearValidationError('currentPassword')"
              />
              <button
                type="button"
                class="password-toggle-btn"
                @click="showCurrentPassword = !showCurrentPassword"
                :disabled="saving"
              >
                <Icon 
                  :name="showCurrentPassword ? 'lucide:eye-off' : 'lucide:eye'" 
                  class="w-4 h-4" 
                />
              </button>
            </div>
            <div v-if="validationErrors.currentPassword" class="error-message">
              {{ validationErrors.currentPassword }}
            </div>
          </div>

          <!-- New Password -->
          <div class="form-group">
            <label class="form-label-glass required">Nueva Contraseña</label>
            <div class="password-input-container">
              <input
                v-model="formData.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                class="form-input-magical"
                :class="{ 'border-red-500 shake': validationErrors.newPassword }"
                placeholder="Ingresa tu nueva contraseña"
                required
                @input="clearValidationError('newPassword')"
              />
              <button
                type="button"
                class="password-toggle-btn"
                @click="showNewPassword = !showNewPassword"
                :disabled="saving"
              >
                <Icon 
                  :name="showNewPassword ? 'lucide:eye-off' : 'lucide:eye'" 
                  class="w-4 h-4" 
                />
              </button>
            </div>
            <div v-if="validationErrors.newPassword" class="error-message">
              {{ validationErrors.newPassword }}
            </div>
            <!-- Password strength indicator -->
            <div v-if="formData.newPassword" class="password-strength magical-strength">
              <div class="password-strength-bar magical-strength-bar">
                <div 
                  class="password-strength-fill magical-strength-fill" 
                  :class="passwordStrength.class"
                  :style="{ width: passwordStrength.width + '%' }"
                >
                  <div class="strength-shimmer"></div>
                </div>
              </div>
              <span class="password-strength-text magical-strength-text" :class="passwordStrength.class">
                <Icon :name="getStrengthIcon()" class="w-4 h-4 mr-1 strength-icon" />
                {{ passwordStrength.text }}
                <span v-if="passwordStrength.width === 100" class="strength-celebration">🎉</span>
              </span>
            </div>
          </div>

          <!-- Confirm New Password -->
          <div class="form-group">
            <label class="form-label-glass required">Confirmar Nueva Contraseña</label>
            <div class="password-input-container">
              <input
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input-magical"
                :class="{ 'border-red-500 shake': validationErrors.confirmPassword }"
                placeholder="Confirma tu nueva contraseña"
                required
                @input="clearValidationError('confirmPassword')"
              />
              <button
                type="button"
                class="password-toggle-btn"
                @click="showConfirmPassword = !showConfirmPassword"
                :disabled="saving"
              >
                <Icon 
                  :name="showConfirmPassword ? 'lucide:eye-off' : 'lucide:eye'" 
                  class="w-4 h-4" 
                />
              </button>
            </div>
            <div v-if="validationErrors.confirmPassword" class="error-message">
              {{ validationErrors.confirmPassword }}
            </div>
          </div>

          <!-- Password Requirements -->
          <div class="password-requirements">
            <h4 class="requirements-title">Requisitos de la contraseña:</h4>
            <ul class="requirements-list magical-requirements">
              <li :class="{ 'requirement-met': hasMinLength, 'requirement-checking': formData.newPassword.length > 0 && formData.newPassword.length < 8 }" class="magical-requirement">
                <Icon :name="hasMinLength ? 'lucide:check' : 'lucide:x'" class="w-4 h-4 requirement-icon" />
                Al menos 8 caracteres
                <div v-if="hasMinLength" class="requirement-sparkle">✨</div>
              </li>
              <li :class="{ 'requirement-met': hasUppercase, 'requirement-checking': formData.newPassword.length > 0 && !hasUppercase }" class="magical-requirement">
                <Icon :name="hasUppercase ? 'lucide:check' : 'lucide:x'" class="w-4 h-4 requirement-icon" />
                Una letra mayúscula
                <div v-if="hasUppercase" class="requirement-sparkle">✨</div>
              </li>
              <li :class="{ 'requirement-met': hasLowercase, 'requirement-checking': formData.newPassword.length > 0 && !hasLowercase }" class="magical-requirement">
                <Icon :name="hasLowercase ? 'lucide:check' : 'lucide:x'" class="w-4 h-4 requirement-icon" />
                Una letra minúscula
                <div v-if="hasLowercase" class="requirement-sparkle">✨</div>
              </li>
              <li :class="{ 'requirement-met': hasNumber, 'requirement-checking': formData.newPassword.length > 0 && !hasNumber }" class="magical-requirement">
                <Icon :name="hasNumber ? 'lucide:check' : 'lucide:x'" class="w-4 h-4 requirement-icon" />
                Un número
                <div v-if="hasNumber" class="requirement-sparkle">✨</div>
              </li>
              <li :class="{ 'requirement-met': hasSpecialChar, 'requirement-checking': formData.newPassword.length > 0 && !hasSpecialChar }" class="magical-requirement">
                <Icon :name="hasSpecialChar ? 'lucide:check' : 'lucide:x'" class="w-4 h-4 requirement-icon" />
                Un carácter especial (!@#$%^&*)
                <div v-if="hasSpecialChar" class="requirement-sparkle">✨</div>
              </li>
            </ul>
          </div>

          <!-- Form Actions -->
          <div class="modal-actions">
            <button 
              type="button" 
              @click="$emit('close')" 
              class="btn-glass-secondary"
              :disabled="saving"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="btn-glass-primary magical-submit-btn" 
              :disabled="saving || !isFormValid"
              :class="{ 'btn-saving': saving, 'btn-password-ready': isFormValid && !saving }"
            >
              <span v-if="saving" class="flex items-center">
                <div class="spinner-magical mr-2"></div>
                <span class="changing-password-text">{{ getPasswordChangeMessage() }}</span>
              </span>
              <span v-else class="flex items-center">
                <Icon name="lucide:shield-check" class="w-4 h-4 mr-1 shield-icon" />
                Cambiar Contraseña
                <div class="btn-security-glow"></div>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Composables
const { updatePassword } = useAuth()

// Emits
const emit = defineEmits<{
  close: []
  success: []
}>()

// Reactive state
const saving = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const passwordChangeMessageIndex = ref(0)
const allRequirementsMet = ref(false)

// Form data
const formData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Validation
const validationErrors = ref<Record<string, string>>({})

// Password strength validation
const hasMinLength = computed(() => formData.value.newPassword.length >= 8)
const hasUppercase = computed(() => /[A-Z]/.test(formData.value.newPassword))
const hasLowercase = computed(() => /[a-z]/.test(formData.value.newPassword))
const hasNumber = computed(() => /\d/.test(formData.value.newPassword))
const hasSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(formData.value.newPassword))

const passwordStrength = computed(() => {
  const score = [
    hasMinLength.value,
    hasUppercase.value,
    hasLowercase.value,
    hasNumber.value,
    hasSpecialChar.value
  ].filter(Boolean).length

  if (score <= 1) {
    return { width: 20, class: 'strength-weak', text: 'Muy débil' }
  } else if (score <= 2) {
    return { width: 40, class: 'strength-weak', text: 'Débil' }
  } else if (score <= 3) {
    return { width: 60, class: 'strength-medium', text: 'Medio' }
  } else if (score <= 4) {
    return { width: 80, class: 'strength-strong', text: 'Fuerte' }
  } else {
    return { width: 100, class: 'strength-very-strong', text: 'Muy fuerte' }
  }
})

const isFormValid = computed(() => {
  return formData.value.currentPassword &&
         formData.value.newPassword &&
         formData.value.confirmPassword &&
         hasMinLength.value &&
         hasUppercase.value &&
         hasLowercase.value &&
         hasNumber.value &&
         hasSpecialChar.value &&
         formData.value.newPassword === formData.value.confirmPassword &&
         Object.keys(validationErrors.value).length === 0
})

// Methods
const handleOverlayClick = () => {
  if (!saving.value) {
    emit('close')
  }
}

const clearValidationError = (field: string) => {
  if (validationErrors.value[field]) {
    delete validationErrors.value[field]
  }
}

const validateForm = (): boolean => {
  const errors: Record<string, string> = {}
  
  // Current password validation
  if (!formData.value.currentPassword) {
    errors.currentPassword = 'La contraseña actual es requerida'
  }
  
  // New password validation
  if (!formData.value.newPassword) {
    errors.newPassword = 'La nueva contraseña es requerida'
  } else if (!hasMinLength.value) {
    errors.newPassword = 'La contraseña debe tener al menos 8 caracteres'
  } else if (!hasUppercase.value || !hasLowercase.value || !hasNumber.value || !hasSpecialChar.value) {
    errors.newPassword = 'La contraseña no cumple con todos los requisitos'
  }
  
  // Confirm password validation
  if (!formData.value.confirmPassword) {
    errors.confirmPassword = 'Debes confirmar la nueva contraseña'
  } else if (formData.value.newPassword !== formData.value.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
  }
  
  // Check if new password is different from current
  if (formData.value.currentPassword && formData.value.newPassword && 
      formData.value.currentPassword === formData.value.newPassword) {
    errors.newPassword = 'La nueva contraseña debe ser diferente a la actual'
  }
  
  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

const getStrengthIcon = () => {
  const score = [
    hasMinLength.value,
    hasUppercase.value,
    hasLowercase.value,
    hasNumber.value,
    hasSpecialChar.value
  ].filter(Boolean).length

  if (score <= 1) return 'lucide:shield-x'
  if (score <= 2) return 'lucide:shield-alert'
  if (score <= 3) return 'lucide:shield'
  if (score <= 4) return 'lucide:shield-check'
  return 'lucide:crown'
}

const getPasswordChangeMessage = () => {
  const messages = [
    'Cifrando nueva contraseña...',
    'Verificando seguridad...',
    'Aplicando cambios...',
    'Finalizando actualización...'
  ]
  
  setTimeout(() => {
    if (saving.value && passwordChangeMessageIndex.value < messages.length - 1) {
      passwordChangeMessageIndex.value++
    }
  }, 800)
  
  return messages[passwordChangeMessageIndex.value] || 'Cambiando...'
}

// Watch for all requirements met
watch([hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar], () => {
  const previouslyMet = allRequirementsMet.value
  allRequirementsMet.value = hasMinLength.value && hasUppercase.value && hasLowercase.value && hasNumber.value && hasSpecialChar.value
  
  // Celebrate when all requirements are met for the first time
  if (allRequirementsMet.value && !previouslyMet) {
    // Add celebration animation
    nextTick(() => {
      const requirementsList = document.querySelector('.magical-requirements')
      if (requirementsList) {
        requirementsList.classList.add('all-requirements-celebration')
        setTimeout(() => {
          requirementsList.classList.remove('all-requirements-celebration')
        }, 2000)
      }
    })
  }
})

const changePassword = async () => {
  if (!validateForm()) return
  
  try {
    saving.value = true
    passwordChangeMessageIndex.value = 0
    
    // Update password using Supabase
    await updatePassword(formData.value.newPassword)
    
    // Reset form
    formData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    
    // Emit success
    emit('success')
    
  } catch (error) {
    console.error('Error changing password:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    
    // Handle specific error cases
    if (errorMessage.includes('Invalid password') || errorMessage.includes('wrong password')) {
      validationErrors.value.currentPassword = 'La contraseña actual es incorrecta'
    } else {
      validationErrors.value.currentPassword = `Error: ${errorMessage}`
    }
  } finally {
    saving.value = false
  }
}

// Handle escape key
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && !saving.value) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  // Focus first input
  nextTick(() => {
    const firstInput = document.querySelector('.password-form input') as HTMLInputElement
    if (firstInput) {
      firstInput.focus()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fade-in 0.3s ease-out;
}

.modal-container {
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: scale-in 0.3s ease-out;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0;
  margin-bottom: 1rem;
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-icon-container {
  width: 3rem;
  height: 3rem;
  background: var(--glass-bg-light);
  backdrop-filter: var(--blur-sm);
  border: 1px solid var(--glass-border-light);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: breathe 4s ease-in-out infinite;
}

.magical-key-container {
  position: relative;
  overflow: visible;
}

.magical-key {
  transition: all 0.3s ease;
}

.magical-key-container:hover .magical-key {
  animation: key-turn 1s ease-in-out;
}

.key-sparkles {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 1rem;
  background: conic-gradient(from 0deg, transparent, rgba(99, 102, 241, 0.4), transparent);
  animation: rotate-sparkles 3s linear infinite;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.magical-key-container:hover .key-sparkles {
  opacity: 1;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-glass);
  margin: 0;
}

.modal-close-btn {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--glass-bg-light);
  backdrop-filter: var(--blur-sm);
  border: 1px solid var(--glass-border-light);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-glass-secondary);
  transition: all var(--duration-normal) var(--ease-out);
  cursor: pointer;
}

.modal-close-btn:hover:not(:disabled) {
  background: var(--glass-bg-medium);
  border-color: var(--glass-border);
  color: var(--text-glass);
  transform: scale(1.05);
}

.modal-close-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-content {
  padding: 0 1.5rem 1.5rem;
}

.modal-description {
  color: var(--text-glass-secondary);
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.password-input-container {
  position: relative;
}

.password-toggle-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-glass-muted);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all var(--duration-normal) var(--ease-out);
}

.password-toggle-btn:hover:not(:disabled) {
  color: var(--text-glass);
  background: var(--glass-bg-light);
}

.password-toggle-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-input-magical {
  padding-right: 3rem;
}

.password-strength {
  margin-top: 0.5rem;
}

.password-strength-bar {
  width: 100%;
  height: 0.25rem;
  background: var(--glass-bg-light);
  border-radius: 0.125rem;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.password-strength-fill {
  height: 100%;
  transition: all var(--duration-normal) var(--ease-out);
  border-radius: 0.125rem;
}

/* Enhanced password strength styling */
.magical-strength-bar {
  position: relative;
  overflow: hidden;
}

.magical-strength-fill {
  position: relative;
  overflow: hidden;
}

.strength-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  animation: shimmer-across 2s ease-in-out infinite;
}

.magical-strength-text {
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.strength-icon {
  transition: all 0.3s ease;
}

.strength-very-strong .strength-icon {
  animation: crown-glow 2s ease-in-out infinite;
}

.strength-celebration {
  animation: celebrate-bounce 0.6s ease-out;
  margin-left: 0.5rem;
}

.strength-weak {
  background: #ef4444;
  color: #ef4444;
}

.strength-medium {
  background: #f59e0b;
  color: #f59e0b;
}

.strength-strong {
  background: #3b82f6;
  color: #3b82f6;
}

.strength-very-strong {
  background: #10b981;
  color: #10b981;
}

.password-strength-text {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.password-requirements {
  padding: 1rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border-light);
  border-radius: 0.75rem;
}

.requirements-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-glass);
  margin-bottom: 0.75rem;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.requirements-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-glass-muted);
  transition: all var(--duration-normal) var(--ease-out);
}

.requirements-list li.requirement-met {
  color: #10b981;
}

/* Enhanced requirements styling */
.magical-requirement {
  position: relative;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
}

.magical-requirement.requirement-checking {
  color: #f59e0b;
  animation: requirement-pulse 1.5s ease-in-out infinite;
}

.magical-requirement.requirement-met {
  animation: requirement-success 0.6s ease-out;
  background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.1), transparent);
}

.requirement-icon {
  transition: all 0.3s ease;
}

.magical-requirement.requirement-met .requirement-icon {
  animation: check-bounce 0.5s ease-out;
}

.requirement-sparkle {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  animation: sparkle-twinkle 1.5s ease-in-out infinite;
}

.all-requirements-celebration {
  animation: requirements-celebration 2s ease-in-out;
  border: 2px solid rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.05);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid var(--glass-border-light);
}

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

.shake {
  animation: error-shake 0.5s ease-in-out;
}

/* Animations */
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes scale-in {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Enhanced submit button */
.magical-submit-btn {
  position: relative;
  overflow: hidden;
}

.magical-submit-btn.btn-password-ready {
  animation: security-ready-pulse 2s ease-in-out infinite;
}

.magical-submit-btn:hover .shield-icon {
  animation: shield-bounce 0.8s ease-in-out infinite;
}

.btn-security-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(16, 185, 129, 0.1) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.8s ease;
}

.magical-submit-btn:hover .btn-security-glow {
  transform: translateX(100%);
}

.changing-password-text {
  animation: password-changing-pulse 1.2s ease-in-out infinite;
}

/* Password strength animations */
.strength-weak {
  background: #ef4444;
  color: #ef4444;
  animation: strength-weak-pulse 2s ease-in-out infinite;
}

.strength-medium {
  background: #f59e0b;
  color: #f59e0b;
  animation: strength-medium-glow 2s ease-in-out infinite;
}

.strength-strong {
  background: #3b82f6;
  color: #3b82f6;
  animation: strength-strong-shimmer 2s ease-in-out infinite;
}

.strength-very-strong {
  background: linear-gradient(90deg, #10b981, #34d399, #6ee7b7);
  color: #10b981;
  animation: strength-very-strong-rainbow 3s ease-in-out infinite;
}

/* Keyframe animations */
@keyframes key-turn {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-15deg); }
  75% { transform: rotate(15deg); }
}

@keyframes rotate-sparkles {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes shimmer-across {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes crown-glow {
  0%, 100% { color: #10b981; filter: drop-shadow(0 0 5px currentColor); }
  50% { color: #fbbf24; filter: drop-shadow(0 0 10px currentColor); }
}

@keyframes celebrate-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3) rotate(15deg); }
}

@keyframes requirement-pulse {
  0%, 100% { background: transparent; }
  50% { background: rgba(245, 158, 11, 0.1); }
}

@keyframes requirement-success {
  0% { transform: translateX(-20px); opacity: 0; }
  50% { transform: translateX(5px); }
  100% { transform: translateX(0); opacity: 1; }
}

@keyframes check-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

@keyframes sparkle-twinkle {
  0%, 100% { opacity: 1; transform: translateY(-50%) scale(1); }
  50% { opacity: 0.5; transform: translateY(-50%) scale(1.2); }
}

@keyframes requirements-celebration {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.02); }
  50% { transform: scale(1.05); }
  75% { transform: scale(1.02); }
}

@keyframes security-ready-pulse {
  0%, 100% { box-shadow: var(--shadow-glass), 0 0 0 rgba(16, 185, 129, 0.4); }
  50% { box-shadow: var(--shadow-glass), 0 0 25px rgba(16, 185, 129, 0.6); }
}

@keyframes shield-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

@keyframes password-changing-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes strength-weak-pulse {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
}

@keyframes strength-medium-glow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.3) drop-shadow(0 0 5px currentColor); }
}

@keyframes strength-strong-shimmer {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2) drop-shadow(0 0 8px currentColor); }
}

@keyframes strength-very-strong-rainbow {
  0%, 100% { filter: brightness(1) hue-rotate(0deg); }
  50% { filter: brightness(1.3) hue-rotate(15deg) drop-shadow(0 0 10px currentColor); }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .magical-key-container,
  .magical-submit-btn,
  .magical-requirement {
    animation: none !important;
  }
  
  .magical-requirement.requirement-met {
    background: rgba(16, 185, 129, 0.1);
    transition: background 0.3s ease;
  }
}

/* Mobile responsive */
@media (max-width: 640px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .modal-container {
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 1rem 1rem 0;
  }
  
  .modal-content {
    padding: 0 1rem 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-actions button {
    width: 100%;
  }
  
  /* Mobile-friendly sparkles */
  .requirement-sparkle {
    font-size: 0.8rem;
  }
}
</style>