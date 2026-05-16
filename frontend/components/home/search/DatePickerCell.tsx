'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

export type Accent = 'sky' | 'rose' | 'amber' | 'orange' | 'emerald'

// All class names written literally so Tailwind includes them in the build
const THEME: Record<Accent, { hover: string; ring: string; text: string; btn: string; selected: string }> = {
  sky:     { hover: 'hover:bg-sky-50',     ring: 'ring-sky-400',     text: 'text-sky-600',     btn: 'text-sky-500 hover:text-sky-700',      selected: 'bg-sky-500'     },
  rose:    { hover: 'hover:bg-rose-50',    ring: 'ring-rose-400',    text: 'text-rose-600',    btn: 'text-rose-500 hover:text-rose-700',     selected: 'bg-rose-500'    },
  amber:   { hover: 'hover:bg-amber-50',   ring: 'ring-amber-400',   text: 'text-amber-600',   btn: 'text-amber-500 hover:text-amber-700',   selected: 'bg-amber-500'   },
  orange:  { hover: 'hover:bg-orange-50',  ring: 'ring-orange-400',  text: 'text-orange-600',  btn: 'text-orange-500 hover:text-orange-700', selected: 'bg-orange-500'  },
  emerald: { hover: 'hover:bg-emerald-50', ring: 'ring-emerald-400', text: 'text-emerald-600', btn: 'text-emerald-500 hover:text-emerald-700', selected: 'bg-emerald-500' },
}

const micro  = 'text-white/50 text-[10px] font-semibold uppercase tracking-wider leading-none mb-0.5'
const DAYS   = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

interface Props {
  label: string
  value: string       // 'YYYY-MM-DD' or ''
  min?: string        // dates before this are disabled
  onChange: (v: string) => void
  iconColor: string   // e.g. 'text-sky-300'
  accent: Accent      // drives all themed colours inside the popup
  className?: string
  defaultOpen?: boolean
  onClose?: () => void
}

export default function DatePickerCell({ label, value, min = '', onChange, iconColor, accent, className, defaultOpen = false, onClose }: Props) {
  const t      = THEME[accent]
  const todayStr = new Date().toISOString().split('T')[0]
  const seed     = value ? new Date(value + 'T00:00:00') : new Date()

  const [open,  setOpen]  = useState(defaultOpen)
  const [month, setMonth] = useState(seed.getMonth())
  const [year,  setYear]  = useState(seed.getFullYear())
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00')
      setMonth(d.getMonth())
      setYear(d.getFullYear())
    }
  }, [value])

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false)
        onClose?.()
      }
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [onClose])

  const display = value
    ? new Date(value + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''

  const grid = useMemo(() => {
    const firstDow    = new Date(year, month, 1).getDay()
    const startOffset = firstDow === 0 ? 6 : firstDow - 1
    const daysInMonth     = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()
    const cells: { day: number; dateStr: string; own: boolean }[] = []

    for (let i = startOffset - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i
      const m = month === 0 ? 12 : month
      const y = month === 0 ? year - 1 : year
      cells.push({ day: d, dateStr: `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`, own: false })
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, dateStr: `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`, own: true })
    }
    const fill = 42 - cells.length
    for (let d = 1; d <= fill; d++) {
      const m = month === 11 ? 1 : month + 2
      const y = month === 11 ? year + 1 : year
      cells.push({ day: d, dateStr: `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`, own: false })
    }
    return cells
  }, [month, year])

  const prevMonth = () => month === 0  ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1)
  const nextMonth = () => month === 11 ? (setMonth(0),  setYear(y => y + 1)) : setMonth(m => m + 1)

  const pick = (dateStr: string, own: boolean) => {
    if (!own || (min && dateStr < min)) return
    onChange(dateStr)
    setOpen(false)
  }

  const goToday = () => {
    const now = new Date()
    setMonth(now.getMonth())
    setYear(now.getFullYear())
    if (!min || todayStr >= min) { onChange(todayStr); setOpen(false) }
  }

  return (
    <div ref={ref} className={className ?? 'relative shrink-0 border-r border-white/15'}>
      {/* ── Trigger ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:py-2.5 hover:bg-white/[0.06] transition-colors h-full w-full"
      >
        <Calendar className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${iconColor} shrink-0`} />
        <div className="text-left">
          <div className={micro}>{label}</div>
          <div className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${value ? 'text-white' : 'text-white/40'}`}>
            {display || 'Select date'}
          </div>
        </div>
      </button>

      {/* ── Calendar popup ── */}
      {open && (
        <div className="absolute top-full mt-2 left-0 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 w-72 z-[60]">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">{label}</p>

          {/* Month / year navigator */}
          <div className="flex items-center justify-between mb-3">
            <button onMouseDown={e => e.preventDefault()} onClick={prevMonth}
              className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
              <ChevronLeft className="w-4 h-4 text-slate-500" />
            </button>
            <span className="text-sm font-bold text-slate-800">{MONTHS[month]} {year}</span>
            <button onMouseDown={e => e.preventDefault()} onClick={nextMonth}
              className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-slate-400 py-1">{d}</div>
            ))}
          </div>

          {/* Date grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {grid.map((cell, i) => {
              const isSelected = cell.dateStr === value
              const isToday    = cell.dateStr === todayStr
              const isDisabled = !cell.own || (!!min && cell.dateStr < min)

              return (
                <button key={i}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => pick(cell.dateStr, cell.own)}
                  disabled={isDisabled}
                  className={[
                    'h-8 w-full rounded-full text-xs font-semibold transition-all flex items-center justify-center',
                    isSelected  ? `${t.selected} text-white shadow-sm`                     : '',
                    !isSelected && isToday && !isDisabled
                                ? `${t.text} ${t.ring} ring-1 font-bold`                   : '',
                    !isSelected && !isToday && !isDisabled
                                ? `text-slate-700 ${t.hover}`                              : '',
                    isDisabled  ? 'text-slate-300 cursor-default'                          : '',
                  ].join(' ')}
                >
                  {cell.day}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
            <button onMouseDown={e => e.preventDefault()}
              onClick={() => { onChange(''); setOpen(false) }}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors">
              Clear
            </button>
            <button onMouseDown={e => e.preventDefault()}
              onClick={goToday}
              className={`text-xs font-semibold transition-colors ${t.btn}`}>
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
