'use client'

import React, { useState } from 'react'
import {
  Menu,
  Store,
  Search,
  Bell,
  ChevronDown,
  UserRound,
  Settings,
  LogOut,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  X,
  ShoppingCart,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/use-auth-store'
import { useAppStore } from '@/stores/use-app-store'
import { mockUsers } from '@/lib/mock-data'

export function Header() {
  const router = useRouter()
  const { currentUser, store, logout, login } = useAuthStore()
  const { toggleSidebar, addToast } = useAppStore()
  const [profileOpen, setProfileOpen] = useState(false)
  const [storeModalOpen, setStoreModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = () => {
    setProfileOpen(false)
    logout()
    addToast('Berhasil keluar dari akun.', 'info')
    router.replace('/login')
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 items-center border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
        {/* Mobile Hamburger */}
        <button
          className="mr-3 rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          onClick={toggleSidebar}
          aria-label="Buka menu navigasi"
        >
          <Menu size={22} />
        </button>

        {/* Store Indicator Button (Active & Clickable: Toko Pusat) */}
        <button
          type="button"
          onClick={() => setStoreModalOpen(true)}
          className="group flex items-center gap-3 rounded-2xl p-2 text-left transition hover:bg-emerald-50/80 border border-transparent hover:border-emerald-200"
          title="Klik untuk info detail Toko Pusat AgroPOS"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-[#166534] shadow-sm transition group-hover:bg-[#166534] group-hover:text-white">
            <Store size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">
                Kasir Aktif
              </span>
            </div>
            <div className="text-sm font-extrabold text-slate-900 tracking-tight group-hover:text-[#166534] flex items-center gap-1">
              {store.name}
              <ChevronDown size={14} className="text-slate-400 group-hover:text-[#166534]" />
            </div>
          </div>
        </button>

        {/* Global Search Bar */}
        <div className="mx-auto hidden max-w-md flex-1 px-8 xl:block">
          <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-400 focus-within:border-emerald-500 focus-within:bg-white focus-within:text-slate-700">
            <Search size={17} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              placeholder="Cari obat tanaman, pupuk, no. batch, supplier..."
            />
            <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
              ⌘ K
            </kbd>
          </div>
        </div>

        {/* Right Actions: Notifications & Profile */}
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          {/* Notification Bell */}
          <button
            onClick={() => addToast('Notifikasi: 2 batch Decis 25 EC mendekati kedaluwarsa dalam 60 hari.', 'info')}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Lihat notifikasi"
          >
            <Bell size={20} />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-white bg-red-500" />
          </button>

          <div className="h-7 w-px bg-slate-200" />

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 rounded-xl p-1.5 text-left hover:bg-slate-50"
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-[#166534] text-xs font-bold text-white shadow-sm">
                {currentUser?.name ? currentUser.name.split(' ').map((n) => n[0]).slice(0, 2).join('') : 'AG'}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-slate-800">
                  {currentUser?.name || 'Pengguna'}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#166534] uppercase tracking-wide">
                  <ShieldCheck size={12} />
                  {currentUser?.role || 'User'}
                </div>
              </div>
              <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5"
                onClick={() => setProfileOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">Masuk sebagai</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{currentUser?.email}</p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">{store.name}</p>
                </div>

                <Link
                  href="/pengguna"
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <UserRound size={16} /> Profil & Hak Akses
                </Link>
                <Link
                  href="/pengaturan"
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <Settings size={16} /> Pengaturan Toko & Printer
                </Link>

                {/* Quick Role Switcher for Testing/Demo */}
                <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/70 rounded-xl my-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Ganti Role / Akun Demo:
                  </p>
                  <div className="grid grid-cols-1 gap-1 text-[11px] font-semibold">
                    {mockUsers.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          login(u.email)
                          addToast(`Beralih ke akun ${u.name} (Role: ${u.role.toUpperCase()})`, 'success')
                        }}
                        className={`flex items-center justify-between p-1.5 rounded-lg text-left transition ${
                          currentUser?.email === u.email
                            ? 'bg-emerald-100/70 text-[#166534] font-bold'
                            : 'text-slate-600 hover:bg-white'
                        }`}
                      >
                        <span className="truncate">{u.name}</span>
                        <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-white text-slate-500 font-bold border border-slate-200">
                          {u.role}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="my-1 border-t border-slate-100" />

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} /> Keluar Sistem
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal Detail Toko Pusat AgroPOS */}
      {storeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 bg-gradient-to-r from-emerald-50 to-white">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-[#166534] text-white shadow-md">
                  <Store size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900">{store.name}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      <CheckCircle2 size={11} /> Utama
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Pusat Kasir, Gudang & Distribusi Pertanian</p>
                </div>
              </div>
              <button
                onClick={() => setStoreModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs">
                <div className="flex items-start gap-2.5 text-slate-700">
                  <MapPin size={16} className="text-[#166534] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-800">Alamat Operasional:</span>
                    <span className="text-slate-600 leading-relaxed">{store.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-700">
                  <Phone size={15} className="text-[#166534] shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800">Telepon / CS: </span>
                    <span className="font-semibold text-slate-600">{store.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-700">
                  <Mail size={15} className="text-[#166534] shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800">Email Resmi: </span>
                    <span className="font-semibold text-slate-600">{store.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-700">
                  <Clock size={15} className="text-[#166534] shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800">Jam Kasir Aktif: </span>
                    <span className="font-semibold text-emerald-700">Senin - Minggu (08:00 - 21:00 WIB)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/pos"
                  onClick={() => setStoreModalOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#166534] p-3 text-xs font-bold text-white shadow-md hover:bg-emerald-800"
                >
                  <ShoppingCart size={15} /> Buka Kasir POS
                </Link>
                <Link
                  href="/pengaturan"
                  onClick={() => setStoreModalOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-emerald-500"
                >
                  <Settings size={15} /> Pengaturan Toko
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
