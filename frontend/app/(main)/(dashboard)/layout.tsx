'use client'

import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import MobileBottomNav from '@/components/dashboard/MobileBottomNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-84px)]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:top-[84px] md:bottom-0 md:left-0 z-30">
        <DashboardSidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 bg-slate-50 min-h-[calc(100vh-84px)] pb-24 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  )
}
