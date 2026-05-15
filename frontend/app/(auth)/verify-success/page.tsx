'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plane, CheckCircle2, Sparkles } from 'lucide-react'

export default function VerifySuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-blue-50/70 to-slate-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/80 p-10 text-center"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-md shadow-sky-500/25">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 bg-clip-text text-transparent leading-none">
              TravelAI
            </span>
            <span className="text-[9px] font-semibold text-slate-400 tracking-widest uppercase leading-none mt-0.5">
              Smart · Cheap · Fast
            </span>
          </div>
        </div>

        {/* Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/25"
        >
          <CheckCircle2 className="w-8 h-8 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
            Email verified! ✈️
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed mb-8">
            Your account is now active. Welcome to TravelAI — discover the best
            flights, trains, buses and hotels powered by AI.
          </p>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-[0.98] text-white text-sm font-bold shadow-md shadow-sky-500/25 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Start Exploring
          </Link>

          <p className="text-center text-sm text-slate-500 mt-5">
            <Link href="/login" className="text-sky-500 font-semibold hover:text-sky-600 transition-colors">
              Sign in to your account →
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
