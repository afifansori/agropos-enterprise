'use client'

import React, { useState } from 'react'
import {
  Search,
  Barcode,
  PackageSearch,
  ShoppingCart,
  CheckCircle2,
} from 'lucide-react'
import { PosProductCard } from '@/components/pos/pos-product-card'
import { PosCartPanel } from '@/components/pos/pos-cart-panel'
import { PaymentModal } from '@/components/pos/payment-modal'
import { ReceiptModal } from '@/components/pos/receipt-modal'
import { mockProducts } from '@/lib/mock-data'
import { useCartStore } from '@/stores/use-cart-store'
import { useAppStore } from '@/stores/use-app-store'
import { useAuthStore } from '@/stores/use-auth-store'
import { Product, ProductCategory } from '@/types/product'
import { SaleTransaction } from '@/types/pos'

const categories: ('Semua' | ProductCategory)[] = [
  'Semua',
  'Herbisida',
  'Fungisida',
  'Insektisida',
  'Pupuk',
  'Benih',
  'Alat Pertanian',
]

export default function PosTerminalPage() {
  const { addItem } = useCartStore()
  const { addToast } = useAppStore()
  const { store } = useAuthStore()

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua')
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)
  const [lastTransaction, setLastTransaction] = useState<SaleTransaction | null>(null)

  const filteredProducts = mockProducts.filter((product) => {
    const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase()) ||
      (product.barcode && product.barcode.includes(search))
    return matchesCategory && matchesSearch
  })

  const handleBarcodeScan = () => {
    // Simulate instant scan of Roundup
    const product = mockProducts[0]
    addItem(product)
    addToast(`Barcode Scan: ${product.name} ditambahkan ke keranjang`)
  }

  const handlePaymentSuccess = (transaction: SaleTransaction) => {
    setIsPaymentOpen(false)
    setLastTransaction(transaction)
    setIsReceiptOpen(true)
    addToast(`Transaksi ${transaction.invoiceNumber} berhasil disimpan!`)
  }

  return (
    <div className="space-y-6">
      {/* Top Header POS */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-wider text-[#166534]">
              Terminal Kasir POS Aktif
            </p>
          </div>
          <h1 className="mt-0.5 text-2xl font-black tracking-tight text-slate-900">
            Point of Sale • {store.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800">
            Sesi Kasir: Normal (08:00 - 21:00)
          </div>
        </div>
      </div>

      {/* Main Layout: 2 Columns (Catalog 65%, Cart 35%) */}
      <div className="grid min-h-[700px] gap-6 xl:grid-cols-[1.55fr_1fr]">
        {/* Left Column: Product Search, Category Filters, Grid */}
        <div className="flex flex-col space-y-4">
          {/* Search & Scan Toolbar */}
          <div className="flex gap-2.5">
            <div className="flex h-12 flex-1 items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-3.5 shadow-sm focus-within:border-[#166534] focus-within:ring-4 focus-within:ring-emerald-50">
              <Search size={18} className="text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ketik nama obat, pupuk, SKU, atau scan barcode..."
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={handleBarcodeScan}
              className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm transition hover:border-[#166534] hover:bg-slate-50"
            >
              <Barcode size={18} className="text-[#166534]" />
              <span className="hidden sm:inline">Simulasi Barcode</span>
            </button>
          </div>

          {/* Category Pill Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition ${
                    active
                      ? 'bg-[#166534] text-white shadow-md shadow-emerald-900/15'
                      : 'border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Products Grid */}
          <div className="grid flex-1 grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3">
            {filteredProducts.map((product) => (
              <PosProductCard
                key={product.id}
                product={product}
                onAdd={(p) => {
                  addItem(p)
                  addToast(`+1 ${p.name}`)
                }}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <PackageSearch size={36} className="text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">Produk tidak ditemukan</p>
              <p className="text-xs text-slate-400 mt-1">Coba kata kunci pencarian atau kategori lain.</p>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Cart Panel */}
        <div className="xl:sticky xl:top-24 h-fit max-h-[calc(100vh-120px)]">
          <PosCartPanel onOpenPayment={() => setIsPaymentOpen(true)} />
        </div>
      </div>

      {/* Payment Checkout Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      {/* Receipt Thermal Print Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        transaction={lastTransaction}
        onClose={() => setIsReceiptOpen(false)}
        onNewTransaction={() => setIsReceiptOpen(false)}
      />
    </div>
  )
}

