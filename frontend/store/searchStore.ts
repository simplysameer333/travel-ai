import { create } from 'zustand'

type ActiveTab = 'flights' | 'hotels' | 'trains' | 'buses'

interface FlightSearch {
  from: string
  to: string
  departureDate: string
  returnDate: string
  travelers: number
}

interface HotelSearch {
  city: string
  checkIn: string
  checkOut: string
  guests: number
}

interface TrainSearch {
  from: string
  to: string
  travelDate: string
}

interface BusSearch {
  from: string
  to: string
  travelDate: string
}

interface SearchState {
  activeTab: ActiveTab
  flightSearch: FlightSearch
  hotelSearch: HotelSearch
  trainSearch: TrainSearch
  busSearch: BusSearch
  results: unknown[]
  isSearching: boolean
  recentSearches: string[]
  setActiveTab: (tab: ActiveTab) => void
  updateFlightSearch: (data: Partial<FlightSearch>) => void
  updateHotelSearch: (data: Partial<HotelSearch>) => void
  updateTrainSearch: (data: Partial<TrainSearch>) => void
  updateBusSearch: (data: Partial<BusSearch>) => void
  setResults: (results: unknown[]) => void
  setIsSearching: (isSearching: boolean) => void
  addRecentSearch: (search: string) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  activeTab: 'flights',
  flightSearch: {
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    travelers: 1,
  },
  hotelSearch: {
    city: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  },
  trainSearch: {
    from: '',
    to: '',
    travelDate: '',
  },
  busSearch: {
    from: '',
    to: '',
    travelDate: '',
  },
  results: [],
  isSearching: false,
  recentSearches: [],
  setActiveTab: (tab) => set({ activeTab: tab }),
  updateFlightSearch: (data) =>
    set((state) => ({ flightSearch: { ...state.flightSearch, ...data } })),
  updateHotelSearch: (data) =>
    set((state) => ({ hotelSearch: { ...state.hotelSearch, ...data } })),
  updateTrainSearch: (data) =>
    set((state) => ({ trainSearch: { ...state.trainSearch, ...data } })),
  updateBusSearch: (data) =>
    set((state) => ({ busSearch: { ...state.busSearch, ...data } })),
  setResults: (results) => set({ results }),
  setIsSearching: (isSearching) => set({ isSearching }),
  addRecentSearch: (search) =>
    set((state) => ({
      recentSearches: [
        search,
        ...state.recentSearches.filter((s) => s !== search),
      ].slice(0, 10),
    })),
}))
