import { create } from 'zustand'
import { Role } from '@/types/auth'
import {
  AppModule,
  RolePermissions,
  DEFAULT_ROLE_PERMISSIONS,
  getModuleByPath,
} from '@/lib/rbac'

interface PermissionState {
  permissions: RolePermissions
  hasPermission: (role: Role | undefined, module: AppModule) => boolean
  canAccessPath: (role: Role | undefined, path: string) => boolean
  setPermission: (role: Role, module: AppModule, enabled: boolean) => void
  resetToDefault: () => void
  initPermissions: () => void
}

const STORAGE_KEY = 'agropos_role_permissions'

export const usePermissionStore = create<PermissionState>((set, get) => ({
  permissions: DEFAULT_ROLE_PERMISSIONS,

  initPermissions: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          set({ permissions: { ...DEFAULT_ROLE_PERMISSIONS, ...parsed } })
          return
        } catch (e) {
          console.error('Failed to parse stored permissions', e)
        }
      }
    }
  },

  hasPermission: (role: Role | undefined, module: AppModule) => {
    if (!role) return false
    if (role === 'owner') return true // Owner always has master privileges
    const rolePerms = get().permissions[role]
    if (!rolePerms) return false
    return Boolean(rolePerms[module])
  },

  canAccessPath: (role: Role | undefined, path: string) => {
    if (!role) return false
    if (role === 'owner') return true
    const module = getModuleByPath(path)
    if (!module) return true // Non-module routes accessible by default
    return get().hasPermission(role, module)
  },

  setPermission: (role: Role, module: AppModule, enabled: boolean) => {
    if (role === 'owner') return // Owner permissions cannot be revoked
    set((state) => {
      const updated = {
        ...state.permissions,
        [role]: {
          ...state.permissions[role],
          [module]: enabled,
        },
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      }
      return { permissions: updated }
    })
  },

  resetToDefault: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    set({ permissions: DEFAULT_ROLE_PERMISSIONS })
  },
}))

