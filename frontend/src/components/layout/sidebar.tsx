'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  PackageSearch,
  Boxes,
  ClipboardList,
  Truck,
  UsersRound,
  WalletCards,
  FileBarChart,
  ShieldCheck,
  Settings,
  HelpCircle,
  X,
  LucideIcon,
  UserCheck,
} from 'lucide-react'
import { Logo } from './logo'
import { useAppStore } from '@/stores/use-app-store'
import { useAuthStore } from '@/stores/use-auth-store'
import { usePermissionStore } from '@/stores/use-permission-store'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: string
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navigationGroups: NavGroup[] = [
  {
    label: 'UTAMA',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'Point of Sale', href: '/pos', icon: ShoppingCart },
    ],
  },
  {
    label: 'OPERASIONAL',
    items: [
      { label: 'Produk', href: '/produk', icon: PackageSearch },
      { label: 'Inventori', href: '/inventori', icon: Boxes, badge: '8' },
      { label: 'Pembelian', href: '/pembelian', icon: ClipboardList },
      { label: 'Supplier', href: '/supplier', icon: Truck },
      { label: 'Pelanggan', href: '/pelanggan', icon: UsersRound },
    ],
  },
  {
    label: 'KEUANGAN',
    items: [
      { label: 'Keuangan', href: '/keuangan', icon: WalletCards },
      { label: 'Laporan', href: '/laporan', icon: FileBarChart },
    ],
  },
  {
    label: 'SISTEM',
    items: [
      { label: 'Pengguna & Akses', href: '/pengguna', icon: ShieldCheck },
      { label: 'Pengaturan', href: '/pengaturan', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useAppStore()
  const { currentUser } = useAuthStore()
  const { canAccessPath, initPermissions } = usePermissionStore()

  useEffect(() => {
    initPermissions()
  }, [initPermissions])

  // Filter groups according to the currently active user role & RBAC permissions checklist
  const visibleGroups = navigationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccessPath(currentUser?.role, item.href)),
    }))
    .filter((group) => group.items.length > 0)

  const roleLabelMap: Record<string, string> = {
    owner: 'Owner (Pemilik)',
    admin: 'Administrator',
    cashier: 'Kasir POS',
    warehouse: 'Staf Gudang',
    supplier: 'Mitra Supplier',
  }

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-slate-200/80 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-between px-6">
          <Logo />
          <button
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Active Role Indicator */}
        <div className="mx-4 mb-3 rounded-2xl bg-emerald-50/80 border border-emerald-100 px-3.5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-600 animate-pulse" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Hak Akses Aktif
              </div>
              <div className="text-xs font-black text-[#166534]">
                {currentUser?.role ? roleLabelMap[currentUser.role] || currentUser.role : 'Owner'}
              </div>
            </div>
          </div>
          <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-[#166534] shadow-xs uppercase">
            {currentUser?.role || 'owner'}
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-5 pt-1 scrollbar-thin">
          {visibleGroups.map((group) => (
            <div key={group.label} className="mb-5">
              <div className="mb-2 px-3 text-[10px] font-extrabold tracking-[0.16em] text-slate-400 uppercase">
                {group.label}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? 'bg-emerald-50 text-[#166534] font-semibold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.4 : 1.8}
                        className={isActive ? 'text-[#166534]' : 'text-slate-500'}
                      />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Support Card */}
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-2xl bg-slate-900 p-3.5 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <HelpCircle size={15} className="text-emerald-400" /> Butuh bantuan akses?
            </div>
            <p className="mt-1 text-[10px] leading-4 text-slate-400">
              Hak akses menu disesuaikan dengan matriks wewenang Toko Pusat.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
