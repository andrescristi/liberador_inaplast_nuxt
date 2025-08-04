/**
 * Auto-registration plugin for Daisy UI minimalist components
 * This plugin automatically registers all DaisyUI components globally
 * and initializes the design system with proper theme handling
 */

export default defineNuxtPlugin(() => {
  // Initialize theme on client side
  const { initializeTheme } = useDaisyComponents()
  
  // Initialize theme immediately
  initializeTheme()
  
  // Handle system theme changes
  if (process.client) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleThemeChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem('daisy-theme')
      if (savedTheme === 'auto' || !savedTheme) {
        const { setTheme } = useDaisyComponents()
        setTheme(e.matches ? 'dark' : 'glassmorphism')
      }
    }
    
    // Listen for system theme changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleThemeChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleThemeChange)
    }
    
    // Handle reduced motion preference
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('reduced-motion', e.matches)
    }
    
    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener('change', handleReducedMotionChange)
    } else {
      reducedMotionQuery.addListener(handleReducedMotionChange)
    }
    
    // Set initial reduced motion state
    document.documentElement.classList.toggle('reduced-motion', reducedMotionQuery.matches)
    
    // Handle high contrast preference
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)')
    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('high-contrast', e.matches)
    }
    
    if (highContrastQuery.addEventListener) {
      highContrastQuery.addEventListener('change', handleHighContrastChange)
    } else {
      highContrastQuery.addListener(handleHighContrastChange)
    }
    
    // Set initial high contrast state
    document.documentElement.classList.toggle('high-contrast', highContrastQuery.matches)
    
    // Add keyboard navigation helper
    const addKeyboardNavigationClass = () => {
      document.documentElement.classList.add('keyboard-navigation')
    }
    
    const removeKeyboardNavigationClass = () => {
      document.documentElement.classList.remove('keyboard-navigation')
    }
    
    // Track keyboard vs mouse navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        addKeyboardNavigationClass()
      }
    })
    
    document.addEventListener('mousedown', removeKeyboardNavigationClass)
    
    // Performance monitoring for development
    if (process.env.NODE_ENV === 'development') {
      // Monitor component render performance
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('daisy-') && entry.duration > 16) {
            console.warn(`Slow Daisy component render: ${entry.name} took ${entry.duration}ms`)
          }
        }
      })
      
      try {
        observer.observe({ entryTypes: ['measure'] })
      } catch (e) {
        // PerformanceObserver not supported in this environment
      }
    }
    
    // Initialize focus-visible polyfill for better focus management
    try {
      import('focus-visible')
    } catch (e) {
      console.warn('focus-visible polyfill not available')
    }
  }
  
  return {
    provide: {
      daisyComponents: useDaisyComponents()
    }
  }
})