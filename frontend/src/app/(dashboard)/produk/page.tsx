'use client'

import React, { useState } from 'react'
import {
  PackageSearch,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  Boxes,
  CircleDollarSign,
  Leaf,
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { ProductFormModal } from '@/components/product/product-form-modal'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'
import { mockProducts } from '@/lib/mock-data'
import { useAppStore } from '@/stores/use-app-store'
import { Product } from '@/types/product'

export default function ProdukPage() {
  const { addToast } = useAppStore()
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('Semua Produk')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  const tabs = ['Semua Produk', 'Herbisida', 'Fungisida', 'Pupuk', 'Benih', 'Stok Kritis']

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())

    if (activeTab === 'Semua Produk') return matchesSearch
    if (activeTab === 'Stok Kritis') return matchesSearch && p.totalStock <= p.minStock
    return matchesSearch && p.category === activeTab
  })

  const handleOpenAdd = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleSaveProduct = (data: Partial<Product>) => {
    if (editingProduct) {
      // Update existing
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? ({
                ...p,
                ...data,
                id: p.id,
              } as Product)
            : p
        )
      )
      addToast(`Produk "${data.name}" berhasil diperbarui!`, 'success')
    } else {
      // Add new
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        sku: data.sku || 'SKU-000',
        name: data.name || 'Produk Baru',
        category: data.category || 'Herbisida',
        unit: data.unit || 'Botol',
        costPrice: data.costPrice || 0,
        sellPrice: data.sellPrice || 0,
        minStock: data.minStock || 10,
        totalStock: data.totalStock || 0,
        status: (data.totalStock || 0) > 0 ? 'active' : 'out_of_stock',
        batches: [],
      }
      setProducts([newProd, ...products])
      addToast(`Produk "${newProd.name}" berhasil ditambahkan!`, 'success')
    }
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleDeleteConfirm = () => {
    if (!deletingProduct) return
    setProducts(products.filter((p) => p.id !== deletingProduct.id))
    addToast(`Produk "${deletingProduct.name}" berhasil dihapus!`, 'info')
    setDeletingProduct(null)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#166534]">Katalog & Master Data Toko Pusat</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Manajemen Produk</h1>
          <p className="mt-1 text-xs text-slate-500">
            Kelola katalog obat pertanian, pestisida, pupuk, benih, multi-satuan, dan penetapan harga Toko Pusat.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 self-start rounded-2xl bg-[#166534] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800 sm:self-auto"
        >
          <Plus size={16} /> Tambah Produk Baru
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Katalog Produk"
          value={products.length.toString()}
          detail={`${products.filter((p) => p.status === 'active').length} produk aktif dijual`}
          icon={PackageSearch}
          tone="green"
        />
        <StatCard
          label="Kategori Obat & Tani"
          value="6 Kategori"
          detail="Herbisida & Pupuk terlaris"
          icon={Boxes}
          tone="blue"
        />
        <StatCard
          label="Nilai Persediaan Keseluruhan"
          value="Rp 486,2 jt"
          detail="Persediaan Toko Pusat"
          icon={CircleDollarSign}
          tone="purple"
        />
      </div>

      {/* Main Table Card */}
      <section className="rounded-3xl border border-slate-200/80 bg-white shadow-card overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-slate-100 px-6 pt-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap border-b-2 px-3.5 py-4 text-xs font-bold transition ${
                  activeTab === tab
                    ? 'border-[#166534] text-[#166534]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex h-11 w-full max-w-sm items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 focus-within:border-emerald-500 focus-within:bg-white">
            <Search size={16} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama produk, SKU..."
              className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => addToast('Filter kategori aktif')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              <Filter size={14} /> Filter
            </button>
            <button
              onClick={() => addToast('Katalog produk diekspor ke CSV')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              <Download size={14} /> Ekspor Data
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-3.5">Produk</th>
                <th className="px-4 py-3.5">SKU</th>
                <th className="px-4 py-3.5">Kategori</th>
                <th className="px-4 py-3.5">Harga Pokok</th>
                <th className="px-4 py-3.5">Harga Jual</th>
                <th className="px-4 py-3.5">Margin</th>
                <th className="px-4 py-3.5">Total Stok</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const margin = p.costPrice > 0 ? Math.round(((p.sellPrice - p.costPrice) / p.sellPrice) * 100) : 0
                return (
                  <tr key={p.id} className="text-xs transition hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-[#166534]">
                          <Leaf size={16} />
                        </div>
                        <div>
                          <div>{p.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{p.description?.slice(0, 40)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-slate-400">{p.sku}</td>
                    <td className="px-4 py-4 text-slate-600 font-semibold">{p.category}</td>
                    <td className="px-4 py-4 text-slate-500">Rp {p.costPrice.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-4 font-extrabold text-[#166534]">Rp {p.sellPrice.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-4 font-bold text-emerald-700">{margin}%</td>
                    <td className="px-4 py-4 font-bold text-slate-800">
                      {p.totalStock} <span className="font-normal text-slate-400">{p.unit}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          p.totalStock <= 0
                            ? 'bg-red-50 text-red-600'
                            : p.totalStock <= p.minStock
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {p.totalStock <= 0 ? 'Habis' : p.totalStock <= p.minStock ? 'Menipis' : 'Aktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-[#166534] transition"
                          title="Edit Produk"
                        >
                          <Edit2 size={12} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingProduct(p)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition"
                          title="Hapus Produk"
                        >
                          <Trash2 size={12} />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-xs text-slate-400">
          <span>Menampilkan {filteredProducts.length} dari {products.length} produk Toko Pusat</span>
        </div>
      </section>

      {/* Product Form Modal (Add & Edit) */}
      <ProductFormModal
        isOpen={isModalOpen}
        initialData={editingProduct}
        onClose={() => {
          setIsModalOpen(false)
          setEditingProduct(null)
        }}
        onSave={handleSaveProduct}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingProduct)}
        title="Hapus Produk"
        message="Apakah Anda yakin ingin menghapus produk ini dari katalog Toko Pusat?"
        itemName={deletingProduct ? `${deletingProduct.name} (${deletingProduct.sku})` : undefined}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
