'use client'

import { Luggage } from 'lucide-react'
import { SidebarSection } from './SidebarSection'
import type { TransportTab, ResultRow } from '../types'

// ── shared sub-components ─────────────────────────────────────────────────────

function toTime(mins: number) {
  const h = Math.floor(mins / 60) % 24
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function toDuration(mins: number) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function DualRangeSlider({
  min, max, step = 1, from, to, onChange, format,
}: {
  min: number; max: number; step?: number
  from: number; to: number
  onChange: (from: number, to: number) => void
  format: (v: number) => string
}) {
  const range = max - min || 1
  const pct = (v: number) => `${((v - min) / range) * 100}%`
  const thumbCls = `
    absolute w-full appearance-none bg-transparent cursor-pointer z-[1]
    [&::-webkit-slider-runnable-track]:opacity-0
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:bg-sky-500
    [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
    [&::-webkit-slider-thumb]:shadow
  `
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-semibold text-slate-700">
        <span>{format(from)}</span>
        <span>{format(to)}</span>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="absolute w-full h-1.5 bg-slate-200 rounded-full" />
        <div
          className="absolute h-1.5 bg-sky-400 rounded-full"
          style={{ left: pct(from), right: `${100 - ((to - min) / range) * 100}%` }}
        />
        <input type="range" min={min} max={max} step={step} value={from}
          onChange={e => onChange(Math.min(Number(e.target.value), to - step), to)}
          className={thumbCls}
        />
        <input type="range" min={min} max={max} step={step} value={to}
          onChange={e => onChange(from, Math.max(Number(e.target.value), from + step))}
          className={thumbCls}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  )
}

function BagCounter({ label, icon, value, onChange }: {
  label: string; icon: React.ReactNode; value: number; onChange: (n: number) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-slate-700">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onChange(Math.max(0, value - 1))}
          className="w-6 h-6 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-sm leading-none">−</button>
        <span className="w-5 text-center text-sm font-semibold text-slate-800 tabular-nums">{value}</span>
        <button onClick={() => onChange(Math.min(3, value + 1))}
          className="w-6 h-6 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-sm leading-none">+</button>
      </div>
    </div>
  )
}

function CheckList({ items, selected, onToggle, showCount = false, counts = {}, labelMap = {} }: {
  items: string[]
  selected: string[]
  onToggle: (v: string) => void
  showCount?: boolean
  counts?: Record<string, number>
  labelMap?: Record<string, string>
}) {
  return (
    <div className="space-y-2.5">
      {items.map(item => {
        const active = selected.length === 0 || selected.includes(item)
        return (
          <label key={item} className="flex items-center gap-2.5 cursor-pointer group select-none">
            <input type="checkbox" checked={active} onChange={() => onToggle(item)}
              className="w-4 h-4 rounded border-slate-300 accent-sky-500 cursor-pointer" />
            <span className={`text-sm truncate group-hover:text-slate-900 ${active ? 'text-slate-700' : 'text-slate-400 line-through'}`}>
              {labelMap[item] ?? item}
            </span>
            {showCount && counts[item] !== undefined && (
              <span className="text-[11px] text-slate-400 ml-auto">({counts[item]})</span>
            )}
          </label>
        )
      })}
    </div>
  )
}

// ── shared price filter ───────────────────────────────────────────────────────

function PriceFilter({ priceRange, maxPrice, onMaxPriceChange }: {
  priceRange: [number, number]
  maxPrice: number
  onMaxPriceChange: (v: number) => void
}) {
  if (priceRange[1] <= priceRange[0]) return null
  return (
    <SidebarSection title="Max Price">
      <input
        type="range"
        min={priceRange[0]} max={priceRange[1]}
        step={Math.max(100, Math.round((priceRange[1] - priceRange[0]) / 50))}
        value={maxPrice <= priceRange[1] ? maxPrice : priceRange[1]}
        onChange={e => onMaxPriceChange(Number(e.target.value))}
        className="w-full accent-sky-500 cursor-pointer"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
        <span className="font-medium text-slate-600">
          ₹{(maxPrice <= priceRange[1] ? maxPrice : priceRange[1]).toLocaleString('en-IN')}
        </span>
      </div>
    </SidebarSection>
  )
}

// ── props per mode ────────────────────────────────────────────────────────────

export interface FlightFilterProps {
  availableStops: number[]
  stopCounts: Record<number, number>
  cheapestPerStop: Record<number, number>
  selectedStops: number[]
  onToggleStop: (s: number) => void
  onClearStops: () => void
  availableAirlines: string[]
  selectedAirlines: string[]
  onToggleAirline: (a: string) => void
  onSelectAllAirlines: () => void
  priceRange: [number, number]
  maxPrice: number
  onMaxPriceChange: (v: number) => void
  depTimeRange: [number, number]
  onDepTimeChange: (from: number, to: number) => void
  arrTimeRange: [number, number]
  onArrTimeChange: (from: number, to: number) => void
  maxFlightDuration: number
  flightDurationRange: [number, number]
  onFlightDurationChange: (from: number, to: number) => void
  stopoverDurationRange: [number, number]
  onStopoverDurationChange: (from: number, to: number) => void
  availableStopoverAirports: string[]
  selectedStopoverAirports: string[]
  onToggleStopoverAirport: (a: string) => void
  cabinBags: number
  onCabinBagsChange: (n: number) => void
  checkedBags: number
  onCheckedBagsChange: (n: number) => void
}

export interface TrainFilterProps {
  results: ResultRow[]
  priceRange: [number, number]
  maxPrice: number
  onMaxPriceChange: (v: number) => void
  selectedClasses: string[]
  onToggleClass: (c: string) => void
  selectedQuotas: string[]
  onToggleQuota: (q: string) => void
  selectedOperators: string[]
  onToggleOperator: (o: string) => void
  depTimeRange: [number, number]
  onDepTimeChange: (from: number, to: number) => void
  arrTimeRange: [number, number]
  onArrTimeChange: (from: number, to: number) => void
  maxTrainDuration: number
  trainDurationRange: [number, number]
  onTrainDurationChange: (from: number, to: number) => void
  tatkalOnly: boolean
  onTatkalOnlyChange: (v: boolean) => void
  availableOnly: boolean
  onAvailableOnlyChange: (v: boolean) => void
  selectedTrainTypes: string[]
  onToggleTrainType: (t: string) => void
}

export interface BusFilterProps {
  results: ResultRow[]
  priceRange: [number, number]
  maxPrice: number
  onMaxPriceChange: (v: number) => void
  selectedBusTypes: string[]
  onToggleBusType: (t: string) => void
  selectedOperators: string[]
  onToggleOperator: (o: string) => void
  minRating: number
  onMinRatingChange: (r: number) => void
  depTimeRange: [number, number]
  onDepTimeChange: (from: number, to: number) => void
}

export interface CarFilterProps {
  results: ResultRow[]
  priceRange: [number, number]
  maxPrice: number
  onMaxPriceChange: (v: number) => void
  selectedCategories: string[]
  onToggleCategory: (c: string) => void
  selectedFuelTypes: string[]
  onToggleFuelType: (f: string) => void
  selectedCompanies: string[]
  onToggleCompany: (c: string) => void
  acOnly: boolean
  onAcOnlyChange: (v: boolean) => void
}

export interface HotelFilterProps {
  results: ResultRow[]
  priceRange: [number, number]
  maxPrice: number
  onMaxPriceChange: (v: number) => void
  // popular quick toggles
  freeCancellationOnly: boolean
  onFreeCancellationChange: (v: boolean) => void
  breakfastOnly: boolean
  onBreakfastOnlyChange: (v: boolean) => void
  poolOnly: boolean
  onPoolOnlyChange: (v: boolean) => void
  parkingOnly: boolean
  onParkingOnlyChange: (v: boolean) => void
  noPrepaymentOnly: boolean
  onNoPrepaymentChange: (v: boolean) => void
  // star rating
  selectedStarRatings: number[]
  onToggleStarRating: (s: number) => void
  // review score
  minReviewScore: number
  onMinReviewScoreChange: (s: number) => void
  // property type
  selectedPropertyTypes: string[]
  onTogglePropertyType: (t: string) => void
  // meals
  selectedMealPlans: string[]
  onToggleMealPlan: (m: string) => void
  // facilities
  selectedAmenities: string[]
  onToggleAmenity: (a: string) => void
  // bed type
  selectedBedTypes: string[]
  onToggleBedType: (b: string) => void
}

// ── flight filters ────────────────────────────────────────────────────────────

function FlightFilters({
  availableStops, stopCounts, cheapestPerStop, selectedStops, onToggleStop, onClearStops,
  availableAirlines, selectedAirlines, onToggleAirline, onSelectAllAirlines,
  priceRange, maxPrice, onMaxPriceChange,
  depTimeRange, onDepTimeChange,
  arrTimeRange, onArrTimeChange,
  maxFlightDuration, flightDurationRange, onFlightDurationChange,
  stopoverDurationRange, onStopoverDurationChange,
  availableStopoverAirports, selectedStopoverAirports, onToggleStopoverAirport,
  cabinBags, onCabinBagsChange, checkedBags, onCheckedBagsChange,
}: FlightFilterProps) {
  return (
    <>
      <PriceFilter priceRange={priceRange} maxPrice={maxPrice} onMaxPriceChange={onMaxPriceChange} />

      {availableStops.length > 0 && (
        <SidebarSection title="Stops">
          <div className="space-y-2.5">
            {selectedStops.length > 0 && (
              <button onClick={onClearStops} className="text-xs text-sky-500 hover:underline mb-1">Show all</button>
            )}
            {availableStops.map(s => {
              const label = s === 0 ? 'Direct' : s === 1 ? '1 stop' : `${s}+ stops`
              const active = selectedStops.length === 0 || selectedStops.includes(s)
              return (
                <label key={s} className="flex items-center justify-between cursor-pointer group select-none">
                  <div className="flex items-center gap-2.5">
                    <input type="checkbox" checked={active} onChange={() => onToggleStop(s)}
                      className="w-4 h-4 rounded border-slate-300 accent-sky-500 cursor-pointer" />
                    <span className={`text-sm group-hover:text-slate-900 ${active ? 'text-slate-700' : 'text-slate-400 line-through'}`}>
                      {label}
                    </span>
                    <span className="text-[11px] text-slate-400">({stopCounts[s] ?? 0})</span>
                  </div>
                  {cheapestPerStop[s] !== undefined && (
                    <span className="text-xs text-slate-400">from ₹{cheapestPerStop[s].toLocaleString('en-IN')}</span>
                  )}
                </label>
              )
            })}
          </div>
        </SidebarSection>
      )}

      {availableAirlines.length > 0 && (
        <SidebarSection title="Airlines">
          {selectedAirlines.length > 0 && (
            <button onClick={onSelectAllAirlines} className="text-xs text-sky-500 hover:underline mb-2 block">Show all airlines</button>
          )}
          <CheckList items={availableAirlines} selected={selectedAirlines} onToggle={onToggleAirline} />
        </SidebarSection>
      )}

      {maxFlightDuration > 0 && (
        <SidebarSection title="Duration">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-2">Flight leg</p>
              <DualRangeSlider min={0} max={maxFlightDuration} step={15}
                from={flightDurationRange[0]} to={flightDurationRange[1]}
                onChange={onFlightDurationChange} format={toDuration} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-2">Stopover</p>
              <DualRangeSlider min={0} max={1440} step={15}
                from={stopoverDurationRange[0]} to={stopoverDurationRange[1]}
                onChange={onStopoverDurationChange} format={toDuration} />
            </div>
          </div>
        </SidebarSection>
      )}

      <SidebarSection title="Departure Time">
        <DualRangeSlider min={0} max={1440} step={30}
          from={depTimeRange[0]} to={depTimeRange[1]}
          onChange={onDepTimeChange} format={toTime} />
      </SidebarSection>

      <SidebarSection title="Arrival Time">
        <DualRangeSlider min={0} max={1440} step={30}
          from={arrTimeRange[0]} to={arrTimeRange[1]}
          onChange={onArrTimeChange} format={toTime} />
      </SidebarSection>

      {availableStopoverAirports.length > 0 && (
        <SidebarSection title="Stopover Airports">
          <CheckList items={availableStopoverAirports} selected={selectedStopoverAirports} onToggle={onToggleStopoverAirport} />
        </SidebarSection>
      )}

      <SidebarSection title="Baggage">
        <div className="space-y-3">
          <BagCounter label="Cabin bag" icon={<Luggage className="w-3.5 h-3.5 text-slate-400" />} value={cabinBags} onChange={onCabinBagsChange} />
          <BagCounter label="Checked bag" icon={<Luggage className="w-3.5 h-3.5 text-slate-500" />} value={checkedBags} onChange={onCheckedBagsChange} />
          {(cabinBags > 0 || checkedBags > 0) && (
            <p className="text-[10px] text-slate-400 leading-relaxed">Filters fares that include this baggage allowance.</p>
          )}
        </div>
      </SidebarSection>
    </>
  )
}

// ── train filters ─────────────────────────────────────────────────────────────

const TRAIN_CLASS_ORDER = ['SL', '3A', '2A', '1A', 'CC', '2S', 'EC']
const TRAIN_CLASS_LABELS: Record<string, string> = {
  SL: 'Sleeper (SL)', '3A': 'AC 3-Tier (3A)', '2A': 'AC 2-Tier (2A)',
  '1A': 'AC First (1A)', CC: 'Chair Car (CC)', '2S': '2nd Sitting (2S)', EC: 'Exec Chair (EC)',
}
const TRAIN_QUOTAS = ['General', 'Tatkal', 'Ladies', 'Senior Citizen']
const TRAIN_TYPE_KEYWORDS = ['Rajdhani', 'Shatabdi', 'Vande Bharat', 'Duronto', 'Humsafar', 'Tejas', 'Gatimaan', 'Express', 'Mail', 'Passenger']

function TrainQuickToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-slate-300 accent-emerald-500 cursor-pointer" />
      <span className={`text-sm transition-colors ${checked ? 'text-slate-800 font-medium' : 'text-slate-600 group-hover:text-slate-800'}`}>
        {label}
      </span>
    </label>
  )
}

function TrainFilters({
  results, priceRange, maxPrice, onMaxPriceChange,
  selectedClasses, onToggleClass,
  selectedQuotas, onToggleQuota,
  selectedOperators, onToggleOperator,
  depTimeRange, onDepTimeChange,
  arrTimeRange, onArrTimeChange,
  maxTrainDuration, trainDurationRange, onTrainDurationChange,
  tatkalOnly, onTatkalOnlyChange,
  availableOnly, onAvailableOnlyChange,
  selectedTrainTypes, onToggleTrainType,
}: TrainFilterProps) {
  const classes = TRAIN_CLASS_ORDER.filter(c => results.some(r => r.class === c))
  const zones = [...new Set(results.map(r => r.operator as string).filter(Boolean))].sort()
  const hasQuota = results.some(r => r.quota != null)

  const availableTypes = [...new Set(
    results.flatMap(r => {
      const name = (r.train_name as string) ?? ''
      return TRAIN_TYPE_KEYWORDS.filter(kw => name.toLowerCase().includes(kw.toLowerCase()))
    })
  )]

  return (
    <>
      <SidebarSection title="Quick Filters">
        <div className="space-y-2.5">
          <TrainQuickToggle label="Tatkal available"    checked={tatkalOnly}    onChange={onTatkalOnlyChange} />
          <TrainQuickToggle label="Confirmed seats only" checked={availableOnly} onChange={onAvailableOnlyChange} />
        </div>
      </SidebarSection>

      <PriceFilter priceRange={priceRange} maxPrice={maxPrice} onMaxPriceChange={onMaxPriceChange} />

      {classes.length > 0 && (
        <SidebarSection title="Class">
          <CheckList items={classes} selected={selectedClasses} onToggle={onToggleClass} labelMap={TRAIN_CLASS_LABELS} />
        </SidebarSection>
      )}

      {hasQuota && (
        <SidebarSection title="Quota">
          <CheckList items={TRAIN_QUOTAS} selected={selectedQuotas} onToggle={onToggleQuota} />
        </SidebarSection>
      )}

      <SidebarSection title="Departure Time">
        <DualRangeSlider min={0} max={1440} step={30}
          from={depTimeRange[0]} to={depTimeRange[1]}
          onChange={onDepTimeChange} format={toTime} />
      </SidebarSection>

      <SidebarSection title="Arrival Time">
        <DualRangeSlider min={0} max={1440} step={30}
          from={arrTimeRange[0]} to={arrTimeRange[1]}
          onChange={onArrTimeChange} format={toTime} />
      </SidebarSection>

      {maxTrainDuration > 0 && (
        <SidebarSection title="Journey Duration">
          <DualRangeSlider min={0} max={maxTrainDuration} step={30}
            from={trainDurationRange[0]} to={trainDurationRange[1]}
            onChange={onTrainDurationChange} format={toDuration} />
        </SidebarSection>
      )}

      {availableTypes.length > 0 && (
        <SidebarSection title="Train Type">
          <CheckList items={availableTypes} selected={selectedTrainTypes} onToggle={onToggleTrainType} />
        </SidebarSection>
      )}

      {zones.length > 0 && (
        <SidebarSection title="Railway Zone">
          <CheckList items={zones} selected={selectedOperators} onToggle={onToggleOperator} />
        </SidebarSection>
      )}
    </>
  )
}

// ── bus filters ───────────────────────────────────────────────────────────────

const BUS_TYPE_ORDER = ['AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Non-AC Seater', 'Volvo']
const RATING_OPTIONS = [4.5, 4, 3.5, 3]

function BusFilters({
  results, priceRange, maxPrice, onMaxPriceChange,
  selectedBusTypes, onToggleBusType,
  selectedOperators, onToggleOperator,
  minRating, onMinRatingChange,
  depTimeRange, onDepTimeChange,
}: BusFilterProps) {
  const busTypes = BUS_TYPE_ORDER.filter(t => results.some(r => r.bus_type === t))
  const operators = [...new Set(results.map(r => r.operator as string).filter(Boolean))].sort()

  return (
    <>
      <PriceFilter priceRange={priceRange} maxPrice={maxPrice} onMaxPriceChange={onMaxPriceChange} />

      {busTypes.length > 0 && (
        <SidebarSection title="Bus Type">
          <CheckList items={busTypes} selected={selectedBusTypes} onToggle={onToggleBusType} />
        </SidebarSection>
      )}

      <SidebarSection title="Minimum Rating">
        <div className="space-y-2">
          {RATING_OPTIONS.map(r => (
            <label key={r} className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="radio"
                name="bus-rating"
                checked={minRating === r}
                onChange={() => onMinRatingChange(minRating === r ? 0 : r)}
                className="w-4 h-4 accent-violet-500 cursor-pointer"
              />
              <span className="text-sm text-slate-700">⭐ {r}+</span>
            </label>
          ))}
        </div>
      </SidebarSection>

      <SidebarSection title="Departure Time">
        <DualRangeSlider min={0} max={1440} step={30}
          from={depTimeRange[0]} to={depTimeRange[1]}
          onChange={onDepTimeChange} format={toTime} />
      </SidebarSection>

      {operators.length > 0 && (
        <SidebarSection title="Operators">
          <CheckList items={operators} selected={selectedOperators} onToggle={onToggleOperator} />
        </SidebarSection>
      )}
    </>
  )
}

// ── car filters ───────────────────────────────────────────────────────────────

const CAR_CATEGORIES = ['Hatchback', 'Sedan', 'SUV', 'Luxury', 'Electric']
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'CNG']

function CarFilters({
  results, priceRange, maxPrice, onMaxPriceChange,
  selectedCategories, onToggleCategory,
  selectedFuelTypes, onToggleFuelType,
  selectedCompanies, onToggleCompany,
  acOnly, onAcOnlyChange,
}: CarFilterProps) {
  const categories = CAR_CATEGORIES.filter(c => results.some(r => r.category === c))
  const fuels = FUEL_TYPES.filter(f => results.some(r => r.fuel_type === f))
  const companies = [...new Set(results.map(r => r.rental_company as string).filter(Boolean))].sort()

  return (
    <>
      <PriceFilter priceRange={priceRange} maxPrice={maxPrice} onMaxPriceChange={onMaxPriceChange} />

      {categories.length > 0 && (
        <SidebarSection title="Category">
          <CheckList items={categories} selected={selectedCategories} onToggle={onToggleCategory} />
        </SidebarSection>
      )}

      {fuels.length > 0 && (
        <SidebarSection title="Fuel Type">
          <CheckList items={fuels} selected={selectedFuelTypes} onToggle={onToggleFuelType} />
        </SidebarSection>
      )}

      <SidebarSection title="Features">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input type="checkbox" checked={acOnly} onChange={e => onAcOnlyChange(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 accent-orange-500 cursor-pointer" />
          <span className="text-sm text-slate-700">AC only</span>
        </label>
      </SidebarSection>

      {companies.length > 0 && (
        <SidebarSection title="Rental Company">
          <CheckList items={companies} selected={selectedCompanies} onToggle={onToggleCompany} />
        </SidebarSection>
      )}
    </>
  )
}

// ── package filters ───────────────────────────────────────────────────────────

const PACKAGE_TRIP_STYLES = ['Adventure', 'Beach', 'Cultural', 'Honeymoon', 'Family', 'Luxury', 'Budget', 'Backpacker']

export interface PackageFilterProps {
  results: ResultRow[]
  priceRange: [number, number]
  maxPrice: number
  onMaxPriceChange: (v: number) => void
  selectedTripStyles: string[]
  onToggleTripStyle: (s: string) => void
  flightsIncluded: boolean
  onFlightsIncludedChange: (v: boolean) => void
  mealsIncluded: boolean
  onMealsIncludedChange: (v: boolean) => void
  transfersIncluded: boolean
  onTransfersIncludedChange: (v: boolean) => void
}

function PackageQuickToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-slate-300 accent-amber-500 cursor-pointer" />
      <span className={`text-sm transition-colors ${checked ? 'text-slate-800 font-medium' : 'text-slate-600 group-hover:text-slate-800'}`}>
        {label}
      </span>
    </label>
  )
}

function PackageFilters({
  results, priceRange, maxPrice, onMaxPriceChange,
  selectedTripStyles, onToggleTripStyle,
  flightsIncluded, onFlightsIncludedChange,
  mealsIncluded, onMealsIncludedChange,
  transfersIncluded, onTransfersIncludedChange,
}: PackageFilterProps) {
  const available = PACKAGE_TRIP_STYLES.filter(s =>
    results.some(r => r.trip_style === s || r.type === s)
  )
  const show = available.length > 0 ? available : PACKAGE_TRIP_STYLES

  return (
    <>
      <SidebarSection title="Inclusions">
        <div className="space-y-2.5">
          <PackageQuickToggle label="Flights included"    checked={flightsIncluded}    onChange={onFlightsIncludedChange} />
          <PackageQuickToggle label="Meals included"      checked={mealsIncluded}      onChange={onMealsIncludedChange} />
          <PackageQuickToggle label="Transfers included"  checked={transfersIncluded}  onChange={onTransfersIncludedChange} />
        </div>
      </SidebarSection>

      <PriceFilter priceRange={priceRange} maxPrice={maxPrice} onMaxPriceChange={onMaxPriceChange} />

      <SidebarSection title="Trip Style">
        <CheckList items={show} selected={selectedTripStyles} onToggle={onToggleTripStyle} />
      </SidebarSection>
    </>
  )
}

// ── hotel filters ─────────────────────────────────────────────────────────────

const HOTEL_PROPERTY_TYPES = [
  'Hotel', 'Resort', 'Apartment', 'Villa', 'Hostel',
  'Guesthouse', 'Boutique Hotel', 'Heritage Hotel', 'Home Stay',
]
const HOTEL_REVIEW_SCORES = [
  { label: 'Exceptional', sub: '9+',  value: 9 },
  { label: 'Excellent',   sub: '8+',  value: 8 },
  { label: 'Very Good',   sub: '7+',  value: 7 },
  { label: 'Good',        sub: '6+',  value: 6 },
]
const HOTEL_MEAL_PLANS = [
  'Breakfast Included',
  'Half Board',
  'Full Board',
  'All-Inclusive',
  'Self Catering',
]
const HOTEL_BED_TYPES = ['King', 'Queen', 'Double', 'Twin', 'Single', 'Bunk Bed']
const HOTEL_FACILITIES_STATIC = [
  'Free WiFi', 'Swimming Pool', 'Fitness Centre', 'Free Parking',
  'Restaurant', 'Spa', 'Bar', 'Room Service', 'Airport Shuttle',
  'Beach Access', 'Air Conditioning', 'Balcony', 'Kitchen', 'Rooftop',
]

function HotelQuickToggle({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-slate-300 accent-rose-400 cursor-pointer"
      />
      <span className={`text-sm transition-colors ${checked ? 'text-slate-800 font-medium' : 'text-slate-600 group-hover:text-slate-800'}`}>
        {label}
      </span>
    </label>
  )
}

function HotelFilters({
  results, priceRange, maxPrice, onMaxPriceChange,
  freeCancellationOnly, onFreeCancellationChange,
  breakfastOnly, onBreakfastOnlyChange,
  poolOnly, onPoolOnlyChange,
  parkingOnly, onParkingOnlyChange,
  noPrepaymentOnly, onNoPrepaymentChange,
  selectedStarRatings, onToggleStarRating,
  minReviewScore, onMinReviewScoreChange,
  selectedPropertyTypes, onTogglePropertyType,
  selectedMealPlans, onToggleMealPlan,
  selectedAmenities, onToggleAmenity,
  selectedBedTypes, onToggleBedType,
}: HotelFilterProps) {
  const resultFacilities = [...new Set(
    results.flatMap(r => (r.amenities as string[] | undefined) ?? [])
  )]
  const facilities = [
    ...HOTEL_FACILITIES_STATIC.filter(f => !resultFacilities.includes(f)),
    ...resultFacilities,
  ].sort()
  const propertyTypes = HOTEL_PROPERTY_TYPES.filter(t =>
    results.some(r => (r.category ?? r.property_type) === t)
  )

  return (
    <>
      {/* Popular filters — always at top for quick access */}
      <SidebarSection title="Popular Filters">
        <div className="space-y-2.5">
          <HotelQuickToggle label="Free cancellation"     checked={freeCancellationOnly} onChange={onFreeCancellationChange} />
          <HotelQuickToggle label="Breakfast included"    checked={breakfastOnly}        onChange={onBreakfastOnlyChange} />
          <HotelQuickToggle label="Swimming pool"         checked={poolOnly}             onChange={onPoolOnlyChange} />
          <HotelQuickToggle label="Free parking"          checked={parkingOnly}          onChange={onParkingOnlyChange} />
          <HotelQuickToggle label="No prepayment needed"  checked={noPrepaymentOnly}     onChange={onNoPrepaymentChange} />
        </div>
      </SidebarSection>

      <PriceFilter priceRange={priceRange} maxPrice={maxPrice} onMaxPriceChange={onMaxPriceChange} />

      {/* Star rating */}
      <SidebarSection title="Star Rating">
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(s => {
            const active = selectedStarRatings.length === 0 || selectedStarRatings.includes(s)
            return (
              <label key={s} className="flex items-center gap-2.5 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => onToggleStarRating(s)}
                  className="w-4 h-4 rounded border-slate-300 accent-amber-500 cursor-pointer"
                />
                <span className={`text-sm leading-none transition-colors ${active ? 'text-amber-500' : 'text-slate-300'}`}>
                  {'★'.repeat(s)}{'☆'.repeat(5 - s)}
                </span>
                <span className={`text-xs ml-auto ${active ? 'text-slate-500' : 'text-slate-300'}`}>{s} star{s !== 1 ? 's' : ''}</span>
              </label>
            )
          })}
        </div>
      </SidebarSection>

      {/* Guest review score */}
      <SidebarSection title="Guest Review Score">
        <div className="space-y-2">
          {HOTEL_REVIEW_SCORES.map(opt => {
            const active = minReviewScore === opt.value
            return (
              <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer select-none group">
                <input
                  type="radio"
                  name="hotel-review-score"
                  checked={active}
                  onChange={() => onMinReviewScoreChange(active ? 0 : opt.value)}
                  className="w-4 h-4 accent-rose-400 cursor-pointer"
                />
                <span className={`text-sm ${active ? 'text-slate-800 font-medium' : 'text-slate-600 group-hover:text-slate-800'}`}>
                  {opt.label}
                </span>
                <span className="ml-auto text-xs font-semibold bg-sky-600 text-white rounded px-1.5 py-0.5 leading-none">{opt.sub}</span>
              </label>
            )
          })}
        </div>
      </SidebarSection>

      {/* Property type */}
      {propertyTypes.length > 0 && (
        <SidebarSection title="Property Type">
          <CheckList items={propertyTypes} selected={selectedPropertyTypes} onToggle={onTogglePropertyType} />
        </SidebarSection>
      )}

      {/* Meal plans */}
      <SidebarSection title="Meals">
        <CheckList items={HOTEL_MEAL_PLANS} selected={selectedMealPlans} onToggle={onToggleMealPlan} />
      </SidebarSection>

      {/* Facilities */}
      <SidebarSection title="Facilities">
        <CheckList items={facilities} selected={selectedAmenities} onToggle={onToggleAmenity} />
      </SidebarSection>

      {/* Bed type */}
      <SidebarSection title="Bed Type">
        <div className="flex flex-wrap gap-1.5">
          {HOTEL_BED_TYPES.map(b => {
            const active = selectedBedTypes.length === 0 || selectedBedTypes.includes(b)
            return (
              <button
                key={b}
                onClick={() => onToggleBedType(b)}
                className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
                  active
                    ? 'bg-slate-800 border-slate-800 text-white'
                    : 'border-slate-200 text-slate-400'
                }`}
              >
                {b}
              </button>
            )
          })}
        </div>
      </SidebarSection>
    </>
  )
}

// ── registry ──────────────────────────────────────────────────────────────────

export interface SearchFiltersProps {
  tab: TransportTab
  aiMessage: string
  onClearAll: () => void
  hasActiveFilters: boolean
  flight: FlightFilterProps
  hotel: HotelFilterProps
  train: TrainFilterProps
  bus: BusFilterProps
  car: CarFilterProps
  pkg: PackageFilterProps
}

export function SearchFilters({ tab, aiMessage, onClearAll, hasActiveFilters, flight, hotel, train, bus, car, pkg }: SearchFiltersProps) {
  return (
    <div>
      {aiMessage && (
        <div className="bg-sky-50 rounded-lg p-3 text-xs text-sky-700 italic leading-relaxed mb-4">
          {aiMessage}
        </div>
      )}

      {tab === 'flight'   && <FlightFilters   {...flight} />}
      {tab === 'hotel'    && <HotelFilters    {...hotel} />}
      {tab === 'train'    && <TrainFilters    {...train} />}
      {tab === 'bus'      && <BusFilters      {...bus} />}
      {tab === 'car'      && <CarFilters      {...car} />}
      {tab === 'package'  && <PackageFilters  {...pkg} />}

      {hasActiveFilters && (
        <button
          onClick={onClearAll}
          className="mt-4 w-full text-xs text-sky-600 hover:text-sky-800 font-semibold py-2.5 border border-sky-200 rounded-xl hover:bg-sky-50 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}
