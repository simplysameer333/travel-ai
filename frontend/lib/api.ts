import axios, { AxiosError } from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        console.error('Unauthorized — please log in again.')
      } else if (status === 429) {
        console.error('Too many requests — please slow down.')
      } else if (status >= 500) {
        console.error('Server error — please try again later.')
      }
    } else if (error.request) {
      console.error('Network error — check your internet connection.')
    }
    return Promise.reject(error)
  }
)

// --- Typed API functions ---

interface FlightSearchParams {
  from: string
  to: string
  departureDate: string
  returnDate?: string
  travelers: number
}

interface HotelSearchParams {
  city: string
  checkIn: string
  checkOut: string
  guests: number
}

interface TrainSearchParams {
  from: string
  to: string
  travelDate: string
}

interface BusSearchParams {
  from: string
  to: string
  travelDate: string
}

export async function searchFlights(data: FlightSearchParams) {
  const response = await api.post('/api/flights/search', data)
  return response.data
}

export async function searchHotels(data: HotelSearchParams) {
  const response = await api.post('/api/hotels/search', data)
  return response.data
}

export async function searchTrains(data: TrainSearchParams) {
  const response = await api.post('/api/trains/search', data)
  return response.data
}

export async function searchBuses(data: BusSearchParams) {
  const response = await api.post('/api/buses/search', data)
  return response.data
}

export async function aiQuery(query: string) {
  const response = await api.post('/api/ai/query', { query })
  return response.data
}

export default api
