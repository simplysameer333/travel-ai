'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, Sparkles, ArrowUp } from 'lucide-react'

const examplePrompts = [
  { emoji: '🏖️', text: 'Beach vacation ₹15k' },
  { emoji: '🌏', text: 'Thailand trip ₹40k' },
  { emoji: '🏔️', text: 'Manali trip' },
  { emoji: '👨‍👩‍👧', text: 'Family trip with kids' },
  { emoji: '❄️', text: 'Cold places in June' },
  { emoji: '🌴', text: 'Weekend getaway Mumbai' },
]

interface Props {
  compact?: boolean
}

export default function AIChatInput({ compact = false }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSubmit = () => {
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">

      {/* ── Main input ── */}
      <div className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl shadow-black/30 overflow-hidden ring-1 ring-white/10">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={'Ask AI anything… "Plan a Goa trip for 3 people under ₹15,000"'}
          rows={compact ? 2 : 3}
          suppressHydrationWarning
          className="w-full px-4 pt-4 pb-2 text-white placeholder:text-white/35 text-sm bg-transparent resize-none outline-none leading-relaxed caret-emerald-400"
        />

        <div className="flex items-center justify-between px-3 py-2.5 border-t border-white/15">
          <button
            type="button"
            className="flex items-center gap-1 text-white/40 hover:text-emerald-400 transition-colors"
            aria-label="Voice input"
          >
            <Mic className="w-3.5 h-3.5" />
            {!compact && <span className="text-xs hidden sm:inline">Speak</span>}
          </button>

          <div className="flex items-center gap-2">
            {!compact && (
              <span className="text-[10px] text-white/25 hidden sm:inline tracking-wide">
                Enter to send
              </span>
            )}
            <button
              onClick={handleSubmit}
              suppressHydrationWarning
              disabled={!query.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-white text-xs font-bold hover:from-emerald-400 hover:to-sky-400 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Plan My Trip
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Example prompt chips — single scrollable row ── */}
      <div className={`flex justify-center gap-1.5 overflow-x-auto no-scrollbar ${compact ? 'mt-2' : 'mt-3 sm:mt-4'}`}>
        {examplePrompts.slice(0, compact ? 4 : 6).map((prompt) => (
          <button
            key={prompt.text}
            onClick={() => setQuery(prompt.text)}
            suppressHydrationWarning
            className="flex items-center gap-1 shrink-0 bg-white/12 hover:bg-white/22 backdrop-blur-sm border border-white/25 hover:border-white/50 text-white/90 hover:text-white text-xs font-medium px-2.5 py-1.5 rounded-full transition-all"
          >
            <span>{prompt.emoji}</span>
            <span className="whitespace-nowrap">{prompt.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
