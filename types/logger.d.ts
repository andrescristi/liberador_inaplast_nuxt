import type pino from 'pino'

declare module '#app' {
  interface NuxtApp {
    $logger: pino.Logger
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $logger: pino.Logger
  }
}

export {}