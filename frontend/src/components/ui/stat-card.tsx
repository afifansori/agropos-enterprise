import React from 'react'
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  detail: string
  icon: LucideIcon
  trend?: string
  trendDown?: boolean
  tone?: 'green' | 'blue' | 'purple' | 'amber' | 'red'
}

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  trend,
  trendDown = false,
  tone = 'green',
}: StatCardProps) {
  const toneClasses = {
    green: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  }

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className={`flex size-11 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
          <Icon size={22} />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
              trendDown ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {trendDown ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
            {trend}
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="text-sm font-medium text-slate-500">{label}</div>
        <div className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</div>
        <div className="mt-1.5 text-xs text-slate-400">{detail}</div>
      </div>
    </article>
  )
}

