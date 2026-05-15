'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plane, Search } from 'lucide-react'

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/search')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto w-full"
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-2 flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1 px-3">
          <Plane className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search flights, hotels, trains..."
            className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-sm py-2"
            suppressHydrationWarning
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold hover:from-sky-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md shrink-0"
          suppressHydrationWarning
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>
    </form>
  )
}
