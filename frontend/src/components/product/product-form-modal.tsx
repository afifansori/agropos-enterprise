'use client'

import React, { useState, useEffect } from 'react'
import { X, Plus, PackageCheck, Save } from 'lucide-react'
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
      setMinStock(10)
      setInitialStock(0)
      setDescription('')
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const isEditing = Boolean(initialData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !sku || sellPrice <= 0) {
      alert('Nama produk, SKU, dan harga jual wajib diisi.')
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
      minStock,
      totalStock: initialStock,
      description,
      status: initialStock > 0 ? 'active' : 'out_of_stock',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-[#166534]">
              <PackageCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isEditing ? 'Edit Data Produk' : 'Tambah Produk Baru'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditing ? 'Perbarui informasi dan harga produk di Toko Pusat' : 'Daftarkan obat pertanian, pupuk, atau benih baru'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Produk</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Amistartop 325 SC (250 ml)"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-[#166534] focus:ring-4 focus:ring-emerald-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">SKU / Kode Barang</label>
              <input
                required
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                placeholder="FGS-099"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-mono outline-none focus:border-[#166534]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold outline-none"
              >
                <option value="Herbisida">Herbisida (Gulma)</option>
                <option value="Fungisida">Fungisida (Jamur)</option>
                <option value="Insektisida">Insektisida (Hama/Ulat)</option>
                <option value="Pupuk">Pupuk Tanaman</option>
                <option value="Benih">Benih Tanaman</option>
                <option value="Alat Pertanian">Alat Pertanian</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Satuan</label>
              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Botol / Sak / Pack"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Stok Minimum Alert</label>
              <input
                type="number"
                value={minStock}
                onChange={(e) => setMinStock(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Harga Beli / Pokok (Rp)</label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Harga Jual (Rp)</label>
              <input
                required
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-[#166534] outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Stok Tersedia ({unit})</label>
              <input
                type="number"
                value={initialStock}
                onChange={(e) => setInitialStock(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
