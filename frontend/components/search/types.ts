export type Intent = 'flight' | 'hotel' | 'train' | 'bus' | 'car' | 'package'
export type TransportTab = 'flight' | 'hotel' | 'train' | 'bus' | 'car' | 'package'
export type SortKey = 'cheapest' | 'best' | 'quickest'
export type ResultRow = Record<string, unknown>

export interface ParsedIntent {
  intent: Intent
  from_city: string | null
  to_city: string | null
  city: string | null
  travel_date: string | null
  return_date: string | null
  check_in: string | null
  check_out: string | null
  travelers: number
  nights: number | null
  budget_total: number | null
  ai_message: string
}

export interface AIResponse {
  success: boolean
  intent: ParsedIntent
  results: ResultRow[]
  ai_message: string
  error?: string
}
