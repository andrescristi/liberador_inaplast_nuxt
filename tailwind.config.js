/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    "./app/**/*.{js,vue,ts}",
    "./composables/**/*.{js,ts}"
  ],
  theme: {
    extend: {
      // Enhanced color system with Inaplast brand colors
      colors: {
        // Brand Primary Colors - #799EFF Base
        'primary': {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)', // Base brand color
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
          DEFAULT: 'var(--primary-500)',
        },
        // Secondary Colors - Warm Orange
        'secondary': {
          50: 'var(--secondary-50)',
          100: 'var(--secondary-100)',
          200: 'var(--secondary-200)',
          300: 'var(--secondary-300)',
          400: 'var(--secondary-400)',
          500: 'var(--secondary-500)',
          600: 'var(--secondary-600)',
          700: 'var(--secondary-700)',
          800: 'var(--secondary-800)',
          900: 'var(--secondary-900)',
          DEFAULT: 'var(--secondary-500)',
        },
        // Accent Colors - Electric Cyan
        'accent': {
          50: 'var(--accent-50)',
          100: 'var(--accent-100)',
          200: 'var(--accent-200)',
          300: 'var(--accent-300)',
          400: 'var(--accent-400)',
          500: 'var(--accent-500)',
          600: 'var(--accent-600)',
          700: 'var(--accent-700)',
          800: 'var(--accent-800)',
          900: 'var(--accent-900)',
          DEFAULT: 'var(--accent-500)',
        },
        // Purple Accent
        'purple': {
          50: 'var(--accent-purple-50)',
          100: 'var(--accent-purple-100)',
          200: 'var(--accent-purple-200)',
          300: 'var(--accent-purple-300)',
          400: 'var(--accent-purple-400)',
          500: 'var(--accent-purple-500)',
          600: 'var(--accent-purple-600)',
          700: 'var(--accent-purple-700)',
          800: 'var(--accent-purple-800)',
          900: 'var(--accent-purple-900)',
          DEFAULT: 'var(--accent-purple-500)',
        },
        // Enhanced Neutral Palette
        'neutral': {
          50: 'var(--neutral-50)',
          100: 'var(--neutral-100)',
          200: 'var(--neutral-200)',
          300: 'var(--neutral-300)',
          400: 'var(--neutral-400)',
          500: 'var(--neutral-500)',
          600: 'var(--neutral-600)',
          700: 'var(--neutral-700)',
          800: 'var(--neutral-800)',
          900: 'var(--neutral-900)',
          DEFAULT: 'var(--neutral-500)',
        },
        // Semantic Colors
        'success': {
          50: 'var(--success-50)',
          100: 'var(--success-100)',
          200: 'var(--success-200)',
          300: 'var(--success-300)',
          400: 'var(--success-400)',
          500: 'var(--success-500)',
          600: 'var(--success-600)',
          700: 'var(--success-700)',
          800: 'var(--success-800)',
          900: 'var(--success-900)',
          DEFAULT: 'var(--success-500)',
        },
        'warning': {
          50: 'var(--warning-50)',
          100: 'var(--warning-100)',
          200: 'var(--warning-200)',
          300: 'var(--warning-300)',
          400: 'var(--warning-400)',
          500: 'var(--warning-500)',
          600: 'var(--warning-600)',
          700: 'var(--warning-700)',
          800: 'var(--warning-800)',
          900: 'var(--warning-900)',
          DEFAULT: 'var(--warning-500)',
        },
        'error': {
          50: 'var(--error-50)',
          100: 'var(--error-100)',
          200: 'var(--error-200)',
          300: 'var(--error-300)',
          400: 'var(--error-400)',
          500: 'var(--error-500)',
          600: 'var(--error-600)',
          700: 'var(--error-700)',
          800: 'var(--error-800)',
          900: 'var(--error-900)',
          DEFAULT: 'var(--error-500)',
        },
        'info': {
          50: 'var(--info-50)',
          100: 'var(--info-100)',
          200: 'var(--info-200)',
          300: 'var(--info-300)',
          400: 'var(--info-400)',
          500: 'var(--info-500)',
          600: 'var(--info-600)',
          700: 'var(--info-700)',
          800: 'var(--info-800)',
          900: 'var(--info-900)',
          DEFAULT: 'var(--info-500)',
        },
        // Enhanced Glass System
        'glass': {
          'border': 'var(--glass-border)',
          'border-light': 'var(--glass-border-light)',
          'border-strong': 'var(--glass-border-strong)',
          'border-primary': 'var(--glass-border-primary)',
          'border-primary-light': 'var(--glass-border-primary-light)',
          'border-primary-strong': 'var(--glass-border-primary-strong)',
          'bg': 'var(--glass-bg)',
          'bg-light': 'var(--glass-bg-light)',
          'bg-medium': 'var(--glass-bg-medium)',
          'bg-strong': 'var(--glass-bg-strong)',
          'bg-nav': 'var(--glass-bg-nav)',
          'bg-card': 'var(--glass-bg-card)',
          'bg-hover': 'var(--glass-bg-hover)',
          'bg-primary': 'var(--glass-bg-primary)',
          'bg-primary-light': 'var(--glass-bg-primary-light)',
          'bg-primary-medium': 'var(--glass-bg-primary-medium)',
          'bg-primary-strong': 'var(--glass-bg-primary-strong)',
        },
        'text-glass': 'var(--text-glass)',
        'text-glass-secondary': 'var(--text-glass-secondary)',
        'text-glass-muted': 'var(--text-glass-muted)',
      },
      backdropBlur: {
        'glass-sm': 'var(--blur-sm)',
        'glass-md': 'var(--blur-md)',
        'glass-lg': 'var(--blur-lg)',
        'glass-xl': 'var(--blur-xl)',
        'glass-2xl': 'var(--blur-2xl)',
      },
      borderRadius: {
        'glass': 'var(--radius-glass)',
        'glass-lg': 'var(--radius-glass-lg)',
        'glass-xl': 'var(--radius-glass-xl)',
        'glass-2xl': 'var(--radius-glass-2xl)',
      },
      boxShadow: {
        'glass': 'var(--shadow-glass)',
        'glass-lg': 'var(--shadow-glass-lg)',
        'glass-xl': 'var(--shadow-glass-xl)',
        'glass-2xl': 'var(--shadow-glass-2xl)',
        'glass-inner': 'var(--shadow-glass-inner)',
      }
    },
  },
  plugins: [
    require('daisyui')
  ],
  
  // DaisyUI configuration
  daisyui: {
    themes: [
      {
        // Enhanced Inaplast theme with #799EFF primary - Complete Integration
        glassmorphism: {
          // PRIMARY BRAND COLORS - #799EFF Base
          "primary": "#799EFF",           // Main brand color
          "primary-content": "#ffffff",   // White text on primary
          
          // SECONDARY COLORS - Warm Orange Complementary
          "secondary": "#FFB366",        // Warm orange
          "secondary-content": "#663300", // Dark text on secondary
          
          // ACCENT COLORS - Electric Cyan & Purple
          "accent": "#00D4FF",           // Electric cyan accent
          "accent-content": "#ffffff",    // White text on accent
          
          // NEUTRAL PALETTE - Cool-toned grays
          "neutral": "#64748B",          // Base neutral
          "neutral-content": "#ffffff",   // White text on neutral
          
          // BASE COLORS - Enhanced glass backgrounds
          "base-100": "rgba(248, 250, 252, 0.1)",  // Almost white glass
          "base-200": "rgba(241, 245, 249, 0.08)", // Very light glass
          "base-300": "rgba(226, 232, 240, 0.05)", // Light glass
          "base-content": "rgba(15, 23, 42, 0.95)", // Almost black text
          
          // SEMANTIC COLORS - Status & Feedback
          "info": "#60A5FA",            // Info blue (primary variant)
          "info-content": "#ffffff",
          "success": "#10B981",         // Professional green
          "success-content": "#ffffff",
          "warning": "#F59E0B",         // Harmonious amber
          "warning-content": "#ffffff",
          "error": "#EF4444",           // Professional red
          "error-content": "#ffffff",
          
          // ENHANCED THEME VARIABLES - Optimized for #799EFF
          "--rounded-box": "16px",      // Card radius
          "--rounded-btn": "12px",      // Button radius
          "--rounded-badge": "20px",    // Badge radius (pill shape)
          "--animation-btn": "0.2s",    // Button animations
          "--animation-input": "0.15s",  // Input animations
          "--btn-focus-scale": "0.98",  // Button focus scale
          "--border-btn": "1px",        // Button border width
          "--tab-border": "1px",        // Tab border width
          "--tab-radius": "12px",       // Tab radius
          
          // GLASSMORPHISM INTEGRATION VARIABLES
          "--glass-opacity": "0.1",     // Base glass opacity
          "--glass-blur": "12px",       // Base blur amount
          "--glass-border-opacity": "0.2", // Border opacity
          "--primary-glass": "rgba(121, 158, 255, 0.15)", // Primary glass
          "--secondary-glass": "rgba(255, 179, 102, 0.15)", // Secondary glass
          "--accent-glass": "rgba(0, 212, 255, 0.15)",    // Accent glass
        },
        
        // LIGHT THEME VARIANT - For better accessibility
        light_primary: {
          "primary": "#799EFF",
          "primary-content": "#ffffff",
          "secondary": "#FFB366",
          "secondary-content": "#663300",
          "accent": "#00D4FF",
          "accent-content": "#ffffff",
          "neutral": "#64748B",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#f1f5f9",
          "base-content": "#0f172a",
          "info": "#60A5FA",
          "info-content": "#ffffff",
          "success": "#10B981",
          "success-content": "#ffffff",
          "warning": "#F59E0B",
          "warning-content": "#ffffff",
          "error": "#EF4444",
          "error-content": "#ffffff",
        },
        
        // DARK THEME VARIANT - Enhanced for #799EFF
        dark_primary: {
          "primary": "#87AAFF",         // Lighter primary for dark mode
          "primary-content": "#1a2966", // Dark text on light primary
          "secondary": "#FFB366",
          "secondary-content": "#663300",
          "accent": "#4DEAFF",          // Lighter accent for dark mode
          "accent-content": "#004d66",
          "neutral": "#475569",
          "neutral-content": "#f1f5f9",
          "base-100": "#0f172a",        // Dark background
          "base-200": "#1e293b",
          "base-300": "#334155",
          "base-content": "#f8fafc",    // Light text
          "info": "#93C5FD",           // Lighter info for dark mode
          "info-content": "#1e3a8a",
          "success": "#34D399",
          "success-content": "#064e3b",
          "warning": "#FBBF24",
          "warning-content": "#78350f",
          "error": "#F87171",
          "error-content": "#7f1d1d",
        },
      },
      "light", // Fallback theme
      "dark",  // Alternative theme
    ],
    base: true, // Apply background color and foreground color for root element
    styled: true, // Include DaisyUI colors and design decisions for all components
    utils: true, // Include utility classes that improve DaisyUI
    prefix: "daisy-", // Prefix for DaisyUI classes to avoid conflicts
    logs: process.env.NODE_ENV === 'development', // Only show logs in development
    darkTheme: "dark_primary", // Use our enhanced dark theme as default
    rtl: false, // Disable RTL for better performance if not needed
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
  
  // Performance optimizations
  corePlugins: {
    // Keep all core plugins enabled for maximum compatibility
    // Consider disabling unused plugins in production for smaller bundle size
  },
  
  // Additional optimizations
  future: {
    // Enable future features for better performance
    hoverOnlyWhenSupported: true, // Only apply hover styles when supported
  },
  
  // Experimental features for better performance
  experimental: {
    // Enable optimized CSS generation
    optimizeUniversalDefaults: true,
  }
}