'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Compass } from 'lucide-react'

// ── Data types ────────────────────────────────────────────────────────────────
export interface TravelTheme {
  slug:     string
  label:    string
  tagline:  string
  image:    string
  span?:    string   // Tailwind col/row span classes for mosaic layout
  textSize: string   // Tailwind text-size class
}

// ── Mock data — swap fetchTravelThemes() with real API call when backend ready ─
// Images: Unsplash (free to use under Unsplash licence)
const MOCK_THEMES: TravelTheme[] = [
  {
    slug: 'beach',
    label: 'Beach & Islands',
    tagline: 'Sun, sand, and blue water',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85',
    span: 'md:col-span-2 md:row-span-2',
    textSize: 'text-2xl sm:text-3xl',
  },
  {
    slug: 'mountains',
    label: 'Mountain Escapes',
    tagline: 'High altitude, cool vibes',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=85',
    textSize: 'text-lg',
  },
  {
    slug: 'city',
    label: 'City Breaks',
    tagline: 'Skylines & street food',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=85',
    textSize: 'text-lg',
  },
  {
    slug: 'honeymoon',
    label: 'Honeymoon',
    tagline: 'Romantic escapes for two',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=85',
    textSize: 'text-lg',
  },
  {
    slug: 'adventure',
    label: 'Adventure',
    tagline: 'Treks, dives & adrenaline',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=85',
    textSize: 'text-lg',
  },
  {
    slug: 'cultural',
    label: 'Heritage & Culture',
    tagline: 'History carved in stone',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=85',
    span: 'md:col-span-2',
    textSize: 'text-xl',
  },
  {
    slug: 'wildlife',
    label: 'Wildlife & Safari',
    tagline: 'Tigers, elephants & beyond',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=85',
    textSize: 'text-lg',
  },
]

// TODO: replace mock with real API — GET /api/themes?include_count=true
async function fetchTravelThemes(): Promise<TravelTheme[]> {
  return MOCK_THEMES
}
// ─────────────────────────────────────────────────────────────────────────────

export default function TravelThemesSection() {
  const router  = useRouter()
  const [themes, setThemes] = useState<TravelTheme[]>([])

  useEffect(() => {
    fetchTravelThemes().then(setThemes)
  }, [])

  if (!themes.length) return null

  return (
    <section className="bg-slate-50 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Compass className="w-4 h-4 text-violet-500" />
            <span className="text-xs font-bold text-violet-500 uppercase tracking-widest">Travel Themes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            What kind of trip are you dreaming of?
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Browse by mood — beach, mountains, city, romance, and more.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[160px]">
          {themes.map((theme, i) => (
            <motion.button
              key={theme.slug}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              onClick={() => router.push(`/packages?theme=${theme.slug}`)}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 hover:-translate-y-1 text-left ${theme.span ?? ''}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={theme.image}
                alt={theme.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className={`${theme.textSize} font-extrabold text-white leading-tight mb-0.5`}>
                  {theme.label}
                </h3>
                <p className="text-white/60 text-xs">{theme.tagline}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
