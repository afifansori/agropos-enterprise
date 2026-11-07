'use client'

import React, { useState, useEffect } from 'react'
import { X, Plus, PackageCheck, Save, Tag, TrendingDown } from 'lucide-react'
import { Product, ProductCategory } from '@/types/product'

interface ProductFormModalProps {
  isOpen: boolean
  initialData?: Product | null
  onClose: () => void
  onSave: (product: Partial<Product>) => void
}

export function ProductFormModal({ isOpen, initialData, onClose, onSave }: ProductFormModalProps) {
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [category, setCategory] = useState<ProductCategory>('Herbisida')
  const [unit, setUnit] = useState('Botol')
  const [costPrice, setCostPrice] = useState<number>(0)
  const [sellPrice, setSellPrice] = useState<number>(0)
  const [wholesalePrice, setWholesalePrice] = useState<number>(0)
  const [wholesaleMinQty, setWholesaleMinQty] = useState<number>(10)
  const [minStock, setMinStock] = useState<number>(10)
  const [initialStock, setInitialStock] = useState<number>(0)
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setSku(initialData.sku)
      setCategory(initialData.category)
      setUnit(initialData.unit)
      setCostPrice(initialData.costPrice)
      setSellPrice(initialData.sellPrice)
      setWholesalePrice(initialData.wholesalePrice ?? Math.round(initialData.sellPrice * 0.9))
      setWholesaleMinQty(initialData.wholesaleMinQty ?? 10)
      setMinStock(initialData.minStock)
      setInitialStock(initialData.totalStock)
      setDescription(initialData.description || '')
    } else {
      setName('')
      setSku('')
      setCategory('Herbisida')
      setUnit('Botol')
      setCostPrice(0)
      setSellPrice(0)
      setWholesalePrice(0)
      setWholesaleMinQty(10)
      setMinStock(10)
      setInitialStock(0)
      setDescription('')
    }
  }, [initialData, isOpen])

  // Auto-calculate wholesale price when sell price changes (90% of sell price)
  useEffect(() => {
    if (!initialData && sellPrice > 0 && wholesalePrice === 0) {
      setWholesalePrice(Math.round(sellPrice * 0.9))
    }
  }, [sellPrice, initialData, wholesalePrice])

  if (!isOpen) return null

  const isEditing = Boolean(initialData)
  const margin = sellPrice > 0 && costPrice > 0
    ? Math.round(((sellPrice - costPrice) / sellPrice) * 100)
    : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !sku || sellPrice <= 0) {
      alert('Nama produk, SKU, dan harga eceran wajib diisi.')
      return
    }

    onSave({
      ...(initialData?.id ? { id: initialData.id } : {}),
      name,
      sku,
      category,
      unit,
      costPrice,
      sellPrice,
      wholesalePrice: wholesalePrice > 0 ? wholesalePrice : Math.round(sellPrice * 0.9),
      wholesaleMinQty,
      minStock,
      totalStock: initialStock,
      description,
      status: initialStock > 0 ? 'active' : 'out_of_stock',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-[#166534]">
              <PackageCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isEditing ? 'Edit Data Produk' : 'Tambah Produk Baru'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditing ? 'Perbarui informasi dan harga produk' : 'Daftarkan produk baru ke katalog'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nama & SKU */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Produk</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Roundup 486 SL (1 Liter)"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-[#166534] focus:ring-4 focus:ring-emerald-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">SKU / Kode Barang</label>
              <input
                required
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                placeholder="HRB-099"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-mono outline-none focus:border-[#166534]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold outline-none focus:border-[#166534]"
              >
                <option value="Herbisida">🌿 Herbisida</option>
                <option value="Fungisida">🍄 Fungisida</option>
                <option value="Insektisida">🐛 Insektisida</option>
                <option value="Pupuk">🌱 Pupuk</option>
                <option value="Benih">🌾 Benih</option>
                <option value="Alat Pertanian">🔧 Alat Pertanian</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Satuan</label>
              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Botol / Sak / Pack"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-[#166534]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Stok Minimum Alert</label>
              <input
                type="number"
                value={minStock}
                onChange={(e) => setMinStock(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-[#166534]"
              />
            </div>
          </div>

          {/* Harga Section */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Tag size={14} className="text-[#166534]" /> Penetapan Harga
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Harga Beli / HPP (Rp)</label>
                <input
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-[#166534]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Harga Eceran (Rp)
                  {margin > 0 && (
                    <span className="ml-1.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      Margin {margin}%
                    </span>
                  )}
                </label>
                <input
                  required
                  type="number"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-bold text-[#166534] outline-none focus:border-[#166534]"
                />
              </div>
            </div>

            {/* Wholesale Price Row */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 mb-2">
                <TrendingDown size={13} /> Harga Grosir
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Harga Grosir (Rp)</label>
                  <input
                    type="number"
                    value={wholesalePrice}
                    onChange={(e) => setWholesalePrice(Number(e.target.value))}
                    placeholder="Otomatis 90% dari eceran"
                    className="w-full rounded-xl border border-blue-200 bg-white p-2.5 text-sm font-bold text-blue-700 outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Min. Qty Grosir</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={wholesaleMinQty}
                      onChange={(e) => setWholesaleMinQty(Number(e.target.value))}
                      min={1}
                      className="w-full rounded-xl border border-blue-200 bg-white p-2.5 text-sm outline-none focus:border-blue-400"
                    />
                    <span className="text-xs text-slate-400 whitespace-nowrap">{unit}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stok */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Stok Tersedia ({unit})
            </label>
            <input
              type="number"
              value={initialStock}
              onChange={(e) => setInitialStock(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-[#166534]"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Deskripsi Produk</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Deskripsi singkat bahan aktif, kegunaan, dll."
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none resize-none focus:border-[#166534] focus:ring-4 focus:ring-emerald-50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#166534] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-800"
            >
              {isEditing ? <Save size={16} /> : <Plus size={16} />}
              {isEditing ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
