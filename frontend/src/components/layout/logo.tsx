import React from 'react'
import { Leaf } from 'lucide-react'

interface LogoProps {
  compact?: boolean
  className?: string
}

export function Logo({ compact = false, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#166534] text-white shadow-md shadow-emerald-900/20">
        <Leaf size={21} strokeWidth={2.4} />
      </div>
      {!compact && (
        <div>
          <div className="text-xl font-extrabold tracking-tight text-slate-900">
            AGRO<span className="text-[#166534]">POS</span>
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Smart Agro Store
          </div>
        </div>
      )}
    </div>
  )
}

