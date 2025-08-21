import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { ref, computed, reactive, nextTick, onMounted, watch } from 'vue'

// Mock Nuxt auto-imports
global.useSupabaseClient = vi.fn()
global.useSupabaseUser = vi.fn(() => ({ value: null }))
global.useToast = vi.fn(() => ({ success: vi.fn(), error: vi.fn() }))
global.useAuth = vi.fn()
global.useProfile = vi.fn()
global.navigateTo = vi.fn()
global.useSeoMeta = vi.fn()
global.definePageMeta = vi.fn()

// Use real Vue reactivity functions
global.nextTick = nextTick
global.computed = computed
global.ref = ref
global.reactive = reactive
global.onMounted = onMounted
global.watch = watch

// Mock process.env for tests
process.env.SUPABASE_URL = 'http://localhost:3000'
process.env.SUPABASE_ANON_KEY = 'test-key'

// Suppress console.warn during tests unless specifically testing for warnings
const originalWarn = console.warn
console.warn = (...args: unknown[]) => {
  const message = args[0]
  if (typeof message === 'string') {
    // Suprimir warnings específicos de Vue en tests
    if (message.includes('[Vue warn]') || 
        message.includes('Failed to resolve component') ||
        message.includes('If this is a native custom element')) {
      return
    }
    // Suprimir warnings de testing no críticos
    if (message.includes('test')) {
      return
    }
  }
  originalWarn(...args)
}