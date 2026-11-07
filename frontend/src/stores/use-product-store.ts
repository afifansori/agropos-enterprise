import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, ProductCategory } from '@/types/product'
import { mockProducts } from '@/lib/mock-data'

interface ProductState {
  products: Product[]
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, data: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProductById: (id: string) => Product | undefined
  getActiveProducts: () => Product[]
  searchProducts: (query: string, category?: string) => Product[]
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: mockProducts,

      addProduct: (data) => {
        const newProduct: Product = {
          ...data,
          id: `prod-${Date.now()}`,
          wholesalePrice: data.wholesalePrice ?? Math.round(data.sellPrice * 0.9),
          wholesaleMinQty: data.wholesaleMinQty ?? 10,
        }
        set({ products: [...get().products, newProduct] })
      },

      updateProduct: (id, data) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })
      },

      deleteProduct: (id) => {
        set({ products: get().products.filter((p) => p.id !== id) })
      },

      getProductById: (id) => get().products.find((p) => p.id === id),

      getActiveProducts: () =>
        get().products.filter((p) => p.status === 'active' && p.totalStock > 0),

      searchProducts: (query, category) => {
        const q = query.toLowerCase().trim()
        return get().products.filter((p) => {
          const matchCat =
            !category || category === 'Semua' || p.category === category
          if (!q) return matchCat
          return (
            matchCat &&
            (p.name.toLowerCase().includes(q) ||
              p.sku.toLowerCase().includes(q) ||
              (p.barcode && p.barcode.includes(q)))
          )
        })
      },
    }),
    {
      name: 'agropos-products',
      // Hanya simpan produk yang sudah di-edit (bukan mock awal)
      partialize: (state) => ({ products: state.products }),
    }
  )
)

