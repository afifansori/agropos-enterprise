'use client'

import React, { useState } from 'react'
import {
  Truck,
  TrendingUp,
  WalletCards,
  Plus,
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  MapPin,
  Edit2,
  Trash2,
  X,
  Save,
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'
import { mockSuppliers } from '@/lib/mock-data'
import { useAppStore } from '@/stores/use-app-store'
import { Supplier } from '@/types/purchase'

export default function SupplierPage() {
  const { addToast } = useAppStore()
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers)
  const [search, setSearch] = useState('')

  // State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [category, setCategory] = useState('Pestisida & Benih')

  const handleOpenAdd = () => {
    setEditingSupplier(null)
    setName('')
    setPhone('')
    setEmail('')
    setAddress('')
    setCategory('Pestisida & Benih')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (s: Supplier) => {
    setEditingSupplier(s)
    setName(s.name)
    setPhone(s.phone)
    setEmail(s.email || '')
    setAddress(s.address)
    setCategory(s.category)
    setIsModalOpen(true)
  }

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) {
      alert('Nama supplier dan nomor telepon wajib diisi.')
      return
    }

    if (editingSupplier) {
      setSuppliers(
        suppliers.map((s) =>
          s.id === editingSupplier.id
            ? {
                ...s,
                name,
                phone,
                email,
                address,
                category,
              }
            : s
        )
      )
      addToast(`Supplier "${name}" berhasil diperbarui!`, 'success')
    } else {
      const newSup: Supplier = {
        id: `sup-${Date.now()}`,
        name,
        phone,
        email,
        address,
        category,
        totalPurchases: 0,
        outstandingPayable: 0,
        status: 'active',
      }
      setSuppliers([newSup, ...suppliers])
      addToast(`Supplier "${name}" berhasil ditambahkan!`, 'success')
    }

    setIsModalOpen(false)
    setEditingSupplier(null)
  }

  const handleDeleteConfirm = () => {
    if (!deletingSupplier) return
    setSuppliers(suppliers.filter((s) => s.id !== deletingSupplier.id))
    addToast(`Supplier "${deletingSupplier.name}" berhasil dihapus!`, 'info')
    setDeletingSupplier(null)
  }

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#166534]">Mitra & Distributor Toko Pusat</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Direktori Supplier</h1>
          <p className="mt-1 text-xs text-slate-500">
            Kelola profil pemasok pabrik pestisida, pupuk, benih, performa pengiriman, dan saldo hutang dagang Toko Pusat.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 self-start rounded-2xl bg-[#166534] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800 sm:self-auto"
        >
          <Plus size={16} /> Tambah Supplier Baru
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Supplier Aktif"
          value={`${suppliers.length} Pabrik & Distributor`}
          detail="Mitra pengadaan Toko Pusat"
          icon={Truck}
          tone="green"
        />
        <StatCard
          label="Ketepatan Pengiriman"
          value="94,8%"
          detail="Naik 2,4% bulan berjalan"
          icon={TrendingUp}
          tone="blue"
        />
        <StatCard
          label="Total Hutang Dagang"
          value={`Rp ${(suppliers.reduce((acc, curr) => acc + curr.outstandingPayable, 0) / 1000000).toFixed(1)} jt`}
          detail="Faktur tempo pembelian terbuka"
          icon={WalletCards}
          tone="amber"
        />
      </div>

      <section className="rounded-3xl border border-slate-200/80 bg-white shadow-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex h-11 w-full max-w-sm items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 focus-within:border-emerald-500 focus-within:bg-white">
            <Search size={16} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama supplier atau kategori..."
              className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => addToast('Data supplier diekspor')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              <Download size={14} /> Ekspor Data
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-3.5">Nama Supplier</th>
                <th className="px-4 py-3.5">Kontak & Email</th>
                <th className="px-4 py-3.5">Kategori Utama</th>
                <th className="px-4 py-3.5">Akumulasi Transaksi</th>
                <th className="px-4 py-3.5">Saldo Hutang</th>
                <th className="px-4 py-3.5">Status Portal</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSuppliers.map((s) => (
                <tr key={s.id} className="text-xs transition hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-bold text-slate-800">
                    <div>{s.name}</div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-normal mt-0.5">
                      <MapPin size={11} /> {s.address}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    <div className="flex items-center gap-1 font-semibold">
                      <Phone size={12} className="text-slate-400" /> {s.phone}
                    </div>
                    {s.email && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                        <Mail size={11} /> {s.email}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-700">{s.category}</td>
                  <td className="px-4 py-4 font-bold text-slate-800">
                    Rp {s.totalPurchases.toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-4 font-extrabold text-amber-700">
                    {s.outstandingPayable > 0 ? `Rp ${s.outstandingPayable.toLocaleString('id-ID')}` : 'Rp 0 (Lunas)'}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      Aktif Terhubung
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-[#166534] transition"
                        title="Edit Supplier"
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeletingSupplier(s)}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition"
                        title="Hapus Supplier"
                      >
                        <Trash2 size={12} />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add / Edit Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingSupplier ? 'Edit Supplier' : 'Tambah Supplier Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Perusahaan / Supplier</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="PT / CV Supplier"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#166534]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#166534]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="order@supplier.com"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#166534]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Produk</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Pestisida, Pupuk, Benih..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#166534]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Kantor / Pabrik</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Alamat lengkap distributor"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#166534]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#166534] px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800"
                >
                  <Save size={14} /> Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingSupplier)}
        title="Hapus Supplier"
        message="Apakah Anda yakin ingin menghapus data supplier mitra ini dari sistem Toko Pusat?"
        itemName={deletingSupplier ? `${deletingSupplier.name} (${deletingSupplier.category})` : undefined}
        onClose={() => setDeletingSupplier(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
