import { Plane, Hotel, Train, Bus, Car } from 'lucide-react'
import type { Intent } from './types'

export const INTENT_META: Record<Intent, {
  icon: typeof Plane
  bg: string
  label: string
  accentBtn: string
}> = {
  flight: { icon: Plane,  bg: 'bg-sky-500',     label: 'Flights',       accentBtn: 'bg-sky-500 hover:bg-sky-600'         },
  hotel:  { icon: Hotel,  bg: 'bg-amber-500',   label: 'Hotels',        accentBtn: 'bg-amber-500 hover:bg-amber-600'     },
  train:  { icon: Train,  bg: 'bg-emerald-500', label: 'Trains',        accentBtn: 'bg-emerald-500 hover:bg-emerald-600' },
  bus:    { icon: Bus,    bg: 'bg-violet-500',  label: 'Buses',          accentBtn: 'bg-violet-500 hover:bg-violet-600'   },
  car:    { icon: Car,    bg: 'bg-orange-500',  label: 'Cars',           accentBtn: 'bg-orange-500 hover:bg-orange-600'  },
}
