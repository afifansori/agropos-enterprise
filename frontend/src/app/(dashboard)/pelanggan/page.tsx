'use client'

import React, { useState } from 'react'
import {
  UsersRound,
  UserRound,
  WalletCards,
  Plus,
  Search,
  Filter,
  Download,
  Phone,
  MapPin,
  Edit2,
  Trash2,
  X,
  Save,
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'
import { mockCustomers } from '@/lib/mock-data'
import { useAppStore } from '@/stores/use-app-store'
import { Customer } from '@/types/pos'

export default function PelangganPage() {
  const { addToast } = useAppStore()
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [search, setSearch] = useState('')

  // State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [type, setType] = useState<Customer['type']>('petani')
  const [creditLimit, setCreditLimit] = useState<number>(5000000)
  const [address, setAddress] = useState('')

  const handleOpenAdd = () => {
    setEditingCustomer(null)
    setName('')
    setPhone('')
    setType('petani')
    setCreditLimit(5000000)
    setAddress('')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c)
    setName(c.name)
    setPhone(c.phone)
    setType(c.type)
    setCreditLimit(c.creditLimit)
    setAddress(c.address || '')
    setIsModalOpen(true)
  }

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) {
      alert('Nama pelanggan dan nomor HP wajib diisi.')
      return
    }

    if (editingCustomer) {
      setCustomers(
        customers.map((c) =>
          c.id === editingCustomer.id
            ? {
                ...c,
                name,
                phone,
                type,
                creditLimit,
                address,
              }
            : c
        )
      )
      addToast(`Data pelanggan "${name}" berhasil diperbarui!`, 'success')
    } else {
      const newCust: Customer = {
        id: `cst-${Date.now()}`,
        name,
        phone,
        type,
        creditLimit,
        currentCredit: 0,
        address,
      }
      setCustomers([newCust, ...customers])
      addToast(`Pelanggan baru "${name}" berhasil ditambahkan!`, 'success')
    }

    setIsModalOpen(false)
    setEditingCustomer(null)
  }

  const handleDeleteConfirm = () => {
    if (!deletingCustomer) return
    setCustomers(customers.filter((c) => c.id !== deletingCustomer.id))
    addToast(`Pelanggan "${deletingCustomer.name}" berhasil dihapus!`, 'info')
    setDeletingCustomer(null)
  }

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#166534]">CRM & Manajemen Piutang Toko Pusat</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Data Pelanggan & Petani</h1>
          <p className="mt-1 text-xs text-slate-500">
            Kelola profil petani, kelompok tani binaan, toko reseller, limit piutang, dan riwayat transaksi Toko Pusat.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 self-start rounded-2xl bg-[#166534] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800 sm:self-auto"
        >
          <Plus size={16} /> Tambah Pelanggan Baru
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Mitra Petani"
          value={`${customers.length} Pelanggan`}
          detail="Terdaftar di Toko Pusat"
          icon={UsersRound}
          tone="green"
        />
        <StatCard
          label="Petani Aktif Belanja"
          value="1.840 Orang"
          detail="74% dari total basis data"
          icon={UserRound}
          tone="blue"
        />
        <StatCard
          label="Total Piutang Berjalan"
          value={`Rp ${(customers.reduce((acc, curr) => acc + curr.currentCredit, 0) / 1000000).toFixed(2)} jt`}
          detail={`${customers.filter((c) => c.currentCredit > 0).length} petani memiliki saldo tempo aktif`}
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
              placeholder="Cari nama petani atau nomor HP..."
              className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => addToast('Data petani diekspor')}
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
                <th className="px-6 py-3.5">Nama Petani / Kelompok</th>
                <th className="px-4 py-3.5">No. Telepon</th>
                <th className="px-4 py-3.5">Tipe</th>
                <th className="px-4 py-3.5">Limit Kredit</th>
                <th className="px-4 py-3.5">Piutang Terpakai</th>
                <th className="px-4 py-3.5">Sisa Limit</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((c) => {
                const remaining = c.creditLimit - c.currentCredit
                return (
                  <tr key={c.id} className="text-xs transition hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      <div>{c.name}</div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-normal mt-0.5">
                        <MapPin size={11} /> {c.address}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-600">
                      <div className="flex items-center gap-1">
                        <Phone size={12} className="text-slate-400" /> {c.phone}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                        {c.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-700">
                      Rp {c.creditLimit.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-4 font-extrabold text-amber-700">
                      Rp {c.currentCredit.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-4 font-bold text-[#166534]">
                      Rp {remaining.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                        Aktif
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-[#166534] transition"
                          title="Edit Pelanggan"
                        >
                          <Edit2 size={12} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingCustomer(c)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition"
                          title="Hapus Pelanggan"
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
      </section>

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingCustomer ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Petani / Kios</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Pak Budi / Kios Barokah"
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Pelanggan</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as Customer['type'])}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold outline-none"
                >
                  <option value="petani">Petani Perorangan</option>
                  <option value="kelompok">Kelompok Tani (Poktan)</option>
                  <option value="reseller">Kios Tani Reseller</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Limit Fasilitas Piutang / Tempo (Rp)</label>
                <input
                  type="number"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-[#166534] outline-none focus:border-[#166534]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Lahan / Kios</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Desa, Kecamatan, Kabupaten"
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
        isOpen={Boolean(deletingCustomer)}
        title="Hapus Data Pelanggan"
        message="Apakah Anda yakin ingin menghapus data petani/pelanggan ini dari sistem Toko Pusat?"
        itemName={deletingCustomer ? `${deletingCustomer.name} (${deletingCustomer.phone})` : undefined}
        onClose={() => setDeletingCustomer(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
