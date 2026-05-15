'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import {
  ArrowLeft, Plane, Train, Hotel, CheckCircle2, Clock, Download,
  MessageCircle, X, ChevronDown, ChevronUp, MapPin, Calendar,
  Users, Utensils, ShieldCheck, Luggage, Wifi, Coffee, Waves,
  AlertTriangle, CreditCard, RefreshCw, Phone, Armchair,
} from 'lucide-react'
import { useState } from 'react'
import { getDestinationImage } from '@/lib/destinationImages'

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_BOOKINGS: Record<string, BookingDetail> = {
  'TRV-8821': {
    id: 'TRV-8821',
    type: 'flight',
    status: 'confirmed',
    destination: 'Goa',
    title: 'IndraAir IA-441',
    subtitle: 'Delhi (DEL) → Goa (GOI)',
    date: 'Sun, 15 Jun 2025',
    amount: '₹4,299',
    provider: 'IndraAir',
    providerLogo: '🟦',
    pnr: 'IAIR8821',
    bookedVia: 'TravelAI',
    bookedOn: '12 May 2025',
    flight: {
      number: 'IA-441',
      airline: 'IndraAir',
      from: { code: 'DEL', city: 'Delhi', terminal: 'Terminal 1D', gate: 'G-12', time: '06:15', date: '15 Jun 2025' },
      to:   { code: 'GOI', city: 'Goa',   terminal: 'Terminal 1',  gate: 'G-04', time: '08:35', date: '15 Jun 2025' },
      duration: '2h 20m',
      aircraft: 'Narrow-body Jet',
      class: 'Economy',
      baggage: { cabin: '7 kg', checkin: '15 kg' },
      meal: 'Vegetarian',
      seat: '14A – Window',
      checkInDeadline: '05:45 AM',
      boardingDeadline: '05:55 AM',
    },
    passengers: [
      { name: 'Sameer Sharma', age: 28, type: 'Adult', seat: '14A', meal: 'Veg' },
    ],
    fareBreakup: [
      { label: 'Base Fare (1 Adult)',   amount: '₹2,850' },
      { label: 'Fuel Surcharge',        amount: '₹620'   },
      { label: 'Airport Taxes & Fees',  amount: '₹579'   },
      { label: 'Convenience Fee',       amount: '₹250'   },
    ],
    addOns: [
      { icon: Armchair,   label: 'Seat Selection',   detail: '14A – Window',     included: true  },
      { icon: Luggage,    label: 'Check-in Baggage', detail: '15 kg included',   included: true  },
      { icon: Utensils,   label: 'Meal',             detail: 'Veg meal selected', included: true  },
      { icon: ShieldCheck, label: 'Travel Insurance', detail: 'Add from ₹199',    included: false },
    ],
    cancellationPolicy: [
      { window: 'Cancel 7+ days before',  charge: '₹1,500 per pax', refund: '₹2,799' },
      { window: 'Cancel 3–7 days before', charge: '₹2,500 per pax', refund: '₹1,799' },
      { window: 'Cancel < 3 days before', charge: '100% of fare',   refund: 'Non-refundable' },
    ],
    timeline: [
      { label: 'Booking Placed',   time: '12 May, 10:32 AM', done: true  },
      { label: 'Payment Confirmed', time: '12 May, 10:33 AM', done: true  },
      { label: 'Ticket Issued',    time: '12 May, 10:34 AM', done: true  },
      { label: 'Check-in Open',   time: '14 Jun, 06:15 AM', done: false },
      { label: 'Travel',           time: '15 Jun, 06:15 AM', done: false },
    ],
    supportOptions: [
      { icon: MessageCircle, label: 'Chat Support',   detail: 'Avg. reply < 2 min' },
      { icon: Phone,         label: '24/7 Helpline',  detail: '+91 1800-TRAVEL'    },
    ],
  },
  'TRV-8822': {
    id: 'TRV-8822',
    type: 'hotel',
    status: 'confirmed',
    destination: 'Goa',
    title: 'Hotel Sunset Goa',
    subtitle: 'Calangute Beach, North Goa',
    date: 'Jun 15 – Jun 20, 2025',
    amount: '₹4,200',
    provider: 'StayBook',
    providerLogo: '🔵',
    pnr: 'HSG-22344',
    bookedVia: 'TravelAI',
    bookedOn: '12 May 2025',
    hotel: {
      name: 'Hotel Sunset Goa',
      address: 'Calangute Beach Road, North Goa – 403516',
      rating: 4.2,
      reviews: 1284,
      checkIn:  { date: 'Sun, 15 Jun 2025', time: '2:00 PM'  },
      checkOut: { date: 'Fri, 20 Jun 2025', time: '11:00 AM' },
      nights: 5,
      roomType: 'Deluxe Room – Sea View',
      guests: '2 Adults',
      amenities: ['Pool', 'Free WiFi', 'Breakfast', 'AC', 'Parking', 'Room Service'],
      policies: ['No smoking', 'Pets not allowed', 'ID required at check-in'],
    },
    passengers: [
      { name: 'Sameer Sharma', age: 28, type: 'Adult', seat: '—', meal: '—' },
    ],
    fareBreakup: [
      { label: 'Room (5 nights × ₹700)', amount: '₹3,500' },
      { label: 'Taxes & Levies (18%)',   amount: '₹630'   },
      { label: 'Service Fee',            amount: '₹70'    },
    ],
    addOns: [
      { icon: Wifi,    label: 'Free WiFi',     detail: 'Included in stay',     included: true  },
      { icon: Coffee,  label: 'Breakfast',     detail: '2 pax daily',          included: true  },
      { icon: Waves,   label: 'Pool Access',   detail: '7 AM – 9 PM',          included: true  },
      { icon: ShieldCheck, label: 'Travel Insurance', detail: 'Add from ₹199', included: false },
    ],
    cancellationPolicy: [
      { window: 'Cancel 7+ days before',  charge: 'Free',       refund: '₹4,200 (full)' },
      { window: 'Cancel 3–7 days before', charge: '1 night',    refund: '₹3,500'        },
      { window: 'Cancel < 3 days before', charge: '2 nights',   refund: '₹2,800'        },
    ],
    timeline: [
      { label: 'Booking Placed',    time: '12 May, 10:35 AM', done: true  },
      { label: 'Payment Confirmed', time: '12 May, 10:36 AM', done: true  },
      { label: 'Hotel Confirmed',   time: '12 May, 11:02 AM', done: true  },
      { label: 'Check-in',          time: '15 Jun, 2:00 PM',  done: false },
      { label: 'Check-out',         time: '20 Jun, 11:00 AM', done: false },
    ],
    supportOptions: [
      { icon: MessageCircle, label: 'Chat Support',  detail: 'Avg. reply < 2 min' },
      { icon: Phone,         label: '24/7 Helpline', detail: '+91 1800-TRAVEL'    },
    ],
  },
  'TRV-8819': {
    id: 'TRV-8819',
    type: 'train',
    status: 'completed',
    destination: 'Jaipur',
    title: 'Rajpath Express',
    subtitle: 'Delhi (NDLS) → Jaipur (JP)',
    date: 'Thu, 12 Mar 2025',
    amount: '₹890',
    provider: 'RailConnect',
    providerLogo: '🚂',
    pnr: '4521834967',
    bookedVia: 'TravelAI',
    bookedOn: '5 Mar 2025',
    train: {
      number: '22958',
      name: 'Rajpath Express',
      from: { station: 'New Delhi (NDLS)', platform: 'Platform 1', time: '16:30', date: '12 Mar 2025' },
      to:   { station: 'Jaipur (JP)',      platform: 'Platform 4', time: '22:05', date: '12 Mar 2025' },
      duration: '5h 35m',
      class: 'AC 3 Tier (3A)',
      coach: 'B2',
      seats: ['32 – Lower', '33 – Middle'],
      quota: 'General',
      distance: '303 km',
    },
    passengers: [
      { name: 'Sameer Sharma', age: 28, type: 'Adult', seat: 'B2 / 32 – Lower', meal: 'Veg' },
    ],
    fareBreakup: [
      { label: 'Base Fare (1 Adult)', amount: '₹680' },
      { label: 'Reservation Fee',    amount: '₹60'  },
      { label: 'Superfast Charge',   amount: '₹75'  },
      { label: 'GST',               amount: '₹75'  },
    ],
    addOns: [
      { icon: Utensils,    label: 'Meals',            detail: 'Veg meal onboard',    included: true  },
      { icon: ShieldCheck, label: 'Travel Insurance', detail: 'Add from ₹49',         included: false },
    ],
    cancellationPolicy: [
      { window: 'Cancel 48+ hours before', charge: '₹120 flat',  refund: '₹770' },
      { window: 'Cancel 12–48 hours',      charge: '25% of fare', refund: '₹580' },
      { window: 'Cancel < 12 hours',       charge: '50% of fare', refund: '₹345' },
    ],
    timeline: [
      { label: 'Booking Placed',    time: '5 Mar, 09:12 AM',  done: true },
      { label: 'Payment Confirmed', time: '5 Mar, 09:13 AM',  done: true },
      { label: 'Ticket Issued',     time: '5 Mar, 09:13 AM',  done: true },
      { label: 'Travel',            time: '12 Mar, 16:30',    done: true },
      { label: 'Completed',         time: '12 Mar, 22:05',    done: true },
    ],
    supportOptions: [
      { icon: MessageCircle, label: 'Chat Support',      detail: 'Avg. reply < 2 min' },
      { icon: Phone,         label: 'RailConnect Help', detail: '1800-RAIL-AI'       },
    ],
  },
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Passenger { name: string; age: number; type: string; seat: string; meal: string }
interface FareItem  { label: string; amount: string }
interface AddOn     { icon: React.ElementType; label: string; detail: string; included: boolean }
interface PolicyRow { window: string; charge: string; refund: string }
interface Timeline  { label: string; time: string; done: boolean }
interface SupportOpt { icon: React.ElementType; label: string; detail: string }

interface BookingDetail {
  id: string; type: 'flight' | 'hotel' | 'train'; status: string
  destination: string; title: string; subtitle: string; date: string
  amount: string; provider: string; providerLogo: string
  pnr: string; bookedVia: string; bookedOn: string
  flight?: {
    number: string; airline: string; duration: string; aircraft: string; class: string
    baggage: { cabin: string; checkin: string }; meal: string; seat: string
    checkInDeadline: string; boardingDeadline: string
    from: { code: string; city: string; terminal: string; gate: string; time: string; date: string }
    to:   { code: string; city: string; terminal: string; gate: string; time: string; date: string }
  }
  hotel?: {
    name: string; address: string; rating: number; reviews: number; nights: number
    roomType: string; guests: string; amenities: string[]; policies: string[]
    checkIn:  { date: string; time: string }
    checkOut: { date: string; time: string }
  }
  train?: {
    number: string; name: string; duration: string; class: string
    coach: string; seats: string[]; quota: string; distance: string
    from: { station: string; platform: string; time: string; date: string }
    to:   { station: string; platform: string; time: string; date: string }
  }
  passengers: Passenger[]; fareBreakup: FareItem[]; addOns: AddOn[]
  cancellationPolicy: PolicyRow[]; timeline: Timeline[]; supportOptions: SupportOpt[]
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  confirmed: { label: 'Confirmed', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  pending:   { label: 'Pending',   color: 'text-amber-700',   bg: 'bg-amber-100'   },
  cancelled: { label: 'Cancelled', color: 'text-red-700',     bg: 'bg-red-100'     },
  completed: { label: 'Completed', color: 'text-slate-600',   bg: 'bg-slate-100'   },
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-50">
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left"
      >
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-slate-50 pt-4">{children}</div>}
    </div>
  )
}

// ─── Section renderers ────────────────────────────────────────────────────────

function FlightDetails({ f }: { f: NonNullable<BookingDetail['flight']> }) {
  return (
    <Section title="Flight Details">
      {/* Route bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="text-center">
          <p className="text-2xl font-black text-slate-900">{f.from.time}</p>
          <p className="text-xs font-bold text-slate-700">{f.from.code}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{f.from.city}</p>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <p className="text-[10px] text-slate-400">{f.duration}</p>
          <div className="w-full flex items-center gap-1">
            <div className="flex-1 h-px bg-slate-200" />
            <Plane className="w-4 h-4 text-sky-500 -rotate-45 shrink-0" />
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <p className="text-[10px] text-slate-400">Non-stop</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-slate-900">{f.to.time}</p>
          <p className="text-xs font-bold text-slate-700">{f.to.code}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{f.to.city}</p>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Flight',     value: `${f.airline} ${f.number}` },
          { label: 'Aircraft',   value: f.aircraft                 },
          { label: 'Class',      value: f.class                    },
          { label: 'Seat',       value: f.seat                     },
          { label: 'Cabin Bag',  value: f.baggage.cabin            },
          { label: 'Check-in Bag', value: f.baggage.checkin        },
        ].map(row => (
          <div key={row.label} className="bg-slate-50 rounded-xl px-3 py-2.5">
            <p className="text-[10px] text-slate-400 font-medium">{row.label}</p>
            <p className="text-xs font-bold text-slate-800 mt-0.5">{row.value}</p>
          </div>
        ))}
      </div>

      {/* Boarding alerts */}
      <div className="mt-4 space-y-2">
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-100">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-800">Check-in closes at {f.checkInDeadline}</p>
            <p className="text-[10px] text-amber-600 mt-0.5">{f.from.terminal} · {f.from.date}</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sky-50 border border-sky-100">
          <Clock className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-sky-800">Boarding closes at {f.boardingDeadline} · Gate {f.from.gate}</p>
            <p className="text-[10px] text-sky-600 mt-0.5">Arrive at gate 30 min before departure</p>
          </div>
        </div>
      </div>
    </Section>
  )
}

function HotelDetails({ h }: { h: NonNullable<BookingDetail['hotel']> }) {
  const AMENITY_ICONS: Record<string, React.ElementType> = {
    Pool: Waves, 'Free WiFi': Wifi, Breakfast: Coffee,
    AC: ShieldCheck, Parking: MapPin, 'Room Service': Utensils,
  }
  return (
    <Section title="Hotel Details">
      {/* Check-in / Check-out */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Check-in</p>
          <p className="text-sm font-extrabold text-emerald-900">{h.checkIn.time}</p>
          <p className="text-[10px] text-emerald-700 mt-0.5">{h.checkIn.date}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 border border-red-100">
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">Check-out</p>
          <p className="text-sm font-extrabold text-red-900">{h.checkOut.time}</p>
          <p className="text-[10px] text-red-700 mt-0.5">{h.checkOut.date}</p>
        </div>
      </div>

      {/* Stay info */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Room',    value: h.roomType  },
          { label: 'Guests',  value: h.guests    },
          { label: 'Nights',  value: String(h.nights) },
          { label: 'Rating',  value: `⭐ ${h.rating} (${h.reviews.toLocaleString()} reviews)` },
        ].map(row => (
          <div key={row.label} className="bg-slate-50 rounded-xl px-3 py-2.5">
            <p className="text-[10px] text-slate-400 font-medium">{row.label}</p>
            <p className="text-xs font-bold text-slate-800 mt-0.5">{row.value}</p>
          </div>
        ))}
      </div>

      {/* Address */}
      <div className="flex items-start gap-2 mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600">{h.address}</p>
      </div>

      {/* Amenities */}
      <div>
        <p className="text-xs font-bold text-slate-700 mb-2">Amenities</p>
        <div className="flex flex-wrap gap-2">
          {h.amenities.map(a => {
            const Icon = AMENITY_ICONS[a] ?? ShieldCheck
            return (
              <span key={a} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700">
                <Icon className="w-3.5 h-3.5" /> {a}
              </span>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

function TrainDetails({ t }: { t: NonNullable<BookingDetail['train']> }) {
  return (
    <Section title="Train Details">
      {/* Route bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="text-center">
          <p className="text-2xl font-black text-slate-900">{t.from.time}</p>
          <p className="text-xs font-bold text-slate-700 mt-0.5">{t.from.station}</p>
          <p className="text-[10px] text-slate-400">{t.from.date}</p>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1">
          <p className="text-[10px] text-slate-400">{t.duration}</p>
          <div className="w-full flex items-center gap-1">
            <div className="flex-1 h-px bg-slate-200" />
            <Train className="w-4 h-4 text-violet-500 shrink-0" />
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <p className="text-[10px] text-slate-400">{t.distance}</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-slate-900">{t.to.time}</p>
          <p className="text-xs font-bold text-slate-700 mt-0.5">{t.to.station}</p>
          <p className="text-[10px] text-slate-400">{t.to.date}</p>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Train No.',   value: t.number       },
          { label: 'Train Name',  value: t.name         },
          { label: 'Class',       value: t.class        },
          { label: 'Coach',       value: t.coach        },
          { label: 'Seats',       value: t.seats.join(', ') },
          { label: 'Quota',       value: t.quota        },
          { label: 'Platform – Dep.', value: t.from.platform },
          { label: 'Platform – Arr.', value: t.to.platform   },
        ].map(row => (
          <div key={row.label} className="bg-slate-50 rounded-xl px-3 py-2.5">
            <p className="text-[10px] text-slate-400 font-medium">{row.label}</p>
            <p className="text-xs font-bold text-slate-800 mt-0.5">{row.value}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BookingDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const booking = MOCK_BOOKINGS[bookingId as string] ?? MOCK_BOOKINGS['TRV-8821']
  const status = STATUS_CFG[booking.status] ?? STATUS_CFG.confirmed
  const [fareOpen, setFareOpen] = useState(false)

  const TypeIcon = booking.type === 'flight' ? Plane : booking.type === 'hotel' ? Hotel : Train
  const typeColor = booking.type === 'flight' ? 'text-sky-500' : booking.type === 'hotel' ? 'text-emerald-500' : 'text-violet-500'

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">

      {/* Back */}
      <Link href="/trips" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Bookings
      </Link>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg">
        <div className="absolute inset-0">
          <Image
            src={getDestinationImage(booking.destination, 900, 320)}
            alt={booking.destination}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/40 to-black/60" />
        </div>
        <div className="relative p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm ${status.bg} ${status.color}`}>
                  <CheckCircle2 className="w-3 h-3 inline mr-1" />{status.label}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm bg-white/15 text-white capitalize">
                  {booking.type}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">{booking.title}</h1>
              <p className="text-white/75 text-sm mt-0.5">{booking.subtitle}</p>
              <div className="flex items-center gap-3 mt-2 text-white/70 text-xs">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{booking.date}</span>
                <span className="flex items-center gap-1"><TypeIcon className={`w-3.5 h-3.5 ${typeColor}`} />{booking.provider}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-white/60 text-[10px]">Total Paid</p>
              <p className="text-2xl font-black text-white">{booking.amount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* PNR card */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
            {booking.type === 'train' ? 'PNR Number' : booking.type === 'hotel' ? 'Confirmation No.' : 'PNR / Booking Ref'}
          </p>
          <p className="text-xl sm:text-2xl font-black text-white tracking-widest font-mono">{booking.pnr}</p>
          <p className="text-[11px] text-slate-400 mt-1">Booked via {booking.bookedVia} · {booking.bookedOn}</p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors">
            <Download className="w-3.5 h-3.5" /> E-Ticket
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors">
            <Download className="w-3.5 h-3.5" /> Invoice
          </button>
        </div>
      </div>

      {/* Type-specific details */}
      {booking.type === 'flight' && booking.flight && <FlightDetails f={booking.flight} />}
      {booking.type === 'hotel'  && booking.hotel  && <HotelDetails  h={booking.hotel}  />}
      {booking.type === 'train'  && booking.train  && <TrainDetails  t={booking.train}  />}

      {/* Passenger details */}
      <Section title={`Traveller${booking.passengers.length > 1 ? 's' : ''} (${booking.passengers.length})`}>
        <div className="space-y-3">
          {booking.passengers.map((p, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-sm font-bold text-sky-700 shrink-0">
                {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900">{p.name}</p>
                <p className="text-xs text-slate-500">{p.type} · Age {p.age}</p>
              </div>
              {p.seat !== '—' && (
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-slate-400">Seat</p>
                  <p className="text-xs font-bold text-slate-700">{p.seat}</p>
                </div>
              )}
              {p.meal !== '—' && (
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-slate-400">Meal</p>
                  <p className="text-xs font-bold text-slate-700">{p.meal}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Fare breakup */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <button
          onClick={() => setFareOpen(v => !v)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-left"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-slate-900">Fare Breakup</h2>
            <span className="text-sm font-extrabold text-sky-600">{booking.amount}</span>
          </div>
          {fareOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {fareOpen && (
          <div className="px-5 pb-5 border-t border-slate-50 pt-4 space-y-2.5">
            {booking.fareBreakup.map((row, i) => (
              <div key={i} className="flex items-center justify-between">
                <p className="text-sm text-slate-600">{row.label}</p>
                <p className="text-sm font-bold text-slate-900">{row.amount}</p>
              </div>
            ))}
            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">Total Paid</p>
              <p className="text-base font-extrabold text-sky-600">{booking.amount}</p>
            </div>
          </div>
        )}
      </div>

      {/* Add-ons */}
      <Section title="Add-ons & Services">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {booking.addOns.map((a, i) => (
            <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border ${a.included ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${a.included ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                <a.icon className={`w-4.5 h-4.5 ${a.included ? 'text-emerald-600' : 'text-slate-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold ${a.included ? 'text-emerald-800' : 'text-slate-700'}`}>{a.label}</p>
                <p className={`text-[10px] mt-0.5 ${a.included ? 'text-emerald-600' : 'text-slate-400'}`}>{a.detail}</p>
              </div>
              {a.included
                ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                : <button className="text-[10px] font-bold text-sky-500 hover:text-sky-600 transition-colors shrink-0">Add</button>
              }
            </div>
          ))}
        </div>
      </Section>

      {/* Booking timeline */}
      <Section title="Booking Timeline">
        <div className="space-y-0">
          {booking.timeline.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${step.done ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                  {step.done
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    : <Clock className="w-4 h-4 text-slate-400" />
                  }
                </div>
                {i < booking.timeline.length - 1 && (
                  <div className={`w-px flex-1 my-1 ${step.done ? 'bg-emerald-200' : 'bg-slate-100'}`} style={{ minHeight: '20px' }} />
                )}
              </div>
              <div className="pb-4">
                <p className={`text-sm font-semibold ${step.done ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{step.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Cancellation policy */}
      <Accordion title="Cancellation Policy">
        <div className="space-y-2">
          {booking.cancellationPolicy.map((row, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Window</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5">{row.window}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Penalty</p>
                <p className="text-xs font-bold text-red-600 mt-0.5">{row.charge}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Refund</p>
                <p className="text-xs font-bold text-emerald-600 mt-0.5">{row.refund}</p>
              </div>
            </div>
          ))}
          <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
            Refunds are credited to the original payment method within 5–7 business days.
            Wallet credits are instant.
          </p>
        </div>
      </Accordion>

      {/* Need help */}
      <Section title="Need Help?">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {booking.supportOptions.map((s, i) => (
            <button key={i} className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-200 transition-all group">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                <s.icon className="w-4.5 h-4.5 text-sky-500" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 group-hover:text-sky-700">{s.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.detail}</p>
              </div>
            </button>
          ))}
        </div>
        <Link
          href="/support"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <MessageCircle className="w-4 h-4" /> View All Support Options
        </Link>
      </Section>

      {/* Actions */}
      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <RefreshCw className="w-4 h-4" /> Modify Booking
          </button>
          <button className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-200 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
            <X className="w-4 h-4" /> Cancel Booking
          </button>
        </div>
      )}

    </div>
  )
}
