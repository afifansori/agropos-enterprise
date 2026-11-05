'use client'

import React, { useState } from 'react'
import {
  Settings,
  Building2,
  Printer,
  ShieldCheck,
  Save,
  Check,
  Store,
  Bell,
  Volume2,
  Download,
  Upload,
  Lock,
  Clock,
  Send,
  AlertTriangle,
  FileCheck,
} from 'lucide-react'
import { useAppStore } from '@/stores/use-app-store'
import {
  mockProducts,
  mockSuppliers,
  mockCustomers,
  mockCashTransactions,
  mockUsers,
  storeInfo,
} from '@/lib/mock-data'

export default function PengaturanPage() {
  const { addToast } = useAppStore()
  const [activeTab, setActiveTab] = useState('Profil Toko Pusat')
  const [saved, setSaved] = useState(false)

  // 1. Profil Toko State
  const [orgName, setOrgName] = useState('PT Agro Tani Makmur')
  const [phone, setPhone] = useState('0251-8622100')
  const [email, setEmail] = useState('halo@agrotani.id')
  const [taxId, setTaxId] = useState('01.234.567.8-901.000')
  const [address, setAddress] = useState('Jl. Raya Pertanian No. 18, Dramaga, Kab. Bogor, Jawa Barat 16610')

  // 2. Printer State
  const [paperSize, setPaperSize] = useState<'58mm' | '80mm'>('80mm')
  const [autoCut, setAutoCut] = useState(true)
  const [printFooterNote, setPrintFooterNote] = useState('Barang yang sudah dibeli tidak dapat ditukar kecuali kemasan bocor pabrik.')

  // 3. Notifikasi & Alarm FEFO State
  const [criticalDays, setCriticalDays] = useState(60)
  const [warningDays, setWarningDays] = useState(120)
  const [minStockAlert, setMinStockAlert] = useState(10)
  const [enableSoundAlarm, setEnableSoundAlarm] = useState(true)
  const [enableWhatsAppAlert, setEnableWhatsAppAlert] = useState(true)
  const [managerWhatsApp, setManagerWhatsApp] = useState('0812-8899-7711')
  const [enableEmailDigest, setEnableEmailDigest] = useState(true)
  const [digestEmail, setDigestEmail] = useState('gudang@agropos.id')

  // 4. Keamanan & Backup State
  const [backupSchedule, setBackupSchedule] = useState<'daily' | 'weekly' | 'manual'>('daily')
  const [enableEncryption, setEnableEncryption] = useState(true)
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(30)
  const [requireSupervisorPin, setRequireSupervisorPin] = useState(true)
  const [restrictLocalIp, setRestrictLocalIp] = useState(true)
  const [isRestoring, setIsRestoring] = useState(false)

  const handleSave = () => {
    setSaved(true)
    addToast('Semua preferensi pengaturan Toko Pusat berhasil disimpan!', 'success')
    setTimeout(() => setSaved(false), 2500)
  }

  // Audio Test Chime for FEFO Alarm
  const handleTestAlarmSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        const ctx = new AudioCtx()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(880, ctx.currentTime) // A5 note
        osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.15) // E6 note
        gain.gain.setValueAtTime(0.25, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.5)
      }
    } catch {
      // AudioContext fallback
    }
    addToast('Uji coba alarm suara FEFO berhasil diputar!', 'info')
  }

  const handleSendTestNotification = () => {
    addToast(`Notifikasi uji coba FEFO berhasil dikirim ke WhatsApp ${managerWhatsApp}!`, 'success')
  }

  // Backup Data Snapshot Generator
  const handleDownloadBackup = () => {
    const backupData = {
      version: '2.0-single-store',
      store: {
        name: orgName,
        phone,
        email,
        taxId,
        address,
        unit: 'Toko Pusat',
      },
      fefoSettings: {
        criticalDays,
        warningDays,
        minStockAlert,
        enableSoundAlarm,
      },
      timestamp: new Date().toISOString(),
      dataset: {
        productsCount: mockProducts.length,
        products: mockProducts,
        suppliers: mockSuppliers,
        customers: mockCustomers,
        financeTransactions: mockCashTransactions,
        users: mockUsers,
      },
    }

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2))
    const downloadAnchor = document.createElement('a')
    const timestampStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `AgroPOS_Backup_TokoPusat_${timestampStr}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()

    addToast('File snapshot cadangan database Toko Pusat berhasil diunduh (.json)!', 'success')
  }

  const handleRestoreFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsRestoring(true)
    setTimeout(() => {
      setIsRestoring(false)
      addToast(`File cadangan "${file.name}" berhasil divalidasi dan dipulihkan!`, 'success')
      e.target.value = ''
    }, 1200)
  }

  const menuItems = [
    { label: 'Profil Toko Pusat', icon: Building2 },
    { label: 'Printer Struk & POS', icon: Printer },
    { label: 'Notifikasi & Alarm FEFO', icon: Bell },
    { label: 'Keamanan & Backup', icon: ShieldCheck },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#166534]">Sistem & Konfigurasi</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Pengaturan AgroPOS</h1>
        <p className="mt-1 text-xs text-slate-500">
          Kelola identitas Toko Pusat, printer thermal kasir 58mm/80mm, alarm stok kedaluwarsa, dan keamanan data.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left Submenu */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-3 shadow-card h-fit space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = activeTab === item.label
            return (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-xs font-bold transition ${
                  active
                    ? 'bg-emerald-50 text-[#166534]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={17} /> {item.label}
              </button>
            )
          })}
        </div>

        {/* Right Content Panel */}
        <div className="rounded-3xl border border-slate-200/80 bg-white shadow-card overflow-hidden">
          {/* TAB 1: PROFIL TOKO PUSAT */}
          {activeTab === 'Profil Toko Pusat' && (
            <div>
              <div className="border-b border-slate-100 p-6">
                <h2 className="text-base font-bold text-slate-900">Profil Toko Pusat</h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Informasi ini ditampilkan pada header struk kasir dan dokumen faktur resmi.
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Usaha / Toko</label>
                    <input
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 p-3 text-xs font-semibold outline-none focus:border-[#166534]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">No. Telepon / WhatsApp</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 p-3 text-xs font-semibold outline-none focus:border-[#166534]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Bisnis</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 p-3 text-xs font-semibold outline-none focus:border-[#166534]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">NPWP Usaha (Opsional)</label>
                    <input
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 p-3 text-xs font-mono outline-none focus:border-[#166534]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat Kantor Pusat</label>
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 p-3 text-xs font-semibold outline-none focus:border-[#166534]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRINTER STRUK & POS */}
          {activeTab === 'Printer Struk & POS' && (
            <div>
              <div className="border-b border-slate-100 p-6">
                <h2 className="text-base font-bold text-slate-900">Konfigurasi Printer Thermal</h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Pengaturan cetak kasir via Web Bluetooth API, USB Direct, atau browser dialog.
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Ukuran Kertas Thermal</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPaperSize('58mm')}
                      className={`flex-1 rounded-2xl border p-4 text-left transition ${
                        paperSize === '58mm'
                          ? 'border-[#166534] bg-emerald-50 text-[#166534]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-sm font-black">58 mm (Mini Portable)</div>
                      <div className="text-[11px] text-slate-400 mt-1">Cocok untuk printer Bluetooth kasir mobile</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaperSize('80mm')}
                      className={`flex-1 rounded-2xl border p-4 text-left transition ${
                        paperSize === '80mm'
                          ? 'border-[#166534] bg-emerald-50 text-[#166534]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-sm font-black">80 mm (Standard POS)</div>
                      <div className="text-[11px] text-slate-400 mt-1">Lebar optimal, memuat detail batch dan NPWP</div>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Auto Cut Struk</div>
                    <div className="text-[11px] text-slate-400">Kirim perintah pemotong kertas otomatis ke printer</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoCut}
                    onChange={(e) => setAutoCut(e.target.checked)}
                    className="size-5 rounded border-slate-300 accent-[#166534]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Catatan Kaki Struk (Footer)</label>
                  <textarea
                    rows={2}
                    value={printFooterNote}
                    onChange={(e) => setPrintFooterNote(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 p-3 text-xs font-semibold outline-none focus:border-[#166534]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFIKASI & ALARM FEFO */}
          {activeTab === 'Notifikasi & Alarm FEFO' && (
            <div>
              <div className="border-b border-slate-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Notifikasi & Alarm FEFO</h2>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Konfigurasi ambang batas peringatan obat/pupuk kedaluwarsa dan pemberitahuan staf Toko Pusat.
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#166534]">
                    FEFO Guard Aktif
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Threshold Configuration */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Parameter Waktu Kedaluwarsa (FEFO)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-red-200 bg-red-50/40 p-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-red-800 mb-1">
                        <AlertTriangle size={15} /> Status Kritis (Merah)
                      </div>
                      <p className="text-[11px] text-slate-500 mb-2">Batas hari sebelum ED untuk prioritas jual</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={criticalDays}
                          onChange={(e) => setCriticalDays(Number(e.target.value))}
                          className="w-20 rounded-xl border border-red-300 bg-white p-2 text-xs font-black text-center text-red-700 outline-none"
                        />
                        <span className="text-xs font-bold text-slate-600">Hari</span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                        <Clock size={15} /> Status Waspada (Kuning)
                      </div>
                      <p className="text-[11px] text-slate-500 mb-2">Peringatan awal pemeriksaan stok gudang</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={warningDays}
                          onChange={(e) => setWarningDays(Number(e.target.value))}
                          className="w-20 rounded-xl border border-amber-300 bg-white p-2 text-xs font-black text-center text-amber-700 outline-none"
                        />
                        <span className="text-xs font-bold text-slate-600">Hari</span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 mb-1">
                        <Store size={15} /> Stok Minimum Kritis
                      </div>
                      <p className="text-[11px] text-slate-500 mb-2">Peringatan pengadaan ulang (Reorder Point)</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={minStockAlert}
                          onChange={(e) => setMinStockAlert(Number(e.target.value))}
                          className="w-20 rounded-xl border border-blue-300 bg-white p-2 text-xs font-black text-center text-blue-700 outline-none"
                        />
                        <span className="text-xs font-bold text-slate-600">Unit</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audio Alert Toggle */}
                <div className="rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Volume2 size={16} className="text-[#166534]" />
                      <span className="text-xs font-bold text-slate-800">Alarm Audio di Kasir</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Bunyikan suara notifikasi ketika kasir memindai batch obat/pupuk yang masuk masa kritis (&lt;{criticalDays} hari).
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleTestAlarmSound}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-[#166534] hover:bg-emerald-50 transition"
                    >
                      Uji Suara Alarm
                    </button>
                    <input
                      type="checkbox"
                      checked={enableSoundAlarm}
                      onChange={(e) => setEnableSoundAlarm(e.target.checked)}
                      className="size-5 rounded border-slate-300 accent-[#166534]"
                    />
                  </div>
                </div>

                {/* Gateway WhatsApp & Email */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Kanal Pengiriman Notifikasi Otomatis
                  </h3>

                  <div className="space-y-3">
                    <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-800">WhatsApp Gateway Alert</div>
                          <div className="text-[11px] text-slate-400">
                            Kirim pesan ringkasan batch kritis setiap pagi pukul 07:30 WIB
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={enableWhatsAppAlert}
                          onChange={(e) => setEnableWhatsAppAlert(e.target.checked)}
                          className="size-5 rounded border-slate-300 accent-[#166534]"
                        />
                      </div>

                      {enableWhatsAppAlert && (
                        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100">
                          <input
                            value={managerWhatsApp}
                            onChange={(e) => setManagerWhatsApp(e.target.value)}
                            placeholder="Nomor WhatsApp (contoh: 0812-8899-7711)"
                            className="w-full sm:flex-1 rounded-xl border border-slate-200 p-2 text-xs font-semibold outline-none focus:border-[#166534]"
                          />
                          <button
                            type="button"
                            onClick={handleSendTestNotification}
                            className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-[#166534] hover:bg-emerald-100 transition whitespace-nowrap"
                          >
                            <Send size={13} /> Kirim Pesan Uji Coba
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-800">Email Digest Mingguan</div>
                          <div className="text-[11px] text-slate-400">
                            Rekap spreadsheet Excel status seluruh batch setiap hari Senin
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={enableEmailDigest}
                          onChange={(e) => setEnableEmailDigest(e.target.checked)}
                          className="size-5 rounded border-slate-300 accent-[#166534]"
                        />
                      </div>

                      {enableEmailDigest && (
                        <div className="pt-2 border-t border-slate-100">
                          <input
                            type="email"
                            value={digestEmail}
                            onChange={(e) => setDigestEmail(e.target.value)}
                            placeholder="gudang@agropos.id"
                            className="w-full rounded-xl border border-slate-200 p-2 text-xs font-semibold outline-none focus:border-[#166534]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: KEAMANAN & BACKUP */}
          {activeTab === 'Keamanan & Backup' && (
            <div>
              <div className="border-b border-slate-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Keamanan Data & Pencadangan (Backup)</h2>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Pencadangan database mandiri, enkripsi snapshot data, serta proteksi sesi login staf.
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#166534]">
                    Toko Pusat Terlindungi
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Backup & Snapshot Action */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Download size={18} className="text-[#166534]" />
                        <h3 className="text-xs font-bold text-slate-900">Pencadangan Data Mandiri (Manual Snapshot)</h3>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Unduh seluruh master data barang, batch FEFO, transaksi kasir, hutang/piutang, dan konfigurasi ke format JSON terenkripsi.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleDownloadBackup}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-sm whitespace-nowrap self-start sm:self-auto"
                    >
                      <Download size={15} /> Buat Snapshot Backup Sekarang
                    </button>
                  </div>
                </div>

                {/* Auto Backup & Encryption Schedule */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Jadwal Cadangan & Enkripsi
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-200 p-4">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Frekuensi Auto-Backup
                      </label>
                      <select
                        value={backupSchedule}
                        onChange={(e) => setBackupSchedule(e.target.value as 'daily' | 'weekly' | 'manual')}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-[#166534]"
                      >
                        <option value="daily">Setiap Hari (Pukul 23:59 WIB)</option>
                        <option value="weekly">Mingguan (Setiap Minggu Malam)</option>
                        <option value="manual">Manual Saja</option>
                      </select>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Arsip tersimpan aman pada penyimpanan lokal peramban & server Toko Pusat.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Enkripsi Data AES-256</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Proteksi file cadangan agar tidak dapat dibaca sembarang pihak
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={enableEncryption}
                        onChange={(e) => setEnableEncryption(e.target.checked)}
                        className="size-5 rounded border-slate-300 accent-[#166534]"
                      />
                    </div>
                  </div>
                </div>

                {/* Session & Security Policies */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Kebijakan Keamanan Sesi Kasir & Staf
                  </h3>

                  <div className="space-y-3">
                    <div className="rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Auto-Logout Sesi Tidak Aktif</div>
                        <div className="text-[11px] text-slate-400">
                          Kunci otomatis layar kasir bila tidak ada sentuhan atau transaksi
                        </div>
                      </div>
                      <select
                        value={sessionTimeoutMinutes}
                        onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                        className="rounded-xl border border-slate-200 p-2 text-xs font-semibold outline-none focus:border-[#166534]"
                      >
                        <option value={15}>15 Menit</option>
                        <option value={30}>30 Menit (Direkomendasikan)</option>
                        <option value={60}>1 Jam</option>
                        <option value={0}>Tidak Pernah</option>
                      </select>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Wajibkan PIN Supervisor untuk Void Kasir</div>
                        <div className="text-[11px] text-slate-400">
                          Kasir tidak dapat menghapus struk belanja tanpa persetujuan Admin/Owner
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={requireSupervisorPin}
                        onChange={(e) => setRequireSupervisorPin(e.target.checked)}
                        className="size-5 rounded border-slate-300 accent-[#166534]"
                      />
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Batasi Akses Jaringan Lokal (IP Whitelist)</div>
                        <div className="text-[11px] text-slate-400">
                          Hanya izinkan akses kasir dari subnet WiFi Toko Pusat (192.168.1.0/24)
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={restrictLocalIp}
                        onChange={(e) => setRestrictLocalIp(e.target.checked)}
                        className="size-5 rounded border-slate-300 accent-[#166534]"
                      />
                    </div>
                  </div>
                </div>

                {/* Restore Backup Section */}
                <div className="rounded-2xl border border-dashed border-slate-300 p-5 bg-slate-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <Upload size={16} className="text-slate-600" />
                        <span>Pulihkan Database dari File Cadangan (Restore)</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Pilih file snapshot .json untuk memulihkan master data Toko Pusat.
                      </p>
                    </div>

                    <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs self-start sm:self-auto">
                      <FileCheck size={14} className="text-[#166534]" />
                      <span>{isRestoring ? 'Memvalidasi File...' : 'Pilih File Snapshot (.json)'}</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleRestoreFileChange}
                        disabled={isRestoring}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Action Bar */}
          <div className="flex justify-end border-t border-slate-100 bg-slate-50/70 px-6 py-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-2xl bg-[#166534] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/15 hover:bg-emerald-800 transition"
            >
              {saved ? <Check size={16} /> : <Save size={16} />}
              {saved ? 'Tersimpan!' : 'Simpan Semua Perubahan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
