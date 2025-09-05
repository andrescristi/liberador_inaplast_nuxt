// Augmentación de tipos para nuxt-auth-utils
declare module '#auth-utils' {
  interface User {
    id: string
    email: string
    user_role: 'Admin' | 'Supervisor' | 'Inspector'
    first_name: string
    last_name: string
  }

  interface UserSession {
    // Campos adicionales para la sesión
    loggedInAt: string
    profileLoaded: boolean
  }

  interface SecureSessionData {
    // Datos seguros solo accesibles en server
    supabaseAccessToken?: string
    supabaseRefreshToken?: string
  }
}

export {}