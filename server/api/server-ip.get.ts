import { defineEventHandler } from 'h3'
import os from 'os'

export default defineEventHandler(async (event) => {
  try {
    // Obtener la IP local del servidor
    const networkInterfaces = os.networkInterfaces()

    // Buscar la primera interfaz de red no interna (no localhost)
    for (const interfaceName in networkInterfaces) {
      const networkInterface = networkInterfaces[interfaceName]
      if (networkInterface) {
        for (const alias of networkInterface) {
          if (alias.family === 'IPv4' && !alias.internal) {
            return {
              success: true,
              ip: alias.address
            }
          }
        }
      }
    }

    // Fallback a localhost si no se encuentra una IP
    return {
      success: true,
      ip: 'localhost'
    }

  } catch (error) {
    return {
      success: false,
      ip: 'localhost'
    }
  }
})