'use client'

import React from 'react'
import Link from 'next/link'
import {
  CircleDollarSign,
  TrendingUp,
  Boxes,
  WalletCards,
  ShoppingCart,
  Truck,
  UserRound,
  Plus,
  ChevronRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  PackageCheck,
  Search,
  ClipboardList,
  Building2,
  ArrowUpRight,
  FileText,
  BadgeAlert,
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { useAuthStore } from '@/stores/use-auth-store'

const chartData = [
  { day: 'Sen', value: 56, label: 'Rp 14,2 jt' },
  { day: 'Sel', value: 72, label: 'Rp 18,5 jt' },
  { day: 'Rab', value: 60, label: 'Rp 15,3 jt' },
  { day: 'Kam', value: 88, label: 'Rp 22,4 jt' },
  { day: 'Jum', value: 76, label: 'Rp 19,8 jt' },
  { day: 'Sab', value: 96, label: 'Rp 26,1 jt' },
  { day: 'Min', value: 68, label: 'Rp 16,3 jt' },
]

const recentReceipts = [
  { id: 'trx-1', no: 'TRX-250519-042', customer: 'Pak Budi Santoso', time: '4 mnt lalu', total: 345000, method: 'Tunai' },
  { id: 'trx-2', no: 'TRX-250519-041', customer: 'Ibu Nurhayati (Poktan)', time: '22 mnt lalu', total: 820000, method: 'QRIS' },
  { id: 'trx-3', no: 'TRX-250519-040', customer: 'Pak Slamet Riyadi', time: '1 jam lalu', total: 1250000, method: 'Piutang Tempo' },
  { id: 'trx-4', no: 'TRX-250519-039', customer: 'Toko Berkah Tani', time: '2 jam lalu', total: 4780000, method: 'Transfer' },
]

const topSellingCashier = [
  { name: 'Decis 25 EC (250 ml)', category: 'Insektisida', sold: '24 botol', revenue: 'Rp 2.040.000' },
  { name: 'Gramoxone 276 SL (1L)', category: 'Herbisida', sold: '18 botol', revenue: 'Rp 1.602.000' },
  { name: 'Roundup 486 SL (1L)', category: 'Herbisida', sold: '15 botol', revenue: 'Rp 1.830.000' },
  { name: 'Antracol 70 WP (1 Kg)', category: 'Fungisida', sold: '12 pack', revenue: 'Rp 1.140.000' },
]

const lowStockItems = [
  { name: 'Gramoxone 276 SL', sku: 'HRB-002', stock: 4, unit: 'Botol', category: 'Herbisida', batch: 'B240105', expiry: '05 Jul 2025', status: 'Kritis (<60 Hari)' },
  { name: 'Decis 25 EC (250 ml)', sku: 'INS-008', stock: 11, unit: 'Botol', category: 'Insektisida', batch: 'B231110', expiry: '10 Agu 2025', status: 'Waspada' },
  { name: 'Antracol 70 WP', sku: 'FGS-014', stock: 7, unit: 'Pack', category: 'Fungisida', batch: 'B240218', expiry: '18 Feb 2027', status: 'Menipis' },
]

const warehouseBatches = [
  { name: 'Gramoxone 276 SL', sku: 'HRB-002', batch: 'B240105', expiry: '05 Jul 2025', daysLeft: '47 Hari', stock: 4, unit: 'Botol', alert: 'KRITIS' },
  { name: 'Decis 25 EC (250 ml)', sku: 'INS-008', batch: 'B231110', expiry: '10 Agu 2025', daysLeft: '83 Hari', stock: 11, unit: 'Botol', alert: 'WASPADA' },
  { name: 'Regent 50 SC (250 ml)', sku: 'INS-003', batch: 'B240218', expiry: '20 Agu 2025', daysLeft: '93 Hari', stock: 64, unit: 'Botol', alert: 'WASPADA' },
]

const supplierPOs = [
  { po: 'PO-250519-012', supplier: 'PT Petro Kimia Tani', date: '19 Mei 2025', due: '02 Jun 2025', total: 19640000, status: 'Dalam Pengiriman' },
  { po: 'PO-250512-008', supplier: 'PT Petro Kimia Tani', date: '12 Mei 2025', due: '26 Mei 2025', total: 23160000, status: 'Diterima Gudang' },
]

export default function DashboardOverviewPage() {
  const { currentUser, store } = useAuthStore()
  const role = currentUser?.role || 'owner'

  // ==========================================
  // 1. DASHBOARD KASIR (ROLE: CASHIER)
  // ==========================================
  if (role === 'cashier') {
    return (
      <div className="space-y-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-[#166534] mb-2">
              <span className="size-2 rounded-full bg-emerald-600 animate-pulse" />
              Sesi Kasir Aktif • Shift Pagi • Toko Pusat
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Halo, {currentUser?.name || 'Kasir'} 👋
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Berikut ringkasan transaksi giliran kasir Anda hari ini di Toko Pusat AgroPOS.
            </p>
          </div>

          <Link
            href="/pos"
            className="inline-flex items-center gap-2 self-start rounded-2xl bg-[#166534] px-6 py-3.5 text-xs font-black text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-800 sm:self-auto hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingCart size={17} /> Buka Layar Kasir POS (F1)
          </Link>
        </div>

        {/* Quick Shortcut Buttons for Cashier */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/pos"
            className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-emerald-200 hover:border-[#166534] shadow-xs transition group"
          >
            <div className="size-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center group-hover:bg-[#166534] group-hover:text-white transition">
              <ShoppingCart size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Transaksi Kasir Baru</div>
              <div className="text-[11px] text-slate-400">Scan barcode & cetak struk</div>
            </div>
          </Link>

          <Link
            href="/produk"
            className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#166534] shadow-xs transition group"
          >
            <div className="size-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-[#166534] group-hover:text-white transition">
              <Search size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Cek Katalog & Harga</div>
              <div className="text-[11px] text-slate-400">Lihat harga jual & kemasan</div>
            </div>
          </Link>

          <Link
            href="/pelanggan"
            className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#166534] shadow-xs transition group"
          >
            <div className="size-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-[#166534] group-hover:text-white transition">
              <UserRound size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Data Pelanggan Petani</div>
              <div className="text-[11px] text-slate-400">Cek nomor kontak & limit piutang</div>
            </div>
          </Link>
        </div>

        {/* 4 Stat Cards Tailored for Cashier */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Transaksi Kasir"
            value="42 Struk"
            detail="Semua transaksi giliran Anda"
            icon={ShoppingCart}
            tone="green"
          />
          <StatCard
            label="Penerimaan Kasir Hari Ini"
            value="Rp 7.360.000"
            detail="Total omzet kasir shift ini"
            icon={CircleDollarSign}
            tone="blue"
          />
          <StatCard
            label="Uang Tunai di Laci Kasir"
            value="Rp 2.450.000"
            detail="Siap disetor saat tutup kasir"
            icon={WalletCards}
            tone="purple"
          />
          <StatCard
            label="Pelanggan Terlayani"
            value="38 Orang"
            detail="Petani perorangan & kelompok tani"
            icon={UserRound}
            tone="amber"
          />
        </div>

        {/* Cashier Two-Panel Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Receipts Panel */}
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Struk Transaksi Terakhir Anda</h3>
                <p className="text-[11px] text-slate-400">Riwayat penjualan yang baru saja diselesaikan</p>
              </div>
              <Link href="/pos" className="text-xs font-bold text-[#166534] hover:underline">
                Buka POS →
              </Link>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {recentReceipts.map((r) => (
                <div key={r.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-xs font-bold text-[#166534]">{r.no}</div>
                    <div className="text-xs text-slate-800 font-semibold">{r.customer}</div>
                    <div className="text-[10px] text-slate-400">{r.time} • Metode: {r.method}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-slate-900">
                      Rp {r.total.toLocaleString('id-ID')}
                    </div>
                    <span className="inline-block mt-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                      Selesai
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Top Selling Today for Cashier */}
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Produk Terlaris Shift Ini</h3>
                <p className="text-[11px] text-slate-400">Paling sering dibeli petani hari ini</p>
              </div>
              <Link href="/produk" className="text-xs font-bold text-[#166534] hover:underline">
                Lihat Katalog →
              </Link>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {topSellingCashier.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-7 rounded-lg bg-emerald-50 text-[#166534] flex items-center justify-center text-xs font-black">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-800">{item.sold}</div>
                    <div className="text-[10px] font-semibold text-emerald-700">{item.revenue}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    )
  }

  // ==========================================
  // 2. DASHBOARD GUDANG (ROLE: WAREHOUSE)
  // ==========================================
  if (role === 'warehouse') {
    return (
      <div className="space-y-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-900 mb-2">
              <Boxes size={14} className="text-amber-700" />
              Operasional Gudang & Tata Kelola Batch FEFO Toko Pusat
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Halo, {currentUser?.name || 'Staf Gudang'} 📦
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Pantau kondisi fisik stok, rotasi obat FEFO (First-Expired First-Out), dan jadwal stock opname.
            </p>
          </div>

          <Link
            href="/inventori"
            className="inline-flex items-center gap-2 self-start rounded-2xl bg-[#166534] px-6 py-3.5 text-xs font-black text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-800 sm:self-auto"
          >
            <Boxes size={17} /> Buka Inventori & FEFO
          </Link>
        </div>

        {/* 4 Stat Cards Tailored for Warehouse */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Stok Fisik Gudang"
            value="1.840 Unit"
            detail="505 macam produk & batch aktif"
            icon={Boxes}
            tone="blue"
          />
          <StatCard
            label="Batch Kritis (<60 Hari)"
            value="1 Batch (4 Botol)"
            detail="Prioritas keluarkan ke rak depan kasir"
            icon={AlertTriangle}
            tone="green" // red/urgent tone
          />
          <StatCard
            label="Batch Waspada (<120 Hari)"
            value="2 Batch (149 Item)"
            detail="Perlu pemantauan berkala"
            icon={Clock}
            tone="amber"
          />
          <StatCard
            label="Jadwal Stock Opname"
            value="2 Rak Fisik"
            detail="Perlu verifikasi fisik vs sistem"
            icon={ClipboardList}
            tone="purple"
          />
        </div>

        {/* Quick Shortcut Buttons for Warehouse */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/inventori"
            className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#166534] shadow-xs transition group"
          >
            <div className="size-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center group-hover:bg-[#166534] group-hover:text-white transition">
              <Boxes size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Penyesuaian Stok (Opname)</div>
              <div className="text-[11px] text-slate-400">Koreksi fisik vs sistem</div>
            </div>
          </Link>

          <Link
            href="/pembelian"
            className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#166534] shadow-xs transition group"
          >
            <div className="size-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-[#166534] group-hover:text-white transition">
              <Truck size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Penerimaan Barang PO</div>
              <div className="text-[11px] text-slate-400">Terima kiriman dari supplier</div>
            </div>
          </Link>

          <Link
            href="/produk"
            className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#166534] shadow-xs transition group"
          >
            <div className="size-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-[#166534] group-hover:text-white transition">
              <Search size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Cek Master Barang</div>
              <div className="text-[11px] text-slate-400">SKU, kemasan & barcode</div>
            </div>
          </Link>
        </div>

        {/* Warehouse Two-Panel Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Urgent FEFO Batches */}
          <section className="rounded-3xl border border-red-200/80 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-red-100">
              <div>
                <h3 className="font-bold text-red-950 text-sm flex items-center gap-1.5">
                  <AlertTriangle size={15} className="text-red-600" />
                  Alarm Batch Mendekati Kedaluwarsa (FEFO)
                </h3>
                <p className="text-[11px] text-red-600/80">Wajib didahulukan dijual ke kasir sebelum ED</p>
              </div>
              <Link href="/inventori" className="text-xs font-bold text-red-700 hover:underline">
                Kelola Batch →
              </Link>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {warehouseBatches.map((b, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{b.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Batch: {b.batch} • Exp: {b.expiry}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      b.alert === 'KRITIS' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.daysLeft} ({b.stock} {b.unit})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Opname Log summary */}
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Aktivitas Gudang & Opname</h3>
                <p className="text-[11px] text-slate-400">Verifikasi fisik rak terkini</p>
              </div>
              <Link href="/inventori" className="text-xs font-bold text-[#166534] hover:underline">
                Lihat Log →
              </Link>
            </div>

            <div className="divide-y divide-slate-100 mt-2 text-xs">
              <div className="py-3">
                <div className="font-semibold text-slate-800">Opname Batch B240301 (Roundup 486 SL)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Fisik 48 botol • Selisih 0 (Sesuai) • 18 Mei 2025</div>
              </div>
              <div className="py-3">
                <div className="font-semibold text-slate-800">Opname Batch B240218 (Antracol 70 WP)</div>
                <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Fisik 87 pack • Selisih +2 pack • 10 Mei 2025</div>
              </div>
              <div className="py-3">
                <div className="font-semibold text-slate-800">Penerimaan PO-250512-008 dari Supplier</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Barang diperiksa lengkap dan masuk rak gudang</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }

  // ==========================================
  // 3. DASHBOARD SUPPLIER (ROLE: SUPPLIER)
  // ==========================================
  if (role === 'supplier') {
    return (
      <div className="space-y-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-[11px] font-bold text-purple-900 mb-2">
              <Truck size={14} className="text-purple-700" />
              Portal Mitra Supplier • Toko Pusat AgroPOS
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Halo, {currentUser?.name || 'Mitra Supplier'} 🚚
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Pantau purchase order yang diterbitkan oleh Toko Pusat, status pengiriman armada, dan faktur.
            </p>
          </div>

          <Link
            href="/pembelian"
            className="inline-flex items-center gap-2 self-start rounded-2xl bg-[#166534] px-6 py-3.5 text-xs font-black text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-800 sm:self-auto"
          >
            <ClipboardList size={17} /> Lihat Purchase Order Saya
          </Link>
        </div>

        {/* 4 Stat Cards Tailored for Supplier */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="PO Aktif Bulan Ini"
            value="3 Dokumen"
            detail="Pesanan obat pertanian resmi"
            icon={ClipboardList}
            tone="green"
          />
          <StatCard
            label="Menunggu Pengiriman"
            value="1 Pesanan"
            detail="Sedang dipersiapkan armada"
            icon={Truck}
            tone="amber"
          />
          <StatCard
            label="Total Nilai Pengadaan"
            value="Rp 42,8 jt"
            detail="Akumulasi pesanan Toko Pusat"
            icon={CircleDollarSign}
            tone="purple"
          />
          <StatCard
            label="Status Pembayaran"
            value="Lancar (Tempo)"
            detail="Termin pembayaran 30 hari"
            icon={WalletCards}
            tone="blue"
          />
        </div>

        {/* Supplier Two-Panel Layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Supplier Active POs */}
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Purchase Order Toko Pusat</h3>
                <p className="text-[11px] text-slate-400">Daftar pesanan pengadaan terbaru</p>
              </div>
              <Link href="/pembelian" className="text-xs font-bold text-[#166534] hover:underline">
                Buka Semua PO →
              </Link>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {supplierPOs.map((po, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-xs font-bold text-[#166534]">{po.po}</div>
                    <div className="text-xs text-slate-800 font-semibold mt-0.5">
                      Tanggal: {po.date} • Jatuh Tempo: {po.due}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-900">
                      Rp {po.total.toLocaleString('id-ID')}
                    </div>
                    <span className={`inline-block mt-0.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      po.status === 'Diterima Gudang' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {po.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Supplier Info & Delivery Guideline */}
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Informasi Gudang & Pengiriman</h3>
              <p className="text-[11px] text-slate-400">Tujuan pengantaran barang pesanan Toko Pusat</p>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">Alamat Gudang Toko Pusat:</div>
                <p>Jl. Raya Pertanian No. 18, Dramaga, Kab. Bogor, Jawa Barat 16610</p>
                <p className="text-[11px] text-slate-500 mt-1">PIC Gudang: Dedi Pratama (WA: 0812-8899-7711)</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <div className="font-bold text-emerald-950 mb-1">Ketentuan Penerimaan Batch Obat:</div>
                <p className="text-emerald-900">
                  Semua produk pestisida & benih wajib menyertakan dokumen Certificate of Analysis (CoA) dan memiliki tanggal kedaluwarsa minimal 18 bulan saat diterima.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }

  // ==========================================
  // 4. DASHBOARD OWNER & ADMIN (EXECUTIVE VIEW)
  // ==========================================
  return (
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#166534]">
            {store.name} • Kasir & Ringkasan Operasional Eksekutif
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Selamat datang, {currentUser?.name || 'Owner'}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Berikut ringkasan performa penjualan kasir, stok obat pertanian, dan arus kas Toko Pusat.
          </p>
        </div>

        <Link
          href="/pos"
          className="inline-flex items-center gap-2 self-start rounded-2xl bg-[#166534] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800 sm:self-auto"
        >
          <Plus size={16} /> Buka Kasir POS Baru
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Penjualan Hari Ini"
          value="Rp 18.450.000"
          detail="42 transaksi kasir berhasil"
          icon={CircleDollarSign}
          trend="12,5%"
          tone="green"
        />
        <StatCard
          label="Laba Kotor"
          value="Rp 5.240.000"
          detail="Margin operasional 28,4%"
          icon={TrendingUp}
          trend="8,2%"
          tone="blue"
        />
        <StatCard
          label="Total Katalog Produk"
          value="1.248"
          detail="8 produk stok kritis / expired"
          icon={Boxes}
          trend="2,4%"
          tone="purple"
        />
        <StatCard
          label="Total Saldo Kas & Bank"
          value="Rp 284,6 jt"
          detail="Brankas kasir & bank Toko Pusat"
          icon={WalletCards}
          tone="green"
        />
      </div>

      {/* Main Section: Chart & Side Panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Sales Chart */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card lg:col-span-2">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">Grafik Penjualan Toko Pusat</h2>
              <p className="mt-0.5 text-xs text-slate-400">Tren omzet 7 hari terakhir</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Rata-rata Rp 18,9 jt/hari
              </span>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="mt-8 flex h-52 items-end justify-between gap-2 sm:gap-4 px-2">
            {chartData.map((item) => (
              <div key={item.day} className="group flex flex-1 flex-col items-center gap-2">
                <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 text-[10px] font-bold text-[#166534] bg-emerald-50 px-1.5 py-0.5 rounded">
                  {item.label}
                </span>
                <div
                  className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-[#166534] to-emerald-500 transition-all duration-300 group-hover:brightness-110"
                  style={{ height: `${item.value * 1.8}px` }}
                />
                <span className="text-xs font-semibold text-slate-500">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: FEFO Expiry & Critical Stock Alert */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle size={17} className="text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Alarm Kedaluwarsa (FEFO)</h3>
              </div>
              <Link href="/inventori" className="text-xs font-bold text-[#166534] hover:underline">
                Kelola Stok
              </Link>
            </div>

            <div className="mt-3 space-y-3">
              {lowStockItems.map((item) => (
                <div key={item.sku} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition">
                  <div>
                    <div className="text-xs font-bold text-slate-800">{item.name}</div>
                    <div className="text-[10px] text-slate-400">
                      Batch {item.batch} • Exp: {item.expiry}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-red-600 block">
                      {item.stock} {item.unit}
                    </span>
                    <span className="text-[9px] font-bold uppercase text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              href="/inventori"
              className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-emerald-50 py-2.5 text-xs font-bold text-[#166534] hover:bg-emerald-100 transition"
            >
              Lihat Seluruh Batch Kedaluwarsa <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
