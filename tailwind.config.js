/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Mobile-first approach
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        }
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      minHeight: {
        'touch': '44px', // Minimum touch target size
        'touch-lg': '48px',
      },
      minWidth: {
        'touch': '44px', // Minimum touch target size
        'touch-lg': '48px',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'mobile-slide-in': 'mobileSlideIn 0.3s ease-out',
        'mobile-fade-in': 'mobileFadeIn 0.2s ease-out',
        'touch-feedback': 'touchFeedback 0.1s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        mobileSlideIn: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        mobileFadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        touchFeedback: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function({ addUtilities }) {
      const newUtilities = {
        '.touch-manipulation': {
          'touch-action': 'manipulation',
        },
        '.touch-target': {
          'min-height': '44px',
          'min-width': '44px',
        },
        '.touch-target-lg': {
          'min-height': '48px',
          'min-width': '48px',
        },
        '.smooth-scroll': {
          '-webkit-overflow-scrolling': 'touch',
          'scroll-behavior': 'smooth',
        },
        '.prevent-zoom': {
          'font-size': '16px', // Prevents zoom on iOS
        },
        '.tap-highlight-none': {
          '-webkit-tap-highlight-color': 'transparent',
        },
        '.tap-highlight-primary': {
          '-webkit-tap-highlight-color': 'rgba(79, 70, 229, 0.2)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}