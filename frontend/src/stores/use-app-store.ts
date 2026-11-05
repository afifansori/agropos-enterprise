import { create } from 'zustand'

interface Toast {
  id: string
  message: string
  type: 'success' | 'info' | 'error'
}

interface AppState {
  sidebarOpen: boolean
  toasts: Toast[]
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void
  removeToast: (id: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  sidebarOpen: false,
  toasts: [],

  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),

  addToast: (message: string, type = 'success') => {
    const id = `toast-${Date.now()}`
    const newToast: Toast = { id, message, type }
    set({ toasts: [...get().toasts, newToast] })

    setTimeout(() => {
      get().removeToast(id)
    }, 3200)
  },

  removeToast: (id: string) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) })
  },
}))

