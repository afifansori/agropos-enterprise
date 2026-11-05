'use client'

import React, { useState } from 'react'
import {
  WalletCards,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  X,
  Save,
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'
import { mockCashTransactions } from '@/lib/mock-data'
import { useAppStore } from '@/stores/use-app-store'
import { CashTransaction } from '@/types/finance'
import { exportToCsv } from '@/lib/export-csv'

export default function KeuanganPage() {
  const { addToast } = useAppStore()
  const [transactions, setTransactions] = useState<CashTransaction[]>(mockCashTransactions)
  const [activeTab, setActiveTab] = useState('Semua Transaksi')
  const [search, setSearch] = useState('')

  // State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<CashTransaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<CashTransaction | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState<number>(0)
  const [type, setType] = useState<CashTransaction['type']>('out')
  const [category, setCategory] = useState<CashTransaction['category']>('operasional')
  const [notes, setNotes] = useState('')

  const handleOpenAdd = () => {
    setEditingTransaction(null)
    setTitle('')
    setAmount(0)
    setType('out')
    setCategory('operasional')
    setNotes('')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (t: CashTransaction) => {
    setEditingTransaction(t)
    setTitle(t.title)
    setAmount(t.amount)
    setType(t.type)
    setCategory(t.category)
    setNotes(t.notes || '')
    setIsModalOpen(true)
  }

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || amount <= 0) {
      alert('Keterangan transaksi dan nominal wajib diisi.')
      return
    }

    if (editingTransaction) {
      setTransactions(
        transactions.map((t) =>
          t.id === editingTransaction.id
            ? {
              ...t,
              title,
              amount,
              type,
              category,
              notes,
            }
            : t
        )
      )
      addToast(`Transaksi kas "${title}" berhasil diperbarui!`, 'success')
    } else {
      const newTx: CashTransaction = {
        id: `ctx-${Date.now()}`,
        code: `BKK-${Date.now().toString().slice(-4)}`,
        type,
        category,
        title,
        amount,
        date: new Date().toLocaleDateString('id-ID'),
        branchName: 'Toko Pusat',
        status: 'completed',
        notes,
      }
      setTransactions([newTx, ...transactions])
      addToast(`Transaksi kas baru "${title}" berhasil dicatat!`, 'success')
    }

    setIsModalOpen(false)
    setEditingTransaction(null)
  }

  const handleDeleteConfirm = () => {
    if (!deletingTransaction) return
    setTransactions(transactions.filter((t) => t.id !== deletingTransaction.id))
    addToast(`Transaksi "${deletingTransaction.title}" berhasil dihapus!`, 'info')
    setDeletingTransaction(null)
  }

  const handleExportBukuKas = () => {
    const headers = [
      'Kode Transaksi',
      'Keterangan',
      'Kategori',
      'Jenis Kas',
      'Tanggal',
      'Nominal (Rp)',
      'Status',
      'Unit Toko',
      'Catatan',
    ]

    const rows = filtered.map((t) => [
      t.code,
      t.title,
      t.category,
      t.type === 'in' ? 'Pemasukan Kas' : 'Pengeluaran Kas',
      t.date,
      t.amount,
      t.status === 'completed' ? 'Selesai' : 'Pending',
      t.branchName || 'Toko Pusat',
      t.notes || '-',
    ])

    const dateStr = new Date().toISOString().slice(0, 10)
    exportToCsv(`Buku_Kas_AgroPOS_Toko_Pusat_${dateStr}`, headers, rows)
    addToast('Buku kas Toko Pusat berhasil diekspor ke Excel (CSV)!', 'success')
  }

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase())

    if (activeTab === 'Pemasukan Kasir') return matchesSearch && t.type === 'in'
    if (activeTab === 'Biaya Operasional') return matchesSearch && t.type === 'out'
    if (activeTab === 'Hutang & Piutang') return matchesSearch && (t.category === 'hutang' || t.category === 'piutang')
    return matchesSearch
  })

  const totalIn = transactions.filter((t) => t.type === 'in').reduce((acc, curr) => acc + curr.amount, 0)
  const totalOut = transactions.filter((t) => t.type === 'out').reduce((acc, curr) => acc + curr.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#166534]">Keuangan & Kas Toko Pusat</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Arus Kas & Pengeluaran
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Pantau saldo kasir, buku kas bank, biaya operasional, dan pencatatan kas Toko Pusat.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 self-start rounded-2xl bg-[#166534] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800 sm:self-auto"
        >
          <Plus size={16} /> Catat Pengeluaran / Kas Keluar
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Saldo Kas & Bank"
          value="Rp 284,6 jt"
          detail="Brankas kasir & bank Toko Pusat"
          icon={WalletCards}
          tone="green"
        />
        <StatCard
          label="Pemasukan Kasir Tercatat"
          value={`Rp ${(totalIn / 1000000).toFixed(1)} jt`}
          detail="Penjualan kasir & pelunasan piutang"
          icon={ArrowUpRight}
          tone="blue"
        />
        <StatCard
          label="Pengeluaran Operasional"
          value={`Rp ${(totalOut / 1000000).toFixed(1)} jt`}
          detail="Pengadaan obat & biaya toko"
          icon={ArrowDownRight}
          tone="amber"
        />
      </div>

      <section className="rounded-3xl border border-slate-200/80 bg-white shadow-card overflow-hidden">
        <div className="border-b border-slate-100 px-6 pt-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {['Semua Transaksi', 'Pemasukan Kasir', 'Biaya Operasional', 'Hutang & Piutang'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap border-b-2 px-3.5 py-4 text-xs font-bold transition ${activeTab === tab
                    ? 'border-[#166534] text-[#166534]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex h-11 w-full max-w-sm items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 focus-within:border-emerald-500 focus-within:bg-white">
            <Search size={16} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari transaksi kas..."
              className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExportBukuKas}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-[#166534] hover:bg-emerald-50 hover:border-emerald-400 transition"
            >
              <Download size={14} /> Ekspor Buku Kas
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-3.5">Kode</th>
                <th className="px-4 py-3.5">Keterangan Transaksi</th>
                <th className="px-4 py-3.5">Kategori</th>
                <th className="px-4 py-3.5">Tanggal</th>
                <th className="px-4 py-3.5">Nominal (Rp)</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => {
                const isIncome = t.type === 'in'
                return (
                  <tr key={t.id} className="text-xs transition hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-mono font-bold text-slate-500">{t.code}</td>
                    <td className="px-4 py-4 font-bold text-slate-800">
                      <div>{t.title}</div>
                      {t.notes && <div className="text-[10px] text-slate-400 font-normal">{t.notes}</div>}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-400">{t.date}</td>
                    <td className={`px-4 py-4 font-extrabold ${isIncome ? 'text-emerald-700' : 'text-red-600'}`}>
                      {isIncome ? `+ Rp ${t.amount.toLocaleString('id-ID')}` : `- Rp ${t.amount.toLocaleString('id-ID')}`}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                        {t.status === 'completed' ? 'Selesai' : 'Terjadwal'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-[#166534] transition"
                          title="Edit Transaksi"
                        >
                          <Edit2 size={12} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingTransaction(t)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition"
                          title="Hapus Transaksi"
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

      {/* Add / Edit Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingTransaction ? 'Edit Catatan Kas' : 'Catat Transaksi Kas Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kas</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('out')}
                    className={`rounded-xl p-2.5 text-xs font-bold border ${type === 'out'
                        ? 'bg-red-50 text-red-700 border-red-300'
                        : 'border-slate-200 text-slate-600'
                      }`}
                  >
                    Kas Keluar (Pengeluaran)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('in')}
                    className={`rounded-xl p-2.5 text-xs font-bold border ${type === 'in'
                        ? 'bg-emerald-50 text-[#166534] border-emerald-300'
                        : 'border-slate-200 text-slate-600'
                      }`}
                  >
                    Kas Masuk (Pemasukan)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan Transaksi</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Pembelian bensin operasional toko"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#166534]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CashTransaction['category'])}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold outline-none"
                >
                  <option value="operasional">Biaya Operasional Toko</option>
                  <option value="pembelian">Pengadaan / Pembelian Obat</option>
                  <option value="penjualan">Penjualan Kasir</option>
                  <option value="piutang">Pelunasan Piutang Petani</option>
                  <option value="hutang">Pembayaran Hutang Supplier</option>
                  <option value="payroll">Gaji Staf Toko</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-[#166534] outline-none focus:border-[#166534]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
                <input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="No. kuitansi / bukti transfer"
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
                  <Save size={14} /> Simpan Catatan Kas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingTransaction)}
        title="Hapus Catatan Kas"
        message="Apakah Anda yakin ingin menghapus catatan transaksi arus kas ini dari buku kas Toko Pusat?"
        itemName={deletingTransaction ? `${deletingTransaction.title} (Rp ${deletingTransaction.amount.toLocaleString('id-ID')})` : undefined}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
