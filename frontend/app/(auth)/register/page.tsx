'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  Plane, Eye, EyeOff, Check, X, Mail, Loader2, CheckCircle2,
} from 'lucide-react'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'

// ── Zod schema ────────────────────────────────────────────────────────────────

const SPECIAL_RE = /[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]/

const schema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'One uppercase letter required')
    .regex(/[a-z]/, 'One lowercase letter required')
    .regex(/[0-9]/, 'One number required')
    .regex(SPECIAL_RE, 'One special character required'),
  confirm_password: z.string(),
  accepted_terms: z.boolean().refine(v => v, 'You must accept the Terms of Service'),
  accepted_privacy_policy: z.boolean().refine(v => v, 'You must accept the Privacy Policy'),
  marketing_opt_in: z.boolean(),
}).refine(d => d.password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

type FormValues = z.infer<typeof schema>

// ── Password requirement checks ───────────────────────────────────────────────

const PW_CHECKS = [
  { label: 'At least 8 characters',  test: (v: string) => v.length >= 8 },
  { label: 'One uppercase letter',   test: (v: string) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter',   test: (v: string) => /[a-z]/.test(v) },
  { label: 'One number',             test: (v: string) => /[0-9]/.test(v) },
  { label: 'One special character',  test: (v: string) => SPECIAL_RE.test(v) },
]

// ── Shared atoms ──────────────────────────────────────────────────────────────

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

const inputErrorCls =
  'w-full h-11 px-4 rounded-xl border border-red-300 bg-red-50/40 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/15 transition-all'

// ── Success screen ────────────────────────────────────────────────────────────

function SuccessScreen({
  email,
  onResend,
  resending,
}: {
  email: string
  onResend: () => void
  resending: boolean
}) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center py-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/25">
        <Mail className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
        Check your inbox
      </h2>
      <p className="text-sm text-slate-500 leading-relaxed mb-1">
        We've sent a verification link to
      </p>
      <p className="text-sm font-bold text-sky-600 mb-6">{email}</p>

      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-2 mb-6">
        {[
          'Open the email from TravelAI',
          'Click "Verify Email Address"',
          'Start exploring the best travel deals',
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold">{i + 1}</span>
            </div>
            <span className="text-xs font-medium text-slate-600">{step}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 mb-3">
        Didn't receive the email? Check spam or
      </p>
      <button
        type="button"
        onClick={onResend}
        disabled={resending}
        className="text-sky-500 text-sm font-semibold hover:text-sky-600 transition-colors disabled:opacity-50 flex items-center gap-1.5 mx-auto"
      >
        {resending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        Resend verification email
      </button>

      <p className="text-center text-sm text-slate-500 mt-8">
        Already verified?{' '}
        <Link href="/login" className="text-sky-500 font-semibold hover:text-sky-600 transition-colors">
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const [showPassword, setShowPassword]   = useState(false)
  const [showConfirm, setShowConfirm]     = useState(false)
  const [submitted, setSubmitted]         = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [resending, setResending]         = useState(false)

  const setPendingEmail = useAuthStore(s => s.setPendingVerificationEmail)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: 'onBlur', defaultValues: { marketing_opt_in: false } })

  const passwordValue = watch('password', '')

  const onSubmit = async (values: FormValues) => {
    try {
      await authApi.register({
        full_name: values.full_name,
        email: values.email,
        password: values.password,
        confirm_password: values.confirm_password,
        accepted_terms: values.accepted_terms,
        accepted_privacy_policy: values.accepted_privacy_policy,
        marketing_opt_in: values.marketing_opt_in ?? false,
      })
      setPendingEmail(values.email)
      setSubmittedEmail(values.email)
      setSubmitted(true)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to create account.')
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await authApi.resendVerification(submittedEmail)
      toast.success('Verification email resent!')
    } catch {
      toast.error('Could not resend. Please try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-blue-50/70 to-slate-50 px-4 pt-8 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-auto bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/80 p-8"
      >
        <BrandLogo />

        <AnimatePresence mode="wait">
          {submitted ? (
            <SuccessScreen
              email={submittedEmail}
              onResend={handleResend}
              resending={resending}
            />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-2xl font-extrabold text-slate-900 text-center tracking-tight mb-1">
                Create your account
              </h1>
              <p className="text-sm text-slate-500 text-center mb-7">
                Start exploring India&apos;s best travel deals
              </p>

              {/* Google */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 rounded-xl py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all mb-5"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs font-medium text-slate-400">or continue with email</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

                {/* Full name */}
                <div>
                  <label htmlFor="full_name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Full name
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    placeholder="Your full name"
                    autoComplete="name"
                    suppressHydrationWarning
                    {...register('full_name')}
                    className={errors.full_name ? inputErrorCls : inputCls}
                  />
                  {errors.full_name && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.full_name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    suppressHydrationWarning
                    {...register('email')}
                    className={errors.email ? inputErrorCls : inputCls}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      suppressHydrationWarning
                      {...register('password')}
                      className={(errors.password ? inputErrorCls : inputCls) + ' pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Live requirements */}
                  {passwordValue.length > 0 && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 space-y-1"
                    >
                      {PW_CHECKS.map(({ label, test }) => {
                        const met = test(passwordValue)
                        return (
                          <li key={label} className="flex items-center gap-2">
                            {met
                              ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              : <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                            <span className={`text-xs font-medium ${met ? 'text-emerald-600' : 'text-slate-400'}`}>
                              {label}
                            </span>
                          </li>
                        )
                      })}
                    </motion.ul>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label htmlFor="confirm_password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm_password"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      suppressHydrationWarning
                      {...register('confirm_password')}
                      className={(errors.confirm_password ? inputErrorCls : inputCls) + ' pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.confirm_password.message}</p>
                  )}
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-1">
                  {[
                    {
                      field: 'accepted_terms' as const,
                      label: (
                        <>
                          I agree to the{' '}
                          <Link href="/terms" className="text-sky-500 hover:text-sky-600 font-semibold">Terms of Service</Link>
                          {' '}*
                        </>
                      ),
                    },
                    {
                      field: 'accepted_privacy_policy' as const,
                      label: (
                        <>
                          I agree to the{' '}
                          <Link href="/privacy" className="text-sky-500 hover:text-sky-600 font-semibold">Privacy Policy</Link>
                          {' '}*
                        </>
                      ),
                    },
                    {
                      field: 'marketing_opt_in' as const,
                      label: 'Send me travel deals, tips and updates (optional)',
                    },
                  ].map(({ field, label }) => (
                    <label key={field} className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative mt-0.5 shrink-0">
                        <input
                          type="checkbox"
                          id={field}
                          {...register(field)}
                          className="peer w-5 h-5 rounded border-slate-300 text-sky-500 accent-sky-500 cursor-pointer"
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors">
                        {label}
                      </span>
                    </label>
                  ))}
                  {(errors.accepted_terms || errors.accepted_privacy_policy) && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.accepted_terms?.message ?? errors.accepted_privacy_policy?.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold shadow-md shadow-sky-500/25 hover:shadow-sky-500/40 transition-all flex items-center justify-center gap-2 mt-1"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? 'Creating account…' : 'Create Account'}
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-6">
                Already have an account?{' '}
                <Link href="/login" className="text-sky-500 font-semibold hover:text-sky-600 transition-colors">
                  Sign in
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
