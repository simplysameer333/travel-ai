'use client'

import Link from 'next/link'
import { Bookmark, Plane, ArrowRight } from 'lucide-react'

export default function SavedTripsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Saved Trips</h1>
        <p className="text-sm text-slate-500 mt-1">Your travel wishlist</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
          <Bookmark className="w-7 h-7 text-slate-300" />
        </div>
        <h3 className="text-sm font-bold text-slate-700 mb-1">No saved trips yet</h3>
        <p className="text-xs text-slate-400 mb-5 max-w-xs mx-auto">
          Bookmark destinations and itineraries from your searches to revisit later.
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold shadow-md shadow-sky-500/25 hover:shadow-sky-500/40 transition-all"
        >
          <Plane className="w-4 h-4" /> Start Searching <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  )
}
