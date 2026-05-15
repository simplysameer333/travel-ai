'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import { type Accent } from './DatePickerCell'
import { CITIES, COUNTRY_FLAGS } from '@/components/search/cities'
import type { City } from '@/components/search/cities'

export type { City }

const HIGHLIGHT: Record<Accent, string> = {
  sky:     'bg-sky-50',
  rose:    'bg-rose-50',
  amber:   'bg-amber-50',
  orange:  'bg-orange-50',
  emerald: 'bg-emerald-50',
}

const POPULAR_NAMES = ['Delhi', 'Mumbai', 'Bangalore', 'Goa', 'Kochi', 'Dubai', 'Singapore', 'Bangkok']
const POPULAR = CITIES.filter(c => POPULAR_NAMES.includes(c.name))

interface Props {
  label: string
  placeholder: string
  value: string
  onChange: (val: string) => void
  icon: React.ReactNode
  iconBg: string
  accent?: Accent
  className?: string
}

const micro = 'text-white/50 text-[10px] font-semibold uppercase tracking-wider leading-none mb-0.5'
const inp   = 'bg-transparent text-white placeholder-white/40 text-sm font-medium outline-none w-full'

export default function CitySearchInput({ label, placeholder, value, onChange, icon, iconBg, accent = 'sky', className = '' }: Props) {
  const [open, setOpen]               = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const q = value.trim().toLowerCase()
    if (!q) return POPULAR
    return CITIES.filter(c =>
      c.name.toLowerCase().startsWith(q) ||
      (c.iata && c.iata.toLowerCase().startsWith(q)) ||
      c.country.toLowerCase().startsWith(q) ||
      c.name.toLowerCase().includes(q)
    ).slice(0, 8)
  }, [value])

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const select = (city: City) => {
    onChange(city.iata ? `${city.name} (${city.iata})` : city.name)
    setOpen(false)
    setHighlighted(0)
  }

  return (
    <div ref={ref} className={`relative flex items-center gap-2 ${className}`}>
      <div className={`w-6 h-6 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className={micro}>{label}</div>
        <input
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true); setHighlighted(0) }}
          onFocus={() => setOpen(true)}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, results.length - 1)) }
            if (e.key === 'ArrowUp')   { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)) }
            if (e.key === 'Enter' && results[highlighted]) select(results[highlighted])
            if (e.key === 'Escape') setOpen(false)
          }}
          className={inp}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          suppressHydrationWarning
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 bg-white rounded-2xl shadow-2xl border border-slate-100 w-72 max-h-64 overflow-y-auto z-[70]">
          <div className="px-3 pt-2.5 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-50">
            {!value.trim() ? 'Popular destinations' : 'Matching cities'}
          </div>
          {results.map((city, i) => (
            <button
              key={city.name}
              onMouseDown={e => e.preventDefault()}
              onClick={() => select(city)}
              className={`w-full text-left flex items-center gap-3 px-3 py-2.5 transition-colors ${i === highlighted ? HIGHLIGHT[accent] : 'hover:bg-slate-50'}`}
            >
              <span className="text-xl leading-none shrink-0">{COUNTRY_FLAGS[city.country] ?? '🌍'}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-800 truncate">{city.name}</div>
                <div className="text-xs text-slate-400 truncate">{city.country}</div>
              </div>
              {city.iata && (
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">{city.iata}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
