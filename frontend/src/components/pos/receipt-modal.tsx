'use client'

import React from 'react'
import { Printer, Check, X, ArrowRight } from 'lucide-react'
import { SaleTransaction } from '@/types/pos'

interface ReceiptModalProps {
  transaction: SaleTransaction | null
  isOpen: boolean
  onClose: () => void
  onNewTransaction: () => void
}

export function ReceiptModal({
  transaction,
  isOpen,
  onClose,
  onNewTransaction,
}: ReceiptModalProps) {
  if (!isOpen || !transaction) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <Check size={18} /> Transaksi Berhasil
          </div>
          <button onClick={onClose} className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        {/* Receipt Simulation Paper */}
        <div className="p-6 bg-slate-100 flex justify-center">
          <div
            id="thermal-receipt"
            className="w-full max-w-[320px] bg-white p-5 shadow-md border border-slate-200 text-[11px] font-mono text-slate-800 leading-relaxed rounded-lg"
          >
            {/* Header Store */}
            <div className="text-center border-b border-dashed border-slate-300 pb-3 mb-3">
              <div className="font-bold text-sm tracking-wider uppercase text-slate-900">
                AGROPOS TANI MAKMUR
              </div>
              <div className="text-[10px] text-slate-500 font-bold">
                TOKO PUSAT
              </div>
              <div className="text-[10px] text-slate-500">
                Jl. Raya Pertanian No. 18, Dramaga, Bogor
              </div>
              <div className="text-[10px] text-slate-500">
                Telp: 0251-8622100 | NPWP: 01.234.567.8
              </div>
            </div>

            {/* Meta */}
            <div className="border-b border-dashed border-slate-300 pb-2 mb-2 space-y-0.5 text-[10px] text-slate-600">
              <div className="flex justify-between">
                <span>No. Struk:</span>
                <span className="font-bold text-slate-800">{transaction.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal:</span>
                <span>{new Date(transaction.createdAt).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir:</span>
                <span>{transaction.cashierName}</span>
              </div>
              {transaction.customer && (
                <div className="flex justify-between">
                  <span>Pelanggan:</span>
                  <span className="font-semibold">{transaction.customer.name}</span>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="border-b border-dashed border-slate-300 pb-2 mb-2 space-y-1.5">
              {transaction.items.map((item, idx) => (
                <div key={idx}>
                  <div className="font-semibold text-slate-800">{item.product.name}</div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</span>
                    <span className="font-bold text-slate-800">Rp {item.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-1 text-[10px] border-b border-dashed border-slate-300 pb-2 mb-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {transaction.subtotal.toLocaleString('id-ID')}</span>
              </div>
              {transaction.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Diskon</span>
                  <span>- Rp {transaction.discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-bold text-slate-900 pt-1 border-t border-slate-200">
                <span>TOTAL</span>
                <span>Rp {transaction.grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-0.5 text-[10px] border-b border-dashed border-slate-300 pb-2 mb-3">
              <div className="flex justify-between uppercase">
                <span>Bayar ({transaction.paymentMethod})</span>
                <span>Rp {transaction.amountPaid.toLocaleString('id-ID')}</span>
              </div>
              {transaction.paymentMethod === 'cash' && (
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Kembali</span>
                  <span>Rp {transaction.changeAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center text-[10px] text-slate-500 space-y-1">
              <div>Terima kasih atas kunjungan Anda!</div>
              <div>Barang yang dibeli tidak dapat ditukar kecuali ada perjanjian.</div>
              <div className="font-bold tracking-widest pt-1">*** LUNAS ***</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-white p-4">
          <button
            onClick={handlePrint}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <Printer size={16} /> Cetak Printer Thermal
          </button>
          <button
            onClick={onNewTransaction}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#166534] py-2.5 text-xs font-bold text-white hover:bg-emerald-800"
          >
            Transaksi Baru <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

