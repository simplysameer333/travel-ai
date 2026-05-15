'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, Menu, X, Bot, Briefcase, Home, LogIn, UserPlus, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/lib/api/auth'
import { toast } from 'sonner'


export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, logout } = useAuthStore()

  const handleLogout = async () => {
    await authApi.logout()
    logout()
    setMobileOpen(false)
    toast.success('Signed out successfully.')
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-white/10 shadow-lg shadow-black/30">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-5">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:shadow-sky-500/50 transition-shadow">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-sky-200 to-sky-400 bg-clip-text text-transparent leading-tight">
                TravelAI
              </span>
              <span className="text-[10px] font-semibold text-sky-300 tracking-widest uppercase leading-none">
                Smart · Cheap · Fast
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-2">

              {/* Home — sky */}
              <Link href="/"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  pathname === '/'
                    ? 'bg-sky-500/20 border-sky-400/60 text-sky-300 shadow-md shadow-sky-500/20'
                    : 'border-sky-500/30 text-sky-400/80 hover:border-sky-400/60 hover:bg-sky-500/10 hover:text-sky-300 hover:shadow-md hover:shadow-sky-500/15'
                }`}>
                <Home className="w-4 h-4" />
                Home
              </Link>

              {/* Dashboard — violet */}
              <Link href="/dashboard"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  pathname === '/dashboard'
                    ? 'bg-violet-500/20 border-violet-400/60 text-violet-300 shadow-md shadow-violet-500/20'
                    : 'border-violet-500/30 text-violet-400/80 hover:border-violet-400/60 hover:bg-violet-500/10 hover:text-violet-300 hover:shadow-md hover:shadow-violet-500/15'
                }`}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              {/* Bookings — emerald */}
              <Link href="/trips"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  pathname === '/trips'
                    ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-300 shadow-md shadow-emerald-500/20'
                    : 'border-emerald-500/30 text-emerald-400/80 hover:border-emerald-400/60 hover:bg-emerald-500/10 hover:text-emerald-300 hover:shadow-md hover:shadow-emerald-500/15'
                }`}>
                <Briefcase className="w-4 h-4" />
                Bookings
              </Link>

              {/* AI Scout — amber */}
              <Link href="/alerts"
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  pathname === '/alerts'
                    ? 'bg-amber-500/20 border-amber-400/60 text-amber-300 shadow-md shadow-amber-500/20'
                    : 'border-amber-500/30 text-amber-400/80 hover:border-amber-400/60 hover:bg-amber-500/10 hover:text-amber-300 hover:shadow-md hover:shadow-amber-500/15'
                }`}>
                <span className="relative">
                  <Bot className="w-4 h-4" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full">
                    <span className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-75" />
                  </span>
                </span>
                AI Scout
              </Link>
            </nav>

          {/* ── Desktop right ── */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-rose-500/30 text-rose-400/80 hover:border-rose-400/60 hover:bg-rose-500/10 hover:text-rose-300 hover:shadow-md hover:shadow-rose-500/15 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <>
                {/* Login — violet */}
                <Link href="/login"
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    pathname === '/login'
                      ? 'bg-violet-500/20 border-violet-400/60 text-violet-300 shadow-md shadow-violet-500/20'
                      : 'border-violet-500/30 text-violet-400/80 hover:border-violet-400/60 hover:bg-violet-500/10 hover:text-violet-300 hover:shadow-md hover:shadow-violet-500/15'
                  }`}>
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>

                {/* Register — rose */}
                <Link href="/register"
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    pathname === '/register'
                      ? 'bg-rose-500/20 border-rose-400/60 text-rose-300 shadow-md shadow-rose-500/20'
                      : 'border-rose-500/30 text-rose-400/80 hover:border-rose-400/60 hover:bg-rose-500/10 hover:text-rose-300 hover:shadow-md hover:shadow-rose-500/15'
                  }`}>
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
            suppressHydrationWarning
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-white/10"
          >
            <div className="px-4 py-4 bg-slate-900/98 backdrop-blur-md flex flex-col gap-2">

              <Link href="/" onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
                  pathname === '/' ? 'bg-sky-500/20 border-sky-400/60 text-sky-300' : 'border-sky-500/25 text-sky-400/80 hover:border-sky-400/50 hover:bg-sky-500/10 hover:text-sky-300'
                }`}>
                <Home className="w-4 h-4" />
                Home
              </Link>

              <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
                  pathname === '/dashboard' ? 'bg-violet-500/20 border-violet-400/60 text-violet-300' : 'border-violet-500/25 text-violet-400/80 hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-violet-300'
                }`}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              <Link href="/trips" onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
                  pathname === '/trips' ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-300' : 'border-emerald-500/25 text-emerald-400/80 hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:text-emerald-300'
                }`}>
                <Briefcase className="w-4 h-4" />
                Bookings
              </Link>

              <Link href="/alerts" onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
                  pathname === '/alerts' ? 'bg-amber-500/20 border-amber-400/60 text-amber-300' : 'border-amber-500/25 text-amber-400/80 hover:border-amber-400/50 hover:bg-amber-500/10 hover:text-amber-300'
                }`}>
                <span className="relative">
                  <Bot className="w-4 h-4" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full" />
                </span>
                AI Scout
              </Link>

              <div className="border-t border-white/10 pt-3 mt-1 flex flex-col gap-2">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border border-rose-500/25 text-rose-400/80 hover:border-rose-400/50 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
                        pathname === '/login' ? 'bg-violet-500/20 border-violet-400/60 text-violet-300' : 'border-violet-500/25 text-violet-400/80 hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-violet-300'
                      }`}>
                      <LogIn className="w-4 h-4" />
                      Login
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
                        pathname === '/register' ? 'bg-rose-500/20 border-rose-400/60 text-rose-300' : 'border-rose-500/25 text-rose-400/80 hover:border-rose-400/50 hover:bg-rose-500/10 hover:text-rose-300'
                      }`}>
                      <UserPlus className="w-4 h-4" />
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
