'use client'

import { useSearchStore } from '@/store/searchStore'
import { searchFlights, searchHotels } from '@/lib/api'

export function useSearch() {
  const {
    activeTab,
    setActiveTab,
    flightSearch,
    hotelSearch,
    setResults,
    setIsSearching,
    isSearching,
    addRecentSearch,
  } = useSearchStore()

  const handleFlightSearch = async () => {
    try {
      setIsSearching(true)
      const label = `${flightSearch.from} → ${flightSearch.to} · ${flightSearch.departureDate}`
      addRecentSearch(label)
      const data = await searchFlights(flightSearch)
      setResults(data?.results ?? [])
    } catch (err) {
      console.error('Flight search failed:', err)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleHotelSearch = async () => {
    try {
      setIsSearching(true)
      const label = `${hotelSearch.city} · ${hotelSearch.checkIn} – ${hotelSearch.checkOut}`
      addRecentSearch(label)
      const data = await searchHotels(hotelSearch)
      setResults(data?.results ?? [])
    } catch (err) {
      console.error('Hotel search failed:', err)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  return {
    activeTab,
    setActiveTab,
    handleFlightSearch,
    handleHotelSearch,
    isSearching,
  }
}
