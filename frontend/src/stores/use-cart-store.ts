import { create } from 'zustand'
import { CartItem, Customer, PaymentMethod, SaleTransaction } from '@/types/pos'
import { Product } from '@/types/product'

interface CartState {
  items: CartItem[]
  selectedCustomer: Customer | null
  discount: number
  paymentMethod: PaymentMethod
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  setDiscount: (discount: number) => void
  setCustomer: (customer: Customer | null) => void
  setPaymentMethod: (method: PaymentMethod) => void
  clearCart: () => void
  getSubtotal: () => number
  getTotalDiscount: () => number
  getGrandTotal: () => number
  checkout: (amountPaid: number, cashierName: string) => SaleTransaction
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  selectedCustomer: null,
  discount: 0,
  paymentMethod: 'cash',

  addItem: (product: Product, quantity = 1) => {
    const { items } = get()
    const existingIndex = items.findIndex((i) => i.product.id === product.id)

    if (existingIndex > -1) {
      const updated = [...items]
      const newQty = updated[existingIndex].quantity + quantity
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: newQty,
        subtotal: newQty * updated[existingIndex].price,
      }
      set({ items: updated })
    } else {
      set({
        items: [
          ...items,
          {
            product,
            quantity,
            price: product.sellPrice,
            discount: 0,
            subtotal: quantity * product.sellPrice,
          },
        ],
      })
    }
  },

  removeItem: (productId: string) => {
    set({ items: get().items.filter((i) => i.product.id !== productId) })
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    const updated = get().items.map((item) => {
      if (item.product.id === productId) {
        return {
          ...item,
          quantity,
          subtotal: quantity * item.price,
        }
      }
      return item
    })
    set({ items: updated })
  },

  setDiscount: (discount: number) => set({ discount }),
  setCustomer: (selectedCustomer: Customer | null) => set({ selectedCustomer }),
  setPaymentMethod: (paymentMethod: PaymentMethod) => set({ paymentMethod }),

  clearCart: () => set({ items: [], selectedCustomer: null, discount: 0, paymentMethod: 'cash' }),

  getSubtotal: () => {
    return get().items.reduce((acc, curr) => acc + curr.subtotal, 0)
  },

  getTotalDiscount: () => {
    return get().discount
  },

  getGrandTotal: () => {
    const subtotal = get().getSubtotal()
    const discount = get().getTotalDiscount()
    return Math.max(0, subtotal - discount)
  },

  checkout: (amountPaid: number, cashierName: string) => {
    const { items, selectedCustomer, paymentMethod, getSubtotal, getTotalDiscount, getGrandTotal, clearCart } = get()
    const grandTotal = getGrandTotal()
    const changeAmount = paymentMethod === 'cash' ? Math.max(0, amountPaid - grandTotal) : 0

    const transaction: SaleTransaction = {
      id: `trx-${Date.now()}`,
      invoiceNumber: `TRX-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      cashierId: 'usr-03',
      cashierName,
      customer: selectedCustomer || undefined,
      items: [...items],
      subtotal: getSubtotal(),
      discountAmount: getTotalDiscount(),
      taxAmount: 0,
      grandTotal,
      paymentMethod,
      amountPaid,
      changeAmount,
      status: 'completed',
      createdAt: new Date().toISOString(),
    }

    clearCart()
    return transaction
  },
}))

