'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plane, Loader2, AlertCircle } from 'lucide-react'
import { authApi } from '@/lib/api/auth'

function VerifyEmailInner() {
  const router = useRouter()
  const params = useSearchParams()
  const token  = params.get('token') ?? ''

  const [status, setStatus] = useState<'loading' | 'error'>('loading')

  useEffect(() => {
    if (!token) { setStatus('error'); return }

    authApi.verifyEmail(token).then(res => {
      if (res.status === 'verified' || res.status === 'already_verified') {
        router.replace('/verify-success')
      } else if (res.status === 'expired') {
        router.replace('/verify-expired')
      } else {
        setStatus('error')
      }
    }).catch(() => setStatus('error'))
  }, [token, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-blue-50/70 to-slate-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/80 p-10 text-center"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md shadow-sky-500/25">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 bg-clip-text text-transparent">
            TravelAI
          </span>
        </div>

        {status === 'loading' ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center mx-auto mb-5">
              <Loader2 className="w-7 h-7 text-sky-500 animate-spin" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mb-2">Verifying your email…</h2>
            <p className="text-sm text-slate-500">Just a moment while we activate your account.</p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mb-2">Invalid link</h2>
            <p className="text-sm text-slate-500">
              This verification link is invalid or has already been used.
            </p>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    }>
      <VerifyEmailInner />
    </Suspense>
  )
}
