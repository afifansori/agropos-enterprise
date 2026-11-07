'use client'

import React, { useState } from 'react'
import {
  X,
  Banknote,
  QrCode,
  Building,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Receipt,
} from 'lucide-react'
import { useCartStore } from '@/stores/use-cart-store'
import { useAuthStore } from '@/stores/use-auth-store'
import { PaymentMethod, SaleTransaction } from '@/types/pos'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (transaction: SaleTransaction) => void
}

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const {
    items,
    getGrandTotal,
    getSubtotal,
    getDiscountAmount,
    discountPercent,
    selectedCustomer,
    checkout,
  } = useCartStore()

  const { currentUser } = useAuthStore()

  const grandTotal = getGrandTotal()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('cash')
  const [cashGiven, setCashGiven] = useState<number>(grandTotal)
  const [tempoDays, setTempoDays] = useState<number>(30)
  const [notes, setNotes] = useState('')

  if (!isOpen) return null

  const change = Math.max(0, cashGiven - grandTotal)
  const isCashSufficient = cashGiven >= grandTotal

  const quickAmounts = [
    grandTotal,
    Math.ceil(grandTotal / 50000) * 50000 || 50000,
    Math.ceil(grandTotal / 100000) * 100000 || 100000,
    Math.ceil(grandTotal / 200000) * 200000 || 200000,
  ].filter((v, i, a) => a.indexOf(v) === i)

  const handleProcess = () => {
    if (selectedMethod === 'cash' && !isCashSufficient) {
      alert('Jumlah uang tunai yang diterima kurang dari total tagihan.')
      return
    }

    const cashierName = currentUser?.name || 'Kasir Toko Pusat'

    const transaction = checkout(
      selectedMethod === 'cash' ? cashGiven : grandTotal,
      cashierName
    )

    onSuccess(transaction)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-[#166534]">
              <Receipt size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pembayaran Transaksi</h2>
              <p className="text-xs text-slate-400">Pilih metode pembayaran dan konfirmasi nominal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Total Display */}
        <div className="bg-emerald-50/70 border-b border-emerald-100/80 px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-800">Total Tagihan</span>
            <div className="text-2xl font-black text-[#166534]">
              Rp {grandTotal.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="text-right text-xs text-emerald-700">
            <div>{items.reduce((acc, i) => acc + i.quantity, 0)} Item Produk</div>
            <div className="font-semibold">{selectedCustomer ? selectedCustomer.name : 'Pelanggan Umum'}</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Method Selector Tabs */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-2.5">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod('cash')}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-xs font-bold transition ${
                  selectedMethod === 'cash'
                    ? 'border-[#166534] bg-emerald-50/50 text-[#166534] ring-2 ring-[#166534]/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Banknote size={20} />
                Tunai
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('qris')}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-xs font-bold transition ${
                  selectedMethod === 'qris'
                    ? 'border-[#166534] bg-emerald-50/50 text-[#166534] ring-2 ring-[#166534]/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <QrCode size={20} />
                QRIS
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('transfer')}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-xs font-bold transition ${
                  selectedMethod === 'transfer'
                    ? 'border-[#166534] bg-emerald-50/50 text-[#166534] ring-2 ring-[#166534]/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building size={20} />
                Transfer
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('tempo')}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-xs font-bold transition ${
                  selectedMethod === 'tempo'
                    ? 'border-[#166534] bg-emerald-50/50 text-[#166534] ring-2 ring-[#166534]/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Calendar size={20} />
                Tempo / Piutang
              </button>
            </div>
          </div>

          {/* Conditional Method Details */}
          {selectedMethod === 'cash' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">
                  Uang Tunai Diterima (Rp)
                </label>
                <input
                  type="number"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 p-3.5 text-lg font-bold text-slate-800 outline-none focus:border-[#166534] focus:ring-4 focus:ring-emerald-50"
                  placeholder="0"
                />
              </div>

              {/* Quick Cash Buttons */}
              <div className="flex flex-wrap gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCashGiven(amt)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      cashGiven === amt
                        ? 'bg-[#166534] text-white'
                        : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {amt === grandTotal ? 'Uang Pas' : `Rp ${amt.toLocaleString('id-ID')}`}
                  </button>
                ))}
              </div>

              {/* Kembalian */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Uang Kembalian</span>
                  <div className={`text-xl font-extrabold ${change > 0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                    Rp {change.toLocaleString('id-ID')}
                  </div>
                </div>
                {!isCashSufficient && (
                  <span className="flex items-center gap-1 text-xs font-bold text-red-600">
                    <AlertCircle size={14} /> Kurang Rp {(grandTotal - cashGiven).toLocaleString('id-ID')}
                  </span>
                )}
              </div>
            </div>
          )}

          {selectedMethod === 'qris' && (
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50">
              <QrCode size={90} className="text-[#166534] mb-3" />
              <div className="text-sm font-bold text-slate-800">Scan QRIS Dinamis AgroPOS</div>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Mendukung Gopay, OVO, Dana, ShopeePay, BCA Mobile, Livin Mandiri, dan semua e-wallet berlisensi QRIS.
              </p>
            </div>
          )}

          {selectedMethod === 'transfer' && (
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-bold text-slate-700">Pilih Rekening Tujuan Toko:</div>
              <div className="space-y-2 text-xs">
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-emerald-500">
                  <div className="flex items-center gap-2">
                    <input type="radio" name="bank" defaultChecked className="accent-[#166534]" />
                    <div>
                      <div className="font-bold text-slate-800">BCA - 8892019920</div>
                      <div className="text-[11px] text-slate-400">a.n. PT Agro Tani Makmur</div>
                    </div>
                  </div>
                  <span className="font-semibold text-emerald-700">Otomatis Terverifikasi</span>
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-emerald-500">
                  <div className="flex items-center gap-2">
                    <input type="radio" name="bank" className="accent-[#166534]" />
                    <div>
                      <div className="font-bold text-slate-800">Bank Mandiri - 133009988112</div>
                      <div className="text-[11px] text-slate-400">a.n. PT Agro Tani Makmur</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {selectedMethod === 'tempo' && (
            <div className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                <AlertCircle size={16} /> Fasilitas Piutang Petani / Reseller
              </div>
              <p className="text-xs text-amber-700">
                Transaksi ini akan dicatat ke buku piutang pelanggan. Pastikan pelanggan telah disetujui memiliki limit kredit.
              </p>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Jangka Waktu Tempo (Hari)
                </label>
                <select
                  value={tempoDays}
                  onChange={(e) => setTempoDays(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-semibold text-slate-800 outline-none"
                >
                  <option value={14}>14 Hari (2 Minggu)</option>
                  <option value={30}>30 Hari (1 Bulan - Pasca Panen)</option>
                  <option value={60}>60 Hari (2 Bulan)</option>
                  <option value={90}>90 Hari (Musim Tanam)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleProcess}
            disabled={selectedMethod === 'cash' && !isCashSufficient}
            className="flex items-center gap-2 rounded-xl bg-[#166534] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 size={16} /> Konfirmasi Pembayaran & Cetak Struk
          </button>
        </div>
      </div>
    </div>
  )
}

