'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Eye, EyeOff, Monitor, Smartphone, LogOut, CheckCircle2, X } from 'lucide-react'
import { toast } from 'sonner'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  current_password: z.string().min(1, 'Required'),
  new_password: z
    .string()
    .min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/\d/).regex(/[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/),
  confirm_password: z.string(),
}).refine(d => d.new_password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})
type FormValues = z.infer<typeof schema>

const RULES = [
  { label: 'At least 8 characters',  test: (v: string) => v.length >= 8 },
  { label: 'One uppercase letter',    test: (v: string) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter',    test: (v: string) => /[a-z]/.test(v) },
  { label: 'One number',             test: (v: string) => /\d/.test(v) },
  { label: 'One special character',  test: (v: string) => /[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/.test(v) },
]

const MOCK_SESSIONS = [
  { id: '1', device: 'Chrome on Windows', location: 'Mumbai, IN', time: 'Active now', current: true,  icon: Monitor    },
  { id: '2', device: 'Safari on iPhone',  location: 'Delhi, IN',  time: '2 days ago', current: false, icon: Smartphone },
]

const inputCls = 'w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/60 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-400/15 transition-all pr-10'

export default function SecurityPage() {
  const router = useRouter()
  const { logout } = useAuthStore()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const newPwd = watch('new_password', '')

  const onSubmit = async (values: FormValues) => {
    try {
      await authApi.resetPassword('__change__', values.new_password)
      toast.success('Password updated. Please sign in again.')
      reset()
      logout()
      router.push('/login')
    } catch {
      toast.error('Failed to update password. Check your current password and try again.')
    }
  }

  const revokeSession = (_id: string) => {
    toast.success('Session revoked.')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Security</h1>
        <p className="text-sm text-slate-500 mt-1">Password, active sessions and login history</p>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-4 h-4 text-violet-500" />
          <h2 className="text-sm font-bold text-slate-900">Change Password</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Password</label>
            <div className="relative">
              <input type={showCurrent ? 'text' : 'password'} placeholder="Current password" className={inputCls} {...register('current_password')} />
              <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.current_password && <p className="text-xs text-red-500 mt-1">{errors.current_password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
            <div className="relative">
              <input type={showNew ? 'text' : 'password'} placeholder="New password" className={inputCls} {...register('new_password')} />
              <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {newPwd && (
              <ul className="mt-2 space-y-1">
                {RULES.map(r => {
                  const ok = r.test(newPwd)
                  return (
                    <li key={r.label} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {ok ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                      {r.label}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
            <div className="relative">
              <input type={showConfirm ? 'text' : 'password'} placeholder="Repeat new password" className={inputCls} {...register('confirm_password')} />
              <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirm_password && <p className="text-xs text-red-500 mt-1">{errors.confirm_password.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-bold shadow-md shadow-violet-500/25 hover:shadow-violet-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
            {isSubmitting ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Active sessions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-sm font-bold text-slate-900 mb-4">Active Sessions</h2>
        <div className="space-y-3">
          {MOCK_SESSIONS.map(s => (
            <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                <s.icon className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{s.device}</p>
                <p className="text-xs text-slate-400">{s.location} · {s.time}</p>
              </div>
              {s.current ? (
                <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">Current</span>
              ) : (
                <button onClick={() => revokeSession(s.id)} className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
                  <LogOut className="w-3.5 h-3.5" /> Revoke
                </button>
              )}
            </div>
          ))}
        </div>
        <button className="mt-4 w-full py-2.5 rounded-xl border border-red-200 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
          Sign out all other devices
        </button>
      </div>

    </div>
  )
}
