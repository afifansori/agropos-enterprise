'use client'

import React from 'react'
import { Check, Info, AlertCircle, X } from 'lucide-react'
import { useAppStore } from '@/stores/use-app-store'

export function ToastContainer() {
  const { toasts, removeToast } = useAppStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const isError = toast.type === 'error'
        const isInfo = toast.type === 'info'

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-slate-900/95 px-4 py-3.5 text-sm font-semibold text-white shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in"
          >
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
                isError ? 'bg-red-500' : isInfo ? 'bg-blue-500' : 'bg-emerald-500'
              }`}
            >
              {isError ? <AlertCircle size={14} /> : isInfo ? <Info size={14} /> : <Check size={14} />}
            </span>
            <span className="flex-1 text-xs leading-5 text-slate-100">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

