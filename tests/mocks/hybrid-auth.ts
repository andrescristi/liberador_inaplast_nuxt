import { vi } from 'vitest'

export interface MockHybridAuth {
  hasValidJWT: ReturnType<typeof vi.fn>
  checkAuth: ReturnType<typeof vi.fn>
  removeJWT: ReturnType<typeof vi.fn>
  setJWT: ReturnType<typeof vi.fn>
  login: ReturnType<typeof vi.fn>
  logout: ReturnType<typeof vi.fn>
  getAuthHeaders: ReturnType<typeof vi.fn>
  refresh: ReturnType<typeof vi.fn>
  initialize: ReturnType<typeof vi.fn>
}

export function createMockHybridAuth(): MockHybridAuth {
  return {
    hasValidJWT: vi.fn(),
    checkAuth: vi.fn(),
    removeJWT: vi.fn(),
    setJWT: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    getAuthHeaders: vi.fn(),
    refresh: vi.fn(),
    initialize: vi.fn()
  }
}

export function createMockUser() {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    role: 'Admin',
    first_name: 'Test',
    last_name: 'User',
    full_name: 'Test User'
  }
}

export function createValidJWT() {
  const now = Math.floor(Date.now() / 1000)
  return {
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidGVzdC11c2VyLWlkIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidXNlcl9yb2xlIjoiQWRtaW4iLCJpYXQiOjE3NTYwNzAwMDAsImV4cCI6MTc1NjE1NjQwMH0.signature',
    expires_at: now + 3600, // 1 hora válido
    user_id: 'test-user-id'
  }
}

export function createExpiredJWT() {
  const now = Math.floor(Date.now() / 1000)
  return {
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidGVzdC11c2VyLWlkIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidXNlcl9yb2xlIjoiQWRtaW4iLCJpYXQiOjE3NTYwNzAwMDAsImV4cCI6MTc1NjA3MzYwMH0.signature',
    expires_at: now - 3600, // Expirado hace 1 hora
    user_id: 'test-user-id'
  }
}