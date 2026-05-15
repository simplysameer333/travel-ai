'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface QuickDest {
  name:  string
  emoji: string
  slug?: string
}

const MOCK_DESTS: QuickDest[] = [
  { name: 'Goa',       emoji: '🏖️' },
  { name: 'Bali',      emoji: '🌺' },
  { name: 'Dubai',     emoji: '🏙️' },
  { name: 'Manali',    emoji: '🏔️' },
  { name: 'Bangkok',   emoji: '⛩️' },
  { name: 'Kerala',    emoji: '🌴' },
  { name: 'Maldives',  emoji: '🐠' },
  { name: 'Singapore', emoji: '🦁' },
  { name: 'Rajasthan', emoji: '🏰' },
  { name: 'Paris',     emoji: '🗼' },
  { name: 'Tokyo',     emoji: '🗾' },
  { name: 'Shimla',    emoji: '❄️' },
  { name: 'London',    emoji: '☂️' },
  { name: 'Coorg',     emoji: '☕' },
  { name: 'New York',  emoji: '🗽' },
  { name: 'Phuket',    emoji: '🏝️' },
  { name: 'Udaipur',   emoji: '🏯' },
  { name: 'Sri Lanka', emoji: '🫖' },
]

async function fetchQuickDests(): Promise<QuickDest[]> {
  return MOCK_DESTS
}

export default function QuickDestBar() {
  const router = useRouter()
  const [dests, setDests] = useState<QuickDest[]>([])
  const [canLeft, setCanLeft]   = useState(false)
  const [canRight, setCanRight] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => { fetchQuickDests().then(setDests) }, [])

  const updateArrows = () => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' })
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateArrows()
    el.addEventListener('scroll', updateArrows, { passive: true })
    return () => el.removeEventListener('scroll', updateArrows)
  }, [dests])

  if (!dests.length) return null

  return (
    <div className="bg-slate-900 border-b border-white/6">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">

          {/* Label — stays fixed, never scrolls */}
          <span className="text-[10px] font-bold text-white/35 uppercase tracking-widest shrink-0">
            Quick&nbsp;search
          </span>

          {/* Left arrow */}
          <button
            onClick={() => scroll('left')}
            disabled={!canLeft}
            className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-white/8 hover:bg-white/16 disabled:opacity-0 disabled:pointer-events-none transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-white/70" />
          </button>

          {/* Scrollable chips — flex-1 so it fills remaining space */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-x-auto no-scrollbar"
          >
            <div className="flex items-center gap-2 w-max">
              {dests.map(d => (
                <button
                  key={d.name}
                  onClick={() => router.push(`/packages?q=${encodeURIComponent(d.slug ?? d.name)}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/6 border border-white/10 hover:bg-white/12 hover:border-white/25 transition-all group"
                >
                  <span className="text-sm leading-none">{d.emoji}</span>
                  <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors whitespace-nowrap">
                    {d.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll('right')}
            disabled={!canRight}
            className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-white/8 hover:bg-white/16 disabled:opacity-0 disabled:pointer-events-none transition-all"
          >
            <ChevronRight className="w-3.5 h-3.5 text-white/70" />
          </button>

        </div>
      </div>
    </div>
  )
}
