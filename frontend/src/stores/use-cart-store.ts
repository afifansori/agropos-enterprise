import { create } from 'zustand'
import { CartItem, Customer, PaymentMethod, SaleTransaction } from '@/types/pos'
import { Product } from '@/types/product'

export type PriceMode = 'retail' | 'wholesale'

interface CartState {
  items: CartItem[]
  selectedCustomer: Customer | null
  discountPercent: number  // Global discount % (0-100)
  paymentMethod: PaymentMethod
  priceMode: PriceMode

  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateItemDiscount: (productId: string, discountPercent: number) => void
  setPriceMode: (mode: PriceMode) => void
  setDiscountPercent: (percent: number) => void
  setCustomer: (customer: Customer | null) => void
  setPaymentMethod: (method: PaymentMethod) => void
  clearCart: () => void
  getSubtotal: () => number
  getDiscountAmount: () => number
  getGrandTotal: () => number
  checkout: (amountPaid: number, cashierName: string) => SaleTransaction
}

function getItemPrice(product: Product, mode: PriceMode, qty: number): number {
  if (
    mode === 'wholesale' &&
    product.wholesalePrice > 0 &&
    qty >= product.wholesaleMinQty
  ) {
    return product.wholesalePrice
  }
  return product.sellPrice
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  selectedCustomer: null,
  discountPercent: 0,
  paymentMethod: 'cash',
  priceMode: 'retail',

  addItem: (product: Product, quantity = 1) => {
    const { items, priceMode } = get()
    const existingIndex = items.findIndex((i) => i.product.id === product.id)

    if (existingIndex > -1) {
      const updated = [...items]
      const newQty = updated[existingIndex].quantity + quantity
      const basePrice = getItemPrice(product, priceMode, newQty)
      const disc = updated[existingIndex].discount // item discount %
      const priceAfterDisc = basePrice * (1 - disc / 100)
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: newQty,
        price: basePrice,
        subtotal: newQty * priceAfterDisc,
      }
      set({ items: updated })
    } else {
      const basePrice = getItemPrice(product, priceMode, quantity)
      set({
        items: [
          ...items,
          {
            product,
            quantity,
            price: basePrice,
            discount: 0, // item-level discount %
            subtotal: quantity * basePrice,
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
    const { priceMode } = get()
    const updated = get().items.map((item) => {
      if (item.product.id === productId) {
        const basePrice = getItemPrice(item.product, priceMode, quantity)
        const disc = item.discount
        const priceAfterDisc = basePrice * (1 - disc / 100)
        return {
          ...item,
          quantity,
          price: basePrice,
          subtotal: quantity * priceAfterDisc,
        }
      }
      return item
    })
    set({ items: updated })
  },

  updateItemDiscount: (productId: string, discountPercent: number) => {
    const pct = Math.min(100, Math.max(0, discountPercent))
    const updated = get().items.map((item) => {
      if (item.product.id === productId) {
        const priceAfterDisc = item.price * (1 - pct / 100)
        return {
          ...item,
          discount: pct,
          subtotal: item.quantity * priceAfterDisc,
        }
      }
      return item
    })
    set({ items: updated })
  },

  setPriceMode: (priceMode: PriceMode) => {
    // Recalculate all item prices when switching mode
    const updated = get().items.map((item) => {
      const basePrice = getItemPrice(item.product, priceMode, item.quantity)
      const disc = item.discount
      const priceAfterDisc = basePrice * (1 - disc / 100)
      return {
        ...item,
        price: basePrice,
        subtotal: item.quantity * priceAfterDisc,
      }
    })
    set({ priceMode, items: updated })
  },

  setDiscountPercent: (percent: number) =>
    set({ discountPercent: Math.min(100, Math.max(0, percent)) }),

  setCustomer: (selectedCustomer: Customer | null) => set({ selectedCustomer }),
  setPaymentMethod: (paymentMethod: PaymentMethod) => set({ paymentMethod }),

  clearCart: () =>
    set({
      items: [],
      selectedCustomer: null,
      discountPercent: 0,
      paymentMethod: 'cash',
      priceMode: 'retail',
    }),

  getSubtotal: () => get().items.reduce((acc, curr) => acc + curr.subtotal, 0),

  getDiscountAmount: () => {
    const subtotal = get().getSubtotal()
    const pct = get().discountPercent
    return Math.round(subtotal * (pct / 100))
  },

  getGrandTotal: () => {
    const subtotal = get().getSubtotal()
    const disc = get().getDiscountAmount()
    return Math.max(0, subtotal - disc)
  },

  checkout: (amountPaid: number, cashierName: string) => {
    const { items, selectedCustomer, paymentMethod, getSubtotal, getDiscountAmount, getGrandTotal, clearCart } = get()
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
      discountAmount: getDiscountAmount(),
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
