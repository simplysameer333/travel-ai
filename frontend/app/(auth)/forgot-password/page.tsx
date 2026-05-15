'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Plane, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { authApi } from '@/lib/api/auth'

const schema = z.object({ email: z.string().email('Enter a valid email address') })
type FormValues = z.infer<typeof schema>

const inputCls =
  'w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/60 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-400/15 transition-all'

function ForgotPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultEmail = searchParams.get('email') ?? ''

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: defaultEmail },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      await authApi.forgotPassword(values.email)
      router.push(`/check-email?email=${encodeURIComponent(values.email)}`)
    } catch {
      toast.error('Something went wrong. Please try again.')
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

        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center">
            <Mail className="w-7 h-7 text-sky-500" />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 text-center tracking-tight mb-1">
          Forgot password?
        </h1>
        <p className="text-sm text-slate-500 text-center mb-7">
          Enter your email and we&apos;ll send a reset link — valid for 1 hour.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Email address
            </label>
            <input
              id="email" type="email" placeholder="you@example.com"
              suppressHydrationWarning className={inputCls}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-[0.98] text-white text-sm font-bold shadow-md shadow-sky-500/25 hover:shadow-sky-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isSubmitting ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Remembered it?{' '}
          <Link href="/login" className="text-sky-500 font-semibold hover:text-sky-600 transition-colors">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  )
}
