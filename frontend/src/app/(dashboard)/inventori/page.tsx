'use client'

import React, { useState } from 'react'
import {
  Boxes,
  AlertTriangle,
  CalendarDays,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit2,
  Trash2,
  X,
  Save,
  Scale,
  ClipboardCheck,
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'
import { useAppStore } from '@/stores/use-app-store'
import { exportToCsv } from '@/lib/export-csv'

interface BatchDisplay {
  id: string
  productName: string
  sku: string
  batchNumber: string
  entryDate: string
  expiryDate: string
  stock: number
  unit: string
  status: 'safe' | 'warning' | 'critical' | 'expired'
  daysRemaining: number
}

interface OpnameRecord {
  id: string
  batchNumber: string
  productName: string
  systemStock: number
  physicalStock: number
  difference: number
  reason: string
  date: string
  operator: string
}

const initialBatches: BatchDisplay[] = [
  {
    id: 'b-01',
    productName: 'Decis 25 EC (250 ml)',
    sku: 'INS-008',
    batchNumber: 'B231110',
    entryDate: '10 Nov 2024',
    expiryDate: '10 Agu 2025',
    stock: 11,
    unit: 'Botol',
    status: 'critical',
    daysRemaining: 45,
  },
  {
    id: 'b-02',
    productName: 'Gramoxone 276 SL',
    sku: 'HRB-002',
    batchNumber: 'B240105',
    entryDate: '05 Jan 2025',
    expiryDate: '05 Jul 2025',
    stock: 4,
    unit: 'Botol',
    status: 'critical',
    daysRemaining: 28,
  },
  {
    id: 'b-03',
    productName: 'Roundup 486 SL (1 Liter)',
    sku: 'HRB-001',
    batchNumber: 'B240115',
    entryDate: '15 Jan 2025',
    expiryDate: '15 Agu 2026',
    stock: 4,
    unit: 'Botol',
    status: 'warning',
    daysRemaining: 120,
  },
  {
    id: 'b-04',
    productName: 'Roundup 486 SL (1 Liter)',
    sku: 'HRB-001',
    batchNumber: 'B240301',
    entryDate: '01 Mar 2025',
    expiryDate: '01 Mar 2027',
    stock: 48,
    unit: 'Botol',
    status: 'safe',
    daysRemaining: 650,
  },
  {
    id: 'b-05',
    productName: 'Antracol 70 WP (1 Kg)',
    sku: 'FGS-014',
    batchNumber: 'B240218',
    entryDate: '18 Feb 2025',
    expiryDate: '18 Feb 2027',
    stock: 87,
    unit: 'Pack',
    status: 'safe',
    daysRemaining: 640,
  },
  {
    id: 'b-06',
    productName: 'NPK Mutiara 16-16-16 (50 Kg)',
    sku: 'PPK-021',
    batchNumber: 'B250406',
    entryDate: '06 Apr 2025',
    expiryDate: '06 Apr 2028',
    stock: 63,
    unit: 'Sak',
    status: 'safe',
    daysRemaining: 1050,
  },
]

const initialOpnameLogs: OpnameRecord[] = [
  {
    id: 'op-01',
    batchNumber: 'B240301',
    productName: 'Roundup 486 SL',
    systemStock: 50,
    physicalStock: 48,
    difference: -2,
    reason: 'Koreksi Botol Bocor / Rusak',
    date: '02 Mei 2025',
    operator: 'Dedi Pratama (Gudang)',
  },
  {
    id: 'op-02',
    batchNumber: 'B240218',
    productName: 'Antracol 70 WP',
    systemStock: 85,
    physicalStock: 87,
    difference: 2,
    reason: 'Penghitungan Fisik Rak Lebih',
    date: '10 Mei 2025',
    operator: 'Rina Wulandari (Admin)',
  },
]

export default function InventoriPage() {
  const { addToast } = useAppStore()
  const [batches, setBatches] = useState<BatchDisplay[]>(initialBatches)
  const [opnameLogs, setOpnameLogs] = useState<OpnameRecord[]>(initialOpnameLogs)
  const [activeTab, setActiveTab] = useState('Ringkasan Batch')
  const [search, setSearch] = useState('')

  // State for Edit and Delete
  const [editingBatch, setEditingBatch] = useState<BatchDisplay | null>(null)
  const [deletingBatch, setDeletingBatch] = useState<BatchDisplay | null>(null)

  // Edit form state
  const [editBatchNumber, setEditBatchNumber] = useState('')
  const [editStock, setEditStock] = useState<number>(0)
  const [editExpiryDate, setEditExpiryDate] = useState('')
  const [editStatus, setEditStatus] = useState<BatchDisplay['status']>('safe')

  // Stock Opname Modal State
  const [isOpnameOpen, setIsOpnameOpen] = useState(false)
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '')
  const [physicalCount, setPhysicalCount] = useState<number>(0)
  const [opnameReason, setOpnameReason] = useState('Koreksi Opname Fisik Rutin')
  const [opnameOperator, setOpnameOperator] = useState('Dedi Pratama (Gudang Toko Pusat)')

  const currentOpnameBatch = batches.find((b) => b.id === selectedBatchId) || batches[0]
  const currentDiff = physicalCount - (currentOpnameBatch?.stock || 0)

  const handleOpenOpname = () => {
    if (batches.length > 0) {
      setSelectedBatchId(batches[0].id)
      setPhysicalCount(batches[0].stock)
    }
    setIsOpnameOpen(true)
  }

  const handleSaveOpname = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentOpnameBatch) return

    const newLog: OpnameRecord = {
      id: `op-${Date.now()}`,
      batchNumber: currentOpnameBatch.batchNumber,
      productName: currentOpnameBatch.productName,
      systemStock: currentOpnameBatch.stock,
      physicalStock: physicalCount,
      difference: currentDiff,
      reason: opnameReason,
      date: new Date().toLocaleDateString('id-ID'),
      operator: opnameOperator,
    }

    setBatches(
      batches.map((b) =>
        b.id === currentOpnameBatch.id
          ? {
              ...b,
              stock: physicalCount,
            }
          : b
      )
    )

    setOpnameLogs([newLog, ...opnameLogs])
    addToast(
      `Stok ${currentOpnameBatch.productName} berhasil disesuaikan menjadi ${physicalCount} ${currentOpnameBatch.unit}!`,
      'success'
    )
    setIsOpnameOpen(false)
  }

  const handleOpenEdit = (b: BatchDisplay) => {
    setEditingBatch(b)
    setEditBatchNumber(b.batchNumber)
    setEditStock(b.stock)
    setEditExpiryDate(b.expiryDate)
    setEditStatus(b.status)
  }

  const handleSaveBatch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBatch) return

    setBatches(
      batches.map((b) =>
        b.id === editingBatch.id
          ? {
              ...b,
              batchNumber: editBatchNumber,
              stock: editStock,
              expiryDate: editExpiryDate,
              status: editStatus,
            }
          : b
      )
    )

    addToast(`Batch ${editBatchNumber} berhasil diperbarui!`, 'success')
    setEditingBatch(null)
  }

  const handleDeleteBatch = () => {
    if (!deletingBatch) return
    setBatches(batches.filter((b) => b.id !== deletingBatch.id))
    addToast(`Batch ${deletingBatch.batchNumber} berhasil dihapus!`, 'info')
    setDeletingBatch(null)
  }

  // Real CSV export function
  const handleExportData = () => {
    const headers = [
      'Nama Produk',
      'SKU',
      'Nomor Batch',
      'Tanggal Masuk',
      'Tanggal Kedaluwarsa',
      'Sisa Waktu (Hari)',
      'Stok',
      'Satuan',
      'Status FEFO',
    ]

    const rows = batches.map((b) => [
      b.productName,
      b.sku,
      b.batchNumber,
      b.entryDate,
      b.expiryDate,
      b.daysRemaining,
      b.stock,
      b.unit,
      b.status === 'critical' ? 'Kritis (Jual Cepat)' : b.status === 'warning' ? 'Waspada' : 'Aman',
    ])

    exportToCsv(`inventori-batch-toko-pusat-${new Date().toISOString().slice(0, 10)}`, headers, rows)
    addToast('File data inventori berhasil diunduh dalam format CSV Excel!', 'success')
  }

  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.productName.toLowerCase().includes(search.toLowerCase()) ||
      b.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.sku.toLowerCase().includes(search.toLowerCase())

    if (activeTab === 'Kedaluwarsa Kritis') {
      return matchesSearch && (b.status === 'critical' || b.status === 'warning')
    }
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#166534]">Gudang Toko Pusat & FEFO</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Inventori & Pelacakan Batch
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Pantau stok fisik Toko Pusat, nomor batch obat pertanian, dan alokasi kasir otomatis berbasis FEFO.
          </p>
        </div>

        <button
          onClick={handleOpenOpname}
          className="inline-flex items-center gap-2 self-start rounded-2xl bg-[#166534] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800 sm:self-auto"
        >
          <Scale size={16} /> Penyesuaian Stok (Opname)
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Unit Tersedia"
          value={`${batches.reduce((acc, curr) => acc + curr.stock, 0)} Unit`}
          detail="Gudang & Rak Toko Pusat"
          icon={Boxes}
          tone="green"
        />
        <StatCard
          label="Stok Mendekati Kritis"
          value={`${batches.filter((b) => b.status === 'critical').length} Batch`}
          detail="Perlu pengadaan purchase order baru"
          icon={AlertTriangle}
          tone="amber"
        />
        <StatCard
          label="Kedaluwarsa < 90 Hari"
          value={`${batches.filter((b) => b.daysRemaining <= 90).length} Batch`}
          detail="Prioritaskan keluar kasir (FEFO)"
          icon={CalendarDays}
          tone="purple"
        />
      </div>

      {/* Main Table Card */}
      <section className="rounded-3xl border border-slate-200/80 bg-white shadow-card overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-slate-100 px-6 pt-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {['Ringkasan Batch', 'Kedaluwarsa Kritis', 'Audit Opname'].map((tab) => (
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
              placeholder="Cari produk atau no. batch..."
              className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => addToast('Filter diterapkan')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              <Filter size={14} /> Filter
            </button>
            <button
              onClick={handleExportData}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              <Download size={14} /> Ekspor Data (CSV)
            </button>
          </div>
        </div>

        {/* Table Content */}
        {activeTab !== 'Audit Opname' ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3.5">Produk</th>
                  <th className="px-4 py-3.5">No. Batch</th>
                  <th className="px-4 py-3.5">Tgl Masuk</th>
                  <th className="px-4 py-3.5">Kedaluwarsa</th>
                  <th className="px-4 py-3.5">Sisa Waktu</th>
                  <th className="px-4 py-3.5">Stok Batch</th>
                  <th className="px-4 py-3.5">Status FEFO</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBatches.map((b) => (
                  <tr key={b.id} className="text-xs transition hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      <div>{b.productName}</div>
                      <div className="text-[10px] font-mono text-slate-400 font-normal">{b.sku}</div>
                    </td>
                    <td className="px-4 py-4 font-mono font-bold text-[#166534]">{b.batchNumber}</td>
                    <td className="px-4 py-4 text-slate-400">{b.entryDate}</td>
                    <td className="px-4 py-4 font-bold text-slate-800">{b.expiryDate}</td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                        <Clock size={12} className="text-slate-400" />
                        {b.daysRemaining} Hari
                      </span>
                    </td>
                    <td className="px-4 py-4 font-extrabold text-slate-800">
                      {b.stock} <span className="font-normal text-slate-400">{b.unit}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          b.status === 'critical'
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : b.status === 'warning'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {b.status === 'critical' ? (
                          <>
                            <AlertCircle size={11} /> Kritis (Jual Cepat)
                          </>
                        ) : b.status === 'warning' ? (
                          <>
                            <AlertTriangle size={11} /> Waspada
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={11} /> Aman
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-[#166534] transition"
                          title="Edit Batch"
                        >
                          <Edit2 size={12} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingBatch(b)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition"
                          title="Hapus Batch"
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
        ) : (
          /* Audit Opname Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3.5">Tanggal</th>
                  <th className="px-4 py-3.5">Nomor Batch</th>
                  <th className="px-4 py-3.5">Nama Produk</th>
                  <th className="px-4 py-3.5">Stok Sistem</th>
                  <th className="px-4 py-3.5">Hitung Fisik</th>
                  <th className="px-4 py-3.5">Selisih</th>
                  <th className="px-4 py-3.5">Alasan Penyesuaian</th>
                  <th className="px-6 py-3.5 text-right">Petugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {opnameLogs.map((log) => (
                  <tr key={log.id} className="text-xs transition hover:bg-slate-50/70">
                    <td className="px-6 py-4 text-slate-500 font-mono">{log.date}</td>
                    <td className="px-4 py-4 font-mono font-bold text-[#166534]">{log.batchNumber}</td>
                    <td className="px-4 py-4 font-bold text-slate-800">{log.productName}</td>
                    <td className="px-4 py-4 text-slate-600">{log.systemStock}</td>
                    <td className="px-4 py-4 font-bold text-slate-900">{log.physicalStock}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`font-black ${
                          log.difference < 0 ? 'text-red-600' : log.difference > 0 ? 'text-emerald-700' : 'text-slate-600'
                        }`}
                      >
                        {log.difference > 0 ? `+${log.difference}` : log.difference}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{log.reason}</td>
                    <td className="px-6 py-4 text-right text-slate-500 font-medium">{log.operator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-xs text-slate-400">
          <span>Menampilkan {filteredBatches.length} batch aktif Toko Pusat</span>
        </div>
      </section>

      {/* Stock Opname Modal */}
      {isOpnameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-emerald-50/60">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#166534] text-white">
                  <Scale size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Penyesuaian Stok (Stock Opname)</h3>
                  <p className="text-[11px] text-slate-500">Sinkronisasi hasil hitung fisik rak dengan sistem Toko Pusat</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpnameOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveOpname} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Produk / Batch</label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => {
                    setSelectedBatchId(e.target.value)
                    const found = batches.find((b) => b.id === e.target.value)
                    if (found) setPhysicalCount(found.stock)
                  }}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-[#166534]"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.productName} • Batch: {b.batchNumber} (Stok Sistem: {b.stock} {b.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[11px] font-bold text-slate-500">Stok Sistem Saat Ini</span>
                  <div className="text-xl font-black text-slate-800 mt-0.5">
                    {currentOpnameBatch?.stock} <span className="text-xs font-normal text-slate-400">{currentOpnameBatch?.unit}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500">Selisih Stok</span>
                  <div
                    className={`text-xl font-black mt-0.5 ${
                      currentDiff < 0 ? 'text-red-600' : currentDiff > 0 ? 'text-emerald-700' : 'text-slate-800'
                    }`}
                  >
                    {currentDiff > 0 ? `+${currentDiff}` : currentDiff}{' '}
                    <span className="text-xs font-normal text-slate-400">{currentOpnameBatch?.unit}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hasil Hitung Fisik Sebenarnya</label>
                <input
                  type="number"
                  value={physicalCount}
                  onChange={(e) => setPhysicalCount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 p-3 text-base font-bold text-[#166534] outline-none focus:border-[#166534]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alasan Penyesuaian</label>
                <select
                  value={opnameReason}
                  onChange={(e) => setOpnameReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none"
                >
                  <option value="Koreksi Opname Fisik Rutin">Koreksi Opname Fisik Rutin</option>
                  <option value="Barang Bocor / Rusak di Gudang">Barang Bocor / Rusak di Gudang</option>
                  <option value="Barang Hilang / Selisih Kasir">Barang Hilang / Selisih Kasir</option>
                  <option value="Koreksi Penerimaan Supplier">Koreksi Penerimaan Supplier</option>
                  <option value="Barang Kedaluwarsa Dihapus">Barang Kedaluwarsa Dihapus</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Petugas Pemeriksa</label>
                <input
                  value={opnameOperator}
                  onChange={(e) => setOpnameOperator(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#166534]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOpnameOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#166534] px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800"
                >
                  <ClipboardCheck size={15} /> Simpan Penyesuaian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Batch Modal */}
      {editingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Edit Data Batch</h3>
                <p className="text-[11px] text-slate-400">{editingBatch.productName}</p>
              </div>
              <button
                onClick={() => setEditingBatch(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBatch} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Batch</label>
                <input
                  value={editBatchNumber}
                  onChange={(e) => setEditBatchNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono font-bold outline-none focus:border-[#166534]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Stok Batch ({editingBatch.unit})
                </label>
                <input
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#166534]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Kedaluwarsa</label>
                <input
                  value={editExpiryDate}
                  onChange={(e) => setEditExpiryDate(e.target.value)}
                  placeholder="Contoh: 10 Agu 2025"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#166534]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status FEFO</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as BatchDisplay['status'])}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold outline-none"
                >
                  <option value="safe">Aman (Safe)</option>
                  <option value="warning">Waspada (Warning)</option>
                  <option value="critical">Kritis / Jual Cepat (Critical)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBatch(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#166534] px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800"
                >
                  <Save size={14} /> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingBatch)}
        title="Hapus Data Batch"
        message="Apakah Anda yakin ingin menghapus batch obat pertanian ini dari inventori Toko Pusat?"
        itemName={deletingBatch ? `${deletingBatch.productName} • Batch ${deletingBatch.batchNumber}` : undefined}
        onClose={() => setDeletingBatch(null)}
        onConfirm={handleDeleteBatch}
      />
    </div>
  )
}
