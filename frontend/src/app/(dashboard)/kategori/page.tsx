'use client'

import React, { useState } from 'react'
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  Search,
  Layers,
  PackageSearch,
} from 'lucide-react'
import { useAppStore } from '@/stores/use-app-store'
import { useProductStore } from '@/stores/use-product-store'
import { ProductCategory } from '@/types/product'

interface Category {
  id: string
  name: ProductCategory
  description: string
  color: string
  icon: string
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Herbisida', description: 'Pembasmi gulma/tanaman pengganggu', color: 'bg-red-50 text-red-600 border-red-200', icon: '🌿' },
  { id: 'cat-2', name: 'Fungisida', description: 'Pembasmi jamur penyakit tanaman', color: 'bg-blue-50 text-blue-600 border-blue-200', icon: '🍄' },
  { id: 'cat-3', name: 'Insektisida', description: 'Pembasmi serangga hama tanaman', color: 'bg-orange-50 text-orange-600 border-orange-200', icon: '🐛' },
  { id: 'cat-4', name: 'Pupuk', description: 'Nutrisi dan penyubur tanah/tanaman', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: '🌱' },
  { id: 'cat-5', name: 'Benih', description: 'Benih unggul bersertifikat', color: 'bg-yellow-50 text-yellow-600 border-yellow-200', icon: '🌾' },
  { id: 'cat-6', name: 'Alat Pertanian', description: 'Peralatan dan mesin pertanian', color: 'bg-slate-50 text-slate-600 border-slate-200', icon: '🔧' },
]

interface CategoryFormModalProps {
  isOpen: boolean
  initialData?: Category | null
  onClose: () => void
  onSave: (cat: Category) => void
}

function CategoryFormModal({ isOpen, initialData, onClose, onSave }: CategoryFormModalProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [icon, setIcon] = useState(initialData?.icon || '📦')

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setDescription(initialData.description)
      setIcon(initialData.icon)
    } else {
      setName('')
      setDescription('')
      setIcon('📦')
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-slate-900">
            {initialData ? 'Edit Kategori' : 'Tambah Kategori'}
          </h2>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">✕</button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-700">Icon Kategori</span>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              maxLength={2}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-2xl outline-none focus:border-[#166534] focus:ring-4 focus:ring-emerald-50"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-700">Nama Kategori</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Herbisida"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-[#166534] focus:ring-4 focus:ring-emerald-50"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-700">Deskripsi</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Deskripsi singkat kategori..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#166534] focus:ring-4 focus:ring-emerald-50 resize-none"
            />
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            onClick={() => {
              if (!name) return
              onSave({
                id: initialData?.id || `cat-${Date.now()}`,
                name: name as ProductCategory,
                description,
                color: initialData?.color || 'bg-slate-50 text-slate-600 border-slate-200',
                icon,
              })
            }}
            className="flex-1 rounded-2xl bg-[#166534] py-3 text-sm font-bold text-white hover:bg-emerald-800"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

export default function KategoriPage() {
  const { addToast } = useAppStore()
  const { products } = useProductStore()
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCat, setEditingCat] = useState<Category | null>(null)
  const [deletingCat, setDeletingCat] = useState<Category | null>(null)

  const filteredCats = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  )

  const getProductCount = (catName: string) =>
    products.filter((p) => p.category === catName).length

  const handleSave = (cat: Category) => {
    if (editingCat) {
      setCategories(categories.map((c) => (c.id === cat.id ? cat : c)))
      addToast(`Kategori "${cat.name}" berhasil diperbarui!`, 'success')
    } else {
      setCategories([...categories, cat])
      addToast(`Kategori "${cat.name}" berhasil ditambahkan!`, 'success')
    }
    setIsModalOpen(false)
    setEditingCat(null)
  }

  const handleDelete = () => {
    if (!deletingCat) return
    setCategories(categories.filter((c) => c.id !== deletingCat.id))
    addToast(`Kategori "${deletingCat.name}" berhasil dihapus!`, 'info')
    setDeletingCat(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#166534]">Master Data</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Manajemen Kategori
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Kelola kategori produk saprotan untuk pengelompokan di katalog dan kasir POS.
          </p>
        </div>
        <button
          onClick={() => { setEditingCat(null); setIsModalOpen(true) }}
          className="inline-flex items-center gap-2 self-start rounded-2xl bg-[#166534] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-800 sm:self-auto"
        >
          <Plus size={16} /> Tambah Kategori
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-[#166534]"><Layers size={18} /></div>
            <div>
              <div className="text-2xl font-black text-slate-900">{categories.length}</div>
              <div className="text-xs text-slate-400">Total Kategori</div>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><PackageSearch size={18} /></div>
            <div>
              <div className="text-2xl font-black text-slate-900">{products.length}</div>
              <div className="text-xs text-slate-400">Total Produk Terdaftar</div>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Tag size={18} /></div>
            <div>
              <div className="text-2xl font-black text-slate-900">
                {categories.filter(c => getProductCount(c.name) > 0).length}
              </div>
              <div className="text-xs text-slate-400">Kategori Aktif</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 shadow-sm focus-within:border-[#166534] focus-within:ring-4 focus-within:ring-emerald-50 max-w-sm">
        <Search size={15} className="text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kategori..."
          className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Category Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCats.map((cat) => {
          const count = getProductCount(cat.name)
          return (
            <div
              key={cat.id}
              className="group relative rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex size-12 items-center justify-center rounded-2xl border text-2xl ${cat.color}`}>
                    {cat.icon}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{cat.name}</div>
                    <div className="mt-0.5 text-[11px] text-slate-400">{count} produk</div>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={() => { setEditingCat(cat); setIsModalOpen(true) }}
                    className="flex size-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-emerald-50 hover:text-[#166534]"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => setDeletingCat(cat)}
                    className="flex size-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500 leading-relaxed">{cat.description}</p>

              <div className="mt-4 h-1.5 rounded-full bg-slate-100">
                <div
                  className="h-1.5 rounded-full bg-[#166534] transition-all"
                  style={{ width: `${Math.min(100, (count / Math.max(1, products.length)) * 100 * 3)}%` }}
                />
              </div>
              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                <span>{count} produk terdaftar</span>
                <span>{count > 0 ? 'Aktif' : 'Kosong'}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Form Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        initialData={editingCat}
        onClose={() => { setIsModalOpen(false); setEditingCat(null) }}
        onSave={handleSave}
      />

      {/* Delete Confirm */}
      {deletingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Hapus Kategori?</h3>
              <p className="mt-2 text-sm text-slate-500">
                Kategori <b>{deletingCat.name}</b> akan dihapus. Produk yang ada tidak ikut terhapus.
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setDeletingCat(null)} className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
                Batal
              </button>
              <button onClick={handleDelete} className="flex-1 rounded-2xl bg-red-500 py-3 text-sm font-bold text-white hover:bg-red-600">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
