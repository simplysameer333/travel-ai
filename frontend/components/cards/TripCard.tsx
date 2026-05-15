interface Trip {
  id: string
  destination: string
  date: string
  status: 'upcoming' | 'completed' | 'saved'
  price: string
}

interface TripCardProps {
  trip?: Trip
}

const statusConfig = {
  upcoming: {
    label: 'Upcoming',
    className: 'bg-sky-100 text-sky-700',
  },
  completed: {
    label: 'Completed',
    className: 'bg-emerald-100 text-emerald-700',
  },
  saved: {
    label: 'Saved',
    className: 'bg-purple-100 text-purple-700',
  },
}

export default function TripCard({ trip }: TripCardProps) {
  if (!trip) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
        <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
    )
  }

  const status = statusConfig[trip.status]

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-slate-800">
          {trip.destination}
        </h3>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.className}`}
        >
          {status.label}
        </span>
      </div>
      <p className="text-sm text-slate-500 mb-4">{trip.date}</p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-slate-900">{trip.price}</span>
        <button className="text-sm text-sky-500 font-medium hover:text-sky-700 transition-colors">
          View Details
        </button>
      </div>
    </div>
  )
}
