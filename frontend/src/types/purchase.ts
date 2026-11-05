export interface Supplier {
  id: string
  name: string
  phone: string
  email?: string
  address: string
  category: string
  totalPurchases: number
  outstandingPayable: number
  status: 'active' | 'review' | 'inactive'
}

export interface PurchaseOrderItem {
  productId: string
  productName: string
  quantity: number
  unit: string
  costPrice: number
  subtotal: number
}

export interface PurchaseOrder {
  id: string
  poNumber: string
  supplierId: string
  supplierName: string
  branchName: string
  items: PurchaseOrderItem[]
  totalAmount: number
  paymentStatus: 'unpaid' | 'partial' | 'paid'
  deliveryStatus: 'draft' | 'ordered' | 'received' | 'returned'
  orderDate: string
  dueDate?: string
}

