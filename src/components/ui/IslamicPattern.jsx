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

export function KBFLogo({ className = '', size = 'default', light = false }) {
  const isSmall = size === 'small'
  const g = (dark) => {
    if (light) return { badge: 'transparent', border: 'rgba(201,150,58,0.5)', starOuter: 'rgba(201,150,58,0.12)', star: '#C9963A', monoBg: 'transparent', monoBorder: '#C9963A', word: '#FAF7F2', tag: '#C9963A' }
    return { badge: '#1A5C3A', border: 'rgba(201,150,58,0.3)', starOuter: 'rgba(201,150,58,0.08)', star: '#C9963A', monoBg: '#1A5C3A', monoBorder: '#C9963A', word: '#1A5C3A', tag: '#C9963A' }
  }
  const c = g()

  const badge = (
    <svg viewBox="0 0 60 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="56" height="56" rx="14" fill={c.badge} stroke={c.border} strokeWidth="1" />
      <path d="M30 13 L40 20 L47 30 L40 40 L30 47 L20 40 L13 30 L20 20 Z" fill={c.star} opacity="0.12" />
      <path d="M30 19 L36 24 L41 30 L36 36 L30 41 L24 36 L19 30 L24 24 Z" fill={c.star} />
      <circle cx="30" cy="30" r="9" fill={c.monoBg} stroke={c.monoBorder} strokeWidth="0.8" />
      <text x="30" y="35" textAnchor="middle" fontFamily="'Playfair Display',Georgia,serif" fontSize="15" fontWeight="700" fill={c.star} letterSpacing="0.5">K</text>
    </svg>
  )

  if (isSmall) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-8 h-8 flex-shrink-0">{badge}</div>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="w-10 h-10 lg:w-11 lg:h-11 flex-shrink-0">{badge}</div>
      <div className="hidden sm:block">
        <svg viewBox="0 0 200 60" className="h-9 lg:h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="26" fontFamily="'Playfair Display',Georgia,serif" fontSize="18" fontWeight="700">
            <tspan fill={c.word}>Knots by </tspan>
            <tspan fill={c.star}>Fimihan</tspan>
          </text>
          <text x="0" y="43" fontFamily="'DM Sans','Helvetica Neue',Arial,sans-serif" fontSize="8.5" fill={c.tag} letterSpacing="4.5">MODEST FASHION</text>
        </svg>
      </div>
    </div>
  )
}
