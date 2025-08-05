interface Toast {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const add = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    toasts.value.push({
      id,
      ...toast
    })
  }

  const remove = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const removeToast = (id: string) => {
    remove(id)
  }

  const clear = () => {
    toasts.value = []
  }

  // Convenience methods
  const success = (title: string, description?: string) => {
    add({ title, description, type: 'success' })
  }

  const error = (title: string, description?: string) => {
    add({ title, description, type: 'error' })
  }

  const warning = (title: string, description?: string) => {
    add({ title, description, type: 'warning' })
  }

  const info = (title: string, description?: string) => {
    add({ title, description, type: 'info' })
  }

  return {
    toasts: readonly(toasts),
    add,
    remove,
    removeToast,
    clear,
    success,
    error,
    warning,
    info
  }
}