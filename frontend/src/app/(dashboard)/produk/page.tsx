'use client'

import React, { useState } from 'react'
import {
  PackageSearch,
  Plus,
  Search,
  Download,
  Edit2,
  Trash2,
  Boxes,
  CircleDollarSign,
  Leaf,
  Tag,
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { ProductFormModal } from '@/components/product/product-form-modal'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'
import { useProductStore } from '@/stores/use-product-store'
import { useAppStore } from '@/stores/use-app-store'
import { Product } from '@/types/product'

export default function ProdukPage() {
  const { addToast } = useAppStore()
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore()

  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('Semua Produk')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  const tabs = ['Semua Produk', 'Herbisida', 'Fungisida', 'Insektisida', 'Pupuk', 'Benih', 'Alat Pertanian', 'Stok Kritis']

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
      updateProduct(editingProduct.id, data)
      addToast(`Produk "${data.name}" berhasil diperbarui!`, 'success')
    } else {
      addProduct({
        sku: data.sku || 'SKU-000',
        name: data.name || 'Produk Baru',
        category: data.category || 'Herbisida',
        unit: data.unit || 'Botol',
        costPrice: data.costPrice || 0,
        sellPrice: data.sellPrice || 0,
        wholesalePrice: data.wholesalePrice || Math.round((data.sellPrice || 0) * 0.9),
        wholesaleMinQty: data.wholesaleMinQty || 10,
        minStock: data.minStock || 10,
        totalStock: data.totalStock || 0,
        status: (data.totalStock || 0) > 0 ? 'active' : 'out_of_stock',
        batches: [],
        description: data.description,
      })
      addToast(`Produk "${data.name}" berhasil ditambahkan!`, 'success')
    }
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleDeleteConfirm = () => {
    if (!deletingProduct) return
    deleteProduct(deletingProduct.id)
    addToast(`Produk "${deletingProduct.name}" berhasil dihapus!`, 'info')
    setDeletingProduct(null)
  }

  const handleExport = () => {
    const header = ['SKU', 'Nama Produk', 'Kategori', 'Satuan', 'HPP', 'Harga Eceran', 'Harga Grosir', 'Min Grosir', 'Stok', 'Status']
    const rows = filteredProducts.map((p) => [
      p.sku, p.name, p.category, p.unit,
      p.costPrice, p.sellPrice, p.wholesalePrice, p.wholesaleMinQty,
      p.totalStock, p.status,
    ])
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `produk-agropos-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    addToast('Data produk berhasil diekspor ke CSV!', 'success')
  }

  const totalNilai = products.reduce((acc, p) => acc + p.costPrice * p.totalStock, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#166534]">Katalog & Master Data Toko Pusat</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Manajemen Produk</h1>
          <p className="mt-1 text-xs text-slate-500">
            Kelola katalog obat pertanian, harga eceran & grosir, stok, dan sinkron otomatis ke kasir POS.
          </p>
        </div>

        <div className="flex gap-2 self-start sm:self-auto">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Download size={15} /> Ekspor CSV
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#166534] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800"
          >
            <Plus size={16} /> Tambah Produk
          </button>
        </div>
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
          label="Kategori Aktif"
          value="7 Kategori"
          detail="Herbisida, Pupuk, Benih & lainnya"
          icon={Boxes}
          tone="blue"
        />
        <StatCard
          label="Nilai Persediaan"
          value={`Rp ${(totalNilai / 1000000).toFixed(1)} jt`}
          detail="Total HPP × Stok"
          icon={CircleDollarSign}
          tone="purple"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === tab
                ? 'bg-[#166534] text-white shadow-md shadow-emerald-900/15'
                : 'border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab}
            {tab === 'Stok Kritis' && (
              <span className="ml-1.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                {products.filter((p) => p.totalStock <= p.minStock).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search + Table */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 p-5">
          <div className="flex h-10 flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 focus-within:border-[#166534] focus-within:ring-4 focus-within:ring-emerald-50">
            <Search size={16} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama produk, SKU..."
              className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400"
            />
          </div>
          <span className="text-xs text-slate-400">{filteredProducts.length} produk</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-3.5">Produk</th>
                <th className="px-4 py-3.5">SKU</th>
                <th className="px-4 py-3.5">Kategori</th>
                <th className="px-4 py-3.5">HPP</th>
                <th className="px-4 py-3.5">Harga Eceran</th>
                <th className="px-4 py-3.5">Harga Grosir</th>
                <th className="px-4 py-3.5">Min Grosir</th>
                <th className="px-4 py-3.5">Stok</th>
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
                          <div className="text-[10px] text-slate-400 font-normal">
                            {p.description?.slice(0, 40) || '-'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-slate-400">{p.sku}</td>
                    <td className="px-4 py-4 text-slate-600 font-semibold">{p.category}</td>
                    <td className="px-4 py-4 text-slate-500">Rp {p.costPrice.toLocaleString('id-ID')}</td>
                    <td className="px-4 py-4 font-extrabold text-[#166534]">
                      Rp {p.sellPrice.toLocaleString('id-ID')}
                      <div className="text-[10px] text-emerald-600 font-semibold">Margin {margin}%</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-blue-600 font-bold">
                        <Tag size={11} />
                        Rp {p.wholesalePrice.toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-500">≥ {p.wholesaleMinQty} {p.unit}</td>
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
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => setDeletingProduct(p)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition"
                        >
                          <Trash2 size={12} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-slate-400">
                    <PackageSearch size={28} className="mx-auto mb-2 text-slate-300" />
                    Tidak ada produk ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-xs text-slate-400">
          <span>Menampilkan {filteredProducts.length} dari {products.length} produk</span>
        </div>
      </section>

      <ProductFormModal
        isOpen={isModalOpen}
        initialData={editingProduct}
        onClose={() => { setIsModalOpen(false); setEditingProduct(null) }}
        onSave={handleSaveProduct}
      />

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
