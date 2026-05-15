'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// ── Data types ────────────────────────────────────────────────────────────────
export interface QuickDest {
  name:  string
  emoji: string
  slug?: string  // optional URL-friendly slug; defaults to name
}

// ── Mock data — swap fetchQuickDests() with real API call when backend ready ──
const MOCK_DESTS: QuickDest[] = [
  { name: 'Goa',       emoji: '🏖️' },
  { name: 'Bali',      emoji: '🇮🇩' },
  { name: 'Dubai',     emoji: '🇦🇪' },
  { name: 'Manali',    emoji: '🏔️' },
  { name: 'Bangkok',   emoji: '🇹🇭' },
  { name: 'Kerala',    emoji: '🌴' },
  { name: 'Maldives',  emoji: '🇲🇻' },
  { name: 'Singapore', emoji: '🇸🇬' },
  { name: 'Rajasthan', emoji: '🏰' },
  { name: 'Paris',     emoji: '🗼' },
  { name: 'Tokyo',     emoji: '🇯🇵' },
  { name: 'Shimla',    emoji: '❄️' },
  { name: 'London',    emoji: '🇬🇧' },
  { name: 'Coorg',     emoji: '☕' },
  { name: 'New York',  emoji: '🗽' },
  { name: 'Phuket',    emoji: '🏝️' },
  { name: 'Udaipur',   emoji: '🏯' },
  { name: 'Sri Lanka', emoji: '🇱🇰' },
]

// TODO: replace mock with real API — GET /api/destinations/popular?limit=20
async function fetchQuickDests(): Promise<QuickDest[]> {
  return MOCK_DESTS
}
// ─────────────────────────────────────────────────────────────────────────────

export default function QuickDestBar() {
  const router = useRouter()
  const [dests, setDests] = useState<QuickDest[]>([])

  useEffect(() => {
    fetchQuickDests().then(setDests)
  }, [])

  if (!dests.length) return null

  return (
    <div className="bg-slate-900 border-b border-white/6">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-white/35 uppercase tracking-widest shrink-0">
            Quick&nbsp;search
          </span>
          <div className="flex items-center gap-2">
            {dests.map(d => (
              <button
                key={d.name}
                onClick={() => router.push(`/packages?q=${encodeURIComponent(d.slug ?? d.name)}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/6 border border-white/10 hover:bg-white/12 hover:border-white/25 transition-all shrink-0 group"
              >
                <span className="text-sm leading-none">{d.emoji}</span>
                <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors whitespace-nowrap">
                  {d.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
