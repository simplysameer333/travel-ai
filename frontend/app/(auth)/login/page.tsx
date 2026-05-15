'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Plane } from 'lucide-react'
import { toast } from 'sonner'
import { authApi, AuthApiError } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})
type FormValues = z.infer<typeof schema>

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function BrandLogo() {
  return (
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
  )
}

const inputCls =
  'w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/60 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-400/15 transition-all'

export default function LoginPage() {
  const router = useRouter()
  const { setUser, setPendingVerificationEmail } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await authApi.login(values.email, values.password)
      setUser(result.user, result.access_token)
      toast.success(`Welcome back, ${result.user.full_name.split(' ')[0]}!`)
      router.push('/')
    } catch (err) {
      if (err instanceof AuthApiError) {
        if (err.code === 'email_not_verified') {
          setPendingVerificationEmail(values.email)
          toast.error('Please verify your email before signing in.')
          router.push('/verify-expired')
          return
        }
        if (err.code === 'account_locked') {
          router.push(`/account-locked?until=${encodeURIComponent(err.lockedUntil ?? '')}`)
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

        <BrandLogo />

        <h1 className="text-2xl font-extrabold text-slate-900 text-center tracking-tight mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500 text-center mb-7">
          Sign in to continue your journey
        </p>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 rounded-xl py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all mb-5"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs font-medium text-slate-400">or continue with email</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <Link
                href={`/forgot-password${getValues('email') ? `?email=${encodeURIComponent(getValues('email'))}` : ''}`}
                className="text-xs font-medium text-sky-500 hover:text-sky-600 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password" type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                suppressHydrationWarning
                className={inputCls + ' pr-10'}
                {...register('password')}
              />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-[0.98] text-white text-sm font-bold shadow-md shadow-sky-500/25 hover:shadow-sky-500/40 transition-all mt-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-sky-500 font-semibold hover:text-sky-600 transition-colors">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
