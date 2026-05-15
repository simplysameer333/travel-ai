import { create } from 'zustand'

interface TripsState {
  trips: unknown[]
  savedTrips: unknown[]
  isLoading: boolean
  setTrips: (trips: unknown[]) => void
  addSavedTrip: (trip: unknown) => void
  removeSavedTrip: (tripId: string) => void
  setLoading: (loading: boolean) => void
}

export const useTripsStore = create<TripsState>((set) => ({
  trips: [],
  savedTrips: [],
  isLoading: false,
  setTrips: (trips) => set({ trips }),
  addSavedTrip: (trip) =>
    set((state) => ({ savedTrips: [...state.savedTrips, trip] })),
  removeSavedTrip: (tripId) =>
    set((state) => ({
      savedTrips: state.savedTrips.filter(
        (t) => (t as { id: string }).id !== tripId
      ),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
}))
