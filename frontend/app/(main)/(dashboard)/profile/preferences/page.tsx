'use client'

import { useState } from 'react'
import { Settings, Save, Globe, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

const SEAT_PREFS    = ['Window', 'Aisle', 'No preference']
const MEAL_PREFS    = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'No preference']
const CABIN_PREFS   = ['Economy', 'Premium Economy', 'Business', 'First Class']
const BUDGET_RANGES = ['Under ₹3,000', '₹3,000 – ₹7,000', '₹7,000 – ₹15,000', '₹15,000+']
const AIRLINES      = ['IndraAir', 'SkyIndia', 'SpiceRoute', 'VistaSky', 'AkasaWings', 'GoAir']
const TRAIN_CLASSES = ['Sleeper', 'AC 3 Tier', 'AC 2 Tier', 'First AC', 'No preference']

const CURRENCIES = [
  { code: 'INR', symbol: '₹',    name: 'Indian Rupee',        flag: '🇮🇳' },
  { code: 'USD', symbol: '$',    name: 'US Dollar',           flag: '🇺🇸' },
  { code: 'EUR', symbol: '€',    name: 'Euro',                flag: '🇪🇺' },
  { code: 'GBP', symbol: '£',    name: 'British Pound',       flag: '🇬🇧' },
  { code: 'AED', symbol: 'د.إ',  name: 'UAE Dirham',          flag: '🇦🇪' },
  { code: 'SGD', symbol: 'S$',   name: 'Singapore Dollar',    flag: '🇸🇬' },
  { code: 'AUD', symbol: 'A$',   name: 'Australian Dollar',   flag: '🇦🇺' },
  { code: 'CAD', symbol: 'C$',   name: 'Canadian Dollar',     flag: '🇨🇦' },
  { code: 'JPY', symbol: '¥',    name: 'Japanese Yen',        flag: '🇯🇵' },
  { code: 'CNY', symbol: '¥',    name: 'Chinese Yuan',        flag: '🇨🇳' },
  { code: 'CHF', symbol: 'Fr',   name: 'Swiss Franc',         flag: '🇨🇭' },
  { code: 'HKD', symbol: 'HK$',  name: 'Hong Kong Dollar',    flag: '🇭🇰' },
  { code: 'THB', symbol: '฿',    name: 'Thai Baht',           flag: '🇹🇭' },
  { code: 'MYR', symbol: 'RM',   name: 'Malaysian Ringgit',   flag: '🇲🇾' },
  { code: 'IDR', symbol: 'Rp',   name: 'Indonesian Rupiah',   flag: '🇮🇩' },
  { code: 'SAR', symbol: '﷼',    name: 'Saudi Riyal',         flag: '🇸🇦' },
  { code: 'NZD', symbol: 'NZ$',  name: 'New Zealand Dollar',  flag: '🇳🇿' },
  { code: 'SEK', symbol: 'kr',   name: 'Swedish Krona',       flag: '🇸🇪' },
  { code: 'ZAR', symbol: 'R',    name: 'South African Rand',  flag: '🇿🇦' },
  { code: 'BRL', symbol: 'R$',   name: 'Brazilian Real',      flag: '🇧🇷' },
]

const LANGUAGES = [
  { code: 'en', label: 'English',    native: 'English',    flag: '🇺🇸' },
  { code: 'hi', label: 'Hindi',      native: 'हिन्दी',      flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali',    native: 'বাংলা',       flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil',      native: 'தமிழ்',       flag: '🇮🇳' },
  { code: 'te', label: 'Telugu',     native: 'తెలుగు',      flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi',    native: 'मराठी',       flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati',   native: 'ગુજરાતી',     flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada',    native: 'ಕನ್ನಡ',       flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam',  native: 'മലയാളം',      flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi',    native: 'ਪੰਜਾਬੀ',      flag: '🇮🇳' },
  { code: 'ar', label: 'Arabic',     native: 'العربية',     flag: '🇸🇦' },
  { code: 'fr', label: 'French',     native: 'Français',    flag: '🇫🇷' },
  { code: 'de', label: 'German',     native: 'Deutsch',     flag: '🇩🇪' },
  { code: 'es', label: 'Spanish',    native: 'Español',     flag: '🇪🇸' },
  { code: 'ja', label: 'Japanese',   native: '日本語',       flag: '🇯🇵' },
  { code: 'zh', label: 'Chinese',    native: '中文',         flag: '🇨🇳' },
]

function SelectField({ label, options, value, onChange }: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/60 text-sm font-medium text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/15 transition-all"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}

function ToggleRow({ label, description, checked, onChange }: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400/30 ${checked ? 'bg-sky-500' : 'bg-slate-200'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}

export default function PreferencesPage() {
  const [cabin, setCabin]             = useState('Economy')
  const [seat, setSeat]               = useState('Window')
  const [meal, setMeal]               = useState('No preference')
  const [budget, setBudget]           = useState('₹3,000 – ₹7,000')
  const [trainClass, setTrainClass]   = useState('AC 3 Tier')
  const [priceAlerts, setPriceAlerts] = useState(true)
  const [emailBooking, setEmailBooking] = useState(true)
  const [tripReminders, setTripReminders] = useState(true)
  const [aiRecs, setAiRecs]           = useState(true)
  const [currency, setCurrency]       = useState('INR')
  const [language, setLanguage]       = useState('en')

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Travel Preferences</h1>
        <p className="text-sm text-slate-500 mt-1">Personalise your TravelAI experience</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-sky-500" />
          <h2 className="text-sm font-bold text-slate-900">Flight Preferences</h2>
        </div>
        <SelectField label="Cabin Class"     options={CABIN_PREFS} value={cabin} onChange={setCabin} />
        <SelectField label="Seat Preference" options={SEAT_PREFS}  value={seat}  onChange={setSeat}  />
        <SelectField label="Meal Preference" options={MEAL_PREFS}  value={meal}  onChange={setMeal}  />
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Preferred Airlines</label>
          <div className="flex flex-wrap gap-2">
            {AIRLINES.map(a => (
              <button key={a} className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 transition-all">
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-bold text-slate-900">Train Preferences</h2>
        <SelectField label="Preferred Class" options={TRAIN_CLASSES} value={trainClass} onChange={setTrainClass} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-bold text-slate-900">Budget Preferences</h2>
        <SelectField label="Budget per Person (one-way)" options={BUDGET_RANGES} value={budget} onChange={setBudget} />
      </div>

      {/* Language & Currency */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-sky-500" />
          <h2 className="text-sm font-bold text-slate-900">Language &amp; Currency</h2>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Display Language</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all ${
                  language === lang.code
                    ? 'border-sky-400 bg-sky-50 text-sky-700 shadow-sm'
                    : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:border-sky-200 hover:bg-sky-50/40'
                }`}
              >
                <span className="text-lg leading-none">{lang.flag}</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">{lang.native}</div>
                  <div className="text-[10px] text-slate-400 truncate">{lang.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            <label className="text-sm font-semibold text-slate-700">Display Currency</label>
            {(() => {
              const cur = CURRENCIES.find(c => c.code === currency)
              return cur ? (
                <span className="ml-auto text-xs font-bold text-sky-600 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
                  {cur.flag} {cur.code} {cur.symbol}
                </span>
              ) : null
            })()}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {CURRENCIES.map(cur => (
              <button
                key={cur.code}
                onClick={() => setCurrency(cur.code)}
                title={cur.name}
                className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border transition-all ${
                  currency === cur.code
                    ? 'border-sky-400 bg-sky-50 shadow-sm'
                    : 'border-slate-200 bg-slate-50/60 hover:border-sky-200 hover:bg-sky-50/40'
                }`}
              >
                <span className="text-xl leading-none">{cur.flag}</span>
                <span className={`text-[11px] font-extrabold ${currency === cur.code ? 'text-sky-700' : 'text-slate-700'}`}>
                  {cur.code}
                </span>
                <span className="text-[10px] text-slate-400">{cur.symbol}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-sm font-bold text-slate-900 mb-2">Notification Preferences</h2>
        <ToggleRow label="Price Drop Alerts"     description="Get notified when fares drop on saved routes" checked={priceAlerts}    onChange={setPriceAlerts}    />
        <ToggleRow label="Booking Confirmations" description="Email confirmations and ticket updates"        checked={emailBooking}   onChange={setEmailBooking}   />
        <ToggleRow label="Trip Reminders"        description="Check-in reminders before your trips"         checked={tripReminders}  onChange={setTripReminders}  />
        <ToggleRow label="AI Recommendations"    description="Personalised trip and deal suggestions"       checked={aiRecs}         onChange={setAiRecs}         />
      </div>

      <button
        onClick={() => toast.success('Preferences saved.')}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-bold shadow-md shadow-sky-500/25 hover:shadow-sky-500/40 transition-all"
      >
        <Save className="w-4 h-4" /> Save Preferences
      </button>

    </div>
  )
}
