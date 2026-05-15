'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Props {
  title: string
  children: React.ReactNode
}

export function SidebarSection({ title, children }: Props) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-t-2 border-slate-200 pt-4 pb-2">
      <button
        className="flex items-center justify-between w-full text-sm font-semibold text-slate-700 mb-3"
        onClick={() => setOpen(o => !o)}
      >
        {title}
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && children}
    </div>
  )
}
