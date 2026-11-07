import { create } from 'zustand'
import { User, StoreInfo } from '@/types/auth'
import { mockUsers, storeInfo as defaultStoreInfo } from '@/lib/mock-data'

interface AuthState {
  currentUser: User | null
  store: StoreInfo
  isAuthenticated: boolean
  isHydrated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  initAuth: () => void
  updateStore: (info: Partial<StoreInfo>) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  store: defaultStoreInfo,
  isAuthenticated: false,
  isHydrated: false,

  initAuth: () => {
    if (typeof window !== 'undefined') {
      // 1. Load custom store info if present
      const storedStore = localStorage.getItem('agropos_store_info')
      if (storedStore) {
        try {
          const parsedStore = JSON.parse(storedStore)
          set({ store: { ...defaultStoreInfo, ...parsedStore } })
        } catch (e) {
          console.error(e)
        }
      }

      // 2. Load auth session
      const storedSession = localStorage.getItem('agropos_session')
      const authStatus = localStorage.getItem('agropos_auth_status')

      if (storedSession && authStatus === 'authenticated') {
        try {
          const user = JSON.parse(storedSession)
          set({ currentUser: user, isAuthenticated: true, isHydrated: true })
          return
        } catch (e) {
          console.error(e)
        }
      }

      // Default: must login first
      set({ currentUser: null, isAuthenticated: false, isHydrated: true })
    }
  },

  login: async (email: string, password: string) => {
    // All demo accounts use password 'agropos123'
    if (password !== 'agropos123') return false
    const foundUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!foundUser) return false

    if (typeof window !== 'undefined') {
      localStorage.setItem('agropos_session', JSON.stringify(foundUser))
      localStorage.setItem('agropos_auth_status', 'authenticated')
    }
    set({
      currentUser: foundUser,
      isAuthenticated: true,
    })
    return true
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agropos_session')
      localStorage.setItem('agropos_auth_status', 'unauthenticated')
    }
    set({
      currentUser: null,
      isAuthenticated: false,
    })
  },

  updateStore: (info: Partial<StoreInfo>) => {
    const updated = { ...get().store, ...info }
    if (typeof window !== 'undefined') {
      localStorage.setItem('agropos_store_info', JSON.stringify(updated))
    }
    set({ store: updated })
  },
}))
