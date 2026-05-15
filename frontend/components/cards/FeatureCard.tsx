import { ReactNode } from 'react'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  color: string
}

export default function FeatureCard({
  icon,
  title,
  description,
  color,
}: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
      <div
        className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-sm sm:text-base font-semibold text-slate-800 mb-1">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
