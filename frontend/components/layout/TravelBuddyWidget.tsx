'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Plane, ArrowRight, Maximize2 } from 'lucide-react'
import { useChatStore } from '@/store/chatStore'
import { useAuthStore } from '@/store/authStore'
import { streamChat } from '@/lib/chat'

const QUICK = [
  'Cheapest flights this weekend',
  'Hotels in Goa under ₹3k',
  'Delhi to Mumbai train options',
]

const GREETING = "Hey! 🌍 Tell me where you want to go and I'll find the cheapest way to get there."

export default function TravelBuddyWidget() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuthStore()
  const { messages, loading, widgetOpen, addMessage, startStreamingMessage, appendToken, setLoading, setWidgetOpen, reset } = useChatStore()

  const [visible, setVisible]     = useState(false)
  const [tooltipOn, setTooltipOn] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Initialise greeting in store if empty
  useEffect(() => {
    if (messages.length === 0) {
      reset(GREETING)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Appear after 3 s OR first scroll — whichever comes first
  useEffect(() => {
    let shown = false
    const show = () => {
      if (shown) return
      shown = true
      setVisible(true)
    }
    const timer = setTimeout(show, 3000)
    const onScroll = () => { show(); window.removeEventListener('scroll', onScroll) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(timer); window.removeEventListener('scroll', onScroll) }
  }, [])

  // Peek tooltip: shows 600 ms after widget appears (only if panel not already open)
  useEffect(() => {
    if (!visible || widgetOpen) return
    const t1 = setTimeout(() => setTooltipOn(true),  600)
    const t2 = setTimeout(() => setTooltipOn(false), 4600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [visible, widgetOpen])

  // Auto-scroll to bottom when panel opens or messages change
  useEffect(() => {
    if (widgetOpen) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80)
    }
  }, [widgetOpen, messages])

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
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputRef.current?.value ?? '')
  }

  const openFullChat = () => {
    router.push('/chat')
    setWidgetOpen(false)
  }

  const toggleOpen = () => {
    setWidgetOpen(!widgetOpen)
    setTooltipOn(false)
  }

  const hasConversation = messages.length > 1

  // All hooks above — safe to guard render here
  if (pathname === '/chat') return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="buddy-widget"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-2"
        >

          {/* ── Mini chat panel ─────────────────────────────────────── */}
          <AnimatePresence>
            {widgetOpen && (
              <motion.div
                key="panel"
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0,  scale: 1    }}
                exit={{    opacity: 0, y: 16, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                className="w-[320px] rounded-2xl bg-white border border-slate-200 shadow-2xl shadow-violet-500/15 flex flex-col overflow-hidden"
                style={{ height: '70vh', maxHeight: '680px', minHeight: '400px' }}
              >
                {/* Panel header — fixed */}
                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-700 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-none">Travel Buddy</p>
                      <p className="text-[10px] text-violet-200 mt-0.5">AI travel planner</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={openFullChat}
                      title="Open full chat"
                      className="w-6 h-6 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                    >
                      <Maximize2 className="w-3 h-3 text-white" />
                    </button>
                    {/* Minimise — collapses back to FAB */}
                    <button
                      onClick={() => setWidgetOpen(false)}
                      title="Minimise"
                      className="w-6 h-6 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Messages — flex-1 fills all remaining space */}
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 no-scrollbar bg-slate-50/50">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-violet-500/20">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {msg.role === 'user' && (
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5">
                          {user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'}
                        </div>
                      )}
                      <div className={`max-w-[82%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-tr-sm'
                          : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-tl-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {loading && (
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <div className="bg-white border border-slate-100 rounded-xl rounded-tl-sm px-3 py-2 shadow-sm">
                        <div className="flex gap-1 items-center h-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Quick chips — only when no conversation yet */}
                {!hasConversation && (
                  <div className="px-3 py-2 flex flex-wrap gap-1.5 border-t border-slate-100 shrink-0 bg-white">
                    {QUICK.map(q => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-violet-50 border border-violet-200 text-[11px] text-violet-700 font-medium hover:bg-violet-100 transition-colors"
                      >
                        <Plane className="w-2.5 h-2.5 shrink-0" /> {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input — fixed at bottom */}
                <div className="px-3 py-2.5 border-t border-slate-100 shrink-0 bg-white">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                      ref={inputRef}
                      placeholder="Ask anything…"
                      className="flex-1 h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="h-9 w-9 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-violet-500/25 disabled:opacity-40 transition-all shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

                {/* Open full chat — footer */}
                <button
                  onClick={openFullChat}
                  className="w-full flex items-center justify-center gap-1.5 py-2 border-t border-slate-100 text-[11px] text-violet-600 font-semibold hover:bg-violet-50 transition-colors shrink-0 bg-white"
                >
                  Open full Travel Buddy <ArrowRight className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Peek tooltip ────────────────────────────────────────── */}
          <AnimatePresence>
            {tooltipOn && !widgetOpen && (
              <motion.div
                key="tooltip"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0  }}
                exit={{    opacity: 0, x: 10  }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 bg-white border border-violet-200 text-slate-700 text-xs font-medium px-3 py-2 rounded-xl shadow-lg shadow-violet-500/10 whitespace-nowrap"
              >
                <span>✈️</span> Plan your next trip?
                <button
                  onClick={() => setTooltipOn(false)}
                  className="ml-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── FAB button ──────────────────────────────────────────── */}
          <div className="relative">
            {!widgetOpen && (
              <span className="absolute inset-0 rounded-full animate-ping bg-violet-400 opacity-20 pointer-events-none" />
            )}

            <button
              onClick={toggleOpen}
              className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 ${
                widgetOpen
                  ? 'bg-gradient-to-br from-slate-700 to-slate-800 shadow-slate-500/30 rotate-12'
                  : 'bg-gradient-to-br from-violet-500 to-purple-700 shadow-violet-500/40 hover:shadow-violet-500/60 hover:scale-105'
              }`}
              aria-label="Open Travel Buddy"
            >
              <AnimatePresence mode="wait">
                {widgetOpen ? (
                  <motion.span key="close"
                    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.span>
                ) : (
                  <motion.span key="bot"
                    initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}
                  >
                    <Bot className="w-6 h-6 text-white" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {!widgetOpen && (
              <span className="absolute bottom-0.5 right-0.5 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
              </span>
            )}
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
