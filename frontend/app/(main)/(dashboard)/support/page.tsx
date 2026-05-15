'use client'

import { useState } from 'react'
import { MessageCircle, Phone, Mail, FileQuestion, ChevronDown, ChevronUp, Headphones, Send } from 'lucide-react'

const FAQS = [
  {
    q: 'How do I cancel a booking?',
    a: "Go to Bookings, find your reservation, and click Cancel. Cancellation is subject to the airline or provider's policy. Refunds are processed within 5–7 business days.",
  },
  {
    q: 'When will I receive my refund?',
    a: 'Refunds are typically processed in 5–7 business days to your original payment method. Wallet credits are instant. You can track status in Payments → Refunds.',
  },
  {
    q: 'How does AI trip planning work?',
    a: 'Our AI analyses your preferences, budget, and travel history to suggest optimised itineraries. Open Travel Buddy and describe your trip — it handles routing, timing and pricing.',
  },
  {
    q: 'Can I modify my booking after confirmation?',
    a: "Date and name changes depend on the provider's policy. Go to Bookings → Modify Booking, or contact our support team for assisted changes.",
  },
  {
    q: 'How are travel documents stored?',
    a: 'Documents are encrypted at rest and never shared with third parties without your consent. They are used only for auto-fill during booking.',
  },
]

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [message, setMessage] = useState('')

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Support</h1>
        <p className="text-sm text-slate-500 mt-1">We're here to help, 24/7</p>
      </div>

      {/* Contact cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: MessageCircle, label: 'Live Chat',  detail: 'Avg. reply < 2 min',  color: 'text-sky-500',    bg: 'bg-sky-50',    border: 'border-sky-100',    action: 'Start Chat'  },
          { icon: Mail,          label: 'Email',      detail: 'support@travelai.in', color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-100', action: 'Send Email'  },
          { icon: Phone,         label: 'Emergency',  detail: '+91 1800-TRAVEL',     color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', action: 'Call Now' },
        ].map(c => (
          <div key={c.label} className={`bg-white rounded-2xl border ${c.border} shadow-sm p-4 text-center`}>
            <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mx-auto mb-3`}>
              <c.icon className={`w-5 h-5 ${c.color}`} />
            </div>
            <p className="text-sm font-bold text-slate-800">{c.label}</p>
            <p className="text-xs text-slate-400 mt-0.5 mb-3">{c.detail}</p>
            <button className={`w-full py-2 rounded-xl text-xs font-bold border ${c.border} ${c.color} ${c.bg} hover:brightness-95 transition-all`}>
              {c.action}
            </button>
          </div>
        ))}
      </div>

      {/* Quick message */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Headphones className="w-4 h-4 text-sky-500" />
          <h2 className="text-sm font-bold text-slate-900">Send us a message</h2>
        </div>
        <select className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/15 mb-3 transition-all">
          <option value="">Select topic...</option>
          <option>Booking issue</option>
          <option>Payment / Refund</option>
          <option>Cancellation</option>
          <option>Flight change</option>
          <option>Travel documents</option>
          <option>Account issue</option>
          <option>Other</option>
        </select>
        <div className="relative">
          <textarea
            rows={3}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Describe your issue..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/15 resize-none transition-all min-h-[88px]"
          />
          <button
            disabled={!message.trim()}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold disabled:opacity-40 transition-opacity"
          >
            <Send className="w-3 h-3" /> Send
          </button>
        </div>
      </div>

      {/* Ticket history */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-sm font-bold text-slate-900 mb-3">My Support Tickets</h2>
        <div className="py-6 text-center">
          <FileQuestion className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-400">No open tickets. We hope everything is going smoothly! ✈️</p>
        </div>
      </div>

      {/* FAQs */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-3">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-semibold text-slate-800">{faq.q}</span>
                {openFaq === i
                  ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 border-t border-slate-50">
                  <p className="text-sm text-slate-600 leading-relaxed pt-3">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
