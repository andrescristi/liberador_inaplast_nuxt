import { vi } from 'vitest'

export const createError = vi.fn()
export const readBody = vi.fn()
export const defineEventHandler = vi.fn((handler) => handler)