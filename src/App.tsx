import { FormEvent, useEffect, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  AlertTriangle,
  Bell,
  Boxes,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Download,
  Eye,
  EyeOff,
  FileBarChart,
  Filter,
  HelpCircle,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  Minus,
  MoreHorizontal,
  PackageSearch,
  Plus,
  Printer,
  ReceiptText,
  Save,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Store,
  TrendingUp,
  Truck,
  UserRound,
  UsersRound,
  WalletCards,
  X,
} from 'lucide-react'

type NavItem = {
  label: string
  icon: typeof LayoutDashboard
  badge?: string
}

type PageName = NavItem['label']

type ModuleConfig = {
  title: string
  eyebrow: string
  description: string
  action: string
  stats: { label: string; value: string; detail: string; icon: typeof Store; tone: string }[]
  columns: string[]
  rows: string[][]
  tabs: string[]
}

const navigation: { label: string; items: NavItem[] }[] = [
  {
    label: 'UTAMA',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard },
      { label: 'Point of Sale', icon: ShoppingCart },
    ],
  },
  {
    label: 'OPERASIONAL',
    items: [
      { label: 'Produk', icon: PackageSearch },
      { label: 'Inventori', icon: Boxes, badge: '8' },
      { label: 'Pembelian', icon: ClipboardList },
      { label: 'Supplier', icon: Truck },
      { label: 'Pelanggan', icon: UsersRound },
    ],
  },
  {
    label: 'KEUANGAN',
    items: [
      { label: 'Keuangan', icon: WalletCards },
      { label: 'Laporan', icon: FileBarChart },
    ],
  },
  {
    label: 'SISTEM',
    items: [
      { label: 'Pengguna & Akses', icon: ShieldCheck },
      { label: 'Pengaturan', icon: Settings },
    ],
  },
]

const chartData = [
  { day: 'Sen', value: 56 },
  { day: 'Sel', value: 72 },
  { day: 'Rab', value: 60 },
  { day: 'Kam', value: 88 },
  { day: 'Jum', value: 76 },
  { day: 'Sab', value: 96 },
  { day: 'Min', value: 68 },
]

const lowStock = [
  { name: 'Roundup 486 SL', sku: 'HRB-001', stock: 4, unit: 'Botol', branch: 'Toko Pusat' },
  { name: 'Antracol 70 WP', sku: 'FGS-014', stock: 7, unit: 'Pack', branch: 'Cabang Utara' },
  { name: 'NPK Mutiara 16-16-16', sku: 'PPK-021', stock: 9, unit: 'Sak', branch: 'Toko Pusat' },
  { name: 'Decis 25 EC', sku: 'INS-008', stock: 11, unit: 'Botol', branch: 'Cabang Selatan' },
]

const activities = [
  { icon: ShoppingCart, title: 'Transaksi #TRX-240519-042', detail: 'Budi Santoso • Rp 1.250.000', time: '4 menit lalu', tone: 'green' },
  { icon: Boxes, title: 'Stok produk diperbarui', detail: 'Roundup 486 SL • +24 botol', time: '18 menit lalu', tone: 'blue' },
  { icon: Truck, title: 'PO #PO-240519-012 diterima', detail: 'PT Agro Makmur Indonesia', time: '42 menit lalu', tone: 'amber' },
  { icon: UserRound, title: 'Pengguna baru ditambahkan', detail: 'Rina Wulandari • Kasir', time: '1 jam lalu', tone: 'purple' },
]

const moduleConfigs: Record<string, ModuleConfig> = {
  Produk: {
    title: 'Manajemen Produk',
    eyebrow: 'Katalog',
    description: 'Kelola produk, kategori, satuan, harga jual, dan informasi pajak.',
    action: 'Tambah Produk',
    stats: [
      { label: 'Total Produk', value: '1.248', detail: '1.186 produk aktif', icon: PackageSearch, tone: 'green' },
      { label: 'Kategori', value: '18', detail: 'Herbisida terlaris', icon: Boxes, tone: 'blue' },
      { label: 'Nilai Persediaan', value: 'Rp 486,2 jt', detail: 'Semua cabang', icon: CircleDollarSign, tone: 'purple' },
    ],
    columns: ['Produk', 'Kategori', 'Harga Jual', 'Stok', 'Status'],
    rows: [
      ['Roundup 486 SL', 'Herbisida', 'Rp 128.000', '124 Botol', 'Aktif'],
      ['Antracol 70 WP', 'Fungisida', 'Rp 92.500', '87 Pack', 'Aktif'],
      ['NPK Mutiara 16-16-16', 'Pupuk', 'Rp 585.000', '63 Sak', 'Aktif'],
      ['Decis 25 EC', 'Insektisida', 'Rp 76.000', '42 Botol', 'Aktif'],
      ['Benih Jagung BISI-18', 'Benih', 'Rp 112.000', '0 Pack', 'Habis'],
    ],
    tabs: ['Semua Produk', 'Aktif', 'Stok Habis', 'Arsip'],
  },
  Inventori: {
    title: 'Inventori & Batch',
    eyebrow: 'Operasional',
    description: 'Pantau stok per cabang, batch, tanggal kedaluwarsa, dan alokasi FEFO.',
    action: 'Penyesuaian Stok',
    stats: [
      { label: 'Total Unit', value: '24.680', detail: 'Di 3 cabang', icon: Boxes, tone: 'green' },
      { label: 'Stok Menipis', value: '8', detail: 'Perlu restock', icon: AlertTriangle, tone: 'amber' },
      { label: 'Akan Kedaluwarsa', value: '14', detail: 'Dalam 90 hari', icon: CalendarDays, tone: 'purple' },
    ],
    columns: ['Produk / Batch', 'Cabang', 'Tanggal Masuk', 'Kedaluwarsa', 'Stok'],
    rows: [
      ['Roundup 486 SL • B240301', 'Toko Pusat', '01 Mar 2025', '01 Mar 2027', '48 Botol'],
      ['Antracol 70 WP • B240218', 'Cabang Utara', '18 Feb 2025', '18 Feb 2027', '32 Pack'],
      ['NPK Mutiara • B250406', 'Toko Pusat', '06 Apr 2025', '06 Apr 2028', '28 Sak'],
      ['Decis 25 EC • B231110', 'Cabang Selatan', '10 Nov 2024', '10 Agu 2025', '11 Botol'],
      ['Gramoxone • B240105', 'Cabang Utara', '05 Jan 2025', '05 Jul 2025', '4 Botol'],
    ],
    tabs: ['Ringkasan Stok', 'Per Batch', 'Kedaluwarsa', 'Mutasi Stok'],
  },
  Pembelian: {
    title: 'Pembelian',
    eyebrow: 'Purchasing',
    description: 'Kelola purchase order, penerimaan barang, dan tagihan supplier.',
    action: 'Buat Purchase Order',
    stats: [
      { label: 'PO Bulan Ini', value: '28', detail: 'Rp 184,5 juta', icon: ClipboardList, tone: 'green' },
      { label: 'Menunggu Barang', value: '6', detail: '3 lewat estimasi', icon: Truck, tone: 'amber' },
      { label: 'Tagihan Supplier', value: 'Rp 42,8 jt', detail: 'Jatuh tempo bulan ini', icon: WalletCards, tone: 'purple' },
    ],
    columns: ['Nomor PO', 'Supplier', 'Tanggal', 'Total', 'Status'],
    rows: [
      ['PO-250519-012', 'PT Agro Makmur Indonesia', '19 Mei 2025', 'Rp 24.600.000', 'Diterima'],
      ['PO-250518-011', 'CV Tani Sejahtera', '18 Mei 2025', 'Rp 12.850.000', 'Dikirim'],
      ['PO-250516-010', 'PT Pupuk Nusantara', '16 Mei 2025', 'Rp 38.200.000', 'Diproses'],
      ['PO-250514-009', 'UD Berkah Benih', '14 Mei 2025', 'Rp 8.750.000', 'Draft'],
      ['PO-250510-008', 'PT Agro Makmur Indonesia', '10 Mei 2025', 'Rp 17.420.000', 'Diterima'],
    ],
    tabs: ['Semua PO', 'Draft', 'Diproses', 'Selesai'],
  },
  Supplier: {
    title: 'Supplier',
    eyebrow: 'Mitra Bisnis',
    description: 'Kelola data supplier, performa pengiriman, dan saldo hutang.',
    action: 'Tambah Supplier',
    stats: [
      { label: 'Supplier Aktif', value: '36', detail: '8 supplier utama', icon: Truck, tone: 'green' },
      { label: 'Ketepatan Kirim', value: '94,8%', detail: 'Naik 2,4% bulan ini', icon: TrendingUp, tone: 'blue' },
      { label: 'Total Hutang', value: 'Rp 42,8 jt', detail: '5 invoice terbuka', icon: WalletCards, tone: 'amber' },
    ],
    columns: ['Supplier', 'Kontak', 'Kategori', 'Total Transaksi', 'Status'],
    rows: [
      ['PT Agro Makmur Indonesia', '021-8892-4401', 'Pestisida', 'Rp 284.500.000', 'Aktif'],
      ['CV Tani Sejahtera', '0812-4456-7788', 'Pupuk', 'Rp 192.800.000', 'Aktif'],
      ['PT Pupuk Nusantara', '021-5571-3290', 'Pupuk', 'Rp 178.420.000', 'Aktif'],
      ['UD Berkah Benih', '0813-9912-4402', 'Benih', 'Rp 96.750.000', 'Aktif'],
      ['CV Sumber Tani', '0821-7789-1300', 'Alat Pertanian', 'Rp 48.200.000', 'Tinjau'],
    ],
    tabs: ['Semua Supplier', 'Aktif', 'Perlu Ditinjau'],
  },
  Pelanggan: {
    title: 'Pelanggan',
    eyebrow: 'CRM',
    description: 'Kelola profil pelanggan, riwayat belanja, poin, dan piutang.',
    action: 'Tambah Pelanggan',
    stats: [
      { label: 'Total Pelanggan', value: '2.486', detail: '128 baru bulan ini', icon: UsersRound, tone: 'green' },
      { label: 'Pelanggan Aktif', value: '1.840', detail: '74% dari total', icon: UserRound, tone: 'blue' },
      { label: 'Total Piutang', value: 'Rp 12,85 jt', detail: '18 pelanggan', icon: WalletCards, tone: 'amber' },
    ],
    columns: ['Pelanggan', 'Telepon', 'Tipe', 'Total Belanja', 'Status'],
    rows: [
      ['Budi Santoso', '0812-3456-7788', 'Petani', 'Rp 28.450.000', 'Aktif'],
      ['Kelompok Tani Mekar', '0813-2288-1190', 'Kelompok', 'Rp 84.200.000', 'Aktif'],
      ['Siti Aminah', '0821-5521-8802', 'Petani', 'Rp 16.750.000', 'Aktif'],
      ['Kios Tani Jaya', '0852-9901-3377', 'Reseller', 'Rp 126.800.000', 'Prioritas'],
      ['Agus Setiawan', '0819-4420-1192', 'Petani', 'Rp 8.420.000', 'Piutang'],
    ],
    tabs: ['Semua Pelanggan', 'Aktif', 'Piutang', 'Member'],
  },
  Keuangan: {
    title: 'Keuangan',
    eyebrow: 'Finance',
    description: 'Pantau arus kas, pengeluaran, hutang, piutang, dan laba rugi.',
    action: 'Catat Pengeluaran',
    stats: [
      { label: 'Kas & Bank', value: 'Rp 284,6 jt', detail: '3 rekening aktif', icon: WalletCards, tone: 'green' },
      { label: 'Pendapatan', value: 'Rp 486,2 jt', detail: 'Bulan berjalan', icon: ArrowUpRight, tone: 'blue' },
      { label: 'Pengeluaran', value: 'Rp 318,4 jt', detail: 'Bulan berjalan', icon: ArrowDownRight, tone: 'amber' },
    ],
    columns: ['Transaksi', 'Kategori', 'Tanggal', 'Nominal', 'Status'],
    rows: [
      ['Penjualan POS #042', 'Penjualan', '19 Mei 2025', '+ Rp 1.250.000', 'Selesai'],
      ['Pembelian PO #012', 'Pembelian', '19 Mei 2025', '- Rp 24.600.000', 'Selesai'],
      ['Biaya Listrik Mei', 'Operasional', '18 Mei 2025', '- Rp 2.840.000', 'Selesai'],
      ['Pembayaran Piutang', 'Piutang', '18 Mei 2025', '+ Rp 4.500.000', 'Selesai'],
      ['Gaji Karyawan', 'Payroll', '17 Mei 2025', '- Rp 32.400.000', 'Terjadwal'],
    ],
    tabs: ['Arus Kas', 'Pengeluaran', 'Hutang', 'Piutang', 'Laba Rugi'],
  },
  Laporan: {
    title: 'Pusat Laporan',
    eyebrow: 'Analitik',
    description: 'Analisis performa bisnis lintas cabang dengan laporan siap ekspor.',
    action: 'Ekspor Laporan',
    stats: [
      { label: 'Penjualan Bersih', value: 'Rp 486,2 jt', detail: 'Bulan berjalan', icon: TrendingUp, tone: 'green' },
      { label: 'Laba Bersih', value: 'Rp 102,8 jt', detail: 'Margin 21,1%', icon: CircleDollarSign, tone: 'blue' },
      { label: 'Perputaran Stok', value: '4,2x', detail: 'Rata-rata 30 hari', icon: Boxes, tone: 'purple' },
    ],
    columns: ['Laporan', 'Periode', 'Cabang', 'Dibuat Oleh', 'Status'],
    rows: [
      ['Laporan Penjualan Harian', '19 Mei 2025', 'Semua Cabang', 'Arif Setiawan', 'Siap'],
      ['Laporan Laba Rugi', 'Mei 2025', 'Semua Cabang', 'Sistem', 'Siap'],
      ['Laporan Stok & Valuasi', 'Mei 2025', 'Toko Pusat', 'Rina Wulandari', 'Siap'],
      ['Laporan Pajak Penjualan', 'April 2025', 'Semua Cabang', 'Sistem', 'Siap'],
      ['Laporan Kedaluwarsa', 'Q2 2025', 'Semua Cabang', 'Dedi Pratama', 'Siap'],
    ],
    tabs: ['Ringkasan', 'Penjualan', 'Inventori', 'Keuangan', 'Pajak'],
  },
  'Pengguna & Akses': {
    title: 'Pengguna & Akses',
    eyebrow: 'Administrasi',
    description: 'Kelola pengguna, role, permission, dan penugasan cabang.',
    action: 'Tambah Pengguna',
    stats: [
      { label: 'Total Pengguna', value: '24', detail: '22 pengguna aktif', icon: UsersRound, tone: 'green' },
      { label: 'Role Sistem', value: '5', detail: 'Owner, Admin, Kasir, Gudang, Supplier', icon: ShieldCheck, tone: 'blue' },
      { label: 'Cabang', value: '3', detail: 'Semua cabang aktif', icon: Building2, tone: 'purple' },
    ],
    columns: ['Pengguna', 'Role', 'Cabang', 'Login Terakhir', 'Status'],
    rows: [
      ['Arif Setiawan', 'Owner', 'Semua Cabang', 'Baru saja', 'Aktif'],
      ['Rina Wulandari', 'Admin', 'Toko Pusat', '12 menit lalu', 'Aktif'],
      ['Dedi Pratama', 'Gudang', 'Toko Pusat', '28 menit lalu', 'Aktif'],
      ['Siska Maharani', 'Kasir', 'Cabang Utara', '1 jam lalu', 'Aktif'],
      ['PT Agro Makmur', 'Supplier', 'Portal Supplier', 'Kemarin', 'Aktif'],
    ],
    tabs: ['Pengguna', 'Role & Permission', 'Penugasan Cabang', 'Log Aktivitas'],
  },
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-logo">
        <Leaf size={21} strokeWidth={2.4} />
      </div>
      {!compact && (
        <div>
          <div className="text-xl font-extrabold tracking-tight text-slate-900">AGRO<span className="text-primary">POS</span></div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Grow your business</div>
        </div>
      )}
    </div>
  )
}

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    if (!form.get('email') || !form.get('password')) {
      setError('Email dan kata sandi wajib diisi.')
      return
    }
    setError('')
    setLoading(true)
    window.setTimeout(onLogin, 700)
  }

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-login-panel p-12 lg:flex lg:flex-col xl:p-16">
        <div className="absolute inset-0 login-grid" />
        <div className="absolute -left-24 bottom-24 size-80 rounded-full bg-green-400/10 blur-3xl" />
        <div className="absolute -right-24 top-24 size-96 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="relative z-10">
          <Logo />
        </div>

        <div className="relative z-10 my-auto max-w-xl py-20">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-emerald-100 backdrop-blur-sm">
            <ShieldCheck size={15} />
            Sistem operasional toko pertanian
          </div>
          <h1 className="max-w-lg text-5xl font-bold leading-[1.12] tracking-[-0.035em] text-white xl:text-6xl">
            Kelola bisnis tani dengan lebih cerdas.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-emerald-100/75">
            Pantau penjualan, inventori, pembelian, dan keuangan seluruh cabang dalam satu platform terpadu.
          </p>

          <div className="mt-12 grid max-w-lg grid-cols-3 gap-3">
            {[
              ['12+', 'Modul bisnis'],
              ['24/7', 'Monitoring'],
              ['100%', 'Aman & akurat'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm">
                <div className="text-xl font-bold text-white">{value}</div>
                <div className="mt-1 text-xs text-emerald-100/60">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-emerald-100/45">© 2025 AGROPOS. Solusi terpercaya bisnis pertanian.</p>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-[#fbfefc] px-6 py-10 sm:px-10">
        <div className="w-full max-w-[430px]">
          <div className="mb-12 lg:hidden">
            <Logo />
          </div>
          <div className="mb-9">
            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl border border-green-100 bg-green-50 text-primary">
              <Store size={22} />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Selamat datang kembali</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Masuk untuk melanjutkan ke dashboard AGROPOS.</p>
          </div>

          <form className="space-y-5" onSubmit={submit}>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
              <div className="input-shell">
                <UserRound size={18} className="text-slate-400" />
                <input name="email" type="email" autoComplete="email" placeholder="nama@perusahaan.com" defaultValue="admin@agropos.id" />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Kata sandi</span>
              <div className="input-shell">
                <ShieldCheck size={18} className="text-slate-400" />
                <input name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Masukkan kata sandi" defaultValue="agropos123" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="icon-button -mr-1" aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" defaultChecked className="size-4 rounded border-slate-300 accent-green-700" />
                Ingat saya
              </label>
              <button type="button" className="text-sm font-semibold text-primary hover:text-green-800">Lupa kata sandi?</button>
            </div>

            {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

            <button type="submit" disabled={loading} className="primary-button w-full">
              {loading ? <span className="loader" /> : <>Masuk ke Dashboard <ChevronRight size={18} /></>}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={14} />
            Dilindungi dengan enkripsi dan akses berbasis peran
          </div>
          <div className="mt-12 flex justify-center gap-5 text-xs font-medium text-slate-400">
            <button type="button" className="hover:text-slate-600">Pusat Bantuan</button>
            <span>•</span>
            <button type="button" className="hover:text-slate-600">Kebijakan Privasi</button>
          </div>
        </div>
      </section>
    </main>
  )
}

function Sidebar({ open, onClose, active, onNavigate }: { open: boolean; onClose: () => void; active: PageName; onNavigate: (page: PageName) => void }) {
  return (
    <>
      {open && <button className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm lg:hidden" onClick={onClose} aria-label="Tutup navigasi" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col border-r border-slate-200/80 bg-white transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center justify-between px-6">
          <Logo />
          <button className="icon-button lg:hidden" onClick={onClose} aria-label="Tutup menu"><X size={20} /></button>
        </div>
        <nav className="scrollbar-thin flex-1 overflow-y-auto px-4 pb-5 pt-3">
          {navigation.map((group) => (
            <div key={group.label} className="mb-6">
              <div className="mb-2 px-3 text-[10px] font-bold tracking-[0.16em] text-slate-400">{group.label}</div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const selected = active === item.label
                  return (
                    <button
                      type="button"
                      key={item.label}
                      onClick={() => { onNavigate(item.label); onClose() }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${selected ? 'bg-green-50 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                      <Icon size={19} strokeWidth={selected ? 2.3 : 1.8} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">{item.badge}</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-2xl bg-slate-900 p-4 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold"><HelpCircle size={17} /> Butuh bantuan?</div>
            <p className="mt-1.5 text-[11px] leading-5 text-slate-400">Tim kami siap membantu operasional Anda.</p>
            <button className="mt-3 w-full rounded-lg bg-white/10 py-2 text-xs font-semibold hover:bg-white/15">Hubungi Support</button>
          </div>
        </div>
      </aside>
    </>
  )
}

function StatCard({ label, value, detail, icon: Icon, trend, trendDown, tone }: { label: string; value: string; detail: string; icon: typeof Store; trend?: string; trendDown?: boolean; tone: string }) {
  return (
    <article className="card group p-5">
      <div className="flex items-start justify-between">
        <div className={`stat-icon ${tone}`}><Icon size={21} /></div>
        {trend && (
          <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold ${trendDown ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
            {trendDown ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}{trend}
          </div>
        )}
      </div>
      <div className="mt-5 text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</div>
      <div className="mt-1.5 text-xs text-slate-400">{detail}</div>
    </article>
  )
}

function PageHeader({ config, onAction }: { config: ModuleConfig; onAction: () => void }) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-semibold text-primary">{config.eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{config.title}</h1>
        <p className="mt-1.5 text-sm text-slate-500">{config.description}</p>
      </div>
      <button className="primary-button self-start sm:self-auto" onClick={onAction}>
        {config.action.includes('Ekspor') ? <Download size={18} /> : <Plus size={18} />} {config.action}
      </button>
    </div>
  )
}

function ModulePage({ config, onToast }: { config: ModuleConfig; onToast: (message: string) => void }) {
  const [activeTab, setActiveTab] = useState(config.tabs[0])
  const [query, setQuery] = useState('')
  const filteredRows = config.rows.filter((row) => row.join(' ').toLowerCase().includes(query.toLowerCase()))

  return (
    <>
      <PageHeader config={config} onAction={() => onToast(`${config.action} siap digunakan`)} />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {config.stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>
      <section className="card overflow-hidden">
        <div className="border-b border-slate-100 px-5 pt-2 sm:px-6">
          <div className="flex gap-1 overflow-x-auto">
            {config.tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap border-b-2 px-3 py-4 text-xs font-semibold transition ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex h-10 w-full max-w-sm items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-green-300 focus-within:bg-white">
            <Search size={17} className="text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder={`Cari di ${config.title.toLowerCase()}...`} />
          </div>
          <div className="flex gap-2">
            <button className="outline-button" onClick={() => onToast('Filter diterapkan')}><Filter size={15} /> Filter</button>
            <button className="outline-button" onClick={() => onToast('Data berhasil diekspor')}><Download size={15} /> Ekspor</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {config.columns.map((column) => <th key={column} className="px-6 py-3.5">{column}</th>)}
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((row, rowIndex) => (
                <tr key={`${row[0]}-${rowIndex}`} className="text-sm transition hover:bg-slate-50/60">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className={`px-6 py-4 ${cellIndex === 0 ? 'font-semibold text-slate-700' : 'text-slate-500'}`}>
                      {cellIndex === row.length - 1 ? (
                        <span className={`status-pill ${['Habis', 'Tinjau', 'Piutang', 'Draft', 'Terjadwal'].includes(cell) ? 'warning' : ''}`}>{cell}</span>
                      ) : cell}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <button className="icon-button" onClick={() => onToast(`Membuka detail ${row[0]}`)} aria-label={`Lihat ${row[0]}`}><MoreHorizontal size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRows.length === 0 && (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <Search size={30} className="text-slate-300" />
              <div className="mt-3 text-sm font-semibold text-slate-600">Data tidak ditemukan</div>
              <p className="mt-1 text-xs text-slate-400">Coba kata kunci atau filter lain.</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-xs text-slate-400">
          <span>Menampilkan {filteredRows.length} dari {config.rows.length} data</span>
          <div className="flex gap-1">
            <button className="outline-button" disabled>Sebelumnya</button>
            <button className="outline-button">Berikutnya</button>
          </div>
        </div>
      </section>
    </>
  )
}

function PosPage({ onToast, onNavigate }: { onToast: (message: string) => void; onNavigate: (page: PageName) => void }) {
  const products = [
    { name: 'Roundup 486 SL', price: 128000, stock: 124, category: 'Herbisida' },
    { name: 'Antracol 70 WP', price: 92500, stock: 87, category: 'Fungisida' },
    { name: 'NPK Mutiara', price: 585000, stock: 63, category: 'Pupuk' },
    { name: 'Decis 25 EC', price: 76000, stock: 42, category: 'Insektisida' },
    { name: 'Benih BISI-18', price: 112000, stock: 96, category: 'Benih' },
    { name: 'Gramoxone 276 SL', price: 89000, stock: 38, category: 'Herbisida' },
  ]
  const [cart, setCart] = useState<{ name: string; price: number; qty: number }[]>([
    { name: 'Roundup 486 SL', price: 128000, qty: 2 },
  ])
  const subtotal = cart.reduce((total, item) => total + item.price * item.qty, 0)

  function addProduct(product: (typeof products)[number]) {
    setCart((current) => {
      const existing = current.find((item) => item.name === product.name)
      return existing
        ? current.map((item) => item.name === product.name ? { ...item, qty: item.qty + 1 } : item)
        : [...current, { name: product.name, price: product.price, qty: 1 }]
    })
  }

  function updateQty(name: string, delta: number) {
    setCart((current) => current.map((item) => item.name === name ? { ...item, qty: item.qty + delta } : item).filter((item) => item.qty > 0))
  }

  function checkout() {
    if (!cart.length) return onToast('Keranjang masih kosong')
    onToast('Transaksi berhasil disimpan dan stok telah diperbarui')
    setCart([])
    window.setTimeout(() => onNavigate('Dashboard'), 900)
  }

  return (
    <>
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary">Kasir</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Point of Sale</h1>
          <p className="mt-1 text-sm text-slate-500">Transaksi baru • Toko Pusat • Kasir Arif</p>
        </div>
        <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">Sesi kasir aktif • 08:00–21:00</div>
      </div>
      <div className="grid min-h-[680px] gap-5 xl:grid-cols-[1.5fr_.8fr]">
        <section className="card p-5">
          <div className="mb-5 flex gap-2">
            <div className="flex h-11 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
              <Search size={18} className="text-slate-400" />
              <input className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Cari nama produk atau scan barcode..." />
            </div>
            <button className="outline-button h-11 px-4"><PackageSearch size={17} /> Scan</button>
          </div>
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {['Semua', 'Pestisida', 'Pupuk', 'Benih', 'Alat'].map((category, index) => <button key={category} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold ${index === 0 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>{category}</button>)}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <button key={product.name} onClick={() => addProduct(product)} className="group rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-green-300 hover:shadow-md">
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-green-50 text-primary"><Leaf size={19} /></div>
                <div className="text-sm font-bold text-slate-700">{product.name}</div>
                <div className="mt-1 text-[11px] text-slate-400">{product.category} • Stok {product.stock}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">Rp {product.price.toLocaleString('id-ID')}</span>
                  <span className="flex size-7 items-center justify-center rounded-lg bg-green-50 text-primary group-hover:bg-primary group-hover:text-white"><Plus size={15} /></span>
                </div>
              </button>
            ))}
          </div>
        </section>
        <section className="card flex flex-col overflow-hidden">
          <div className="border-b border-slate-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">Keranjang</h2>
                <p className="mt-1 text-xs text-slate-400">{cart.reduce((total, item) => total + item.qty, 0)} item dalam transaksi</p>
              </div>
              <ReceiptText size={20} className="text-primary" />
            </div>
            <button className="mt-4 flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-3 text-sm">
              <span className="flex items-center gap-2 text-slate-600"><UserRound size={17} /> Pelanggan umum</span><ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {cart.map((item) => (
              <div key={item.name} className="rounded-xl bg-slate-50 p-3">
                <div className="flex justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-700">{item.name}</div>
                  <div className="text-sm font-bold text-slate-700">Rp {(item.price * item.qty).toLocaleString('id-ID')}</div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400">@ Rp {item.price.toLocaleString('id-ID')}</span>
                  <div className="flex items-center gap-2">
                    <button className="icon-button size-7 border border-slate-200 bg-white" onClick={() => updateQty(item.name, -1)}><Minus size={13} /></button>
                    <span className="w-5 text-center text-sm font-bold">{item.qty}</span>
                    <button className="icon-button size-7 border border-slate-200 bg-white" onClick={() => updateQty(item.name, 1)}><Plus size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
            {!cart.length && <div className="flex h-full flex-col items-center justify-center py-16 text-center"><ShoppingCart size={32} className="text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-500">Keranjang kosong</p><p className="mt-1 text-xs text-slate-400">Pilih produk untuk memulai transaksi.</p></div>}
          </div>
          <div className="border-t border-slate-100 bg-slate-50/60 p-5">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>Rp {subtotal.toLocaleString('id-ID')}</span></div>
              <div className="flex justify-between text-slate-500"><span>Diskon</span><button className="font-semibold text-primary">Tambah diskon</button></div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900"><span>Total</span><span>Rp {subtotal.toLocaleString('id-ID')}</span></div>
            </div>
            <button className="primary-button mt-5 w-full" onClick={checkout}><CircleDollarSign size={18} /> Proses Pembayaran</button>
            <button className="mt-2 flex w-full items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-500"><Printer size={15} /> Tahan Transaksi</button>
          </div>
        </section>
      </div>
    </>
  )
}

function SettingsPage({ onToast }: { onToast: (message: string) => void }) {
  const [saved, setSaved] = useState(false)
  return (
    <>
      <div className="mb-7">
        <p className="text-sm font-semibold text-primary">Sistem</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Pengaturan</h1>
        <p className="mt-1.5 text-sm text-slate-500">Konfigurasi organisasi, cabang, transaksi, printer, dan notifikasi.</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <div className="card h-fit p-3">
          {['Profil Organisasi', 'Cabang', 'Penjualan & POS', 'Inventori', 'Printer', 'Notifikasi', 'Keamanan'].map((item, index) => (
            <button key={item} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ${index === 0 ? 'bg-green-50 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}>
              {index === 0 ? <Building2 size={17} /> : index === 4 ? <Printer size={17} /> : <Settings size={17} />}{item}
            </button>
          ))}
        </div>
        <section className="card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="font-bold text-slate-900">Profil Organisasi</h2>
            <p className="mt-1 text-xs text-slate-400">Informasi ini ditampilkan pada struk dan dokumen transaksi.</p>
          </div>
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            {[
              ['Nama Organisasi', 'Toko Tani Makmur'],
              ['Nomor Telepon', '021-8892-4410'],
              ['Email Bisnis', 'halo@tanimakmur.id'],
              ['NPWP', '01.234.567.8-901.000'],
            ].map(([label, value]) => (
              <label key={label} className="block">
                <span className="mb-2 block text-xs font-bold text-slate-600">{label}</span>
                <input defaultValue={value} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50" />
              </label>
            ))}
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-xs font-bold text-slate-600">Alamat Kantor Pusat</span>
              <textarea defaultValue="Jl. Raya Pertanian No. 18, Kabupaten Bogor, Jawa Barat 16610" rows={4} className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50" />
            </label>
          </div>
          <div className="flex justify-end border-t border-slate-100 bg-slate-50/60 px-6 py-4">
            <button className="primary-button" onClick={() => { setSaved(true); onToast('Pengaturan organisasi berhasil disimpan') }}>
              {saved ? <Check size={18} /> : <Save size={18} />}{saved ? 'Tersimpan' : 'Simpan Perubahan'}
            </button>
          </div>
        </section>
      </div>
    </>
  )
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [branch, setBranch] = useState('Semua Cabang')
  const [activePage, setActivePage] = useState<PageName>('Dashboard')
  const [toast, setToast] = useState('')

  function navigate(page: PageName) {
    setActivePage(page)
    setProfileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  return (
    <div className="min-h-screen bg-[#f7faf8] text-slate-800">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} active={activePage} onNavigate={navigate} />
      <div className="lg:pl-[270px]">
        <header className="sticky top-0 z-20 flex h-20 items-center border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <button className="icon-button mr-2 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Buka menu"><Menu size={22} /></button>
          <div className="hidden min-w-0 items-center gap-3 md:flex">
            <div className="flex size-9 items-center justify-center rounded-lg bg-green-50 text-primary"><Building2 size={18} /></div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cabang aktif</div>
              <select value={branch} onChange={(event) => setBranch(event.target.value)} className="cursor-pointer bg-transparent pr-2 text-sm font-semibold text-slate-700 outline-none">
                <option>Semua Cabang</option>
                <option>Toko Pusat</option>
                <option>Cabang Utara</option>
                <option>Cabang Selatan</option>
              </select>
            </div>
          </div>
          <div className="mx-auto hidden max-w-md flex-1 px-8 xl:block">
            <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-400 focus-within:border-green-300 focus-within:bg-white">
              <Search size={17} />
              <input className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" placeholder="Cari produk, transaksi, supplier..." />
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold">⌘ K</kbd>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button className="icon-button relative" aria-label="Notifikasi" onClick={() => showToast('Anda memiliki 3 notifikasi baru')}>
              <Bell size={20} />
              <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-red-500" />
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="relative">
              <button className="flex items-center gap-2.5 rounded-xl p-1.5 text-left hover:bg-slate-50" onClick={() => setProfileOpen((value) => !value)}>
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">AS</div>
                <div className="hidden sm:block">
                  <div className="text-sm font-semibold text-slate-800">Arif Setiawan</div>
                  <div className="text-[11px] font-medium text-primary">Owner</div>
                </div>
                <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  <button className="menu-option" onClick={() => navigate('Pengguna & Akses')}><UserRound size={17} /> Profil Saya</button>
                  <button className="menu-option" onClick={() => navigate('Pengaturan')}><Settings size={17} /> Pengaturan Akun</button>
                  <div className="my-1 border-t border-slate-100" />
                  <button className="menu-option text-red-600 hover:bg-red-50" onClick={onLogout}><LogOut size={17} /> Keluar</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1500px]">
            {activePage === 'Dashboard' ? (
            <>
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-medium text-primary">Senin, 19 Mei 2025</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Selamat pagi, Arif</h1>
                <p className="mt-1.5 text-sm text-slate-500">Berikut ringkasan performa bisnis Anda hari ini.</p>
              </div>
              <button className="primary-button self-start sm:self-auto" onClick={() => navigate('Point of Sale')}><Plus size={18} /> Transaksi Baru</button>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Penjualan Hari Ini" value="Rp 18.450.000" detail="42 transaksi berhasil" icon={CircleDollarSign} trend="12,5%" tone="green" />
              <StatCard label="Laba Kotor" value="Rp 5.240.000" detail="Margin 28,4%" icon={TrendingUp} trend="8,2%" tone="blue" />
              <StatCard label="Total Produk" value="1.248" detail="8 produk stok menipis" icon={Boxes} trend="2,4%" tone="purple" />
              <StatCard label="Piutang Berjalan" value="Rp 12.850.000" detail="6 jatuh tempo minggu ini" icon={WalletCards} trend="3,1%" trendDown tone="amber" />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
              <section className="card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
                  <div>
                    <h2 className="font-bold text-slate-900">Ringkasan Penjualan</h2>
                    <p className="mt-1 text-xs text-slate-400">Performa penjualan 7 hari terakhir</p>
                  </div>
                  <button className="outline-button"><CalendarDays size={15} /> 7 Hari Terakhir <ChevronDown size={14} /></button>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="mb-7 flex items-end gap-6">
                    <div>
                      <div className="text-xs font-medium text-slate-400">Total penjualan</div>
                      <div className="mt-1 text-2xl font-bold text-slate-900">Rp 112,6 jt</div>
                    </div>
                    <div className="mb-1 flex items-center gap-1 text-xs font-bold text-green-700"><ArrowUpRight size={15} /> 14,2% <span className="font-normal text-slate-400">vs minggu lalu</span></div>
                  </div>
                  <div className="relative flex h-56 items-end gap-3 border-b border-slate-100 sm:gap-6">
                    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-6">
                      {[1, 2, 3, 4].map((line) => <div key={line} className="border-t border-dashed border-slate-100" />)}
                    </div>
                    {chartData.map((item, index) => (
                      <div key={item.day} className="relative z-10 flex h-full flex-1 flex-col items-center justify-end gap-3">
                        <div className="chart-bar group relative w-full max-w-10 rounded-t-lg bg-green-100 transition hover:bg-green-200" style={{ height: `${item.value}%` }}>
                          <div className={`absolute inset-x-0 bottom-0 rounded-t-lg bg-primary transition-all ${index === 5 ? 'h-full' : 'h-[76%]'} group-hover:bg-green-700`} />
                        </div>
                        <span className={`text-[11px] font-medium ${index === 5 ? 'text-primary' : 'text-slate-400'}`}>{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="card">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
                  <div>
                    <h2 className="font-bold text-slate-900">Aktivitas Terbaru</h2>
                    <p className="mt-1 text-xs text-slate-400">Update operasional terkini</p>
                  </div>
                  <button className="text-xs font-semibold text-primary">Lihat Semua</button>
                </div>
                <div className="divide-y divide-slate-100 px-5">
                  {activities.map((activity) => {
                    const Icon = activity.icon
                    return (
                      <div className="flex gap-3 py-4" key={activity.title}>
                        <div className={`activity-icon ${activity.tone}`}><Icon size={16} /></div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold text-slate-700">{activity.title}</div>
                          <div className="mt-0.5 truncate text-xs text-slate-400">{activity.detail}</div>
                        </div>
                        <div className="shrink-0 text-[10px] text-slate-400">{activity.time}</div>
                      </div>
                    )
                  })}
                </div>
              </section>
            </div>

            <section className="card mt-6 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-slate-900">Produk Stok Menipis</h2>
                    <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">8 item</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">Segera lakukan pemesanan untuk menjaga ketersediaan</p>
                </div>
                <button className="outline-button hidden sm:flex" onClick={() => navigate('Inventori')}>Kelola Inventori <ChevronRight size={15} /></button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                  <thead>
                    <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-3.5">Produk</th>
                      <th className="px-4 py-3.5">SKU</th>
                      <th className="px-4 py-3.5">Cabang</th>
                      <th className="px-4 py-3.5">Sisa Stok</th>
                      <th className="px-6 py-3.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lowStock.map((product, index) => (
                      <tr key={product.sku} className="text-sm transition hover:bg-slate-50/60">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-green-50 text-primary"><Leaf size={17} /></div>
                            <span className="font-semibold text-slate-700">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-mono text-xs text-slate-400">{product.sku}</td>
                        <td className="px-4 py-4 text-slate-500">{product.branch}</td>
                        <td className="px-4 py-4 font-semibold text-slate-700">{product.stock} <span className="font-normal text-slate-400">{product.unit}</span></td>
                        <td className="px-6 py-4 text-right"><span className={`status-pill ${index < 2 ? 'critical' : 'warning'}`}>{index < 2 ? 'Kritis' : 'Menipis'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            </>
            ) : activePage === 'Point of Sale' ? (
              <PosPage onToast={showToast} onNavigate={navigate} />
            ) : activePage === 'Pengaturan' ? (
              <SettingsPage onToast={showToast} />
            ) : (
              <ModulePage config={moduleConfigs[activePage]} onToast={showToast} />
            )}
          </div>
        </main>
      </div>
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl">
          <span className="flex size-6 items-center justify-center rounded-full bg-green-500"><Check size={14} /></span>
          {toast}
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('agropos-session') === 'active')

  useEffect(() => {
    if (authenticated) sessionStorage.setItem('agropos-session', 'active')
    else sessionStorage.removeItem('agropos-session')
  }, [authenticated])

  return authenticated ? <Dashboard onLogout={() => setAuthenticated(false)} /> : <LoginPage onLogin={() => setAuthenticated(true)} />
}
