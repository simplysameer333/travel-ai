'use client'

import type { TransportTab, ResultRow } from '../types'

// ── helpers ───────────────────────────────────────────────────────────────────

function Pill({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
        active
          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-800'
      }`}
    >
      {children}
    </button>
  )
}

// ── time-of-day buckets (minutes from midnight) ───────────────────────────────

const TIME_SLOTS = [
  { label: 'Early morning', sub: '12am–6am', from: 0,   to: 360  },
  { label: 'Morning',       sub: '6am–12pm', from: 360, to: 720  },
  { label: 'Afternoon',     sub: '12pm–6pm', from: 720, to: 1080 },
  { label: 'Evening',       sub: '6pm–12am', from: 1080, to: 1440 },
]

function slotActive(depRange: [number, number], slot: { from: number; to: number }) {
  return depRange[0] === slot.from && depRange[1] === slot.to
}

// ── props ─────────────────────────────────────────────────────────────────────

export interface TopFilterProps {
  tab: TransportTab
  results: ResultRow[]

  // flights
  availableStops: number[]
  cheapestPerStop: Record<number, number>
  selectedStops: number[]
  onToggleStop: (s: number) => void
  depTimeRange: [number, number]
  onDepTimeChange: (f: number, t: number) => void

  // trains
  selectedClasses: string[]
  onToggleClass: (c: string) => void

  // bus
  selectedBusTypes: string[]
  onToggleBusType: (t: string) => void

  // car
  selectedCarCategories: string[]
  onToggleCarCategory: (c: string) => void
}

// ── flight top filters ────────────────────────────────────────────────────────

function FlightTopFilters({
  availableStops, cheapestPerStop, selectedStops, onToggleStop,
  depTimeRange, onDepTimeChange,
}: Pick<TopFilterProps, 'availableStops' | 'cheapestPerStop' | 'selectedStops' | 'onToggleStop' | 'depTimeRange' | 'onDepTimeChange'>) {
  return (
    <>
      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider shrink-0">Stops</span>
      {availableStops.map(s => {
        const label = s === 0 ? 'Direct' : s === 1 ? '1 Stop' : `${s}+ Stops`
        const price = cheapestPerStop[s]
        return (
          <Pill key={s} active={selectedStops.includes(s)} onClick={() => onToggleStop(s)}>
            {label}{price ? ` · ₹${price.toLocaleString('en-IN')}` : ''}
          </Pill>
        )
      })}

      <div className="w-px h-5 bg-slate-200 mx-1 shrink-0" />
      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider shrink-0">Departure</span>
      {TIME_SLOTS.map(slot => (
        <Pill
          key={slot.label}
          active={slotActive(depTimeRange, slot)}
          onClick={() =>
            slotActive(depTimeRange, slot)
              ? onDepTimeChange(0, 1440)
              : onDepTimeChange(slot.from, slot.to)
          }
        >
          {slot.label}
        </Pill>
      ))}
    </>
  )
}

// ── train top filters ─────────────────────────────────────────────────────────

const TRAIN_CLASSES = ['SL', '3A', '2A', '1A', 'CC', '2S', 'EC']

function TrainTopFilters({
  results, selectedClasses, onToggleClass, depTimeRange, onDepTimeChange,
}: Pick<TopFilterProps, 'results' | 'selectedClasses' | 'onToggleClass' | 'depTimeRange' | 'onDepTimeChange'>) {
  const available = TRAIN_CLASSES.filter(c => results.some(r => r.class === c))
  const show = available.length > 0 ? available : TRAIN_CLASSES.slice(0, 5)
  return (
    <>
      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider shrink-0">Class</span>
      {show.map(c => (
        <Pill key={c} active={selectedClasses.includes(c)} onClick={() => onToggleClass(c)}>
          {c}
        </Pill>
      ))}
      <div className="w-px h-5 bg-slate-200 mx-1 shrink-0" />
      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider shrink-0">Departure</span>
      {TIME_SLOTS.map(slot => (
        <Pill
          key={slot.label}
          active={slotActive(depTimeRange, slot)}
          onClick={() =>
            slotActive(depTimeRange, slot)
              ? onDepTimeChange(0, 1440)
              : onDepTimeChange(slot.from, slot.to)
          }
        >
          {slot.label}
        </Pill>
      ))}
    </>
  )
}

// ── bus top filters ───────────────────────────────────────────────────────────

const BUS_TYPES = ['AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Non-AC Seater', 'Volvo']

function BusTopFilters({
  results, selectedBusTypes, onToggleBusType, depTimeRange, onDepTimeChange,
}: Pick<TopFilterProps, 'results' | 'selectedBusTypes' | 'onToggleBusType' | 'depTimeRange' | 'onDepTimeChange'>) {
  const available = BUS_TYPES.filter(t => results.some(r => r.bus_type === t))
  const show = available.length > 0 ? available : BUS_TYPES.slice(0, 4)
  return (
    <>
      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider shrink-0">Type</span>
      {show.map(t => (
        <Pill key={t} active={selectedBusTypes.includes(t)} onClick={() => onToggleBusType(t)}>
          {t}
        </Pill>
      ))}
      <div className="w-px h-5 bg-slate-200 mx-1 shrink-0" />
      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider shrink-0">Departure</span>
      {TIME_SLOTS.map(slot => (
        <Pill
          key={slot.label}
          active={slotActive(depTimeRange, slot)}
          onClick={() =>
            slotActive(depTimeRange, slot)
              ? onDepTimeChange(0, 1440)
              : onDepTimeChange(slot.from, slot.to)
          }
        >
          {slot.label}
        </Pill>
      ))}
    </>
  )
}

// ── car top filters ───────────────────────────────────────────────────────────

const CAR_CATEGORIES = ['Hatchback', 'Sedan', 'SUV', 'Luxury', 'Electric']

function CarTopFilters({
  results, selectedCarCategories, onToggleCarCategory,
}: Pick<TopFilterProps, 'results' | 'selectedCarCategories' | 'onToggleCarCategory'>) {
  const available = CAR_CATEGORIES.filter(c => results.some(r => r.category === c))
  const show = available.length > 0 ? available : CAR_CATEGORIES
  return (
    <>
      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider shrink-0">Category</span>
      {show.map(c => (
        <Pill key={c} active={selectedCarCategories.includes(c)} onClick={() => onToggleCarCategory(c)}>
          {c}
        </Pill>
      ))}
    </>
  )
}

// ── main export ───────────────────────────────────────────────────────────────

export function TopFilters(props: TopFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-hide">
      {props.tab === 'flight' && <FlightTopFilters {...props} />}
      {props.tab === 'train'  && <TrainTopFilters  {...props} />}
      {props.tab === 'bus'    && <BusTopFilters    {...props} />}
      {props.tab === 'car'    && <CarTopFilters    {...props} />}
    </div>
  )
}
