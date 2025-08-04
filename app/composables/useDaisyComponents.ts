import { ref, computed, type Ref } from 'vue'

export interface DaisyTheme {
  primary: string
  secondary: string
  accent: string
  neutral: string
  'base-100': string
  'base-200': string
  'base-300': string
  info: string
  success: string
  warning: string
  error: string
}

export interface DaisyToastOptions {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message: string
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  persistent?: boolean
}

export interface DaisyModalOptions {
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  persistent?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

export interface DaisyConfirmOptions extends DaisyModalOptions {
  confirmText?: string
  cancelText?: string
  type?: 'info' | 'warning' | 'error' | 'success'
}

/**
 * Composable for managing Daisy UI components and utilities
 * Provides a centralized way to work with the minimalist design system
 */
export const useDaisyComponents = () => {
  // Theme management
  const currentTheme = ref<string>('glassmorphism')
  const isDarkMode = ref(false)

  // Toast management
  const toasts = ref<Array<{ id: string; options: DaisyToastOptions }>>([])
  
  // Modal management
  const modals = ref<Array<{ id: string; isOpen: boolean; options: DaisyModalOptions }>>([])

  // Theme utilities
  const setTheme = (theme: string) => {
    currentTheme.value = theme
    if (process.client) {
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('daisy-theme', theme)
    }
  }

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    const theme = isDarkMode.value ? 'dark' : 'glassmorphism'
    setTheme(theme)
  }

  const initializeTheme = () => {
    if (process.client) {
      const savedTheme = localStorage.getItem('daisy-theme') || 'glassmorphism'
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      if (savedTheme === 'auto') {
        setTheme(prefersDark ? 'dark' : 'glassmorphism')
        isDarkMode.value = prefersDark
      } else {
        setTheme(savedTheme)
        isDarkMode.value = savedTheme === 'dark'
      }
    }
  }

  // Toast utilities
  const showToast = (options: DaisyToastOptions) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const duration = options.duration ?? 5000
    
    toasts.value.push({ id, options })

    if (!options.persistent && duration > 0) {
      setTimeout(() => {
        hideToast(id)
      }, duration)
    }

    return id
  }

  const hideToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAllToasts = () => {
    toasts.value = []
  }

  // Toast shortcuts
  const toastSuccess = (message: string, options?: Partial<DaisyToastOptions>) => {
    return showToast({ type: 'success', message, ...options })
  }

  const toastError = (message: string, options?: Partial<DaisyToastOptions>) => {
    return showToast({ type: 'error', message, ...options })
  }

  const toastWarning = (message: string, options?: Partial<DaisyToastOptions>) => {
    return showToast({ type: 'warning', message, ...options })
  }

  const toastInfo = (message: string, options?: Partial<DaisyToastOptions>) => {
    return showToast({ type: 'info', message, ...options })
  }

  // Modal utilities
  const showModal = (options: DaisyModalOptions = {}) => {
    const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    modals.value.push({ id, isOpen: true, options })
    return id
  }

  const hideModal = (id: string) => {
    const modal = modals.value.find(m => m.id === id)
    if (modal) {
      modal.isOpen = false
      // Remove after animation completes
      setTimeout(() => {
        const index = modals.value.findIndex(m => m.id === id)
        if (index > -1) {
          modals.value.splice(index, 1)
        }
      }, 300)
    }
  }

  const hideAllModals = () => {
    modals.value.forEach(modal => {
      modal.isOpen = false
    })
    // Clear after animations complete
    setTimeout(() => {
      modals.value = []
    }, 300)
  }

  // Confirmation dialog
  const confirm = (options: DaisyConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const id = showModal({
        ...options,
        persistent: true,
        closeOnBackdrop: false,
        closeOnEscape: false
      })

      // This would need to be implemented with a confirmation component
      // For now, using native confirm as fallback
      const result = window.confirm(`${options.title || 'Confirm'}\n${options.description || ''}`)
      hideModal(id)
      resolve(result)
    })
  }

  // Form validation utilities
  const validateField = (value: any, rules: string[]): string[] => {
    const errors: string[] = []

    for (const rule of rules) {
      switch (rule) {
        case 'required':
          if (!value || (typeof value === 'string' && !value.trim())) {
            errors.push('This field is required')
          }
          break
        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push('Please enter a valid email address')
          }
          break
        case 'url':
          if (value && !/^https?:\/\/.+/.test(value)) {
            errors.push('Please enter a valid URL')
          }
          break
        case 'number':
          if (value && isNaN(Number(value))) {
            errors.push('Please enter a valid number')
          }
          break
        default:
          // Custom validation rules can be added here
          break
      }
    }

    return errors
  }

  // Loading state management
  const loadingStates = ref<Map<string, boolean>>(new Map())

  const setLoading = (key: string, loading: boolean) => {
    loadingStates.value.set(key, loading)
  }

  const isLoading = (key: string): boolean => {
    return loadingStates.value.get(key) || false
  }

  const withLoading = async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
    try {
      setLoading(key, true)
      return await fn()
    } finally {
      setLoading(key, false)
    }
  }

  // Component state management
  const componentStates = ref<Map<string, any>>(new Map())

  const setComponentState = (key: string, state: any) => {
    componentStates.value.set(key, state)
  }

  const getComponentState = <T>(key: string, defaultValue?: T): T => {
    return componentStates.value.get(key) ?? defaultValue
  }

  // Accessibility utilities
  const announceToScreenReader = (message: string) => {
    if (process.client) {
      const announcement = document.createElement('div')
      announcement.setAttribute('aria-live', 'polite')
      announcement.setAttribute('aria-atomic', 'true')
      announcement.className = 'sr-only'
      announcement.textContent = message
      
      document.body.appendChild(announcement)
      
      setTimeout(() => {
        document.body.removeChild(announcement)
      }, 1000)
    }
  }

  // Performance utilities
  const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  // Computed properties
  const themeColors = computed<DaisyTheme>(() => {
    // This would typically read from CSS variables or theme config
    return {
      primary: '#799EFF',
      secondary: '#64748B',
      accent: '#22C55E',
      neutral: '#374151',
      'base-100': '#FFFFFF',
      'base-200': '#F8FAFC',
      'base-300': '#E2E8F0',
      info: '#3B82F6',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    }
  })

  const isReducedMotion = computed(() => {
    if (process.client) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return false
  })

  const isHighContrast = computed(() => {
    if (process.client) {
      return window.matchMedia('(prefers-contrast: high)').matches
    }
    return false
  })

  // Initialize on client side
  if (process.client) {
    initializeTheme()
  }

  return {
    // Theme
    currentTheme: readonly(currentTheme),
    isDarkMode: readonly(isDarkMode),
    themeColors,
    setTheme,
    toggleDarkMode,
    initializeTheme,

    // Toasts
    toasts: readonly(toasts),
    showToast,
    hideToast,
    clearAllToasts,
    toastSuccess,
    toastError,
    toastWarning,
    toastInfo,

    // Modals
    modals: readonly(modals),
    showModal,
    hideModal,
    hideAllModals,
    confirm,

    // Form validation
    validateField,

    // Loading states
    setLoading,
    isLoading,
    withLoading,

    // Component states
    setComponentState,
    getComponentState,

    // Accessibility
    announceToScreenReader,

    // Performance
    debounce,
    throttle,

    // Computed properties
    isReducedMotion,
    isHighContrast
  }
}