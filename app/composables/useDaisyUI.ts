/**
 * Composable for using DaisyUI components alongside the existing glassmorphism system
 * This provides a bridge between DaisyUI and custom glass components
 */

// Enhanced type definitions for better developer experience with #799EFF integration
export type DaisyTheme = 'glassmorphism' | 'light_primary' | 'dark_primary' | 'light' | 'dark'
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
  | 'navbar' 
  | 'drawer' 
  | 'menu'

export type ClassPriority = 'daisy' | 'glass'

export interface DaisyUIConfig {
  defaultTheme?: DaisyTheme
  enableGlassEffects?: boolean
  enableAnimations?: boolean
  enablePrimaryColors?: boolean
  glassIntensity?: 'light' | 'medium' | 'strong'
  animationDuration?: 'fast' | 'normal' | 'slow'
}

export const useDaisyUI = (config: DaisyUIConfig = {}) => {
  // Enhanced configuration with #799EFF optimizations
  const {
    defaultTheme = 'glassmorphism',
    enableGlassEffects = true,
    enableAnimations = true,
    enablePrimaryColors = true,
    glassIntensity = 'medium',
    animationDuration = 'normal'
  } = config

  /**
   * Merge DaisyUI classes with glassmorphism classes
   * @param daisyClasses - DaisyUI component classes
   * @param glassClasses - Custom glassmorphism classes
   * @param priority - Which system takes priority
   */
  const mergeClasses = (
    daisyClasses: string = '',
    glassClasses: string = '',
    priority: ClassPriority = 'glass'
  ): string => {
    if (priority === 'glass') {
      return `${daisyClasses} ${glassClasses}`.trim()
    }
    return `${glassClasses} ${daisyClasses}`.trim()
  }

  /**
   * Switch to a specific DaisyUI theme
   * @param theme - The theme to switch to
   */
  const switchToDaisyTheme = (theme: DaisyTheme = defaultTheme): void => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme)
      // Dispatch custom event for theme change listeners
      document.dispatchEvent(new CustomEvent('daisy-theme-changed', { 
        detail: { theme, timestamp: Date.now() } 
      }))
    }
  }

  /**
   * Switch back to custom glassmorphism styling
   */
  const switchToGlassTheme = (): void => {
    if (typeof document !== 'undefined') {
      document.documentElement.removeAttribute('data-theme')
      // Dispatch custom event for theme change listeners
      document.dispatchEvent(new CustomEvent('glass-theme-changed', { 
        detail: { timestamp: Date.now() } 
      }))
    }
  }

  /**
   * Get DaisyUI component classes with enhanced glass backdrop and #799EFF primary colors
   * Optimized for the new color palette and glassmorphism integration
   * @param component - The DaisyUI component type
   */
  const getDaisyGlassClasses = (component: DaisyComponent): string => {
    // Glass intensity mapping
    const glassBlurMap = {
      light: 'backdrop-blur-glass-sm',
      medium: 'backdrop-blur-glass-md', 
      strong: 'backdrop-blur-glass-lg'
    }
    
    const baseBlur = glassBlurMap[glassIntensity]
    
    const componentMap: Record<DaisyComponent, string> = {
      // BUTTONS - Enhanced with primary glass
      'btn': `daisy-btn ${baseBlur} bg-glass-bg-primary border-glass-border-primary text-primary-content hover:bg-primary-600 focus:ring-primary-300`,
      
      // CARDS - Primary-tinted glass backgrounds
      'card': `daisy-card ${baseBlur} bg-glass-bg-primary border-glass-border-primary shadow-primary`,
      
      // MODALS - Strong glass with primary accents
      'modal': `daisy-modal backdrop-blur-glass-lg bg-glass-bg-primary-strong border-glass-border-primary-strong`,
      
      // DROPDOWNS - Medium glass with primary tinting
      'dropdown': `daisy-dropdown ${baseBlur} bg-glass-bg-primary border-glass-border-primary`,
      
      // TABLES - Light glass for better readability
      'table': `daisy-table backdrop-blur-glass-sm bg-glass-bg-primary-light border-glass-border-primary-light`,
      
      // FORM ELEMENTS - Enhanced with primary focus states
      'input': `daisy-input backdrop-blur-glass-sm bg-glass-bg-primary-light border-glass-border-primary focus:border-primary-400 focus:ring-primary-200`,
      'select': `daisy-select backdrop-blur-glass-sm bg-glass-bg-primary-light border-glass-border-primary focus:border-primary-400 focus:ring-primary-200`,
      'textarea': `daisy-textarea backdrop-blur-glass-sm bg-glass-bg-primary-light border-glass-border-primary focus:border-primary-400 focus:ring-primary-200`,
      
      // ALERTS - Medium glass with semantic colors
      'alert': `daisy-alert ${baseBlur} bg-glass-bg-primary-medium border-glass-border-primary`,
      
      // BADGES - Small glass elements with primary accents
      'badge': `daisy-badge backdrop-blur-glass-sm bg-glass-bg-primary border-glass-border-primary-light text-primary-700`,
      
      // PROGRESS - Minimal glass for clean appearance
      'progress': `daisy-progress backdrop-blur-glass-sm bg-glass-bg-primary-light`,
      
      // LOADING - Primary color theming
      'loading': `daisy-loading text-primary-600`,
      
      // TOOLTIPS - Strong glass for visibility
      'tooltip': `daisy-tooltip backdrop-blur-glass-md bg-glass-bg-primary-strong border-glass-border-primary text-primary-content`,
      
      // NAVIGATION - Enhanced glass for better hierarchy
      'navbar': `daisy-navbar ${baseBlur} bg-glass-bg-primary border-glass-border-primary shadow-primary`,
      'drawer': `daisy-drawer ${baseBlur} bg-glass-bg-primary-medium border-glass-border-primary`,
      'menu': `daisy-menu ${baseBlur} bg-glass-bg-primary-light border-glass-border-primary-light`,
    }
    
    const classes = componentMap[component]
    if (!classes) {
      console.warn(`[useDaisyUI] Unknown component type: ${component}`)
      return ''
    }
    
    // Apply glass effects only if enabled
    return enableGlassEffects ? classes : componentMap[component]?.replace(/backdrop-blur-\S+\s*/g, '') || ''
  }

  /**
   * Check if DaisyUI theme is active
   */
  const isDaisyThemeActive = (): boolean => {
    if (typeof document === 'undefined') return false
    return document.documentElement.hasAttribute('data-theme')
  }

  /**
   * Get the currently active theme
   */
  const getCurrentTheme = (): DaisyTheme | null => {
    if (typeof document === 'undefined') return null
    const theme = document.documentElement.getAttribute('data-theme')
    return theme as DaisyTheme || null
  }

  /**
   * Get available DaisyUI themes with enhanced #799EFF variants
   */
  const getAvailableThemes = (): DaisyTheme[] => {
    return ['glassmorphism', 'light_primary', 'dark_primary', 'light', 'dark']
  }

  /**
   * Validate if a component type is supported (expanded for #799EFF integration)
   * @param component - Component type to validate
   */
  const isValidComponent = (component: string): component is DaisyComponent => {
    const validComponents: DaisyComponent[] = [
      'btn', 'card', 'modal', 'dropdown', 'table', 'input', 
      'select', 'textarea', 'alert', 'badge', 'progress', 'loading', 'tooltip',
      'navbar', 'drawer', 'menu'
    ]
    return validComponents.includes(component as DaisyComponent)
  }

  /**
   * Create CSS classes with proper validation and error handling
   * @param baseClasses - Base CSS classes
   * @param conditionalClasses - Conditional classes to apply
   */
  const createClasses = (
    baseClasses: string,
    conditionalClasses: Record<string, boolean> = {}
  ): string => {
    const classes = [baseClasses]
    
    Object.entries(conditionalClasses).forEach(([className, condition]) => {
      if (condition && className.trim()) {
        classes.push(className)
      }
    })
    
    return classes.filter(Boolean).join(' ').trim()
  }

  /**
   * Get primary color variants for dynamic theming
   */
  const getPrimaryColorVariants = () => {
    return {
      50: 'var(--primary-50)',
      100: 'var(--primary-100)',
      200: 'var(--primary-200)',
      300: 'var(--primary-300)',
      400: 'var(--primary-400)',
      500: 'var(--primary-500)', // Base #799EFF
      600: 'var(--primary-600)',
      700: 'var(--primary-700)',
      800: 'var(--primary-800)',
      900: 'var(--primary-900)',
    }
  }
  
  /**
   * Get glassmorphism color variants with primary tinting
   */
  const getGlassColorVariants = () => {
    return {
      'bg-primary': 'var(--glass-bg-primary)',
      'bg-primary-light': 'var(--glass-bg-primary-light)',
      'bg-primary-medium': 'var(--glass-bg-primary-medium)',
      'bg-primary-strong': 'var(--glass-bg-primary-strong)',
      'border-primary': 'var(--glass-border-primary)',
      'border-primary-light': 'var(--glass-border-primary-light)',
      'border-primary-strong': 'var(--glass-border-primary-strong)',
    }
  }
  
  /**
   * Apply theme-aware color classes based on current theme
   */
  const getThemeAwareClasses = (lightClasses: string, darkClasses: string): string => {
    const currentTheme = getCurrentTheme()
    if (currentTheme === 'dark_primary' || currentTheme === 'dark') {
      return darkClasses
    }
    return lightClasses
  }

  return {
    // Core functionality
    mergeClasses,
    switchToDaisyTheme,
    switchToGlassTheme,
    getDaisyGlassClasses,
    isDaisyThemeActive,
    getCurrentTheme,
    getAvailableThemes,
    isValidComponent,
    createClasses,
    
    // Enhanced #799EFF functionality
    getPrimaryColorVariants,
    getGlassColorVariants,
    getThemeAwareClasses,
    
    // Configuration access
    config: {
      defaultTheme,
      enableGlassEffects,
      enableAnimations,
      enablePrimaryColors,
      glassIntensity,
      animationDuration
    }
  }
}

export type DaisyUIComposable = ReturnType<typeof useDaisyUI>