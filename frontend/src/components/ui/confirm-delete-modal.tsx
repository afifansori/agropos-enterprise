'use client'

import React from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  title: string
  message: string
  itemName?: string
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmDeleteModal({
  isOpen,
  title,
  message,
  itemName,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
            <AlertTriangle size={18} />
            <span>{title}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
          {itemName && (
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-3 text-xs font-bold text-red-800">
              {itemName}
            </div>
          )}
          <p className="text-[11px] text-slate-400">
            Tindakan ini akan menghapus data secara permanen dari sistem Toko Pusat.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-900/20 hover:bg-red-700"
          >
            <Trash2 size={14} /> Hapus Data
          </button>
        </div>
      </div>
    </div>
  )
}

