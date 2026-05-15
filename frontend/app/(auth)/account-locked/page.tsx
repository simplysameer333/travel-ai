'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Plane, ShieldAlert } from 'lucide-react'

function formatCountdown(ms: number): string {
  if (ms <= 0) return '0:00'
  const totalSec = Math.floor(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${min}:${sec.toString().padStart(2, '0')}`
}

function AccountLockedContent() {
  const searchParams = useSearchParams()
  const untilParam = searchParams.get('until') ?? ''
  const lockedUntil = untilParam ? new Date(untilParam) : null

  const [remaining, setRemaining] = useState<number>(() =>
    lockedUntil ? Math.max(0, lockedUntil.getTime() - Date.now()) : 0
  )

  useEffect(() => {
    if (!lockedUntil || remaining <= 0) return
    const interval = setInterval(() => {
      const left = Math.max(0, lockedUntil.getTime() - Date.now())
      setRemaining(left)
      if (left <= 0) clearInterval(interval)
    }, 1000)
    return () => clearInterval(interval)
  }, [lockedUntil]) // eslint-disable-line react-hooks/exhaustive-deps

  const unlocked = remaining <= 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-blue-50/70 to-slate-50 px-4 pt-8 pb-16">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-slate-200/80 p-8 text-center">

        <div className="flex items-center gap-2.5 justify-center mb-6">
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

        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          Account temporarily locked
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          Too many failed sign-in attempts. Your account is locked for a short time to keep it secure.
        </p>

        {!unlocked && lockedUntil && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-6">
            <p className="text-xs text-red-500 font-semibold uppercase tracking-wider mb-1">Time remaining</p>
            <p className="text-3xl font-black text-red-600 tabular-nums">{formatCountdown(remaining)}</p>
          </div>
        )}

        {unlocked && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6">
            <p className="text-sm font-semibold text-emerald-700">Your account is now unlocked.</p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/login"
            className={`block w-full py-3 rounded-xl text-sm font-bold transition-all text-center ${
              unlocked
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-md shadow-sky-500/25 hover:shadow-sky-500/40'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none'
            }`}
          >
            {unlocked ? 'Sign In Now' : 'Sign In (locked)'}
          </Link>
          <Link
            href="/forgot-password"
            className="block w-full py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all text-center"
          >
            Reset my password instead
          </Link>
        </div>

        <p className="text-xs text-slate-400 mt-5">
          Need help?{' '}
          <a href="mailto:support@travelai.in" className="text-sky-500 hover:text-sky-600 font-medium">
            Contact support
          </a>
        </p>
      </div>
    </div>
  )
}

export default function AccountLockedPage() {
  return (
    <Suspense>
      <AccountLockedContent />
    </Suspense>
  )
}
