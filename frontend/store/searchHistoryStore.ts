import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SearchHistoryRecord {
  id: string
  query: string
  intent: string | null
  from_city: string | null
  to_city: string | null
  timestamp: number
}

interface SearchHistoryState {
  history: SearchHistoryRecord[]
  addRecord: (r: Omit<SearchHistoryRecord, 'id' | 'timestamp'>) => void
  clear: () => void
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      history: [],
      addRecord: (r) => set(s => ({
        history: [
          { ...r, id: Date.now().toString(), timestamp: Date.now() },
          ...s.history.filter(h => h.query.toLowerCase() !== r.query.toLowerCase()),
        ].slice(0, 20),
      })),
      clear: () => set({ history: [] }),
    }),
    { name: 'travelai-search-history' }
  )
)
