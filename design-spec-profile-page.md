# User Profile Page - Complete Design Specification
## Order Management System - Inaplast

**Design Version:** 1.0  
**Date:** August 3, 2025  
**Tech Stack:** Nuxt.js + Tailwind CSS + Supabase  
**Design System:** Glassmorphism with Magical Particles

---

## 1. DESIGN OVERVIEW

### Visual Design Language
The profile page follows the established glassmorphism design system with magical interactions, featuring:
- **Glass morphism cards** with backdrop blur effects
- **Magical particles** and delightful micro-interactions  
- **Role-based color coding** for visual hierarchy
- **Spanish localization** for consistent user experience
- **Mobile-first responsive design** optimized for field workers

### Page Architecture
```
Profile Page Layout:
├── Page Header with breadcrumb
├── Profile Hero Section (avatar area + basic info)
├── Main Content Grid
│   ├── Personal Information Card
│   ├── Role & Permissions Card  
│   ├── Security Settings Card
│   └── Activity Summary Card (optional)
└── Mobile-optimized layout adaptations
```

---

## 2. LAYOUT SPECIFICATIONS

### Desktop Layout (≥768px)
```css
/* Main container */
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

/* Profile hero section */
.profile-hero {
  grid-column: 1 / -1;
  padding: 3rem 2rem;
}

/* Main content grid */
.profile-content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
```

### Tablet Layout (768px - 1023px)
```css
.profile-content-grid {
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.profile-hero {
  padding: 2rem 1.5rem;
}
```

### Mobile Layout (<768px)
```css
.profile-container {
  padding: 1rem;
  gap: 1rem;
}

.profile-hero {
  padding: 1.5rem 1rem;
}

.profile-content-grid {
  gap: 1rem;
}
```

---

## 3. COMPONENT SPECIFICATIONS

### 3.1 Profile Hero Section

#### Visual Structure
```vue
<div class="glass-card-magical profile-hero">
  <div class="profile-hero-content">
    <!-- Avatar Area -->
    <div class="profile-avatar-container">
      <div class="profile-avatar-wrapper">
        <div class="profile-avatar">
          <!-- Avatar image or initials -->
        </div>
        <div class="role-badge">
          <!-- Role indicator -->
        </div>
      </div>
    </div>
    
    <!-- Basic Info -->
    <div class="profile-basic-info">
      <h1 class="profile-name">{{ fullName }}</h1>
      <p class="profile-email">{{ email }}</p>
      <p class="profile-meta">{{ lastLoginText }}</p>
    </div>
    
    <!-- Quick Actions -->
    <div class="profile-actions">
      <button class="btn-glass-secondary">Editar Perfil</button>
    </div>
  </div>
</div>
```

#### CSS Specifications
```css
.profile-hero {
  background: var(--glass-bg-card);
  backdrop-filter: var(--blur-md);
  border: 1px solid var(--glass-border-light);
  border-radius: var(--radius-glass);
  position: relative;
  overflow: hidden;
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

/* Mobile adjustments */
@media (max-width: 767px) {
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
}
```

### 3.2 Role-Based Color Coding

#### Role Badge Variants
```css
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
```

### 3.3 Information Cards

#### Personal Information Card
```vue
<div class="glass-card profile-info-card">
  <div class="card-header">
    <div class="card-header-content">
      <div class="card-icon-container">
        <Icon name="lucide:user" class="w-5 h-5 text-blue-400" />
      </div>
      <h3 class="card-title">Información Personal</h3>
    </div>
    <button v-if="!editMode" @click="enableEdit" class="btn-glass-secondary text-sm">
      <Icon name="lucide:edit" class="w-4 h-4 mr-1" />
      Editar
    </button>
  </div>
  
  <div class="card-content">
    <!-- View Mode -->
    <div v-if="!editMode" class="info-display">
      <div class="info-item">
        <label class="info-label">Nombre</label>
        <p class="info-value">{{ firstName }}</p>
      </div>
      <div class="info-item">
        <label class="info-label">Apellido</label>
        <p class="info-value">{{ lastName }}</p>
      </div>
      <div class="info-item">
        <label class="info-label">Email</label>
        <p class="info-value">{{ email }}</p>
      </div>
    </div>
    
    <!-- Edit Mode -->
    <form v-else @submit.prevent="saveChanges" class="edit-form">
      <div class="form-group">
        <label class="form-label-glass required">Nombre</label>
        <input
          v-model="editData.firstName"
          type="text"
          class="form-input-magical"
          placeholder="Ingresa tu nombre"
          required
        />
      </div>
      <div class="form-group">
        <label class="form-label-glass required">Apellido</label>
        <input
          v-model="editData.lastName"
          type="text"
          class="form-input-magical"
          placeholder="Ingresa tu apellido"
          required
        />
      </div>
      <div class="form-actions">
        <button type="button" @click="cancelEdit" class="btn-glass-secondary">
          Cancelar
        </button>
        <button type="submit" class="btn-glass-primary" :disabled="saving">
          <span v-if="saving" class="flex items-center">
            <div class="spinner-magical mr-2"></div>
            Guardando...
          </span>
          <span v-else>Guardar Cambios</span>
        </button>
      </div>
    </form>
  </div>
</div>
```

#### CSS for Information Cards
```css
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

/* Mobile adjustments */
@media (max-width: 767px) {
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
}
```

### 3.4 Security Settings Card

#### Structure
```vue
<div class="glass-card profile-security-card">
  <div class="card-header">
    <div class="card-header-content">
      <div class="card-icon-container">
        <Icon name="lucide:shield-check" class="w-5 h-5 text-green-400" />
      </div>
      <h3 class="card-title">Configuración de Seguridad</h3>
    </div>
  </div>
  
  <div class="card-content">
    <div class="security-section">
      <div class="security-item">
        <div class="security-item-info">
          <h4 class="security-item-title">Contraseña</h4>
          <p class="security-item-description">
            Última actualización: {{ lastPasswordChange }}
          </p>
        </div>
        <button @click="showPasswordChange = true" class="btn-glass-secondary">
          <Icon name="lucide:key" class="w-4 h-4 mr-1" />
          Cambiar
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
    
    <!-- Password Change Modal would be handled separately -->
  </div>
</div>
```

### 3.5 Role & Permissions Card

#### Structure  
```vue
<div class="glass-card profile-role-card">
  <div class="card-header">
    <div class="card-header-content">
      <div class="card-icon-container">
        <Icon name="lucide:user-check" class="w-5 h-5 text-purple-400" />
      </div>
      <h3 class="card-title">Rol y Permisos</h3>
    </div>
  </div>
  
  <div class="card-content">
    <div class="role-section">
      <div class="current-role">
        <div class="role-badge-large" :class="userRole">
          {{ roleDisplayName }}
        </div>
        <p class="role-description">
          {{ roleDescription }}
        </p>
      </div>
      
      <div class="permissions-list">
        <h4 class="permissions-title">Permisos disponibles:</h4>
        <ul class="permissions-items">
          <li v-for="permission in userPermissions" 
              :key="permission.id" 
              class="permission-item">
            <Icon name="lucide:check" class="w-4 h-4 text-green-400" />
            {{ permission.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
```

#### CSS for Role Card
```css
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
```

---

## 4. RESPONSIVE DESIGN STRATEGY

### Breakpoint System
```css
/* Mobile First Approach */
.profile-page {
  /* Base mobile styles */
}

/* Tablet */
@media (min-width: 768px) {
  .profile-content-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .profile-content-grid {
    grid-template-columns: 2fr 1fr;
  }
  
  .profile-hero-content {
    padding: 3rem;
  }
}

/* Large Desktop */
@media (min-width: 1280px) {
  .profile-container {
    max-width: 1200px;
  }
}
```

### Mobile Optimizations
1. **Stack cards vertically** for better scrolling experience
2. **Larger touch targets** (minimum 44px height for buttons)
3. **Simplified edit forms** with better spacing
4. **Bottom sheet modals** for password changes
5. **Floating save buttons** that stick to viewport bottom

---

## 5. ANIMATION & MICRO-INTERACTION SPECIFICATIONS

### Entry Animations
```css
.profile-page-enter {
  animation: slide-up-fade 0.6s var(--ease-spring);
}

.profile-card-enter {
  animation: bounce-in 0.4s var(--ease-bounce);
}

.profile-card:nth-child(2) {
  animation-delay: 0.1s;
}

.profile-card:nth-child(3) {
  animation-delay: 0.2s;
}

.profile-card:nth-child(4) {
  animation-delay: 0.3s;
}
```

### Interactive States
```css
/* Save button loading state */
.btn-saving {
  position: relative;
  pointer-events: none;
}

.btn-saving::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, 
    transparent 25%, 
    var(--sparkle-color) 50%, 
    transparent 75%);
  background-size: 200% 100%;
  animation: glass-shimmer 2s ease-in-out infinite;
  border-radius: inherit;
}

/* Success state */
.save-success {
  animation: success-bounce 0.6s var(--ease-bounce);
}

.save-success::after {
  content: '✨';
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 1.5rem;
  animation: sparkle 1s ease-in-out;
}

/* Error state */
.save-error {
  animation: error-shake 0.5s ease-in-out;
  border-color: var(--error-border) !important;
  box-shadow: 0 0 20px var(--error-glow);
}
```

### Role Badge Animations
```css
.role-badge {
  transition: all var(--duration-normal) var(--ease-out);
}

.role-badge:hover {
  transform: scale(1.1) rotate(5deg);
  animation: magical-glow 1s ease-in-out infinite;
}

.role-badge-large:hover {
  transform: scale(1.05);
  animation: heartbeat 1s ease-in-out infinite;
}
```

---

## 6. ACCESSIBILITY COMPLIANCE

### WCAG Guidelines Implementation

#### Color Contrast
```css
/* Ensure minimum 4.5:1 contrast ratio */
.profile-name {
  color: var(--text-glass); /* rgba(255, 255, 255, 0.95) */
}

.info-label {
  color: var(--text-glass-secondary); /* rgba(255, 255, 255, 0.8) */
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .role-badge {
    border-width: 3px;
  }
  
  .form-input-magical:focus {
    outline: 3px solid #ffffff;
    outline-offset: 2px;
  }
}
```

#### Keyboard Navigation
```css
/* Focus styles */
.btn-glass-primary:focus,
.btn-glass-secondary:focus {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: 2px;
  box-shadow: 
    var(--shadow-glass-lg),
    0 0 0 4px rgba(255, 255, 255, 0.2);
}

.form-input-magical:focus {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: 2px;
}

/* Skip to content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--glass-bg-strong);
  color: var(--text-glass);
  padding: 8px;
  border-radius: 4px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 6px;
}
```

#### Screen Reader Support
```html
<!-- ARIA labels and descriptions -->
<div class="profile-avatar" 
     aria-label="Avatar del usuario" 
     role="img">
  {{ initials }}
</div>

<button aria-describedby="edit-help" 
        class="btn-glass-secondary">
  Editar Perfil
</button>
<div id="edit-help" class="sr-only">
  Permite editar tu información personal
</div>

<!-- Form validation messages -->
<input aria-describedby="firstname-error" 
       aria-invalid="true"
       class="form-input-magical error">
<div id="firstname-error" role="alert" class="error-message">
  El nombre es requerido
</div>
```

#### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  .glass-card-magical,
  .role-badge,
  .card-icon-container {
    animation: none;
  }
  
  .profile-avatar:hover {
    transform: none;
  }
  
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. FORM VALIDATION & ERROR HANDLING

### Validation Rules
```typescript
interface ProfileValidation {
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZáéíóúñÑ\s]+$/,
    message: 'Solo se permiten letras y espacios'
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZáéíóúñÑ\s]+$/,
    message: 'Solo se permiten letras y espacios'
  }
}
```

### Error State Styling
```css
.form-input-magical.error {
  border-color: var(--error-border);
  box-shadow: 0 0 10px var(--error-glow);
  animation: error-shake 0.5s ease-in-out;
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

.success-message {
  color: #34d399;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: bounce-in 0.4s var(--ease-bounce);
}

.success-message::before {
  content: '✅';
  font-size: 1rem;
}
```

---

## 8. COMPONENT INTEGRATION CHECKLIST

### Required Vue Components
- [ ] `ProfilePage.vue` - Main profile page container
- [ ] `ProfileHero.vue` - Hero section with avatar and basic info  
- [ ] `PersonalInfoCard.vue` - Editable personal information
- [ ] `RolePermissionsCard.vue` - Role display and permissions
- [ ] `SecuritySettingsCard.vue` - Password management
- [ ] `ActivitySummaryCard.vue` - Optional activity tracking
- [ ] `PasswordChangeModal.vue` - Password change form
- [ ] `ProfileEditForm.vue` - Reusable edit form component

### Design System Integration
- [ ] All components use existing glassmorphism classes
- [ ] Role-based color coding implemented
- [ ] Magical animations and micro-interactions added
- [ ] Responsive breakpoints configured
- [ ] Accessibility attributes included
- [ ] Error handling with delightful feedback
- [ ] Loading states with magical spinners

### Data Flow Requirements
- [ ] User profile data fetching from Supabase
- [ ] Real-time role and permissions loading
- [ ] Form validation with immediate feedback
- [ ] Optimistic updates with rollback on error
- [ ] Success/error notifications with animations
- [ ] Profile picture upload handling (future)

---

## 9. IMPLEMENTATION PRIORITY

### Phase 1: Core Profile Display (Sprint Priority 1)
1. **Profile Hero Section** - Avatar, name, email, role badge
2. **Personal Information Card** - Display mode with basic info
3. **Role & Permissions Card** - Current role and permissions list
4. **Basic edit functionality** - Edit personal information

### Phase 2: Security & Interactions (Sprint Priority 2) 
1. **Security Settings Card** - Password management
2. **Enhanced animations** - Magical micro-interactions
3. **Advanced form validation** - Real-time validation with feedback
4. **Mobile optimizations** - Touch-friendly interactions

### Phase 3: Enhanced Features (Future Sprints)
1. **Activity Summary Card** - Recent activity tracking
2. **Profile picture upload** - Avatar management
3. **Advanced preferences** - Theme and notification settings
4. **Team member profiles** - View other user profiles (for admins)

---

## 10. TECHNICAL NOTES

### CSS Custom Properties Usage
The design leverages existing CSS custom properties from the glassmorphism system:
- `--glass-bg-*` for background variations
- `--glass-border-*` for border styling  
- `--shadow-glass-*` for shadow effects
- `--text-glass-*` for text color hierarchy
- `--radius-glass-*` for consistent border radius

### Animation Performance
- Use `transform` and `opacity` for animations
- Leverage `will-change` property for complex animations
- Implement `prefers-reduced-motion` media query
- Use CSS custom properties for animation timing

### Responsive Considerations
- Mobile-first approach with progressive enhancement
- Touch-friendly 44px minimum touch targets
- Simplified layouts for small screens
- Optimized for field worker usage patterns

This design specification provides a comprehensive foundation for implementing a beautiful, functional, and accessible user profile page that seamlessly integrates with the existing glassmorphism design system while meeting all UX research requirements.