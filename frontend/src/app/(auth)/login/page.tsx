'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ShieldCheck,
  Store,
  UserRound,
  Eye,
  EyeOff,
  ChevronRight,
  Leaf,
} from 'lucide-react'
import { Logo } from '@/components/layout/logo'
import { useAuthStore } from '@/stores/use-auth-store'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()

  const [email, setEmail] = useState('owner@agropos.id')
  const [password, setPassword] = useState('agropos123')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Email dan kata sandi wajib diisi.')
      return
    }

    setLoading(true)
    setError('')

    setTimeout(async () => {
      await login(email)
      setLoading(false)
      router.push('/')
    }, 600)
  }

  const setDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('agropos123')
  }

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-[1.05fr_.95fr]">
      {/* Left Brand Showcase Section */}
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#0b3b21] via-[#125a2f] to-[#0a3c22] p-12 lg:flex lg:flex-col xl:p-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -left-24 bottom-24 size-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -right-24 top-24 size-96 rounded-full bg-green-300/10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-white text-[#166534] shadow-xl">
              <Leaf size={24} strokeWidth={2.4} />
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight text-white">
                AGRO<span className="text-emerald-400">POS</span>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/80">
                Grow your business
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 my-auto max-w-xl py-20">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold text-emerald-100 backdrop-blur-sm">
            <ShieldCheck size={16} className="text-emerald-300" />
            Sistem Operasional Toko Obat Pertanian & Saprotan
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-white xl:text-5xl">
            Kelola bisnis saprotan dengan lebih cerdas & presisi.
          </h1>

          <p className="mt-6 text-sm leading-7 text-emerald-100/80">
            Kendali penuh stok per batch (FEFO), kasir POS cepat, purchase order supplier, piutang kelompok tani, dan keuangan Toko Pusat terpadu.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              ['Toko Pusat', 'Operasional & Kasir'],
              ['Batch & FEFO', 'Cegah Kedaluwarsa'],
              ['Multi-Payment', 'Tunai, QRIS & Tempo'],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.07] p-3.5 backdrop-blur-sm">
                <div className="text-sm font-bold text-white">{title}</div>
                <div className="mt-1 text-[11px] text-emerald-200/60 leading-tight">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-emerald-100/40">
          © 2026 AGROPOS Enterprise Platform. All rights reserved.
        </p>
      </section>

      {/* Right Login Form */}
      <section className="flex min-h-screen items-center justify-center bg-[#fbfefc] px-6 py-10 sm:px-10">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>

          <div className="mb-8">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-[#166534]">
              <Store size={24} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Selamat datang kembali
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Masuk untuk melanjutkan ke operasional AGROPOS.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-slate-700">Email Akun</span>
              <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 text-slate-600 shadow-sm transition focus-within:border-[#166534] focus-within:ring-4 focus-within:ring-emerald-50">
                <UserRound size={18} className="text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@agropos.id"
                  className="h-full w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-slate-700">Kata Sandi</span>
              <div className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 text-slate-600 shadow-sm transition focus-within:border-[#166534] focus-within:ring-4 focus-within:ring-emerald-50">
                <ShieldCheck size={18} className="text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="h-full w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 accent-[#166534]" />
                Ingat saya
              </label>
              <button type="button" className="font-bold text-[#166534] hover:underline">
                Lupa kata sandi?
              </button>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#166534] text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <div className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <>
                  Masuk ke Dashboard <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
              Pilih Role Akun Demo:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setDemoAccount('owner@agropos.id')}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2 hover:bg-emerald-50 hover:border-emerald-500 text-left"
              >
                👤 Owner (Arif)
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('kasir@agropos.id')}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2 hover:bg-emerald-50 hover:border-emerald-500 text-left"
              >
                🛒 Kasir (Budi)
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('gudang@agropos.id')}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2 hover:bg-emerald-50 hover:border-emerald-500 text-left"
              >
                📦 Gudang (Dedi)
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('supplier@agropos.id')}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2 hover:bg-emerald-50 hover:border-emerald-500 text-left"
              >
                🚚 Supplier (Petro)
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

