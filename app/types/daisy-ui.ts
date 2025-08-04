/**
 * Enhanced TypeScript definitions for DaisyUI integration
 * Provides better developer experience with autocompletion and type safety
 */

// Core DaisyUI theme definitions
export type DaisyTheme = 'glassmorphism' | 'light' | 'dark'

// Component variant types
export type DaisyButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'accent' 
  | 'ghost' 
  | 'link' 
  | 'glass'
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info'

export type DaisyButtonSize = 'xs' | 'sm' | 'md' | 'lg'
export type DaisyButtonType = 'button' | 'submit' | 'reset'

export type DaisyCardVariant = 'default' | 'compact' | 'side' | 'image-full'
export type DaisyCardSize = 'sm' | 'md' | 'lg'

export type DaisyAlertType = 'info' | 'success' | 'warning' | 'error'
export type DaisyBadgeVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline'

// Component size types
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// Glass effect types
export type GlassBlurLevel = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type GlassOpacity = 'light' | 'medium' | 'strong'

// DaisyUI component mapping
export type DaisyComponent = 
  | 'btn' 
  | 'card' 
  | 'modal' 
  | 'dropdown' 
  | 'table' 
  | 'input' 
  | 'select' 
  | 'textarea' 
  | 'alert' 
  | 'badge' 
  | 'progress' 
  | 'loading' 
  | 'tooltip'
  | 'checkbox'
  | 'radio'
  | 'toggle'
  | 'range'
  | 'file-input'
  | 'join'
  | 'steps'
  | 'timeline'
  | 'chat'
  | 'mockup-phone'
  | 'mockup-browser'

// Configuration interfaces
export interface DaisyUIConfig {
  /** Default theme to use */
  defaultTheme?: DaisyTheme
  /** Enable glassmorphism effects */
  enableGlassEffects?: boolean
  /** Enable animations and transitions */
  enableAnimations?: boolean
  /** Performance mode - reduces animations and effects */
  performanceMode?: boolean
  /** Enable accessibility features */
  accessibility?: boolean
}

export interface GlassConfig {
  /** Blur level for backdrop filter */
  blur?: GlassBlurLevel
  /** Background opacity level */
  opacity?: GlassOpacity
  /** Enable border effects */
  borders?: boolean
  /** Enable shadow effects */
  shadows?: boolean
  /** Enable hover effects */
  hoverEffects?: boolean
}

// Component prop interfaces
export interface DaisyButtonProps {
  variant?: DaisyButtonVariant
  size?: DaisyButtonSize
  type?: DaisyButtonType
  loading?: boolean
  disabled?: boolean
  icon?: string
  iconOnly?: boolean
  outline?: boolean
  wide?: boolean
  glass?: boolean
  ariaLabel?: string
  ariaDescribedBy?: string
  ripple?: boolean
}

export interface DaisyCardProps {
  title?: string
  description?: string
  image?: string
  imageAlt?: string
  badge?: string
  actions?: CardAction[]
  variant?: DaisyCardVariant
  size?: DaisyCardSize
  glass?: boolean
  bordered?: boolean
  shadow?: boolean
  interactive?: boolean
  customClass?: string
  role?: string
  actionsLabel?: string
}

export interface CardAction {
  label: string
  onClick: () => void | Promise<void>
  variant?: DaisyButtonVariant
  size?: DaisyButtonSize
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
}

// Theme configuration
export interface ThemeColors {
  primary: string
  'primary-content': string
  secondary: string
  'secondary-content': string
  accent: string
  'accent-content': string
  neutral: string
  'neutral-content': string
  'base-100': string
  'base-200': string
  'base-300': string
  'base-content': string
  info: string
  'info-content': string
  success: string
  'success-content': string
  warning: string
  'warning-content': string
  error: string
  'error-content': string
}

// Composable return types
export interface DaisyUIComposable {
  mergeClasses: (
    daisyClasses?: string,
    glassClasses?: string,
    priority?: 'daisy' | 'glass'
  ) => string
  switchToDaisyTheme: (theme?: DaisyTheme) => void
  switchToGlassTheme: () => void
  getDaisyGlassClasses: (component: DaisyComponent) => string
  isDaisyThemeActive: () => boolean
  getCurrentTheme: () => DaisyTheme | null
  getAvailableThemes: () => DaisyTheme[]
  isValidComponent: (component: string) => component is DaisyComponent
  createClasses: (
    baseClasses: string,
    conditionalClasses?: Record<string, boolean>
  ) => string
  config: DaisyUIConfig
}

// Event types
export interface ThemeChangeEvent extends CustomEvent {
  detail: {
    theme: DaisyTheme
    timestamp: number
  }
}

export interface GlassThemeChangeEvent extends CustomEvent {
  detail: {
    timestamp: number
  }
}

// CSS class utility types
export type DaisyClass = `daisy-${string}`
export type GlassClass = `glass-${string}` | `bg-glass-${string}` | `border-glass-${string}`

// Animation and transition types
export type AnimationDuration = 'fast' | 'normal' | 'slow' | 'slower'
export type EasingFunction = 'ease-out' | 'ease-in' | 'ease-in-out' | 'bounce' | 'elastic' | 'spring'

// Accessibility types
export interface A11yProps {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-expanded'?: boolean
  'aria-disabled'?: boolean
  'aria-pressed'?: boolean
  'aria-checked'?: boolean
  role?: string
  tabindex?: number
}

// Performance monitoring types
export interface PerformanceMetrics {
  renderTime: number
  componentCount: number
  cssSize: number
  jsSize: number
  interactionDelay: number
}

// Error handling types
export interface DaisyUIError extends Error {
  component?: string
  context?: string
  timestamp: number
}

// Validation schemas
export const VALID_BUTTON_VARIANTS: readonly DaisyButtonVariant[] = [
  'primary', 'secondary', 'accent', 'ghost', 'link', 'glass', 'success', 'warning', 'error', 'info'
] as const

export const VALID_BUTTON_SIZES: readonly DaisyButtonSize[] = [
  'xs', 'sm', 'md', 'lg'
] as const

export const VALID_THEMES: readonly DaisyTheme[] = [
  'glassmorphism', 'light', 'dark'
] as const

export const VALID_COMPONENTS: readonly DaisyComponent[] = [
  'btn', 'card', 'modal', 'dropdown', 'table', 'input', 'select', 'textarea',
  'alert', 'badge', 'progress', 'loading', 'tooltip', 'checkbox', 'radio',
  'toggle', 'range', 'file-input', 'join', 'steps', 'timeline', 'chat',
  'mockup-phone', 'mockup-browser'
] as const

// Type guards
export const isDaisyButtonVariant = (variant: string): variant is DaisyButtonVariant => {
  return VALID_BUTTON_VARIANTS.includes(variant as DaisyButtonVariant)
}

export const isDaisyTheme = (theme: string): theme is DaisyTheme => {
  return VALID_THEMES.includes(theme as DaisyTheme)
}

export const isDaisyComponent = (component: string): component is DaisyComponent => {
  return VALID_COMPONENTS.includes(component as DaisyComponent)
}

// Utility types for better inference
export type ExtractVariant<T> = T extends { variant?: infer V } ? V : never
export type ExtractSize<T> = T extends { size?: infer S } ? S : never

// CSS-in-TS utility types
export type CSSValue = string | number
export type CSSProperties = Partial<Record<string, CSSValue>>

// Component state types
export interface ComponentState {
  loading: boolean
  disabled: boolean
  focused: boolean
  hovered: boolean
  pressed: boolean
  error: boolean
}

// Form-related types
export interface FormFieldProps {
  name?: string
  value?: any
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  validation?: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: any) => boolean | string
  }
}

// Enhanced DaisyUI integration types
export interface EnhancedDaisyUIConfig extends DaisyUIConfig {
  /** Enable performance monitoring */
  monitoring?: boolean
  /** Custom CSS variables override */
  cssVariables?: Record<string, string>
  /** Component-specific configurations */
  components?: Partial<Record<DaisyComponent, any>>
}