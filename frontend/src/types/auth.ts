export type Role = 'owner' | 'admin' | 'cashier' | 'warehouse' | 'supplier'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  storeName: string
  avatar?: string
  lastLogin?: string
  status: 'active' | 'inactive'
}

export interface StoreInfo {
  name: string
  address: string
  phone: string
  taxNumber?: string
  email: string
  logoUrl?: string
  faviconUrl?: string
}
