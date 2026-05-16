'use client'

import { useRef, useEffect, Suspense } from 'react'
import { Bot, Send, Plane, RotateCcw, Bookmark } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useChatStore } from '@/store/chatStore'
import { useSearchParams } from 'next/navigation'
import { streamChat } from '@/lib/chat'

const SUGGESTIONS = [
  'Plan a 5-day trip to Goa under ₹15,000',
  'Cheapest flights from Delhi to Mumbai this weekend',
  'Best hill stations to visit in July',
  'Train options from Bangalore to Chennai',
]

function ChatInner() {
  const { user } = useAuthStore()
  const firstName = user?.full_name?.split(' ')[0] ?? 'there'

  const {
    messages, loading, sessionId,
    addMessage, startStreamingMessage, appendToken,
    setLoading, setStatus, reset,
  } = useChatStore()

  const bottomRef   = useRef<HTMLDivElement>(null)
  const inputRef    = useRef<HTMLInputElement>(null)
  const initialised = useRef(false)
  const searchParams = useSearchParams()

  const greeting = `Hey ${firstName}! 🌍 I'm Travel Buddy, your personal AI travel companion. I can help you plan trips, find cheap flights and trains, compare hotels, and build full itineraries. What adventure are we planning?`

  useEffect(() => {
    if (initialised.current) return
    initialised.current = true
    if (messages.length === 0) reset(greeting)
    const q = searchParams.get('q')
    if (q) sendMessage(q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Lock body scroll while chat is mounted
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const ph = html.style.overflow
    const pb = body.style.overflow
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    return () => { html.style.overflow = ph; body.style.overflow = pb }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    if (inputRef.current) inputRef.current.value = ''

    addMessage({ role: 'user', content: text.trim() })

    const history = [
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: text.trim() },
    ]

    const streamId = startStreamingMessage()

    await streamChat(
      history,
      (token) => appendToken(streamId, token),
      ()      => setLoading(false),
      (err)   => { appendToken(streamId, err); setLoading(false) },
      (status) => setStatus(status),
      sessionId,
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage(inputRef.current?.value ?? '')
  }

  const resetChat = () => reset(greeting)

  return (
    <div className="fixed top-[84px] left-0 right-0 bottom-16 md:left-64 md:bottom-0 flex flex-col bg-white overflow-hidden z-20">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white" />
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Travel Buddy</p>
            <p className="text-[11px] text-slate-400">AI-powered travel planner</p>
          </div>
        </div>
        <button
          onClick={resetChat}
          title="New conversation"
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-600"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* ── Messages ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-4 bg-slate-50 no-scrollbar">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'assistant' ? (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shrink-0 shadow-md shadow-violet-500/20 mt-0.5">
                <Bot className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0 mt-0.5">
                {user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'}
              </div>
            )}

            <div className={`flex flex-col gap-1 max-w-[82%] sm:max-w-[72%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-tr-sm'
                  : 'bg-white border border-slate-100 text-slate-800 shadow-sm rounded-tl-sm'
              }`}>
                {msg.content}
                {loading && msg.id.startsWith('stream-') && msg === messages[messages.length - 1] && (
                  <span className="inline-block w-0.5 h-4 bg-violet-400 animate-pulse ml-0.5 align-middle" />
                )}
              </div>
              <div className={`flex items-center gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <span className="text-[10px] text-slate-400">{msg.time}</span>
                {msg.role === 'assistant' && msg.content && (
                  <button className="text-[10px] text-slate-400 hover:text-violet-500 transition-colors flex items-center gap-1">
                    <Bookmark className="w-3 h-3" /> Save
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing dots — only while waiting for first token */}
        {loading && messages[messages.length - 1]?.content === '' && (
          <div className="flex gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center h-4">
                <span className="w-2 h-2 rounded-full bg-violet-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-violet-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-violet-300 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Suggestions ─────────────────────────────────────────────────── */}
      {messages.length <= 1 && (
        <div className="px-4 py-2.5 bg-white border-t border-slate-100 shrink-0">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-2">Try asking</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="shrink-0 px-3 py-2 rounded-xl border border-violet-200 bg-violet-50 text-xs font-medium text-violet-700 hover:border-violet-400 hover:bg-violet-100 transition-all flex items-center gap-1.5"
              >
                <Plane className="w-3 h-3 shrink-0" /> {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input ───────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 bg-white border-t border-slate-100 shrink-0"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask Travel Buddy to plan a trip…"
            className="flex-1 h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-11 w-11 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-violet-500/25 hover:shadow-violet-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatInner />
    </Suspense>
  )
}
