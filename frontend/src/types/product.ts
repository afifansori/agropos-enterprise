export type ProductCategory = 'Herbisida' | 'Fungisida' | 'Insektisida' | 'Pupuk' | 'Benih' | 'Alat Pertanian'

export interface Unit {
  id: string
  name: string // e.g. Botol, Pack, Sak, Dus
  conversionFactor: number
}

export interface BatchItem {
  id: string
  batchNumber: string
  expiryDate: string // YYYY-MM-DD
  entryDate: string
  stock: number
  costPrice: number
  status: 'safe' | 'warning' | 'critical' | 'expired'
}

export interface Product {
  id: string
  sku: string
  barcode?: string
  name: string
  category: ProductCategory
  unit: string
  costPrice: number
  sellPrice: number       // Harga Eceran
  wholesalePrice: number  // Harga Grosir
  wholesaleMinQty: number // Minimal qty untuk harga grosir
  minStock: number
  totalStock: number
  batches: BatchItem[]
  status: 'active' | 'out_of_stock' | 'archived'
  description?: string
}
