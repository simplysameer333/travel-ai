'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { DestinationCard } from '@/components/cards'

// ── Mock data — swap fetchDestinations() with real API call when backend ready ─
const DESTINATIONS = [
  {
    name: 'Goa',
    tagline: 'Sun, sand & seafood',
    price: 'From ₹3,499',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=85',
    tag: 'Trending',
    tagColor: 'bg-rose-500',
    span: 'md:col-span-2',
  },
  {
    name: 'Manali',
    tagline: 'Snow peaks & adventure',
    price: 'From ₹4,199',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=85',
    tag: 'Popular',
    tagColor: 'bg-sky-500',
    span: '',
  },
  {
    name: 'Kerala',
    tagline: 'Backwaters & bliss',
    price: 'From ₹3,799',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=85',
    tag: 'Recommended',
    tagColor: 'bg-emerald-500',
    span: '',
  },
  {
    name: 'Rajasthan',
    tagline: 'Royal heritage',
    price: 'From ₹2,999',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=85',
    tag: 'Bestseller',
    tagColor: 'bg-amber-500',
    span: '',
  },
  {
    name: 'Dubai',
    tagline: 'Luxury & skyline',
    price: 'From ₹22,999',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=85',
    tag: 'International',
    tagColor: 'bg-violet-500',
    span: 'md:col-span-2',
  },
  {
    name: 'Bali',
    tagline: 'Temples & rice terraces',
    price: 'From ₹31,999',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=85',
    tag: 'Trending',
    tagColor: 'bg-rose-500',
    span: '',
  },
  {
    name: 'Bangkok',
    tagline: 'Street food & temples',
    price: 'From ₹18,999',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=85',
    tag: 'Popular',
    tagColor: 'bg-sky-500',
    span: '',
  },
]

// TODO: replace mock with real API — GET /api/destinations/featured?limit=7
async function fetchDestinations() {
  return DESTINATIONS
}
// ─────────────────────────────────────────────────────────────────────────────

export default function DestinationsSection() {
  const router = useRouter()

  return (
    <section className="bg-slate-50 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-sky-500" />
              <span className="text-xs font-bold text-sky-500 uppercase tracking-widest">Top Picks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Where will you go next?
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              India&apos;s favourite getaways + the international destinations Desi travellers love most.
            </p>
          </div>
          <button
            onClick={() => router.push('/search')}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-800 transition-colors shrink-0"
          >
            Explore all
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px]">
          {DESTINATIONS.map((dest, i) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className={dest.span}
            >
              <DestinationCard
                name={dest.name}
                tagline={dest.tagline}
                price={dest.price}
                image={dest.image}
                tag={dest.tag}
                tagColor={dest.tagColor}
                onClick={() => router.push('/search')}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="sm:hidden text-center mt-8"
        >
          <button
            onClick={() => router.push('/search')}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border-2 border-sky-500 text-sky-600 font-semibold text-sm hover:bg-sky-50 transition-colors"
          >
            View All Destinations
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
