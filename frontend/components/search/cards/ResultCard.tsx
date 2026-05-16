import type { Intent, ResultRow } from '../types'
import { FlightCard }        from './FlightCard'
import { HotelCard }         from './HotelCard'
import { TrainCard }         from './TrainCard'
import { BusCard }           from './BusCard'
import { CarCard }           from './CarCard'
import { PackageResultCard } from './PackageResultCard'

interface Props {
  intent: Intent
  r: ResultRow
}

const CARD_MAP: Record<Intent, React.ComponentType<{ r: ResultRow }>> = {
  flight:  FlightCard,
  hotel:   HotelCard,
  train:   TrainCard,
  bus:     BusCard,
  car:     CarCard,
  package: PackageResultCard,
}

export function ResultCard({ intent, r }: Props) {
  const Card = CARD_MAP[intent]
  return <Card r={r} />
}
