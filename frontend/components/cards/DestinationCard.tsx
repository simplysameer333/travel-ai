'use client'
import { ArrowRight } from 'lucide-react'

export interface DestinationCardProps {
  name:     string
  tagline:  string
  price:    string
  image:    string
  tag:      string
  tagColor: string           // full Tailwind bg class, e.g. 'bg-rose-500'
  onClick?: () => void
}

export function DestinationCard({ name, tagline, price, image, tag, tagColor, onClick }: DestinationCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 hover:-translate-y-1 h-full w-full"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {/* Tag badge */}
      <div className="absolute top-3 left-3">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full text-white ${tagColor}`}>
          {tag}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-white leading-none mb-0.5">{name}</h3>
          <p className="text-white/65 text-xs">{tagline}</p>
          <p className="text-emerald-300 text-sm font-bold mt-1.5">{price}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
          <ArrowRight className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
    </div>
  )
}
