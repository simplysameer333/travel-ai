'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Plane, Clock, Loader2, Send } from 'lucide-react'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'

export default function VerifyExpiredPage() {
  const pendingEmail = useAuthStore(s => s.pendingVerificationEmail)
  const [email, setEmail]     = useState(pendingEmail ?? '')
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSending(true)
    try {
      await authApi.resendVerification(email.trim())
      setSent(true)
      toast.success('New verification link sent!')
    } catch {
      toast.error('Could not resend. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-blue-50/70 to-slate-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/80 p-10 text-center"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md shadow-sky-500/25">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 bg-clip-text text-transparent leading-none">
              TravelAI
            </span>
            <span className="text-[9px] font-semibold text-slate-400 tracking-widest uppercase leading-none mt-0.5">
              Smart · Cheap · Fast
            </span>
          </div>
        </div>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-5">
          <Clock className="w-7 h-7 text-amber-500" />
        </div>

        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
          Link expired
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-7">
          This verification link has expired. Links are valid for 24 hours.
          Enter your email below to receive a fresh one.
        </p>

        {sent ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6">
            <p className="text-sm font-semibold text-emerald-700">
              ✓ New link sent! Check your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleResend} className="space-y-3 mb-6">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              suppressHydrationWarning
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/60 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-400/15 transition-all"
            />
            <button
              type="submit"
              disabled={sending || !email.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-[0.98] disabled:opacity-50 text-white text-sm font-bold shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
            >
              {sending
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                : <><Send className="w-4 h-4" /> Resend verification email</>
              }
            </button>
          </form>
        )}

        <p className="text-center text-sm text-slate-500">
          <Link href="/login" className="text-sky-500 font-semibold hover:text-sky-600 transition-colors">
            Back to sign in
          </Link>
          {' · '}
          <Link href="/register" className="text-sky-500 font-semibold hover:text-sky-600 transition-colors">
            Create new account
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
