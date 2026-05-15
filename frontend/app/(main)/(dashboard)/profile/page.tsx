'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import {
  UserCircle, Shield, Settings, FileText, ChevronRight,
  Mail, Phone, Calendar, Globe, MapPin, Edit3, UserRound,
} from 'lucide-react'

const PROFILE_SECTIONS = [
  {
    href: '/profile/security',
    icon: Shield,
    label: 'Security',
    description: 'Password, sessions, login history',
    color: 'text-violet-500',
    bg: 'bg-violet-50',
  },
  {
    href: '/profile/preferences',
    icon: Settings,
    label: 'Travel Preferences',
    description: 'Class, airlines, budget, seat type',
    color: 'text-sky-500',
    bg: 'bg-sky-50',
  },
  {
    href: '/profile/travel-documents',
    icon: FileText,
    label: 'Travel Documents',
    description: 'Passport, visa, ID proofs',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
]

const INFO_ROWS = [
  { icon: Mail,     label: 'Email',         field: 'email' as const },
  { icon: Phone,    label: 'Phone',          field: null, placeholder: 'Not added' },
  { icon: Calendar, label: 'Date of Birth',  field: null, placeholder: 'Not added' },
  { icon: Globe,    label: 'Nationality',    field: null, placeholder: 'Not added' },
  { icon: MapPin,   label: 'City',           field: null, placeholder: 'Not added' },
]

export default function ProfilePage() {
  const { user } = useAuthStore()

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your personal information and preferences</p>
      </div>

      {/* Avatar card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-sky-500/25 overflow-hidden">
              {user?.full_name
                ? <span>{initials}</span>
                : <UserRound className="w-10 h-10 text-white/80" strokeWidth={1.5} />
              }
            </div>
            <button className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors">
              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-900 truncate">{user?.full_name ?? '—'}</h2>
            <p className="text-sm text-slate-500 truncate">{user?.email ?? '—'}</p>
            <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              ● Verified
            </span>
          </div>
          <button className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shrink-0">
            Edit
          </button>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
        <div className="px-5 py-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
          <button className="flex items-center gap-1.5 text-xs font-semibold text-sky-500 hover:text-sky-600 transition-colors">
            <Edit3 className="w-3 h-3" /> Edit
          </button>
        </div>
        {INFO_ROWS.map(row => (
          <div key={row.label} className="px-5 py-3.5 flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
              <row.icon className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-400 font-medium">{row.label}</p>
              <p className={`text-sm font-semibold ${row.field && user ? 'text-slate-800' : 'text-slate-400'} truncate`}>
                {row.field && user ? (user[row.field] as string) : row.placeholder}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Section links */}
      <div className="space-y-2">
        {PROFILE_SECTIONS.map(section => (
          <Link
            key={section.href}
            href={section.href}
            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl ${section.bg} flex items-center justify-center shrink-0`}>
              <section.icon className={`w-5 h-5 ${section.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800">{section.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{section.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
          </Link>
        ))}
      </div>

      <p className="text-center text-xs text-slate-400">
        <UserCircle className="w-3.5 h-3.5 inline mr-1" />
        TravelAI member since 2025
      </p>
    </div>
  )
}
