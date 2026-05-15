'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  CreditCard,
  Wallet,
  Bookmark,
  FileText,
  Sparkles,
  Bell,
  Bot,
  HeadphonesIcon,
  UserCircle,
  LogOut,
  Plane,
  Package,
  Tag,
} from 'lucide-react'

import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/lib/api/auth'
import { toast } from 'sonner'

function NoPhotoAvatar() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background */}
      <rect width="100" height="100" fill="#e2e8f0" />
      {/* Head */}
      <circle cx="50" cy="36" r="22" fill="#94a3b8" />
      {/* Shoulders */}
      <path d="M0 100 Q0 68 50 66 Q100 68 100 100Z" fill="#94a3b8" />
      {/* Label band */}
      <rect x="0" y="80" width="100" height="20" fill="rgba(15,23,42,0.45)" />
      <text
        x="50" y="93"
        textAnchor="middle"
        fontSize="10"
        fontFamily="system-ui,sans-serif"
        fontWeight="700"
        letterSpacing="2.5"
        fill="white"
      >
        NO PHOTO
      </text>
    </svg>
  )
}

const NAV = [
  {
    group: 'Travel',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Bookings',   href: '/trips',     icon: Briefcase       },
      { label: 'Payments',  href: '/payments',  icon: CreditCard      },
      { label: 'Wallet', href: '/wallet', icon: Wallet },
    ],
  },
  {
    group: 'Explore',
    items: [
      { label: 'Packages', href: '/packages', icon: Package },
      { label: 'Deals', href: '/deals', icon: Tag },
    ],
  },
  {
    group: 'Tools',
    items: [
      { label: 'Saved Trips', href: '/saved', icon: Bookmark },
      { label: 'AI Scout', href: '/alerts', icon: Bot },
      { label: 'Travel Docs', href: '/profile/travel-documents', icon: FileText },
      { label: 'AI Assistant', href: '/chat', icon: Sparkles },
      { label: 'Notifications', href: '/notifications', icon: Bell },
    ],
  },
  {
    group: 'Account',
    items: [
      { label: 'Profile', href: '/profile', icon: UserCircle },
      { label: 'Support', href: '/support', icon: HeadphonesIcon },
    ],
  },
]

interface SidebarProps {
  onNavigate?: () => void
}

export default function DashboardSidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  const handleLogout = async () => {
    await authApi.logout()
    logout()
    toast.success('Signed out successfully.')
    router.push('/')
  }

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-white/8">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 border-b border-white/8">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onNavigate}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md shadow-sky-500/30">
            <Plane className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-sky-200 to-sky-400 bg-clip-text text-transparent">
            TravelAI
          </span>
        </Link>
      </div>

      {/* User avatar */}
      {user && (
        <div className="px-4 py-4 border-b border-white/8">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
            <div className="w-10 h-10 rounded-xl shrink-0 overflow-hidden border border-white/10">
              {user?.full_name
                ? (
                  <div className="w-full h-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                )
                : <NoPhotoAvatar />
              }
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate">{user.full_name}</span>
              <span className="text-xs text-slate-400 truncate">{user.email}</span>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV.map(group => (
          <div key={group.group}>
            <p className="px-3 mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-sky-500/20 text-sky-300 shadow-sm'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-sky-400' : ''}`} />
                    {item.label}
                    {item.label === 'Notifications' && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white">
                        3
                      </span>
                    )}
                    {item.label === 'Price Alerts' && (
                      <span className="ml-auto relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/8">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
