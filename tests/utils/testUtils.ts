import { vi } from 'vitest'
import { createApp } from 'vue'
import type { H3Event, EventHandlerRequest } from 'h3'

/**
 * Crea un contexto mock para testing de endpoints API
 */
export function createMockContext(options: {
  method?: string
  body?: any
  headers?: Record<string, string>
  query?: Record<string, string>
  user?: any
}): H3Event<EventHandlerRequest> {
  const { method = 'GET', body, headers = {}, query = {}, user } = options

  const mockEvent = {
    node: {
      req: {
        method,
        url: '/test',
        headers: {
          'content-type': 'application/json',
          ...headers
        }
      },
      res: {
        statusCode: 200,
        setHeader: vi.fn(),
        end: vi.fn()
      }
    },
    context: {
      user: user || null,
      cloudflare: {},
      params: {}
    },
    web: {
      url: new URL('http://localhost:3000/test')
    },
    _body: body,
    _query: query
  } as unknown as H3Event<EventHandlerRequest>

  return mockEvent
}

/**
 * Crea datos mock para tests
 */
export const createMockData = {
  order: () => ({
    id: 1,
    lote: 'LOT001',
    cliente: 'Cliente Test',
    producto: 'Producto Test',
    pedido: 'PED001',
    fecha_fabricacion: '2024-12-01',
    codigo_producto: 'COD001',
    cantidad_embalajes: 10,
    unidades_por_embalaje: 25,
    turno: 'mañana',
    numero_operario: 'OP001',
    maquina: 'MAQ001',
    inspector_calidad: 'Inspector Test',
    jefe_de_turno: 'Jefe Test',
    orden_de_compra: 'OC001',
    created_at: '2024-12-01T10:00:00Z',
    updated_at: '2024-12-01T10:00:00Z'
  }),

  user: () => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    created_at: '2024-12-01T10:00:00Z',
    updated_at: '2024-12-01T10:00:00Z'
  }),

  profile: () => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    full_name: 'Usuario Test',
    role: 'admin',
    created_at: '2024-12-01T10:00:00Z',
    updated_at: '2024-12-01T10:00:00Z'
  })
}

/**
 * Mock para Supabase client
 */
export function createMockSupabaseClient(options: {
  selectResponse?: any
  insertResponse?: any
  updateResponse?: any
  deleteResponse?: any
  error?: any
} = {}) {
  const {
    selectResponse = { data: [], error: null },
    insertResponse = { data: [], error: null },
    updateResponse = { data: [], error: null },
    deleteResponse = { data: [], error: null },
    error = null
  } = options

  return {
    from: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve(selectResponse)),
      insert: vi.fn(() => ({
        select: vi.fn(() => Promise.resolve(insertResponse))
      })),
      update: vi.fn(() => ({
        select: vi.fn(() => Promise.resolve(updateResponse))
      })),
      delete: vi.fn(() => Promise.resolve(deleteResponse)),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis()
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({
        data: { user: createMockData.user() },
        error
      })),
      signInWithPassword: vi.fn(() => Promise.resolve({
        data: { user: createMockData.user() },
        error
      })),
      signOut: vi.fn(() => Promise.resolve({ error }))
    }
  }
}

/**
 * Función helper para testear composables que requieren instancia de Vue
 */
export function withSetup<T>(composable: () => T): T {
  let result: T
  const app = createApp({
    setup() {
      result = composable()
      return {}
    }
  })
  app.mount(document.createElement('div'))
  return result!
}