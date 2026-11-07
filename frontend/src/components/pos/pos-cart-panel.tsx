'use client'

import React, { useState } from 'react'
import {
  ReceiptText,
  UserRound,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  Tag,
  CircleDollarSign,
  ShoppingCart,
  Percent,
  Store,
  TrendingDown,
} from 'lucide-react'
import { useCartStore } from '@/stores/use-cart-store'
import { mockCustomers } from '@/lib/mock-data'

interface PosCartPanelProps {
  onOpenPayment: () => void
}

export function PosCartPanel({ onOpenPayment }: PosCartPanelProps) {
  const {
    items,
    selectedCustomer,
    discountPercent,
    priceMode,
    setCustomer,
    updateQuantity,
    updateItemDiscount,
    removeItem,
    setDiscountPercent,
    setPriceMode,
    getSubtotal,
    getDiscountAmount,
    getGrandTotal,
  } = useCartStore()

  const [customerPickerOpen, setCustomerPickerOpen] = useState(false)
  const [discountOpen, setDiscountOpen] = useState(false)
  const [localDiscount, setLocalDiscount] = useState<number>(discountPercent)
  const [editingItemDisc, setEditingItemDisc] = useState<string | null>(null)
  const [itemDiscVal, setItemDiscVal] = useState<number>(0)

  const subtotal = getSubtotal()
  const discountAmount = getDiscountAmount()
  const grandTotal = getGrandTotal()
  const totalItemCount = items.reduce((acc, curr) => acc + curr.quantity, 0)

  const handleApplyGlobalDiscount = () => {
    setDiscountPercent(localDiscount)
    setDiscountOpen(false)
  }

  const handleOpenItemDisc = (itemId: string, currentDisc: number) => {
    setEditingItemDisc(itemId)
    setItemDiscVal(currentDisc)
  }

  const handleApplyItemDisc = (itemId: string) => {
    updateItemDiscount(itemId, itemDiscVal)
    setEditingItemDisc(null)
  }

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card">
      {/* Header */}
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Keranjang Kasir</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {totalItemCount} item dalam transaksi berjalan
            </p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-[#166534]">
            <ReceiptText size={18} />
          </div>
        </div>

        {/* Price Mode Toggle — Eceran / Grosir */}
        <div className="mt-3 flex rounded-2xl border border-slate-200 bg-slate-50 p-1 gap-1">
          <button
            onClick={() => setPriceMode('retail')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition ${
              priceMode === 'retail'
                ? 'bg-white text-[#166534] shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Store size={13} /> Harga Eceran
          </button>
          <button
            onClick={() => setPriceMode('wholesale')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition ${
              priceMode === 'wholesale'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <TrendingDown size={13} /> Harga Grosir
          </button>
        </div>

        {/* Customer Selector */}
        <div className="relative mt-2">
          <button
            onClick={() => setCustomerPickerOpen(!customerPickerOpen)}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-500 hover:bg-white"
          >
            <div className="flex items-center gap-2">
              <UserRound size={16} className="text-[#166534]" />
              <div className="text-left">
                <div className="font-bold">
                  {selectedCustomer ? selectedCustomer.name : 'Pelanggan Umum (Tanpa Piutang)'}
                </div>
                {selectedCustomer && (
                  <div className="text-[10px] text-slate-400">
                    {selectedCustomer.phone} • Limit Rp {selectedCustomer.creditLimit.toLocaleString('id-ID')}
                  </div>
                )}
              </div>
            </div>
            <ChevronRight size={15} className="text-slate-400" />
          </button>

          {customerPickerOpen && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <button
                onClick={() => { setCustomer(null); setCustomerPickerOpen(false) }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <UserRound size={14} className="text-slate-400" /> Pelanggan Umum
              </button>
              <div className="my-1 border-t border-slate-100" />
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">
                Daftar Petani / Mitra
              </div>
              {mockCustomers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setCustomer(c); setCustomerPickerOpen(false) }}
                  className="flex w-full flex-col rounded-xl px-3 py-2 text-left text-xs hover:bg-emerald-50"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>{c.name}</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 uppercase">
                      {c.type}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Sisa Limit Piutang: Rp {(c.creditLimit - c.currentCredit).toLocaleString('id-ID')}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="truncate text-xs font-bold text-slate-800">
                  {item.product.name}
                </div>
                <div className="mt-0.5 text-[10px] text-slate-400 font-mono">
                  {priceMode === 'wholesale' && item.quantity >= item.product.wholesaleMinQty ? (
                    <span className="text-emerald-600 font-bold">
                      Grosir @ Rp {item.price.toLocaleString('id-ID')}
                      {item.discount > 0 && ` -${item.discount}%`}
                    </span>
                  ) : (
                    <span>
                      Eceran @ Rp {item.price.toLocaleString('id-ID')}
                      {item.discount > 0 && (
                        <span className="text-orange-500"> -{item.discount}%</span>
                      )}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-black text-slate-900">
                  Rp {item.subtotal.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            {/* Item Discount + Qty Controls */}
            <div className="mt-2 flex items-center justify-between border-t border-slate-100/80 pt-2">
              {/* Item Discount % */}
              {editingItemDisc === item.product.id ? (
                <div className="flex items-center gap-1">
                  <Percent size={12} className="text-orange-500" />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={itemDiscVal}
                    onChange={(e) => setItemDiscVal(Number(e.target.value))}
                    className="w-14 rounded-lg border border-orange-300 px-1.5 py-0.5 text-right text-xs outline-none focus:border-orange-500"
                    autoFocus
                  />
                  <button
                    onClick={() => handleApplyItemDisc(item.product.id)}
                    className="rounded-lg bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white"
                  >
                    Ok
                  </button>
                  <button
                    onClick={() => setEditingItemDisc(null)}
                    className="text-slate-400 hover:text-slate-600 text-[10px]"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleOpenItemDisc(item.product.id, item.discount)}
                  className={`flex items-center gap-1 text-[10px] font-bold transition hover:underline ${
                    item.discount > 0 ? 'text-orange-500' : 'text-slate-400 hover:text-orange-500'
                  }`}
                >
                  <Tag size={11} />
                  {item.discount > 0 ? `Diskon ${item.discount}%` : 'Diskon Item'}
                </button>
              )}

              {/* Qty Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-slate-300 hover:text-red-500 transition p-1"
                  aria-label="Hapus item"
                >
                  <Trash2 size={13} />
                </button>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="flex size-6 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
                >
                  <Minus size={12} />
                </button>
                <span className="w-7 text-center text-xs font-bold text-slate-800">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="flex size-6 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center p-6">
            <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-300 mb-3">
              <ShoppingCart size={28} />
            </div>
            <p className="text-xs font-bold text-slate-600">Keranjang Kasir Kosong</p>
            <p className="mt-1 text-[11px] text-slate-400 max-w-[200px]">
              Klik pada produk di katalog atau scan barcode untuk menambah transaksi.
            </p>
          </div>
        )}
      </div>

      {/* Summary & Checkout Footer */}
      <div className="border-t border-slate-100 bg-slate-50/70 p-4 space-y-2">
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal ({totalItemCount} item)</span>
            <span className="font-semibold text-slate-800">Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>

          {/* Global Discount % */}
          <div className="flex justify-between items-center text-slate-500">
            <span>Diskon Tambahan (%)</span>
            {discountOpen ? (
              <div className="flex items-center gap-1">
                <Percent size={11} className="text-orange-500" />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={localDiscount}
                  onChange={(e) => setLocalDiscount(Number(e.target.value))}
                  className="w-16 rounded-lg border border-slate-200 px-2 py-0.5 text-right text-xs outline-none focus:border-[#166534]"
                  autoFocus
                />
                <span className="text-slate-400">%</span>
                <button
                  onClick={handleApplyGlobalDiscount}
                  className="rounded-lg bg-[#166534] px-2 py-0.5 text-[10px] font-bold text-white"
                >
                  Ok
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setLocalDiscount(discountPercent); setDiscountOpen(true) }}
                className="flex items-center gap-1 font-bold text-[#166534] hover:underline"
              >
                <Percent size={12} />
                {discountPercent > 0
                  ? `- Rp ${discountAmount.toLocaleString('id-ID')} (${discountPercent}%)`
                  : '+ Tambah Diskon'}
              </button>
            )}
          </div>

          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-extrabold text-slate-900">
            <span>Total Bayar</span>
            <span className="text-[#166534]">Rp {grandTotal.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <button
          onClick={onOpenPayment}
          disabled={items.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#166534] py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CircleDollarSign size={18} /> Proses Pembayaran (F4)
        </button>
      </div>
    </section>
  )
}
