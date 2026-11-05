'use client'

import React, { useState, useEffect } from 'react'
import {
  ClipboardList,
  Truck,
  WalletCards,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  PackageCheck,
  Edit2,
  Trash2,
  X,
  Save,
  ShoppingBag,
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'
import { mockPurchaseOrders, mockSuppliers, mockProducts } from '@/lib/mock-data'
import { useAppStore } from '@/stores/use-app-store'
import { PurchaseOrder, PurchaseOrderItem } from '@/types/purchase'
import { exportToCsv } from '@/lib/export-csv'

export default function PembelianPage() {
  const { addToast } = useAppStore()
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders)
  const [activeTab, setActiveTab] = useState('Semua PO')
  const [search, setSearch] = useState('')

  // State for Create PO Modal
  const [isCreatePoOpen, setIsCreatePoOpen] = useState(false)
  const [selectedSupplierId, setSelectedSupplierId] = useState(mockSuppliers[0]?.id || '')
  const [poOrderDate, setPoOrderDate] = useState('2025-05-19')
  const [poDueDate, setPoDueDate] = useState('2025-06-02')

  useEffect(() => {
    setPoOrderDate(new Date().toISOString().slice(0, 10))
    setPoDueDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))
  }, [])
  const [poItems, setPoItems] = useState<
    Array<{ productId: string; productName: string; quantity: number; unit: string; costPrice: number }>
  >([
    {
      productId: mockProducts[0]?.id || 'prod-001',
      productName: mockProducts[0]?.name || 'Roundup 486 SL',
      quantity: 50,
      unit: mockProducts[0]?.unit || 'Botol',
      costPrice: mockProducts[0]?.costPrice || 102000,
    },
  ])

  // State for Edit and Delete
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null)
  const [deletingOrder, setDeletingOrder] = useState<PurchaseOrder | null>(null)

  // Edit form state
  const [editTotal, setEditTotal] = useState<number>(0)
  const [editDeliveryStatus, setEditDeliveryStatus] = useState<PurchaseOrder['deliveryStatus']>('received')
  const [editPaymentStatus, setEditPaymentStatus] = useState<PurchaseOrder['paymentStatus']>('paid')

  const handleOpenEdit = (po: PurchaseOrder) => {
    setEditingOrder(po)
    setEditTotal(po.totalAmount)
    setEditDeliveryStatus(po.deliveryStatus)
    setEditPaymentStatus(po.paymentStatus)
  }

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingOrder) return

    setOrders(
      orders.map((o) =>
        o.id === editingOrder.id
          ? {
              ...o,
              totalAmount: editTotal,
              deliveryStatus: editDeliveryStatus,
              paymentStatus: editPaymentStatus,
            }
          : o
      )
    )

    addToast(`Purchase Order ${editingOrder.poNumber} berhasil diperbarui!`, 'success')
    setEditingOrder(null)
  }

  const handleDeleteOrder = () => {
    if (!deletingOrder) return
    setOrders(orders.filter((o) => o.id !== deletingOrder.id))
    addToast(`Purchase Order ${deletingOrder.poNumber} berhasil dihapus!`, 'info')
    setDeletingOrder(null)
  }

  // Handle Create PO
  const handleAddItemRow = () => {
    const defaultProd = mockProducts[0]
    setPoItems([
      ...poItems,
      {
        productId: defaultProd.id,
        productName: defaultProd.name,
        quantity: 10,
        unit: defaultProd.unit,
        costPrice: defaultProd.costPrice,
      },
    ])
  }

  const handleRemoveItemRow = (index: number) => {
    if (poItems.length === 1) return
    setPoItems(poItems.filter((_, i) => i !== index))
  }

  const handleProductChange = (index: number, prodId: string) => {
    const prod = mockProducts.find((p) => p.id === prodId)
    if (!prod) return
    const updated = [...poItems]
    updated[index] = {
      productId: prod.id,
      productName: prod.name,
      quantity: updated[index].quantity,
      unit: prod.unit,
      costPrice: prod.costPrice,
    }
    setPoItems(updated)
  }

  const handleQuantityChange = (index: number, qty: number) => {
    const updated = [...poItems]
    updated[index].quantity = Math.max(1, qty)
    setPoItems(updated)
  }

  const handleCostPriceChange = (index: number, price: number) => {
    const updated = [...poItems]
    updated[index].costPrice = Math.max(0, price)
    setPoItems(updated)
  }

  const poCalculatedTotal = poItems.reduce((acc, it) => acc + it.quantity * it.costPrice, 0)

  const handleCreatePoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const supplier = mockSuppliers.find((s) => s.id === selectedSupplierId) || mockSuppliers[0]
    const randomDigits = Math.floor(100 + Math.random() * 900)
    const newPoNumber = `PO-${poOrderDate.replace(/-/g, '').slice(2)}-${randomDigits}`

    const formattedItems: PurchaseOrderItem[] = poItems.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unit: item.unit,
      costPrice: item.costPrice,
      subtotal: item.quantity * item.costPrice,
    }))

    const newOrder: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: newPoNumber,
      supplierId: supplier.id,
      supplierName: supplier.name,
      branchName: 'Toko Pusat',
      items: formattedItems,
      totalAmount: poCalculatedTotal,
      paymentStatus: 'unpaid',
      deliveryStatus: 'ordered',
      orderDate: poOrderDate,
      dueDate: poDueDate,
    }

    setOrders([newOrder, ...orders])
    addToast(`Purchase Order ${newPoNumber} untuk ${supplier.name} berhasil dibuat!`, 'success')
    setIsCreatePoOpen(false)
  }

  // Handle Export CSV
  const handleExportData = () => {
    const headers = [
      'Nomor PO',
      'Supplier',
      'Unit Toko',
      'Macam Barang',
      'Tanggal Order',
      'Jatuh Tempo',
      'Total Nominal (Rp)',
      'Status Barang',
      'Status Pembayaran',
    ]

    const rows = filteredOrders.map((o) => [
      o.poNumber,
      o.supplierName,
      o.branchName,
      `${o.items.length} Macam`,
      o.orderDate,
      o.dueDate || '-',
      o.totalAmount,
      o.deliveryStatus === 'received' ? 'Diterima Gudang' : 'Dalam Pengiriman',
      o.paymentStatus === 'paid' ? 'Lunas' : o.paymentStatus === 'partial' ? 'DP Sebagian' : 'Belum Bayar',
    ])

    const dateStr = new Date().toISOString().slice(0, 10)
    exportToCsv(`Purchase_Order_AgroPOS_Toko_Pusat_${dateStr}`, headers, rows)
    addToast('Data Purchase Order Toko Pusat berhasil diekspor ke Excel!', 'success')
  }

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.supplierName.toLowerCase().includes(search.toLowerCase())

    if (activeTab === 'Menunggu Barang') return matchesSearch && o.deliveryStatus !== 'received'
    if (activeTab === 'Diterima Gudang') return matchesSearch && o.deliveryStatus === 'received'
    if (activeTab === 'Lunas') return matchesSearch && o.paymentStatus === 'paid'
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#166534]">Purchasing & Pengadaan Toko Pusat</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Pembelian & Purchase Order
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Kelola pesanan ke distributor pabrik obat pertanian, penerimaan barang Toko Pusat, dan faktur hutang.
          </p>
        </div>

        <button
          onClick={() => setIsCreatePoOpen(true)}
          className="inline-flex items-center gap-2 self-start rounded-2xl bg-[#166534] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800 sm:self-auto"
        >
          <Plus size={16} /> Buat Purchase Order (PO)
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="PO Bulan Berjalan"
          value={`${orders.length} Dokumen`}
          detail={`Total nilai Rp ${(orders.reduce((acc, curr) => acc + curr.totalAmount, 0) / 1000000).toFixed(1)} juta`}
          icon={ClipboardList}
          tone="green"
        />
        <StatCard
          label="Menunggu Pengiriman"
          value={`${orders.filter((o) => o.deliveryStatus !== 'received').length} Pesanan`}
          detail="Distributor sedang memproses pengiriman"
          icon={Truck}
          tone="amber"
        />
        <StatCard
          label="Faktur Hutang Supplier"
          value="Rp 42,8 jt"
          detail="Jatuh tempo dalam 30 hari"
          icon={WalletCards}
          tone="purple"
        />
      </div>

      <section className="rounded-3xl border border-slate-200/80 bg-white shadow-card overflow-hidden">
        <div className="border-b border-slate-100 px-6 pt-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {['Semua PO', 'Menunggu Barang', 'Diterima Gudang', 'Lunas'].map((tab) => (
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

        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex h-11 w-full max-w-sm items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 focus-within:border-emerald-500 focus-within:bg-white">
            <Search size={16} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nomor PO atau nama supplier..."
              className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => addToast('Filter status ditampilkan')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              <Filter size={14} /> Filter
            </button>
            <button
              onClick={handleExportData}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-[#166534] hover:bg-emerald-50 hover:border-emerald-400 transition"
            >
              <Download size={14} /> Ekspor Data
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-3.5">Nomor PO</th>
                <th className="px-4 py-3.5">Supplier</th>
                <th className="px-4 py-3.5">Item Barang</th>
                <th className="px-4 py-3.5">Tanggal</th>
                <th className="px-4 py-3.5">Total Nominal</th>
                <th className="px-4 py-3.5">Status Barang</th>
                <th className="px-4 py-3.5">Status Bayar</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((po) => (
                <tr key={po.id} className="text-xs transition hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-mono font-bold text-[#166534]">{po.poNumber}</td>
                  <td className="px-4 py-4 font-semibold text-slate-800">{po.supplierName}</td>
                  <td className="px-4 py-4 text-slate-600">{po.items.length} Macam Produk</td>
                  <td className="px-4 py-4 text-slate-400">{po.orderDate}</td>
                  <td className="px-4 py-4 font-extrabold text-slate-900">
                    Rp {po.totalAmount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        po.deliveryStatus === 'received'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {po.deliveryStatus === 'received' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                      {po.deliveryStatus === 'received' ? 'Diterima' : 'Dalam Pengiriman'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        po.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : po.paymentStatus === 'partial'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {po.paymentStatus === 'paid' ? 'Lunas' : po.paymentStatus === 'partial' ? 'DP Sebagian' : 'Belum Bayar'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(po)}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-[#166534] transition"
                        title="Edit PO"
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeletingOrder(po)}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition"
                        title="Hapus PO"
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

      {/* Create PO Modal */}
      {isCreatePoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Buat Purchase Order (PO) Baru</h3>
                <p className="text-[11px] text-slate-400">Pengadaan barang dari distributor ke Toko Pusat AgroPOS</p>
              </div>
              <button
                onClick={() => setIsCreatePoOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePoSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Supplier / Distributor</label>
                  <select
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-[#166534]"
                  >
                    {mockSuppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Pesanan</label>
                  <input
                    type="date"
                    value={poOrderDate}
                    onChange={(e) => setPoOrderDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-[#166534]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimasi Jatuh Tempo</label>
                  <input
                    type="date"
                    value={poDueDate}
                    onChange={(e) => setPoDueDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-[#166534]"
                    required
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Daftar Barang yang Dipesan</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#166534] hover:underline"
                  >
                    <Plus size={13} /> Tambah Baris Barang
                  </button>
                </div>

                <div className="space-y-2.5">
                  {poItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200"
                    >
                      <div className="w-full sm:flex-1">
                        <select
                          value={item.productId}
                          onChange={(e) => handleProductChange(idx, e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold outline-none"
                        >
                          {mockProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.sku})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="w-24">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(idx, Number(e.target.value))}
                            placeholder="Qty"
                            className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-center outline-none"
                            title="Jumlah Pesanan"
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400 w-12">{item.unit}</span>

                        <div className="w-32">
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            value={item.costPrice}
                            onChange={(e) => handleCostPriceChange(idx, Number(e.target.value))}
                            placeholder="Harga Beli"
                            className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-right outline-none"
                            title="Harga Beli Satuan"
                          />
                        </div>

                        <div className="w-28 text-right font-bold text-xs text-slate-900">
                          Rp {(item.quantity * item.costPrice).toLocaleString('id-ID')}
                        </div>

                        {poItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(idx)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                            title="Hapus baris"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary and Submit */}
              <div className="rounded-2xl bg-emerald-50/70 p-4 border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-900">Total Nilai Purchase Order</div>
                  <div className="text-[11px] text-emerald-700">Toko Pusat • Pembayaran Tempo Standar</div>
                </div>
                <div className="text-xl font-black text-[#166534]">
                  Rp {poCalculatedTotal.toLocaleString('id-ID')}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreatePoOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#166534] px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 shadow-md shadow-emerald-950/10"
                >
                  <Save size={14} /> Terbitkan PO Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit PO Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Edit Purchase Order</h3>
                <p className="text-[11px] text-slate-400">{editingOrder.poNumber} • {editingOrder.supplierName}</p>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Nominal Pembelian (Rp)</label>
                <input
                  type="number"
                  value={editTotal}
                  onChange={(e) => setEditTotal(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-[#166534] outline-none focus:border-[#166534]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Pengiriman Barang</label>
                <select
                  value={editDeliveryStatus}
                  onChange={(e) => setEditDeliveryStatus(e.target.value as PurchaseOrder['deliveryStatus'])}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none"
                >
                  <option value="draft">Draft Pesanan</option>
                  <option value="ordered">Dalam Pengiriman (Ordered)</option>
                  <option value="received">Diterima Gudang (Received)</option>
                  <option value="returned">Retur (Returned)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Pembayaran</label>
                <select
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value as PurchaseOrder['paymentStatus'])}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none"
                >
                  <option value="unpaid">Belum Dibayar (Unpaid)</option>
                  <option value="partial">Uang Muka / Sebagian (Partial)</option>
                  <option value="paid">Lunas (Paid)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
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
        isOpen={Boolean(deletingOrder)}
        title="Hapus Purchase Order"
        message="Apakah Anda yakin ingin membatalkan dan menghapus PO pembelian ini dari sistem Toko Pusat?"
        itemName={deletingOrder ? `${deletingOrder.poNumber} • ${deletingOrder.supplierName}` : undefined}
        onClose={() => setDeletingOrder(null)}
        onConfirm={handleDeleteOrder}
      />
    </div>
  )
}
