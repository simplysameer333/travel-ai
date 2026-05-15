'use client'

import { useState } from 'react'
import { FileText, Plus, Shield, Calendar, Globe, AlertTriangle, Eye, Trash2 } from 'lucide-react'

interface Document {
  id: string
  type: string
  number: string
  country: string
  expiry: string
  expired: boolean
}

const MOCK_DOCS: Document[] = []

function AddDocModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-4 sm:pb-0">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Add Travel Document</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors text-lg leading-none">✕</button>
        </div>
        <select className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/15 transition-all">
          <option value="">Document type...</option>
          <option>Passport</option>
          <option>National ID</option>
          <option>Driver's Licence</option>
          <option>Visa</option>
          <option>PAN Card</option>
          <option>Aadhaar</option>
        </select>
        {['Document Number', 'Full Name (as on document)', 'Date of Birth', 'Expiry Date', 'Issuing Country'].map(f => (
          <input
            key={f}
            placeholder={f}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/60 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/15 transition-all"
          />
        ))}
        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-bold shadow-md shadow-sky-500/25">
            Save Document
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TravelDocumentsPage() {
  const [showAdd, setShowAdd] = useState(false)
  const [docs] = useState<Document[]>(MOCK_DOCS)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      {showAdd && <AddDocModal onClose={() => setShowAdd(false)} />}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Travel Documents</h1>
          <p className="text-sm text-slate-500 mt-1">Securely store passport, visa and ID details</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-bold shadow-md shadow-sky-500/25 hover:shadow-sky-500/40 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
        <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-emerald-800">End-to-end encrypted</p>
          <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
            Your documents are encrypted at rest and never shared with third parties. They're used only for auto-fill during booking — never stored by airlines or providers.
          </p>
        </div>
      </div>

      {/* Document types guide */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { icon: '🛂', label: 'Passport',    desc: 'Required for international travel' },
          { icon: '🪪', label: 'National ID',  desc: 'Aadhaar, PAN, Voter ID'           },
          { icon: '✈️', label: 'Visa',         desc: 'Entry permits & visas'             },
          { icon: '🚂', label: 'Railway ID',   desc: 'For rail bookings'                },
          { icon: '🏨', label: 'Hotel ID',     desc: 'Check-in requirements'            },
          { icon: '📋', label: 'Insurance',    desc: 'Travel insurance docs'            },
        ].map(d => (
          <div key={d.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3.5 text-center">
            <div className="text-xl mb-1.5">{d.icon}</div>
            <p className="text-xs font-bold text-slate-800">{d.label}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{d.desc}</p>
          </div>
        ))}
      </div>

      {/* Documents list */}
      {docs.length > 0 ? (
        <div className="space-y-3">
          {docs.map(doc => (
            <div key={doc.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{doc.type}</p>
                    <p className="text-xs text-slate-400 font-mono">••••{doc.number.slice(-4)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.expired && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
                      <AlertTriangle className="w-3 h-3" /> Expired
                    </span>
                  )}
                  <button className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Eye className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="p-2.5 rounded-xl hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{doc.country}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Expires {doc.expiry}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-600 mb-1">No documents yet</p>
          <p className="text-xs text-slate-400 mb-4 max-w-xs mx-auto">
            Add your passport and IDs for faster booking checkout and auto-fill.
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold shadow-md shadow-sky-500/25"
          >
            <Plus className="w-4 h-4" /> Add First Document
          </button>
        </div>
      )}
    </div>
  )
}
