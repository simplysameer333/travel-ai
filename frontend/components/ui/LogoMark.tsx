/**
 * TravelAI logo mark — 3-node neural triangle.
 * Top apex = AI intelligence, bottom two = departure + destination.
 * White-on-transparent; wrap in a colored container.
 */
export default function LogoMark({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Triangle edges */}
      <line x1="12" y1="4.5" x2="5.5"  y2="18.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="12" y1="4.5" x2="18.5" y2="18.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="5.5" y1="18.5" x2="18.5" y2="18.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      {/* Faint vertical axis — AI guides the route */}
      <line x1="12" y1="7"   x2="12" y2="14"  stroke="white" strokeWidth="1"   strokeLinecap="round" opacity="0.35" />
      {/* Apex node — brightest, the AI */}
      <circle cx="12"  cy="4.5"  r="2.8" fill="white" />
      {/* Departure & destination nodes */}
      <circle cx="5.5" cy="18.5" r="2"   fill="white" opacity="0.85" />
      <circle cx="18.5" cy="18.5" r="2"  fill="white" opacity="0.85" />
      {/* Centre convergence node */}
      <circle cx="12"  cy="13.5" r="1.4" fill="white" opacity="0.45" />
    </svg>
  )
}
