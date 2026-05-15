'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Plane, Eye, EyeOff, CheckCircle2, X } from 'lucide-react'
import { toast } from 'sonner'
import { authApi, AuthApiError } from '@/lib/api/auth'

const passwordRules = [
  { label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter', test: (v: string) => /[a-z]/.test(v) },
  { label: 'One number', test: (v: string) => /\d/.test(v) },
  { label: 'One special character', test: (v: string) => /[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/.test(v) },
]

const schema = z.object({
  new_password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'One uppercase letter')
    .regex(/[a-z]/, 'One lowercase letter')
    .regex(/\d/, 'One number')
    .regex(/[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/, 'One special character'),
  confirm_password: z.string(),
}).refine(d => d.new_password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})
type FormValues = z.infer<typeof schema>

const inputCls =
  'w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/60 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-400/15 transition-all'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const newPassword = watch('new_password', '')

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 via-blue-50/70 to-slate-50 px-4 pt-8 pb-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Invalid or missing reset token.</p>
          <Link href="/forgot-password" className="text-sky-500 font-semibold hover:text-sky-600">
            Request a new link
          </Link>
        </div>
      </div>
    )
  }

  const onSubmit = async (values: FormValues) => {
    try {
      await authApi.resetPassword(token, values.new_password)
      toast.success('Password updated! Please sign in.')
      router.push('/login')
    } catch (err) {
      if (err instanceof AuthApiError) {
        if (err.code === 'expired_token') {
          toast.error('This reset link has expired.')
          router.push('/forgot-password')
          return
        }
        if (err.code === 'invalid_token') {
          toast.error('Invalid reset link. Please request a new one.')
          router.push('/forgot-password')
          return
        }
        toast.error(err.message)
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-blue-50/70 to-slate-50 px-4 pt-8 pb-16">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-slate-200/80 p-8">

        <div className="flex items-center gap-2.5 justify-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md shadow-sky-500/25">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 bg-clip-text text-transparent leading-none">
              TravelAI
            </span>
            <span className="text-[9px] font-semibold text-slate-400 tracking-widest uppercase leading-none mt-0.5">
              Smart · Cheap · Fast
            </span>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 text-center tracking-tight mb-1">
          Choose a new password
        </h1>
        <p className="text-sm text-slate-500 text-center mb-7">
          Make it strong — you won&apos;t need to reset it again.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="new_password" className="block text-sm font-semibold text-slate-700 mb-1.5">
              New password
            </label>
            <div className="relative">
              <input
                id="new_password" type={showNew ? 'text' : 'password'}
                placeholder="New password"
                suppressHydrationWarning
                className={inputCls + ' pr-10'}
                {...register('new_password')}
              />
              <button type="button" onClick={() => setShowNew(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {newPassword && (
              <ul className="mt-2 space-y-1">
                {passwordRules.map(rule => {
                  const ok = rule.test(newPassword)
                  return (
                    <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {ok ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                      {rule.label}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div>
            <label htmlFor="confirm_password" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirm_password" type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat password"
                suppressHydrationWarning
                className={inputCls + ' pr-10'}
                {...register('confirm_password')}
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-xs text-red-500 mt-1">{errors.confirm_password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-[0.98] text-white text-sm font-bold shadow-md shadow-sky-500/25 hover:shadow-sky-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isSubmitting ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
