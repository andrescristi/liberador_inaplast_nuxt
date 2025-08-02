# Phase 2: UI Design System & Component Specifications

## 1. DESIGN SYSTEM FOUNDATION

### Color Palette

#### Brand Colors
```css
/* Primary - Professional Blue */
--primary-50: #eff6ff
--primary-100: #dbeafe
--primary-500: #3b82f6  /* Main brand color */
--primary-600: #2563eb  /* Hover states */
--primary-700: #1d4ed8  /* Active states */
--primary-900: #1e3a8a  /* Text on light backgrounds */

/* Secondary - Complementary Teal */
--secondary-50: #f0fdfa
--secondary-100: #ccfbf1
--secondary-500: #14b8a6
--secondary-600: #0d9488
--secondary-700: #0f766e
```

#### Status Colors
```css
/* Success - Green */
--success-50: #f0fdf4
--success-100: #dcfce7
--success-500: #22c55e
--success-600: #16a34a
--success-700: #15803d

/* Warning - Amber */
--warning-50: #fffbeb
--warning-100: #fef3c7
--warning-500: #f59e0b
--warning-600: #d97706
--warning-700: #b45309

/* Error - Red */
--error-50: #fef2f2
--error-100: #fee2e2
--error-500: #ef4444
--error-600: #dc2626
--error-700: #b91c1c

/* Info - Indigo */
--info-50: #eef2ff
--info-100: #e0e7ff
--info-500: #6366f1
--info-600: #4f46e5
--info-700: #4338ca
```

#### Neutral Grays
```css
/* Neutral Scale */
--neutral-50: #f8fafc   /* Background light */
--neutral-100: #f1f5f9  /* Background medium */
--neutral-200: #e2e8f0  /* Borders light */
--neutral-300: #cbd5e1  /* Borders medium */
--neutral-400: #94a3b8  /* Text muted */
--neutral-500: #64748b  /* Text secondary */
--neutral-600: #475569  /* Text primary */
--neutral-700: #334155  /* Text dark */
--neutral-800: #1e293b  /* Headers */
--neutral-900: #0f172a  /* Text darkest */
```

### Typography Scale

#### Font Stack
```css
/* Primary Font - Inter (clean, professional) */
font-family: 'Inter', system-ui, -apple-system, sans-serif;

/* Monospace - JetBrains Mono (for order IDs, data) */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

#### Type Scale (Mobile-First)
```css
/* Display - Hero sections */
.text-display {
  font-size: 2.25rem;    /* 36px */
  line-height: 2.5rem;   /* 40px */
  font-weight: 800;
  letter-spacing: -0.025em;
}

/* H1 - Page titles */
.text-h1 {
  font-size: 1.875rem;   /* 30px */
  line-height: 2.25rem;  /* 36px */
  font-weight: 700;
  letter-spacing: -0.025em;
}

/* H2 - Section headers */
.text-h2 {
  font-size: 1.5rem;     /* 24px */
  line-height: 2rem;     /* 32px */
  font-weight: 600;
  letter-spacing: -0.025em;
}

/* H3 - Card titles, subsections */
.text-h3 {
  font-size: 1.25rem;    /* 20px */
  line-height: 1.75rem;  /* 28px */
  font-weight: 600;
}

/* Body Large - Primary content */
.text-body-lg {
  font-size: 1.125rem;   /* 18px */
  line-height: 1.75rem;  /* 28px */
  font-weight: 400;
}

/* Body - Default text */
.text-body {
  font-size: 1rem;       /* 16px */
  line-height: 1.5rem;   /* 24px */
  font-weight: 400;
}

/* Body Small - Secondary text */
.text-body-sm {
  font-size: 0.875rem;   /* 14px */
  line-height: 1.25rem;  /* 20px */
  font-weight: 400;
}

/* Caption - Labels, metadata */
.text-caption {
  font-size: 0.75rem;    /* 12px */
  line-height: 1rem;     /* 16px */
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### Spacing System (8px Grid)
```css
/* Tailwind-compatible spacing scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### Border Radius & Shadows
```css
/* Border Radius */
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

## 2. COMPONENT SPECIFICATIONS

### Button System

#### Primary Buttons
```css
/* Primary Button */
.btn-primary {
  background: var(--primary-500);
  color: white;
  padding: 0.625rem 1.5rem;      /* 10px 24px */
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background: var(--primary-600);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-primary:active {
  background: var(--primary-700);
  transform: translateY(0);
}

/* Large Primary Button */
.btn-primary-lg {
  padding: 0.75rem 2rem;         /* 12px 32px */
  font-size: 1rem;
  border-radius: var(--radius-lg);
}
```

#### Secondary Buttons
```css
.btn-secondary {
  background: white;
  color: var(--primary-600);
  border: 2px solid var(--primary-200);
  padding: 0.5625rem 1.5rem;     /* Adjusted for border */
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--primary-50);
  border-color: var(--primary-300);
}
```

#### Destructive Buttons
```css
.btn-destructive {
  background: var(--error-500);
  color: white;
  padding: 0.625rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.btn-destructive:hover {
  background: var(--error-600);
}
```

#### Icon Buttons
```css
.btn-icon {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-icon-sm {
  width: 2rem;
  height: 2rem;
}
```

### Card Components

#### Metric Cards (Dashboard)
```css
.metric-card {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.metric-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--primary-200);
}

.metric-card-icon {
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.metric-card-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: 0.25rem;
}

.metric-card-label {
  font-size: 0.875rem;
  color: var(--neutral-500);
  font-weight: 500;
}
```

#### Order Cards (Mobile)
```css
.order-card {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  padding: 1rem;
  margin-bottom: 0.75rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.order-card:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-lg);
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.order-card-id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--neutral-600);
}

.order-card-amount {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--neutral-900);
}
```

### Data Tables

#### Table Container
```css
.data-table {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.data-table-header {
  background: var(--neutral-50);
  border-bottom: 1px solid var(--neutral-200);
}

.data-table-header th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--neutral-700);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-table-row {
  border-bottom: 1px solid var(--neutral-100);
  transition: all 0.15s ease;
}

.data-table-row:hover {
  background: var(--neutral-50);
}

.data-table-row:last-child {
  border-bottom: none;
}

.data-table-cell {
  padding: 1rem;
  font-size: 0.875rem;
  color: var(--neutral-600);
}
```

#### Table Actions
```css
.table-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.table-action-btn {
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--neutral-400);
  cursor: pointer;
  transition: all 0.15s ease;
}

.table-action-btn:hover {
  background: var(--neutral-100);
  color: var(--neutral-600);
}
```

### Form Components

#### Input Fields
```css
.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--neutral-200);
  border-radius: var(--radius-md);
  font-size: 1rem;
  color: var(--neutral-900);
  background: white;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.form-input:invalid {
  border-color: var(--error-500);
}

.form-input::placeholder {
  color: var(--neutral-400);
}
```

#### Select Dropdowns
```css
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 2.5rem;
  border: 2px solid var(--neutral-200);
  border-radius: var(--radius-md);
  font-size: 1rem;
  color: var(--neutral-900);
  background: white url("data:image/svg+xml...") no-repeat right 0.75rem center;
  appearance: none;
  cursor: pointer;
}
```

#### Form Labels
```css
.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--neutral-700);
  margin-bottom: 0.5rem;
}

.form-label.required::after {
  content: " *";
  color: var(--error-500);
}
```

### Status Indicators

#### Status Badges
```css
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Status Variants */
.status-pending {
  background: var(--warning-100);
  color: var(--warning-700);
}

.status-processing {
  background: var(--info-100);
  color: var(--info-700);
}

.status-completed {
  background: var(--success-100);
  color: var(--success-700);
}

.status-cancelled {
  background: var(--error-100);
  color: var(--error-700);
}
```

#### Status Timeline
```css
.status-timeline {
  position: relative;
  padding-left: 2rem;
}

.status-timeline::before {
  content: '';
  position: absolute;
  left: 0.75rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--neutral-200);
}

.timeline-item {
  position: relative;
  padding-bottom: 1.5rem;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -0.375rem;
  top: 0.125rem;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: var(--primary-500);
  border: 2px solid white;
  box-shadow: 0 0 0 2px var(--primary-500);
}

.timeline-item.completed::before {
  background: var(--success-500);
  box-shadow: 0 0 0 2px var(--success-500);
}
```

### Navigation Components

#### Header Navigation
```css
.header {
  background: white;
  border-bottom: 1px solid var(--neutral-200);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.95);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-600);
}

.nav-menu {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--neutral-600);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: var(--primary-600);
  background: var(--primary-50);
}

.nav-link.active {
  color: var(--primary-600);
  background: var(--primary-100);
  font-weight: 600;
}
```

#### Mobile Navigation
```css
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid var(--neutral-200);
  padding: 0.75rem;
  display: none;
}

@media (max-width: 768px) {
  .mobile-nav {
    display: flex;
    justify-content: space-around;
  }
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--neutral-500);
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.mobile-nav-item.active {
  color: var(--primary-600);
  background: var(--primary-50);
}

.mobile-nav-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-bottom: 0.25rem;
}
```

### Modal Components

#### Modal Overlay
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--neutral-900);
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}
```

## 3. PAGE-SPECIFIC DESIGNS

### Dashboard Layout
```css
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--neutral-900);
  margin-bottom: 0.5rem;
}

.dashboard-subtitle {
  color: var(--neutral-500);
  font-size: 1rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.recent-orders-section {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--neutral-900);
}
```

### Orders Management Page
```css
.orders-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filters-section {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.filters-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
}

.orders-table-container {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.table-pagination {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--neutral-200);
  display: flex;
  justify-content: between;
  align-items: center;
}
```

### Order Detail Page
```css
.order-detail-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.order-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--neutral-600);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.back-button:hover {
  color: var(--primary-600);
}

.order-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .order-info-grid {
    grid-template-columns: 1fr;
  }
}

.order-info-card {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.order-items-section {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
}

.order-items-table {
  width: 100%;
  border-collapse: collapse;
}

.order-items-table th,
.order-items-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--neutral-200);
}

.order-total {
  text-align: right;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--neutral-900);
  padding-top: 1rem;
  border-top: 2px solid var(--neutral-200);
}
```

## 4. MICRO-INTERACTIONS & ANIMATIONS

### Hover Effects
```css
/* Subtle lift on cards */
.card-hover {
  transition: all 0.2s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Button press feedback */
.btn-press {
  transition: transform 0.1s ease;
}

.btn-press:active {
  transform: scale(0.98);
}
```

### Loading States
```css
/* Skeleton loading */
.skeleton {
  background: linear-gradient(90deg, var(--neutral-200) 25%, var(--neutral-100) 50%, var(--neutral-200) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Spinner */
.spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid var(--neutral-200);
  border-top: 2px solid var(--primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### Success/Error Feedback
```css
/* Toast notifications */
.toast {
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 1rem 1.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  color: white;
  font-weight: 500;
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.toast-success {
  background: var(--success-500);
}

.toast-error {
  background: var(--error-500);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Form validation feedback */
.input-success {
  border-color: var(--success-500);
  box-shadow: 0 0 0 3px rgb(34 197 94 / 0.1);
}

.input-error {
  border-color: var(--error-500);
  box-shadow: 0 0 0 3px rgb(239 68 68 / 0.1);
}

.error-message {
  color: var(--error-600);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
```

### Page Transitions
```css
/* Fade in animation for page loads */
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-active {
  transition: all 0.3s ease;
}

.page-enter-to {
  opacity: 1;
  transform: translateY(0);
}
```

## 5. EMPTY STATES & ERROR HANDLING

### Empty State Components
```css
.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  color: var(--neutral-500);
}

.empty-state-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1.5rem;
  color: var(--neutral-300);
}

.empty-state-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--neutral-700);
  margin-bottom: 0.5rem;
}

.empty-state-description {
  font-size: 1rem;
  color: var(--neutral-500);
  margin-bottom: 1.5rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}
```

### Error Boundaries
```css
.error-boundary {
  text-align: center;
  padding: 3rem 1.5rem;
  background: var(--error-50);
  border: 1px solid var(--error-200);
  border-radius: var(--radius-lg);
  margin: 2rem 0;
}

.error-icon {
  width: 3rem;
  height: 3rem;
  color: var(--error-500);
  margin: 0 auto 1rem;
}

.error-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--error-700);
  margin-bottom: 0.5rem;
}

.error-message {
  color: var(--error-600);
  margin-bottom: 1.5rem;
}
```

## 6. RESPONSIVE DESIGN SPECIFICATIONS

### Mobile Adaptations
```css
@media (max-width: 768px) {
  /* Hide desktop navigation */
  .nav-menu {
    display: none;
  }
  
  /* Show mobile navigation */
  .mobile-nav {
    display: flex;
  }
  
  /* Stack metric cards */
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  /* Convert tables to cards */
  .data-table {
    display: none;
  }
  
  .mobile-cards {
    display: block;
  }
  
  /* Adjust padding */
  .dashboard-container,
  .orders-container,
  .order-detail-container {
    padding: 1rem;
  }
}
```

### Tablet Optimizations
```css
@media (min-width: 768px) and (max-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filters-grid {
    grid-template-columns: 2fr 1fr auto;
  }
  
  .order-info-grid {
    grid-template-columns: 1fr;
  }
}
```

## 7. ACCESSIBILITY ENHANCEMENTS

### Focus Management
```css
/* Focus rings */
.focus-ring:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* Skip to content */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-600);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
```

### Screen Reader Support
```css
/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## 8. DARK MODE SUPPORT (Future Enhancement)

### Dark Mode Variables
```css
@media (prefers-color-scheme: dark) {
  :root {
    --neutral-50: #0f172a;
    --neutral-100: #1e293b;
    --neutral-200: #334155;
    --neutral-300: #475569;
    --neutral-400: #64748b;
    --neutral-500: #94a3b8;
    --neutral-600: #cbd5e1;
    --neutral-700: #e2e8f0;
    --neutral-800: #f1f5f9;
    --neutral-900: #f8fafc;
  }
}
```

## IMPLEMENTATION NOTES

### shadcn/ui Customization
- Override default color tokens in `tailwind.config.js`
- Use CSS custom properties for consistent theming
- Extend default component variants for status indicators
- Add custom animations to the Tailwind config

### Performance Considerations
- Use `transform` and `opacity` for animations (GPU accelerated)
- Implement lazy loading for table data
- Use `will-change` property sparingly for better performance
- Optimize images and icons (prefer SVG)

### Development Workflow
1. Start with mobile-first responsive design
2. Use design tokens consistently across components
3. Test accessibility with keyboard navigation
4. Validate color contrast ratios (WCAG AA compliance)
5. Test loading states and error scenarios

This comprehensive design system provides a solid foundation for building a modern, accessible, and user-friendly order management application that works seamlessly across all devices and use cases.