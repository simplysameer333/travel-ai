'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const REVIEWS = [
  {
    name: 'Priya Sharma',
    role: 'Mumbai → Bali',
    initials: 'PS',
    rating: 5,
    text: 'Planned our honeymoon in literally 2 minutes. AI suggested Bali, found us a 5★ resort 40% cheaper than MakeMyTrip. The itinerary was perfect — better than anything I could have planned myself.',
    color: 'from-rose-400 to-pink-500',
    savings: 'Saved ₹18,000',
  },
  {
    name: 'Rahul Verma',
    role: 'Delhi → Manali',
    initials: 'RV',
    rating: 5,
    text: 'I was skeptical about an AI booking travel, but wow. It found a Manali package with flights, 4★ hotel, and Rohtang permits — all bundled. Entire trip cost less than just the flights I found on other sites.',
    color: 'from-sky-400 to-blue-500',
    savings: 'Saved ₹12,500',
  },
  {
    name: 'Aisha Khan',
    role: 'Bangalore → Dubai',
    initials: 'AK',
    rating: 5,
    text: 'The price alert feature is insane. Got a notification at 3 AM that Dubai flights dropped by ₹8K. Booked instantly from my phone. That\'s the kind of thing a human travel agent would never catch.',
    color: 'from-violet-400 to-purple-500',
    savings: 'Saved ₹8,200',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function SocialProofSection() {
  return (
    <section className="bg-slate-900 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-1 mb-3">
            {[0,1,2,3,4].map(i => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Loved by 2M+ Indian travellers
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Real savings. Real trips. From Desi wanderers across India and the world.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {REVIEWS.map(review => (
            <motion.div
              key={review.name}
              variants={item}
              className="bg-slate-800/60 border border-white/8 rounded-3xl p-6 flex flex-col hover:border-white/15 transition-all"
            >
              <Quote className="w-6 h-6 text-slate-600 mb-4" />
              <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="border-t border-white/8 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${review.color} flex items-center justify-center shrink-0`}>
                    <span className="text-xs font-bold text-white">{review.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{review.name}</p>
                    <p className="text-xs text-slate-500">{review.role}</p>
                  </div>
                </div>
                <div className="bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-lg">
                  {review.savings}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { value: '2M+', label: 'Happy Travellers', sub: 'and counting' },
            { value: '₹500', label: 'Avg per booking saved', sub: 'vs other platforms' },
            { value: '4.9★', label: 'App Store Rating', sub: '50,000+ reviews' },
            { value: '<10s', label: 'Trip plan ready', sub: 'AI is that fast' },
          ].map(stat => (
            <div key={stat.label} className="bg-slate-800/40 border border-white/8 rounded-2xl p-4 text-center">
              <div className="text-2xl font-extrabold text-white mb-0.5">{stat.value}</div>
              <div className="text-xs font-semibold text-slate-300">{stat.label}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
