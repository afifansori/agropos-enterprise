import { Product } from './product'

export interface CartItem {
  product: Product
  quantity: number
  price: number
  discount: number
  subtotal: number
}

export type PaymentMethod = 'cash' | 'transfer' | 'qris' | 'tempo'

export interface Customer {
  id: string
  name: string
  phone: string
  type: 'petani' | 'kelompok' | 'reseller'
  creditLimit: number
  currentCredit: number
  address?: string
}

export interface SaleTransaction {
  id: string
  invoiceNumber: string
  cashierId: string
  cashierName: string
  customer?: Customer
  items: CartItem[]
  subtotal: number
  discountAmount: number
  taxAmount: number
  grandTotal: number
  paymentMethod: PaymentMethod
  amountPaid: number
  changeAmount: number
  dueDate?: string // Untuk tempo / piutang
  status: 'completed' | 'pending' | 'canceled'
  createdAt: string
}
