'use client'

import React from 'react'
import { Leaf } from 'lucide-react'
import { useAuthStore } from '@/stores/use-auth-store'

interface LogoProps {
  compact?: boolean
  className?: string
}

export function Logo({ compact = false, className = '' }: LogoProps) {
  const { store } = useAuthStore()

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {store.logoUrl ? (
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={store.logoUrl}
            alt={store.name}
            className="size-full object-contain"
          />
        </div>
      ) : (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#166534] text-white shadow-md shadow-emerald-900/20">
          <Leaf size={21} strokeWidth={2.4} />
        </div>
      )}

      {!compact && (
        <div>
          <div className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
            AGRO<span className="text-[#166534]">POS</span>
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {store.name || 'Smart Agro Store'}
          </div>
        </div>
      )}
    </div>
  )
}
