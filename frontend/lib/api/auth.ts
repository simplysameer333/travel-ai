import axios, { AxiosError } from 'axios'
import { API_BASE_URL } from '@/lib/config'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 12000,
})

export interface RegisterPayload {
  full_name: string
  email: string
  password: string
  confirm_password: string
  accepted_terms: boolean
  accepted_privacy_policy: boolean
  marketing_opt_in: boolean
}

export interface RegisterResponse {
  message: string
}

export interface VerifyEmailResponse {
  status: 'verified' | 'already_verified' | 'expired' | 'invalid'
}

export interface AuthUser {
  id: string
  full_name: string
  email: string
  is_verified: boolean
  status: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: AuthUser
}

export interface ApiErrorDetail {
  message: string
  code: string
  locked_until?: string
}

export class AuthApiError extends Error {
  code: string
  lockedUntil?: string

  constructor(message: string, code: string, lockedUntil?: string) {
    super(message)
    this.code = code
    this.lockedUntil = lockedUntil
  }
}

function extractError(err: unknown): never {
  if (err instanceof AxiosError) {
    const detail = err.response?.data?.detail
    if (detail && typeof detail === 'object' && 'code' in detail) {
      throw new AuthApiError(detail.message, detail.code, detail.locked_until)
    }
    if (typeof detail === 'string') throw new AuthApiError(detail, 'unknown')
    if (Array.isArray(detail)) {
      throw new AuthApiError(detail.map((d: { msg: string }) => d.msg).join(' '), 'validation')
    }
  }
  throw new AuthApiError('Something went wrong. Please try again.', 'unknown')
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    try {
      const { data } = await api.post<RegisterResponse>('/api/auth/register', payload)
      return data
    } catch (err) {
      extractError(err)
    }
  },

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    try {
      const { data } = await api.get<VerifyEmailResponse>(`/api/auth/verify-email?token=${token}`)
      return data
    } catch (err) {
      extractError(err)
    }
  },

  async resendVerification(email: string): Promise<void> {
    try {
      await api.post('/api/auth/resend-verification', { email })
    } catch (err) {
      extractError(err)
    }
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const { data } = await api.post<LoginResponse>('/api/auth/login', { email, password })
      return data
    } catch (err) {
      extractError(err)
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout')
    } catch {
      // best-effort
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post('/api/auth/forgot-password', { email })
    } catch (err) {
      extractError(err)
    }
  },

  async resetPassword(token: string, new_password: string): Promise<void> {
    try {
      await api.post('/api/auth/reset-password', { token, new_password })
    } catch (err) {
      extractError(err)
    }
  },
}
