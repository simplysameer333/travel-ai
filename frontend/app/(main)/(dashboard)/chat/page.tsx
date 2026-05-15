'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, Plane, RotateCcw, Bookmark } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
}

const SUGGESTIONS = [
  'Plan a 5-day trip to Goa under ₹15,000',
  'Cheapest flights from Delhi to Mumbai this weekend',
  'Best hill stations to visit in July',
  'Train options from Bangalore to Chennai',
]

function now() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatPage() {
  const { user } = useAuthStore()
  const firstName = user?.full_name.split(' ')[0] ?? 'there'
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hi ${firstName}! ✈️ I'm your AI travel assistant. I can help you plan trips, find cheap flights and trains, compare hotels, and build complete itineraries. What are you planning?`,
      time: now(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim(), time: now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    await new Promise(r => setTimeout(r, 1000))

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: "Great question! I'm currently being set up to connect to our live AI engine. Full AI responses with real flight data, train schedules and hotel pricing are coming very soon. For now, you can search manually using the search page.",
      time: now(),
    }
    setMessages(prev => [...prev, aiMsg])
    setLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-144px)] md:h-[calc(100vh-80px)] max-w-4xl mx-auto w-full">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/25">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">AI Travel Assistant</p>
            <p className="text-xs text-emerald-500 font-medium">{'●'} Online</p>
          </div>
        </div>
        <button
          onClick={() => setMessages([{
            id: Date.now().toString(),
            role: 'assistant',
            content: `Hi ${firstName}! ✈️ I'm your AI travel assistant. What trip shall we plan?`,
            time: now(),
          }])}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'assistant' ? (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-violet-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'}
              </div>
            )}
            <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-tr-sm'
                  : 'bg-white border border-slate-100 text-slate-800 shadow-sm rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
              <div className={`flex items-center gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <span className="text-[10px] text-slate-400">{msg.time}</span>
                {msg.role === 'assistant' && (
                  <button className="text-[10px] text-slate-400 hover:text-sky-500 transition-colors flex items-center gap-1">
                    <Bookmark className="w-3 h-3" /> Save
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center h-4">
                <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions (show only if 1 message) */}
      {messages.length === 1 && (
        <div className="px-4 py-3 bg-white border-t border-slate-100 shrink-0">
          <p className="text-[11px] text-slate-400 font-medium mb-2">Try asking:</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="shrink-0 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-600 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 transition-all flex items-center gap-1.5"
              >
                <Plane className="w-3 h-3" /> {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 py-3 bg-white border-t border-slate-100 shrink-0" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask me to plan a trip..."
            className="flex-1 h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/15 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="h-11 w-11 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/25 hover:shadow-sky-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
