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

interface ChatState {
  messages: ChatMessage[]
  loading: boolean
  widgetOpen: boolean

  addMessage: (msg: Omit<ChatMessage, 'id' | 'time'>) => ChatMessage
  /** Creates an empty assistant bubble and returns its id */
  startStreamingMessage: () => string
  /** Appends a token to the message with the given id */
  appendToken: (id: string, token: string) => void
  setLoading: (v: boolean) => void
  setWidgetOpen: (v: boolean) => void
  reset: (greeting: string) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      loading: false,
      widgetOpen: false,

      addMessage: (msg) => {
        const full: ChatMessage = { ...msg, id: Date.now().toString(), time: now() }
        set(s => ({ messages: [...s.messages, full] }))
        return full
      },

      startStreamingMessage: () => {
        const id = `stream-${Date.now()}`
        const msg: ChatMessage = { id, role: 'assistant', content: '', time: now() }
        set(s => ({ messages: [...s.messages, msg], loading: true }))
        return id
      },

      appendToken: (id, token) => {
        set(s => ({
          messages: s.messages.map(m =>
            m.id === id ? { ...m, content: m.content + token } : m
          ),
        }))
      },

      setLoading: (loading) => set({ loading }),
      setWidgetOpen: (widgetOpen) => set({ widgetOpen }),

      reset: (greeting) => {
        set({
          loading: false,
          messages: [{ id: '0', role: 'assistant', content: greeting, time: now() }],
        })
      },
    }),
    {
      name: 'travelai-chat',
      partialize: (s) => ({ messages: s.messages, widgetOpen: s.widgetOpen }),
    }
  )
)
