'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Plane, Hotel, Package, Bus, Car, Train, Shield, Zap, TrendingDown } from 'lucide-react'
import AIChatInput      from '@/components/home/AIChatInput'
import QuickDestBar     from '@/components/home/QuickDestBar'
import FlightSearchBar  from '@/components/home/search/FlightSearchBar'
import HotelSearchBar   from '@/components/home/search/HotelSearchBar'
import PackageSearchBar from '@/components/home/search/PackageSearchBar'
import BusSearchBar     from '@/components/home/search/BusSearchBar'
import CarSearchBar     from '@/components/home/search/CarSearchBar'
import TrainSearchBar   from '@/components/home/search/TrainSearchBar'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2400&q=90'

const TABS = [
  { key: 'ai',       label: 'AI Agent',  icon: Sparkles, gradient: 'from-violet-500 to-purple-600'  },
  { key: 'flights',  label: 'Flights',   icon: Plane,    gradient: 'from-sky-500 to-blue-600'       },
  { key: 'trains',   label: 'Trains',    icon: Train,    gradient: 'from-emerald-500 to-teal-600'   },
  { key: 'hotels',   label: 'Hotels',    icon: Hotel,    gradient: 'from-rose-400 to-pink-500'      },
  { key: 'packages', label: 'Packages',  icon: Package,  gradient: 'from-amber-400 to-orange-500'   },
  { key: 'bus',      label: 'Bus',       icon: Bus,      gradient: 'from-orange-500 to-red-500'     },
  { key: 'car',      label: 'Cars',      icon: Car,      gradient: 'from-indigo-500 to-blue-700'    },
] as const

type Tab = typeof TABS[number]['key']

const TRUST_ITEMS = [
  { icon: TrendingDown, text: '35% avg cheaper than OTAs' },
  { icon: Sparkles,     text: '2M+ trips planned by AI'   },
  { icon: Shield,       text: '100% secure booking'       },
  { icon: Zap,          text: 'Instant confirmation'      },
]

const slideIn = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -4 }, transition: { duration: 0.18 } }

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<Tab>('ai')

  return (
    <div>
      {/* ── Fixed-height image section ──
          NOTE: no overflow-hidden here so search dropdowns can escape the section bounds */}
      <section className="relative flex flex-col" style={{ height: 'min(440px, calc(100vh - 190px))' }}>

        {/* Background image in its own clipping wrapper */}
        <div className="absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMAGE} alt="Travel destination"
            className="w-full h-full object-cover object-center" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 pt-5 pb-3 text-center">

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-1.5">
            Your AI Travel Agent.
            <span className="bg-gradient-to-r from-sky-300 via-violet-300 to-emerald-300 bg-clip-text text-transparent"> Always On.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
            className="text-white/65 text-xs sm:text-sm mb-3 max-w-lg">
            Flights · Hotels · Packages · Bus · Cars — all powered by AI. Free to use.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.14 }}
            className="w-full max-w-4xl">

            {/* ── Tab switcher (scrollable on mobile) ── */}
            <div className="flex justify-center mb-3">
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md border border-white/15 rounded-xl p-1 shadow-xl overflow-x-auto no-scrollbar">
                {TABS.map(tab => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.key
                  return (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                        isActive ? `bg-gradient-to-r ${tab.gradient} text-white shadow-md` : 'text-white/60 hover:text-white hover:bg-white/10'
                      }`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── Search widgets ──
                min-h keeps this container at a fixed size so the title above
                never shifts when AnimatePresence unmounts the exiting tab. */}
            <div className="min-h-[140px]">
              <AnimatePresence mode="wait">
                {activeTab === 'ai'       && <motion.div key="ai"       {...slideIn}><AIChatInput compact /></motion.div>}
                {activeTab === 'flights'  && <motion.div key="flights"  {...slideIn}><FlightSearchBar /></motion.div>}
                {activeTab === 'trains'   && <motion.div key="trains"   {...slideIn}><TrainSearchBar /></motion.div>}
                {activeTab === 'hotels'   && <motion.div key="hotels"   {...slideIn}><HotelSearchBar /></motion.div>}
                {activeTab === 'packages' && <motion.div key="packages" {...slideIn}><PackageSearchBar /></motion.div>}
                {activeTab === 'bus'      && <motion.div key="bus"      {...slideIn}><BusSearchBar /></motion.div>}
                {activeTab === 'car'      && <motion.div key="car"      {...slideIn}><CarSearchBar /></motion.div>}
              </AnimatePresence>
            </div>

          </motion.div>
        </div>
      </section>

      {/* ── Trust bar — sibling to section, never overlaps ── */}
      <div className="bg-slate-900 border-b border-white/12">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2">
            {TRUST_ITEMS.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={item.text} className="flex items-center gap-2">
                  {i > 0 && <span className="hidden sm:block w-px h-4 bg-white/15 mr-4" />}
                  <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-sm sm:text-base font-semibold text-white/85">{item.text}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Quick destination chips ── */}
      <QuickDestBar />
    </div>
  )
}
