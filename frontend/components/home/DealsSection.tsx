'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Zap, ArrowRight } from 'lucide-react'
import { DealCard } from '@/components/cards'
import { MOCK_DEALS } from '@/lib/packages'

const DISPLAY_DEALS = MOCK_DEALS.slice(0, 4)

export default function DealsSection() {
  return (
    <section className="bg-white py-8 sm:py-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-5"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Limited Time</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Today&apos;s Hottest Deals
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              AI-tracked price drops and flash sales. Updated hourly.
            </p>
          </div>
          <Link
            href="/deals"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-rose-500 hover:text-rose-700 transition-colors shrink-0"
          >
            All deals
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DISPLAY_DEALS.map((deal, i) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <DealCard deal={deal} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="sm:hidden text-center mt-8"
        >
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border-2 border-rose-400 text-rose-500 font-semibold text-sm hover:bg-rose-50 transition-colors"
          >
            <Zap className="w-4 h-4" />
            View All Deals
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
