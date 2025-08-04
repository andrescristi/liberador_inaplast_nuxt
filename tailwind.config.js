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
      // Simplified color system
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          light: '#8B5CF6',
          dark: '#3730A3',
        },
        success: {
          DEFAULT: '#10B981',
        },
        warning: {
          DEFAULT: '#F59E0B',
        },
        error: {
          DEFAULT: '#EF4444',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
      boxShadow: {
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [
    require('daisyui')
  ],
  
  // Simplified DaisyUI configuration
  daisyui: {
    themes: [
      {
        minimal: {
          "primary": "#4F46E5",
          "primary-content": "#ffffff",
          "secondary": "#6B7280",
          "secondary-content": "#ffffff",
          "accent": "#8B5CF6",
          "accent-content": "#ffffff",
          "neutral": "#374151",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#F9FAFB",
          "base-300": "#F3F4F6",
          "base-content": "#111827",
          "info": "#4F46E5",
          "info-content": "#ffffff",
          "success": "#10B981",
          "success-content": "#ffffff",
          "warning": "#F59E0B",
          "warning-content": "#ffffff",
          "error": "#EF4444",
          "error-content": "#ffffff",
          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.375rem",
          "--rounded-badge": "9999px",
          "--animation-btn": "0.15s",
          "--animation-input": "0.15s",
          "--btn-focus-scale": "0.98",
        }
      },
      "light",
      "dark",
    ],
    base: true,
    styled: true,
    utils: true,
    prefix: "daisy-",
    logs: false,
    darkTheme: "dark",
    rtl: false,
  },
}