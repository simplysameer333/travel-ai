'use client'
import { Plus, Minus } from 'lucide-react'
import type { Accent } from '@/components/home/search/DatePickerCell'

const HOVER: Record<Accent, string> = {
  sky:     'hover:border-sky-400 hover:text-sky-600',
  rose:    'hover:border-rose-400 hover:text-rose-500',
  amber:   'hover:border-amber-400 hover:text-amber-600',
  orange:  'hover:border-orange-400 hover:text-orange-600',
  emerald: 'hover:border-emerald-400 hover:text-emerald-600',
}

export function Stepper({ label, sub, val, min, max, onChange, accent = 'sky' }: {
  label: string; sub: string; val: number; min: number; max: number
  onChange: (n: number) => void; accent?: Accent
}) {
  const hover = HOVER[accent]
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
      <div>
        <div className="text-xs font-bold text-slate-800">{label}</div>
        <div className="text-[10px] text-slate-400">{sub}</div>
      </div>
      <div className="flex items-center gap-2.5">
        <button onClick={() => onChange(Math.max(min, val - 1))} disabled={val <= min}
          className={`w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 ${hover} disabled:opacity-30 transition-all`}>
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-5 text-center text-sm font-bold text-slate-800">{val}</span>
        <button onClick={() => onChange(Math.min(max, val + 1))} disabled={val >= max}
          className={`w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 ${hover} disabled:opacity-30 transition-all`}>
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
