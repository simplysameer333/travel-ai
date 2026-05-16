import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
}

function now() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

// Stable session ID — generated once, persisted in localStorage
function makeSessionId() {
  return `sess-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

interface ChatState {
  messages: ChatMessage[]
  loading: boolean
  widgetOpen: boolean
  statusText: string          // live status from the graph (e.g. "Searching flights...")
  sessionId: string           // used as LangGraph thread_id for per-session persistence

  addMessage: (msg: Omit<ChatMessage, 'id' | 'time'>) => ChatMessage
  /** Creates an empty assistant bubble and returns its id */
  startStreamingMessage: () => string
  /** Appends a token to the streaming message */
  appendToken: (id: string, token: string) => void
  setLoading: (v: boolean) => void
  setWidgetOpen: (v: boolean) => void
  setStatus: (text: string) => void
  reset: (greeting: string) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      loading: false,
      widgetOpen: false,
      statusText: '',
      sessionId: makeSessionId(),

      addMessage: (msg) => {
        const full: ChatMessage = { ...msg, id: Date.now().toString(), time: now() }
        set(s => ({ messages: [...s.messages, full] }))
        return full
      },

      startStreamingMessage: () => {
        const id = `stream-${Date.now()}`
        const msg: ChatMessage = { id, role: 'assistant', content: '', time: now() }
        set(s => ({ messages: [...s.messages, msg], loading: true, statusText: '' }))
        return id
      },

      appendToken: (id, token) => {
        set(s => ({
          messages: s.messages.map(m =>
            m.id === id ? { ...m, content: m.content + token } : m
          ),
          statusText: '',  // clear status once tokens start flowing
        }))
      },

      setLoading: (loading) => set({ loading, statusText: loading ? '' : '' }),
      setWidgetOpen: (widgetOpen) => set({ widgetOpen }),
      setStatus: (statusText) => set({ statusText }),

      reset: (greeting) => {
        set({
          loading: false,
          statusText: '',
          messages: [{ id: '0', role: 'assistant', content: greeting, time: now() }],
        })
      },
    }),
    {
      name: 'travelai-chat',
      partialize: (s) => ({
        messages: s.messages,
        widgetOpen: s.widgetOpen,
        sessionId: s.sessionId,
      }),
    }
  )
)
