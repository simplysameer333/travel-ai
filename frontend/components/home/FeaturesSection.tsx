'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Search, CreditCard, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

const STEPS = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Tell AI your travel dream',
    description: 'Type anything — "Goa for 4 nights under ₹15K" or "Family trip with kids". Our AI understands natural language like a real travel agent.',
    color: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/30',
  },
  {
    number: '02',
    icon: Search,
    title: 'AI hunts the best deal',
    description: 'We search 100+ airlines, train operators, and hotel chains in real-time. AI cross-references prices, reviews, and availability to find your perfect option.',
    color: 'from-sky-500 to-blue-600',
    glow: 'shadow-sky-500/30',
  },
  {
    number: '03',
    icon: CreditCard,
    title: 'Book in one click',
    description: 'Confirm everything — flights, hotels, transfers — in a single checkout. Secure payment, instant confirmation, 24/7 support.',
    color: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/30',
  },
]

const WHY_CARDS = [
  {
    emoji: '⚡',
    title: 'Faster than any OTA',
    desc: 'Get a full trip plan in under 10 seconds, not 10 minutes of scrolling.',
  },
  {
    emoji: '💰',
    title: 'AI price prediction',
    desc: 'Know if you should book now or wait — our AI tracks fare trends 24/7.',
  },
  {
    emoji: '🎯',
    title: 'Personalized to you',
    desc: 'Not generic results. AI learns your preferences and budget to curate perfectly.',
  },
  {
    emoji: '🛡️',
    title: 'Price match guarantee',
    desc: 'Found it cheaper elsewhere? We\'ll match it. No questions asked.',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
}

export default function FeaturesSection() {
  return (
    <>
      {/* ── How It Works ── */}
      <section className="bg-slate-900 py-12 sm:py-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
              Travel planning, reimagined
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">
                for the AI age
              </span>
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              No more 20-tab research marathons. Our AI does in seconds what takes humans hours.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          >
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div key={step.number} variants={item} className="relative">
                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[calc(100%-12px)] w-[calc(100%-24px+2rem)] h-px bg-gradient-to-r from-white/20 to-transparent z-10 pointer-events-none" style={{ width: 'calc(100% + 2rem)', left: 'calc(100% - 1rem)' }} />
                  )}
                  <div className="relative bg-slate-800/60 border border-white/8 rounded-3xl p-6 h-full hover:border-white/15 transition-all hover:-translate-y-1">
                    {/* Step number */}
                    <div className="text-5xl font-black text-white/5 absolute top-4 right-5 select-none">{step.number}</div>

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg ${step.glow} flex items-center justify-center mb-5`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] transition-all text-sm"
            >
              <Sparkles className="w-4 h-4" />
              Try AI Trip Planner — It&apos;s Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Why TravelAI ── */}
      <section className="bg-white py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              Why travellers choose <span className="text-sky-500">TravelAI</span>
            </h2>
            <p className="text-slate-500 text-base max-w-lg mx-auto">
              Smarter than a search engine. Cheaper than a travel agent. Faster than both.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {WHY_CARDS.map(card => (
              <motion.div
                key={card.title}
                variants={item}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:bg-sky-50 hover:border-sky-100 transition-all"
              >
                <div className="text-3xl mb-3">{card.emoji}</div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{card.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
