import type { Logger } from 'pino'

export const useLogger = (): Logger => {
  return useNuxtApp().$logger as Logger
}