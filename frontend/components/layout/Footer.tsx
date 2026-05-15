import Link from 'next/link'
import { Plane } from 'lucide-react'

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Blog', href: '/blog' },
]

const supportLinks = [
  { label: 'Help Center', href: '/help' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
]

const travelLinks = [
  { label: 'Flights', href: '/search' },
  { label: 'Hotels', href: '/search' },
  { label: 'Trains', href: '/search' },
]

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-16">

        {/* 2-col on mobile → 4-col on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">

          {/* Brand — spans both columns on mobile */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600">
                <Plane className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">TravelAI</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              India&apos;s first AI travel agent that actually plans and optimizes trips —
              flights, trains, buses &amp; hotels, all in one place.
            </p>
            <div className="flex gap-3 mt-5">
              {['T', 'I', 'F'].map((letter, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-slate-700 hover:bg-sky-500 flex items-center justify-center cursor-pointer transition-colors text-xs font-bold"
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>

          {/* Company — col 1, row 2 on mobile */}
          <div className="col-span-1">
            <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Company
            </h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support — col 2, row 2 on mobile */}
          <div className="col-span-1">
            <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Support
            </h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Travel — spans both cols on mobile so it sits centred in row 3 */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Travel
            </h3>
            {/* Inline list on mobile to avoid taking a full extra row */}
            <ul className="flex flex-wrap gap-x-6 gap-y-2.5 md:flex-col md:gap-x-0">
              {travelLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-slate-500 text-xs sm:text-sm">
          &copy; 2026 TravelAI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
