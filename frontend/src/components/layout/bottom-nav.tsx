'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  PackageSearch,
  Tag,
  Menu,
  X,
  Boxes,
  ClipboardList,
  Truck,
  UsersRound,
  WalletCards,
  FileBarChart,
  ShieldCheck,
  Settings,
  LogOut,
  Store,
} from 'lucide-react'
import { useAuthStore } from '@/stores/use-auth-store'
import { usePermissionStore } from '@/stores/use-permission-store'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/stores/use-app-store'

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { currentUser, store, logout } = useAuthStore()
  const { canAccessPath } = usePermissionStore()
  const { addToast } = useAppStore()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Primary bottom tabs
  const mainTabs = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Kasir POS', href: '/pos', icon: ShoppingCart },
    { label: 'Produk', href: '/produk', icon: PackageSearch },
    { label: 'Kategori', href: '/kategori', icon: Tag },
  ].filter((tab) => canAccessPath(currentUser?.role, tab.href))

  // Secondary drawer items
  const drawerItems = [
    { label: 'Inventori & FEFO', href: '/inventori', icon: Boxes },
    { label: 'Pembelian & PO', href: '/pembelian', icon: ClipboardList },
    { label: 'Supplier Pupuk & Obat', href: '/supplier', icon: Truck },
    { label: 'Pelanggan & Piutang', href: '/pelanggan', icon: UsersRound },
    { label: 'Keuangan & Kas', href: '/keuangan', icon: WalletCards },
    { label: 'Pusat Laporan', href: '/laporan', icon: FileBarChart },
    { label: 'Pengguna & Hak Akses', href: '/pengguna', icon: ShieldCheck },
    { label: 'Pengaturan Toko', href: '/pengaturan', icon: Settings },
  ].filter((item) => canAccessPath(currentUser?.role, item.href))

  const handleLogout = () => {
    setDrawerOpen(false)
    logout()
    addToast('Berhasil keluar dari akun.', 'info')
    router.replace('/login')
  }

  return (
    <>
      {/* Bottom Nav Bar (Mobile & Tablet: lg:hidden) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-slate-200/90 bg-white/95 px-2 backdrop-blur-lg shadow-lg lg:hidden">
        {mainTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center justify-center py-1 transition ${
                isActive
                  ? 'text-[#166534] font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div
                className={`flex size-9 items-center justify-center rounded-xl transition ${
                  isActive ? 'bg-emerald-50 text-[#166534]' : ''
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </Link>
          )
        })}

        {/* More / Menu Drawer Toggle */}
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className={`flex flex-1 flex-col items-center justify-center py-1 transition ${
            drawerOpen
              ? 'text-[#166534] font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div
            className={`flex size-9 items-center justify-center rounded-xl transition ${
              drawerOpen ? 'bg-emerald-50 text-[#166534]' : ''
            }`}
          >
            <Menu size={20} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Menu Lain</span>
        </button>
      </nav>

      {/* Slide-up Drawer for Extra Menus */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/50 backdrop-blur-sm lg:hidden animate-in fade-in">
          <div
            className="flex-1"
            onClick={() => setDrawerOpen(false)}
            aria-label="Tutup menu"
          />

          <div className="max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-slate-200 bg-white p-5 shadow-2xl animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-[#166534]">
                  <Store size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{store.name}</h3>
                  <p className="text-[10px] text-slate-400">
                    Role: <span className="uppercase font-bold text-[#166534]">{currentUser?.role}</span> ({currentUser?.name})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 py-4">
              {drawerItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center gap-2.5 rounded-2xl border p-3 text-xs font-bold transition ${
                      isActive
                        ? 'border-[#166534] bg-emerald-50 text-[#166534]'
                        : 'border-slate-100 bg-slate-50/70 text-slate-700 hover:bg-white hover:border-slate-200'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-[#166534]' : 'text-slate-400'} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            <div className="border-t border-slate-100 pt-3">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-3 text-xs font-bold text-red-600 hover:bg-red-100"
              >
                <LogOut size={16} /> Keluar Sistem (Logout)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
