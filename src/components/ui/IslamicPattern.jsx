export function PatternOverlay({ className = '', opacity = '0.03' }) {
  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} viewBox="0 0 200 200" preserveAspectRatio="none" style={{ opacity }}>
      <defs>
        <pattern id="islamic-stars" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <polygon points="40,5 47,30 72,30 52,45 58,70 40,55 22,70 28,45 8,30 33,30" fill="currentColor" />
          <circle cx="40" cy="40" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <pattern id="islamic-geo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30,0 L60,30 L30,60 L0,30 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M30,15 L45,30 L30,45 L15,30 Z" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-geo)" />
    </svg>
  )
}

export function StarPattern({ className = '', opacity = '0.05' }) {
  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} viewBox="0 0 200 200" preserveAspectRatio="none" style={{ opacity }}>
      <defs>
        <pattern id="stars-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <polygon points="50,5 58,35 90,35 65,55 75,85 50,65 25,85 35,55 10,35 42,35" fill="currentColor" transform="scale(0.6) translate(15,15)" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#stars-pattern)" />
    </svg>
  )
}

export function KBFLogo({ className = '', size = 'default' }) {
  const sizes = {
    small: { box: 'w-8 h-8', text: 'text-xs', wrapper: 'w-8 h-8' },
    default: { box: 'w-10 h-10', text: 'text-sm', wrapper: 'w-10 h-10' },
    large: { box: 'w-14 h-14', text: 'text-xl', wrapper: 'w-14 h-14' },
    xl: { box: 'w-16 h-16', text: 'text-2xl', wrapper: 'w-16 h-16' },
  }
  const s = sizes[size] || sizes.default

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${s.wrapper} rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0 border border-gold-500/30`}>
        <span className={`${s.text} font-bold text-gold-500 font-display tracking-wide`}>KBF</span>
      </div>
      <div className="hidden sm:block">
        <span className={`${size === 'large' || size === 'xl' ? 'text-lg' : 'text-base'} font-display font-bold text-emerald-600 leading-tight block`}>
          Knots by Fimihan
        </span>
      </div>
    </div>
  )
}
