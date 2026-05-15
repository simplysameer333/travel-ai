/**
 * Central config — all environment-specific values live here.
 * Set NEXT_PUBLIC_API_URL in:
 *   - .env.local         (local dev — gitignored)
 *   - Railway env vars   (staging / production)
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export const config = {
  apiBaseUrl: API_BASE_URL,
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
} as const
