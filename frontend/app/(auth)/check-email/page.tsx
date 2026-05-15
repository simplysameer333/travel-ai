'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Plane, MailCheck } from 'lucide-react'

function CheckEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? 'your inbox'

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
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <MailCheck className="w-8 h-8 text-emerald-500" />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          Check your inbox
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-1">
          We sent a password reset link to
        </p>
        <p className="text-sm font-semibold text-slate-800 mb-6 break-all">{email}</p>

        <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 text-left mb-6">
          <p className="text-xs font-semibold text-slate-600 mb-2">Next steps:</p>
          <ol className="space-y-1.5 text-xs text-slate-500">
            <li>1. Open the email from TravelAI</li>
            <li>2. Click <strong className="text-slate-700">Reset Password</strong></li>
            <li>3. Choose a new password</li>
          </ol>
          <p className="text-xs text-slate-400 mt-3">Link expires in <strong>1 hour</strong>. Check your spam folder if you don&apos;t see it.</p>
        </div>

        <Link
          href="/login"
          className="block w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-sm font-bold shadow-md shadow-sky-500/25 hover:shadow-sky-500/40 transition-all text-center"
        >
          Back to Sign In
        </Link>

        <p className="text-xs text-slate-400 mt-4">
          Didn&apos;t get the email?{' '}
          <Link href={`/forgot-password?email=${encodeURIComponent(email)}`} className="text-sky-500 hover:text-sky-600 font-medium">
            Resend
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function CheckEmailPage() {
  return (
    <Suspense>
      <CheckEmailContent />
    </Suspense>
  )
}
