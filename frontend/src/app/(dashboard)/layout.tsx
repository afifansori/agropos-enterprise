'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { ShieldAlert, Home, ShoppingCart, Boxes } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { ToastContainer } from '@/components/ui/toast-container'
import { useAuthStore } from '@/stores/use-auth-store'
import { usePermissionStore } from '@/stores/use-permission-store'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { currentUser, isAuthenticated, isHydrated, initAuth } = useAuthStore()
  const { canAccessPath, initPermissions } = usePermissionStore()

  useEffect(() => {
    initAuth()
    initPermissions()
  }, [initAuth, initPermissions])

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isHydrated, isAuthenticated, router])

  if (isHydrated && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7faf8]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-4 border-[#166534] border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">Mengarahkan ke halaman login...</p>
        </div>
      </div>
    )
  }

  const isAllowed = isHydrated && currentUser ? canAccessPath(currentUser.role, pathname) : true

  return (
    <div className="min-h-screen bg-[#f7faf8] text-slate-800 antialiased">
      <Sidebar />
      <div className="lg:pl-[270px] flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="mx-auto max-w-[1500px]">
            {isAllowed ? (
              children
            ) : (
              <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6">
                <div className="size-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-sm mb-4">
                  <ShieldAlert size={32} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                  Hak Akses Terbatas (RBAC)
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Akses Menu Dibatasi untuk Peran Ini
                </h2>
                <p className="mt-2 max-w-md text-xs leading-5 text-slate-500">
                  Akun Anda dengan peran <b className="text-slate-800 uppercase font-bold">{currentUser?.role}</b> tidak memiliki izin untuk mengakses halaman ini berdasarkan matriks hak akses Toko Pusat.
                </p>
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#166534] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-900/15 hover:bg-emerald-800 transition"
                  >
                    <Home size={15} /> Kembali ke Dashboard
                  </Link>
                  {currentUser?.role === 'cashier' && (
                    <Link
                      href="/pos"
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <ShoppingCart size={15} /> Buka Layar Kasir POS
                    </Link>
                  )}
                  {currentUser?.role === 'warehouse' && (
                    <Link
                      href="/inventori"
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Boxes size={15} /> Buka Inventori & FEFO
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <BottomNav />
      <ToastContainer />
    </div>
  )
}
