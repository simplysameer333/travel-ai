'use client'

import { useState } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { use } from 'react'
import {
  ArrowLeft, Star, MapPin, Clock, Plane, Utensils, Car, CheckCircle2,
  XCircle, Shield, Sparkles, ChevronDown, ChevronUp, Users, Calendar,
} from 'lucide-react'
import {
  getPackageById,
  TYPE_LABELS,
  TYPE_COLORS,
  MEAL_LABELS,
  packageCoverImage,
} from '@/lib/packages'

interface Props {
  params: Promise<{ packageId: string }>
}

export default function PackageDetailPage({ params }: Props) {
  const { packageId } = use(params)
  const pkg = getPackageById(packageId)

  if (!pkg) notFound()

  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'ai'>('overview')
  const [expandedDay, setExpandedDay] = useState<number | null>(1)
  const savings = Math.round((pkg.savings / pkg.original_price) * 100)

  const tabs = [
    { key: 'overview',   label: 'Overview'    },
    { key: 'itinerary',  label: 'Itinerary'   },
    { key: 'ai',         label: 'AI Insights' },
  ] as const

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero Image ── */}
      <div className="relative h-64 sm:h-80 md:h-96">
        <Image
          src={packageCoverImage(pkg.primary_destination, 1200, 600)}
          alt={pkg.primary_destination}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Back button */}
        <Link
          href="/packages"
          className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white text-sm font-semibold px-3 py-2 rounded-xl hover:bg-black/60 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Packages
        </Link>

        {/* Badges */}
        <div className="absolute top-4 right-4 flex gap-2">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${TYPE_COLORS[pkg.type]}`}>
            {TYPE_LABELS[pkg.type]}
          </span>
          {pkg.is_bestseller && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-400 text-amber-900">
              Bestseller
            </span>
          )}
        </div>

        {/* Bottom title bar */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-5">
          <h1 className="text-xl sm:text-3xl font-extrabold text-white mb-1">{pkg.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-1 text-white/80">
              <MapPin className="w-3.5 h-3.5" />
              {pkg.destinations.join(' · ')}
            </div>
            <div className="flex items-center gap-1 text-white/80">
              <Clock className="w-3.5 h-3.5" />
              {pkg.duration_nights}N / {pkg.duration_days}D
            </div>
            <div className="flex items-center gap-1.5 text-white/80">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-white">{pkg.rating}</span>
              <span>({pkg.reviews_count.toLocaleString()} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content + Sidebar ── */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Tabs content ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Tab nav */}
          <div className="flex gap-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-1.5">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === t.key
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Overview tab */}
          {activeTab === 'overview' && (
            <div className="space-y-5">

              {/* AI Summary */}
              <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <span className="text-sm font-bold text-violet-800">AI Summary</span>
                </div>
                <p className="text-sm text-violet-700 italic">{pkg.ai_summary}</p>
              </div>

              {/* What's included */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-bold text-slate-900 mb-4">What&apos;s Included</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Flights', included: pkg.inclusions.flights, icon: Plane },
                    { label: `${pkg.inclusions.hotel_stars}★ Hotel`, included: pkg.inclusions.hotel_stars > 0, icon: Star },
                    { label: MEAL_LABELS[pkg.inclusions.meals], included: pkg.inclusions.meals !== 'none', icon: Utensils },
                    { label: 'Transfers', included: pkg.inclusions.transfers, icon: Car },
                    { label: 'Tours & Sightseeing', included: pkg.inclusions.tours, icon: MapPin },
                    { label: 'Visa Assistance', included: pkg.inclusions.visa_assistance, icon: Shield },
                  ].map(item => (
                    <div key={item.label} className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${item.included ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-400'}`}>
                      {item.included
                        ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                        : <XCircle className="w-4 h-4 shrink-0 text-slate-300" />
                      }
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Activities */}
              {pkg.inclusions.activities.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="font-bold text-slate-900 mb-3">Included Activities</h3>
                  <div className="flex flex-wrap gap-2">
                    {pkg.inclusions.activities.map(act => (
                      <span key={act} className="text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100 px-3 py-1.5 rounded-full">
                        ✓ {act}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Departure cities */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-500" />
                  Departure Cities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {pkg.departure_cities.map(city => (
                    <span key={city} className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">
                      {city}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  {pkg.cancellation_policy === 'free' ? '✓ Free cancellation' : pkg.cancellation_policy === 'partial' ? 'Partial refund on cancellation' : 'Non-refundable'} ·{' '}
                  {pkg.visa_required ? 'Visa required' : 'No visa required for Indians'}
                </p>
              </div>
            </div>
          )}

          {/* Itinerary tab */}
          {activeTab === 'itinerary' && (
            <div className="space-y-3">
              {pkg.itinerary.map(day => (
                <div key={day.day} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <button
                    className="w-full flex items-center gap-4 p-4 text-left"
                    onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shrink-0">
                      <span className="text-sm font-extrabold text-white">D{day.day}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900">{day.title}</p>
                      {day.highlight && (
                        <p className="text-xs text-violet-600 font-semibold mt-0.5">★ {day.highlight}</p>
                      )}
                    </div>
                    {expandedDay === day.day
                      ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    }
                  </button>
                  {expandedDay === day.day && (
                    <div className="px-4 pb-4 border-t border-slate-100">
                      <p className="text-sm text-slate-600 mt-3 mb-3">{day.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Activities</p>
                          <div className="space-y-1">
                            {day.activities.map(act => (
                              <div key={act} className="flex items-center gap-2 text-xs text-slate-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                                {act}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          {day.meals.length > 0 && (
                            <>
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Meals</p>
                              <div className="flex flex-wrap gap-1">
                                {day.meals.map(m => (
                                  <span key={m} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{m}</span>
                                ))}
                              </div>
                            </>
                          )}
                          {day.accommodation && (
                            <p className="text-xs text-slate-500 mt-2">
                              <span className="font-semibold">Stay:</span> {day.accommodation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* AI Insights tab */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-violet-500" />
                  <h3 className="font-bold text-violet-900">Why AI recommends this package</h3>
                </div>
                <div className="space-y-3">
                  {pkg.ai_insights.map((insight, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-3 border border-violet-100">
                      <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-white">{i + 1}</span>
                      </div>
                      <p className="text-sm text-slate-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
                <Sparkles className="w-8 h-8 text-violet-400 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 mb-2">Want a custom version?</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Tell our AI your preferences and it will tailor this package to you.
                </p>
                <Link
                  href={`/packages/create-with-ai?base=${pkg.id}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold shadow-md shadow-violet-500/25 hover:scale-[1.02] transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Customize with AI
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Booking sidebar ── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5 sticky top-[100px]">
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">
                  ₹{pkg.price_per_person.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-slate-400 line-through">
                  ₹{Math.round(pkg.original_price / 2).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-500">per person</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Save {savings}%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Total for 2: ₹{pkg.total_price.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Travellers */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-3">
              <Users className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-xs font-semibold text-slate-700">Travellers</p>
                <p className="text-xs text-slate-400">2 Adults (default)</p>
              </div>
            </div>

            {/* Departure */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-4">
              <Calendar className="w-4 h-4 text-slate-500" />
              <div>
                <p className="text-xs font-semibold text-slate-700">Departure Date</p>
                <p className="text-xs text-slate-400">Select your preferred date</p>
              </div>
            </div>

            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.01] transition-all mb-3">
              Book This Package
            </button>

            <Link
              href={`/packages/create-with-ai?base=${pkg.id}`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-violet-200 text-violet-700 font-semibold text-sm hover:bg-violet-50 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Customize with AI
            </Link>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                {pkg.cancellation_policy === 'free' ? 'Free cancellation available' : 'Partial refund on cancellation'}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Instant confirmation
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                AI-optimized price guarantee
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
