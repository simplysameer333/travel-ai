'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Briefcase, Sparkles, Bot, UserCircle } from 'lucide-react'

const TABS = [
  { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Trips', href: '/trips', icon: Briefcase },
  { label: 'AI', href: '/chat', icon: Sparkles },
  { label: 'Scout', href: '/alerts', icon: Bot },
  { label: 'Profile', href: '/profile', icon: UserCircle },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-900/98 backdrop-blur-xl border-t border-white/10"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch h-16">
        {TABS.map(tab => {
          const active = isActive(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <tab.icon
                className={`w-5 h-5 transition-colors ${active ? 'text-sky-400' : 'text-slate-500'}`}
              />
              <span className={`text-[10px] font-semibold ${active ? 'text-sky-400' : 'text-slate-500'}`}>
                {tab.label}
              </span>
              {active && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-sky-400 rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
