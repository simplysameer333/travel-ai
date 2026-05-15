'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import {
  ArrowLeft, Sparkles, Send, Bot, User, MapPin, Calendar, Users,
  DollarSign, Plane, Hotel, RefreshCw,
} from 'lucide-react'
import { getPackageById } from '@/lib/packages'

interface Message {
  role: 'ai' | 'user'
  content: string
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'ai',
    content: "Hi! I'm your AI travel planner ✈️ I'll build you a personalized package in minutes. Let's start — **where do you want to go?** Or tell me a vibe (beach, mountains, heritage, adventure…) and I'll suggest destinations.",
  },
]

const QUICK_REPLIES = [
  { emoji: '🏖️', text: 'Goa beach vacation' },
  { emoji: '⛰️', text: 'Himalayan adventure' },
  { emoji: '🏛️', text: 'Rajasthan heritage tour' },
  { emoji: '🌏', text: 'International trip' },
  { emoji: '🌴', text: 'Kerala backwaters' },
  { emoji: '💍', text: 'Honeymoon package' },
]

const PREFERENCE_CHIPS = [
  { icon: Users, label: 'Solo' },
  { icon: Users, label: 'Couple' },
  { icon: Users, label: 'Family' },
  { icon: DollarSign, label: 'Budget' },
  { icon: DollarSign, label: 'Mid-range' },
  { icon: DollarSign, label: 'Luxury' },
  { icon: Plane, label: 'Flights included' },
  { icon: Hotel, label: '5-star hotel' },
  { icon: Calendar, label: 'Flexible dates' },
]

function AIBuilder() {
  const searchParams = useSearchParams()
  const basePackageId = searchParams.get('base')
  const basePackage = basePackageId ? getPackageById(basePackageId) : null

  const [messages, setMessages] = useState<Message[]>(() => {
    if (basePackage) {
      return [
        ...INITIAL_MESSAGES,
        {
          role: 'ai',
          content: `Great choice! I can see you're interested in **${basePackage.title}** — ${basePackage.duration_nights} nights, ${basePackage.destinations.join(' → ')}. Would you like to customize the dates, hotel category, add activities, or adjust the budget? Just tell me what you'd change.`,
        },
      ]
    }
    return INITIAL_MESSAGES
  })
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const aiReply: Message = {
        role: 'ai',
        content: getAIReply(text, messages.length),
      }
      setMessages(prev => [...prev, aiReply])
      setIsTyping(false)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900 to-purple-900 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/packages" className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">AI Package Builder</p>
              <p className="text-xs text-violet-300">Powered by TravelAI</p>
            </div>
          </div>
          <button
            onClick={() => setMessages(INITIAL_MESSAGES)}
            className="ml-auto flex items-center gap-1.5 text-violet-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Quick preference chips */}
      <div className="bg-white border-b border-slate-100 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs text-slate-400 shrink-0">Quick add:</span>
          {PREFERENCE_CHIPS.map(chip => (
            <button
              key={chip.label}
              onClick={() => sendMessage(chip.label)}
              className="flex items-center gap-1.5 shrink-0 text-xs font-semibold bg-slate-100 hover:bg-violet-100 hover:text-violet-700 text-slate-600 px-3 py-1.5 rounded-full transition-all"
            >
              <chip.icon className="w-3 h-3" />
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                msg.role === 'ai' ? 'bg-violet-600' : 'bg-sky-500'
              }`}>
                {msg.role === 'ai' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'ai'
                  ? 'bg-white border border-slate-100 shadow-sm text-slate-800'
                  : 'bg-violet-600 text-white'
              }`}
                dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
              />
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-600 shrink-0 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-100 shadow-sm rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick reply chips (only on first AI message) */}
          {messages.length <= 2 && !isTyping && (
            <div className="flex flex-wrap gap-2 ml-11">
              {QUICK_REPLIES.map(qr => (
                <button
                  key={qr.text}
                  onClick={() => sendMessage(qr.text)}
                  className="flex items-center gap-1.5 bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-700 text-xs font-semibold px-3 py-2 rounded-full transition-all"
                >
                  <span>{qr.emoji}</span>
                  {qr.text}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="bg-white border-t border-slate-100 px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <div className="flex-1 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
              placeholder="Tell me your travel preferences..."
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/25 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function getAIReply(userMsg: string, msgCount: number): string {
  const msg = userMsg.toLowerCase()
  if (msg.includes('goa') || msg.includes('beach'))
    return "Perfect! 🏖️ Goa is a great choice. **How many nights?** I recommend at least 4 nights to cover both North and South Goa. Also — **when are you planning to travel?** Peak season (Dec–Jan) costs 30% more but has the best weather."
  if (msg.includes('manali') || msg.includes('mountain') || msg.includes('himalaya') || msg.includes('snow'))
    return "Love the mountain vibe! ⛰️ Manali is stunning, especially for the Rohtang Pass and Solang Valley. **Are you interested in adventure activities** like paragliding, river rafting, or snow trekking? And how many people are travelling?"
  if (msg.includes('kerala') || msg.includes('backwater'))
    return "Kerala is pure magic! 🌴 The houseboat experience on Alleppey backwaters is unmissable. Would you like a **honeymoon-style luxury package** (5★ + houseboat) or a **budget-friendly version** with 3★ stays? We can also add an Ayurveda spa day."
  if (msg.includes('rajasthan') || msg.includes('heritage') || msg.includes('jaipur'))
    return "The royal triangle (Jaipur → Jodhpur → Udaipur) is breathtaking! 👑 A 7-night itinerary covers all three cities beautifully. **Do you prefer palace hotels** (₹15K/night) or heritage havelis (₹6K/night)? Both are authentic Rajasthani experiences."
  if (msg.includes('couple') || msg.includes('honeymoon'))
    return "Aww, romantic travel! 💍 For couples, I recommend **Kerala** (houseboat + Ayurveda), **Maldives** (overwater bungalow), or **Udaipur** (lake-view palace). Any preference? I can tailor inclusions like candlelit dinners, room decoration, and sunset cruises."
  if (msg.includes('family') || msg.includes('kids'))
    return "Family trips are my specialty! 👨‍👩‍👧 For families with kids, **Goa** (beaches + water parks), **Rajasthan** (elephant rides + fort tours), or **Singapore** (Universal Studios, Sentosa) work brilliantly. **How old are the kids?** That helps me pick kid-friendly activities."
  if (msg.includes('budget') || msg.includes('cheap') || msg.includes('affordable'))
    return "Smart move! 💰 I can find you excellent packages under ₹15,000/person. Top budget picks: **Goa (3N/4D from ₹8,999)**, **Manali (4N/5D from ₹12,999)**, or **Coorg (2N/3D from ₹6,499)**. Which sounds interesting?"
  if (msg.includes('luxury') || msg.includes('5 star') || msg.includes('premium'))
    return "Excellent taste! ✨ Our premium packages include 5★ resorts, private transfers, and exclusive experiences. Top picks: **Maldives overwater villa (₹89,999)**, **Kerala luxury houseboat (₹45,999)**, or **Dubai with Burj Al Arab (₹1,20,000)**. Which destination appeals?"
  if (msg.includes('international') || msg.includes('abroad'))
    return "International adventures await! 🌏 Most popular for Indian travellers: **Thailand (₹35K)**, **Dubai (₹45K)**, **Bali (₹42K)**, **Singapore (₹52K)**, **Maldives (₹80K)**. All visa-free or easy visa. Which region interests you most?"
  if (msgCount > 4)
    return "Based on everything you've told me, I'm building your perfect package now! 🎉 This will take just a moment... In the meantime, you can also **browse our pre-built packages** to compare. Your custom package will include flights, hotels, transfers and all the activities we discussed."
  return "Great! I'm understanding your preferences. Tell me more — **what's your approximate budget per person**, and **how many nights** are you thinking? This helps me find you the best value package. 🌟"
}

export default function CreateWithAIPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Sparkles className="w-6 h-6 text-violet-500 animate-pulse" /></div>}>
      <AIBuilder />
    </Suspense>
  )
}
