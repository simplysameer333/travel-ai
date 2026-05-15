import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  id: string
  full_name: string
  email: string
  is_verified: boolean
  status: string
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  pendingVerificationEmail: string | null

  setUser: (user: AuthUser | null, accessToken?: string) => void
  setAccessToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setPendingVerificationEmail: (email: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      pendingVerificationEmail: null,

      setUser: (user, accessToken) =>
        set({ user, isAuthenticated: !!user, accessToken: accessToken ?? null }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setLoading: (isLoading) => set({ isLoading }),
      setPendingVerificationEmail: (email) => set({ pendingVerificationEmail: email }),
      logout: () =>
        set({ user: null, isAuthenticated: false, accessToken: null, pendingVerificationEmail: null }),
    }),
    {
      name: 'travelai-auth',
      partialize: (s) => ({
        pendingVerificationEmail: s.pendingVerificationEmail,
        user: s.user,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
)
