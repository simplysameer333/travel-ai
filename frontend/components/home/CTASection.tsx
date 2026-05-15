'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, Plane, Shield } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 rounded-3xl p-10 sm:p-16 relative overflow-hidden"
        >
          {/* Glow orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
              Ready to travel smarter?
              <br />
              <span className="bg-gradient-to-r from-violet-300 to-sky-300 bg-clip-text text-transparent">
                Your AI agent is waiting.
              </span>
            </h2>

            <p className="text-slate-400 text-base mb-8 max-w-lg mx-auto">
              Join 2 million+ Indian travellers saving money with AI. First trip plan is always free.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] transition-all text-sm w-full sm:w-auto justify-center"
              >
                <Sparkles className="w-4 h-4" />
                Start Planning — It&apos;s Free
              </Link>
              <Link
                href="/search"
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-all text-sm w-full sm:w-auto justify-center"
              >
                <Plane className="w-4 h-4" />
                Search Flights
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-slate-500 text-xs">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                No credit card required
              </div>
              <div className="w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                100% secure booking
              </div>
              <div className="w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                Free cancellation available
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
