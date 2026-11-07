import { create } from 'zustand'
import { User, StoreInfo } from '@/types/auth'
import { mockUsers, storeInfo } from '@/lib/mock-data'

interface AuthState {
  currentUser: User | null
  store: StoreInfo
  isAuthenticated: boolean
  isHydrated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  initAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: mockUsers[0],
  store: storeInfo,
  isAuthenticated: true,
  isHydrated: false,

  initAuth: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('agropos_session')
      if (stored) {
        try {
          const user = JSON.parse(stored)
          set({ currentUser: user, isAuthenticated: true, isHydrated: true })
          return
        } catch (e) {
          console.error(e)
        }
      } else {
        // If logged out previously
        const hasSession = localStorage.getItem('agropos_auth_status')
        if (hasSession === 'unauthenticated') {
          set({ currentUser: null, isAuthenticated: false, isHydrated: true })
          return
        }
      }
      set({ isHydrated: true })
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
}))
