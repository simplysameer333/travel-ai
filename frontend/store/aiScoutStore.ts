/**
 * Separate Zustand store for the AI Scout search/planning page (/ai-agent).
 * Kept independent from chatStore (Travel Buddy) so their conversations don't mix.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ScoutMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
}

function now() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

function makeSessionId() {
  return `scout-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

interface AIScoutState {
  messages: ScoutMessage[]
  loading: boolean
  statusText: string
  sessionId: string

  addMessage: (msg: Omit<ScoutMessage, 'id' | 'time'>) => ScoutMessage
  startStreamingMessage: () => string
  appendToken: (id: string, token: string) => void
  setLoading: (v: boolean) => void
  setStatus: (text: string) => void
  reset: (greeting: string) => void
}

export const useAIScoutStore = create<AIScoutState>()(
  persist(
    (set) => ({
      messages: [],
      loading: false,
      statusText: '',
      sessionId: makeSessionId(),

      addMessage: (msg) => {
        const full: ScoutMessage = { ...msg, id: Date.now().toString(), time: now() }
        set(s => ({ messages: [...s.messages, full] }))
        return full
      },

      startStreamingMessage: () => {
        const id = `scout-stream-${Date.now()}`
        const msg: ScoutMessage = { id, role: 'assistant', content: '', time: now() }
        set(s => ({ messages: [...s.messages, msg], loading: true, statusText: '' }))
        return id
      },

      appendToken: (id, token) => {
        set(s => ({
          messages: s.messages.map(m =>
            m.id === id ? { ...m, content: m.content + token } : m
          ),
          statusText: '',
        }))
      },

      setLoading: (loading) => set({ loading }),
      setStatus: (statusText) => set({ statusText }),

      reset: (greeting) => set({
        loading: false,
        statusText: '',
        messages: [{ id: 'scout-0', role: 'assistant', content: greeting, time: now() }],
      }),
    }),
    {
      name: 'travelai-ai-scout',
      partialize: (s) => ({ messages: s.messages, sessionId: s.sessionId }),
    }
  )
)
