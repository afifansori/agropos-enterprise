"use client"

import React from "react"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sprout,
  Store,
  Boxes,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Building2,
  Users,
  Layers,
  ArrowRight,
  Database,
  Truck
} from "lucide-react"

interface PingResponse {
  status: string
  message: string
  version: string
  timestamp: string
}

export default function FoundationDashboard() {
  const { data: pingData, isLoading, isError, refetch } = useQuery<PingResponse>({
    queryKey: ["backend-ping"],
    queryFn: async () => {
      const res = await apiClient.get<PingResponse>("/ping")
      return res.data
    },
  })

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-[#1E293B]">
      {/* Topbar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E2E8F0] bg-white px-4 md:px-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#166534] text-white shadow">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#166534]">AGROPOS</span>
            <span className="hidden text-xs text-[#64748B] sm:inline-block ml-2 font-medium">
              Agricultural Store Enterprise Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-lg bg-[#DCFCE7] px-3 py-1.5 text-xs font-semibold text-[#166534]">
            <Building2 className="h-3.5 w-3.5" />
            PT Agro Tani Makmur (AGRO-01)
          </div>

          <div className="flex items-center gap-1.5">
            {isLoading ? (
              <Badge variant="secondary" className="animate-pulse">
                Cek Backend...
              </Badge>
            ) : isError ? (
              <Badge variant="destructive">API Offline</Badge>
            ) : (
              <Badge variant="secondary" className="bg-[#DCFCE7] text-[#166534] border border-[#22C55E]/30">
                <CheckCircle2 className="mr-1 h-3 w-3 text-[#22C55E]" />
                API v1 Active
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 space-y-8">
        {/* Banner Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#166534] to-[#14532d] p-6 md:p-10 text-white shadow-lg">
          <div className="relative z-10 max-w-2xl space-y-3">
            <Badge className="bg-[#22C55E] text-white hover:bg-[#16a34a] border-none font-medium">
              Tahap 1: Project Foundation & Database Selesai
            </Badge>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Platform POS, Inventori & Supplier Portal Toko Obat Pertanian
            </h1>
            <p className="text-sm md:text-base text-green-100 leading-relaxed">
              Arsitektur Multi-Organization & Multi-Branch siap dioperasikan. Terintegrasi dengan Laravel 12 (PHP 8.4), MySQL 8, dan Next.js App Router dengan penegakan FEFO & isolasi akses ketat.
            </p>
          </div>
          <div className="absolute -bottom-6 -right-6 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
        </div>

        {/* 4 Statistik Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-[#166534]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#64748B]">Organisasi</CardTitle>
              <Building2 className="h-4 w-4 text-[#166534]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#166534]">PT Agro Tani</div>
              <p className="text-xs text-[#64748B] mt-1">Multi-Organization Ready</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#22C55E]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#64748B]">Cabang Aktif</CardTitle>
              <Store className="h-4 w-4 text-[#22C55E]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1E293B]">2 Cabang</div>
              <p className="text-xs text-[#64748B] mt-1">Solo (Pusat) & Klaten</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#166534]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#64748B]">Metode Stok</CardTitle>
              <Boxes className="h-4 w-4 text-[#166534]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#166534]">FEFO & Batch</div>
              <p className="text-xs text-[#64748B] mt-1">First Expired, First Out</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#22C55E]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#64748B]">Peran Sistem</CardTitle>
              <ShieldCheck className="h-4 w-4 text-[#22C55E]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1E293B]">5 Roles</div>
              <p className="text-xs text-[#64748B] mt-1">Owner, Admin, Kasir, Gudang, Supplier</p>
            </CardContent>
          </Card>
        </div>

        {/* Status Konektivitas & Konfigurasi */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Backend Status */}
          <Card className="lg:col-span-1 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-5 w-5 text-[#166534]" />
                  Status Backend & MySQL
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => refetch()} className="h-8 w-8 p-0">
                  <RefreshCw className="h-4 w-4 text-[#166534]" />
                </Button>
              </div>
              <CardDescription>Pemeriksaan API /api/v1/ping</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Backend Framework</span>
                <span className="font-semibold text-[#166534]">Laravel 12 (PHP 8.4)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Database Engine</span>
                <span className="font-semibold text-[#1E293B]">MySQL 8.4 Community</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Database Name</span>
                <span className="font-semibold font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">agropos</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Response API</span>
                <span className="font-medium text-xs">
                  {isLoading ? "Menguji..." : pingData ? pingData.message : "Tidak dapat terhubung"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[#64748B]">Sanctum & CORS</span>
                <Badge variant="secondary">Terkonfigurasi</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Card Multi-Role Architecture */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-[#166534]" />
                Arsitektur Multi-Role & Cakupan Hak Akses (Seeded)
              </CardTitle>
              <CardDescription>Akun awal yang telah terdaftar dalam database MySQL</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-[#E2E8F0]">
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 text-[#166534] flex items-center justify-center font-bold text-xs">
                      OW
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Owner (Budi Santoso)</p>
                      <p className="text-xs text-[#64748B]">owner@agropos.test • Akses seluruh cabang & laporan finansial</p>
                    </div>
                  </div>
                  <Badge className="bg-[#166534]">Semua Cabang</Badge>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      AD
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Admin Cabang (Siti Rahma)</p>
                      <p className="text-xs text-[#64748B]">admin@agropos.test • Operasional master data & transaksi cabang</p>
                    </div>
                  </div>
                  <Badge variant="outline">Cabang Solo</Badge>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                      KS
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Kasir (Rian Pratama)</p>
                      <p className="text-xs text-[#64748B]">kasir@agropos.test • POS, penjualan, tanpa akses HPP modal</p>
                    </div>
                  </div>
                  <Badge variant="outline">Cabang Solo</Badge>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      GD
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Gudang (Agus Setiawan)</p>
                      <p className="text-xs text-[#64748B]">gudang@agropos.test • Penerimaan PO, batch expiry & opname stok</p>
                    </div>
                  </div>
                  <Badge variant="outline">Solo & Klaten</Badge>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                      SP
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Supplier (PT Petro Kimia Tani)</p>
                      <p className="text-xs text-[#64748B]">supplier@agropos.test • Portal khusus PO, faktur, surat jalan</p>
                    </div>
                  </div>
                  <Badge className="bg-purple-700">Portal Supplier</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Roadmap Tahapan Proyek */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#166534]" />
              Roadmap Pengembangan AGROPOS
            </CardTitle>
            <CardDescription>12 Tahap Arsitektur Berkelanjutan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-[#22C55E] bg-[#DCFCE7]/40 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#166534]">Tahap 1: Foundation</p>
                  <p className="text-[#64748B]">Laravel 12, MySQL 8, Next.js</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
              </div>

              <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-between opacity-80">
                <div>
                  <p className="font-bold text-[#1E293B]">Tahap 2: Auth & RBAC</p>
                  <p className="text-[#64748B]">Multi-Branch & Scope Security</p>
                </div>
                <ArrowRight className="h-4 w-4 text-[#94A3B8]" />
              </div>

              <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-between opacity-60">
                <div>
                  <p className="font-bold text-[#1E293B]">Tahap 3: Master Data</p>
                  <p className="text-[#64748B]">Produk, Kategori, Multi-Satuan</p>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-between opacity-60">
                <div>
                  <p className="font-bold text-[#1E293B]">Tahap 4: Inventory & FEFO</p>
                  <p className="text-[#64748B]">Batch, Expiry Date & Movements</p>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-between opacity-60">
                <div>
                  <p className="font-bold text-[#1E293B]">Tahap 5: Purchasing</p>
                  <p className="text-[#64748B]">PO, Penerimaan & Hutang</p>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-between opacity-60">
                <div>
                  <p className="font-bold text-[#1E293B]">Tahap 6: POS Sales</p>
                  <p className="text-[#64748B]">Kasir, FEFO Costing & Split Pay</p>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-between opacity-60">
                <div>
                  <p className="font-bold text-[#1E293B]">Tahap 7: Finance</p>
                  <p className="text-[#64748B]">Hutang/Piutang & Laba Rugi</p>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-between opacity-60">
                <div>
                  <p className="font-bold text-[#1E293B]">Tahap 8-12: Advanced</p>
                  <p className="text-[#64748B]">Transfer, Supplier, Report, PWA</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
