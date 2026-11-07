import { Role } from '@/types/auth'

export type AppModule =
  | 'dashboard'
  | 'pos'
  | 'produk'
  | 'inventori'
  | 'pembelian'
  | 'supplier'
  | 'pelanggan'
  | 'keuangan'
  | 'laporan'
  | 'pengguna'
  | 'pengaturan'

export interface ModuleDefinition {
  id: AppModule
  name: string
  category: string
  description: string
  path: string
}

export const APP_MODULES: ModuleDefinition[] = [
  {
    id: 'dashboard',
    name: 'Dashboard Ringkasan',
    category: 'Utama',
    description: 'Statistik performa dan aktivitas harian Toko Pusat',
    path: '/',
  },
  {
    id: 'pos',
    name: 'Kasir POS & Transaksi',
    category: 'Penjualan',
    description: 'Antarmuka kasir, barcode scanner, struk, dan checkout',
    path: '/pos',
  },
  {
    id: 'produk',
    name: 'Katalog Produk & Harga',
    category: 'Operasional',
    description: 'Master data obat pertanian, pupuk, dan penetapan harga',
    path: '/produk',
  },
  {
    id: 'inventori',
    name: 'Inventori & FEFO Batch',
    category: 'Operasional',
    description: 'Stock opname, mutasi stok, dan alarm kedaluwarsa',
    path: '/inventori',
  },
  {
    id: 'pembelian',
    name: 'Pembelian & Purchase Order',
    category: 'Operasional',
    description: 'Penerbitan PO pengadaan ke supplier dan faktur',
    path: '/pembelian',
  },
  {
    id: 'supplier',
    name: 'Distributor & Supplier',
    category: 'Operasional',
    description: 'Data mitra pabrik pestisida dan distributor pupuk',
    path: '/supplier',
  },
  {
    id: 'pelanggan',
    name: 'Pelanggan Petani & Piutang',
    category: 'Operasional',
    description: 'Kelompok tani, petani perorangan, dan limit plafon tempo',
    path: '/pelanggan',
  },
  {
    id: 'keuangan',
    name: 'Keuangan & Buku Kas',
    category: 'Keuangan',
    description: 'Arus kas masuk/keluar, biaya operasional, dan saldo bank',
    path: '/keuangan',
  },
  {
    id: 'laporan',
    name: 'Pusat Laporan & Analitik',
    category: 'Laporan',
    description: 'Preview dan cetak A4 / Excel rekapitulasi usaha',
    path: '/laporan',
  },
  {
    id: 'pengguna',
    name: 'Pengguna & Hak Akses (RBAC)',
    category: 'Sistem',
    description: 'Manajemen akun staf, audit log, dan matriks izin',
    path: '/pengguna',
  },
  {
    id: 'pengaturan',
    name: 'Pengaturan Sistem & Backup',
    category: 'Sistem',
    description: 'Printer thermal kasir, profil toko, dan cadangan data',
    path: '/pengaturan',
  },
]

export type RolePermissions = Record<Role, Record<AppModule, boolean>>

export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  owner: {
    dashboard: true,
    pos: true,
    produk: true,
    inventori: true,
    pembelian: true,
    supplier: true,
    pelanggan: true,
    keuangan: true,
    laporan: true,
    pengguna: true,
    pengaturan: true,
  },
  admin: {
    dashboard: true,
    pos: true,
    produk: true,
    inventori: true,
    pembelian: true,
    supplier: true,
    pelanggan: true,
    keuangan: true,
    laporan: true,
    pengguna: true,
    pengaturan: false, // Owner only by default
  },
  cashier: {
    dashboard: true, // Cashier tailored dashboard
    pos: true,
    produk: true, // Price lookup
    pelanggan: true, // Customer & debt lookup
    inventori: false,
    pembelian: false,
    supplier: false,
    keuangan: false,
    laporan: false,
    pengguna: false,
    pengaturan: false,
  },
  warehouse: {
    dashboard: true, // Warehouse tailored dashboard
    inventori: true,
    produk: true,
    pembelian: true, // Receiving items
    supplier: true,
    pos: false,
    pelanggan: false,
    keuangan: false,
    laporan: false,
    pengguna: false,
    pengaturan: false,
  },
  supplier: {
    dashboard: true, // Supplier portal dashboard
    pembelian: true, // View POs for supplier
    produk: true, // View supplied catalog
    pos: false,
    inventori: false,
    supplier: false,
    pelanggan: false,
    keuangan: false,
    laporan: false,
    pengguna: false,
    pengaturan: false,
  },
}

export function getModuleByPath(pathname: string): AppModule | null {
  if (pathname === '/') return 'dashboard'
  if (pathname.startsWith('/kategori')) return 'produk'
  const matched = APP_MODULES.find((m) => m.path !== '/' && pathname.startsWith(m.path))
  return matched ? matched.id : null
}

