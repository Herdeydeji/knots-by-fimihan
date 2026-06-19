import { useEffect, useRef, useState } from 'react'
import { HiCheck, HiX, HiExclamation } from 'react-icons/hi'
import { useToast } from '../../stores/useToast'

function ToastIcon({ type }) {
  const icons = {
    success: <HiCheck className="w-4 h-4 text-emerald-600" />,
    error: <HiX className="w-4 h-4 text-red-500" />,
    info: <HiExclamation className="w-4 h-4 text-blue-500" />,
  }
  const bg = {
    success: 'bg-emerald-100 dark:bg-emerald-900/40',
    error: 'bg-red-100 dark:bg-red-900/40',
    info: 'bg-blue-100 dark:bg-blue-900/40',
  }
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${bg[type] || bg.success}`}>
      {icons[type] || icons.success}
    </div>
  )
}

function ProgressBar({ duration, createdAt, removing }) {
  const [width, setWidth] = useState(100)
  const frameRef = useRef(null)

  useEffect(() => {
    if (removing) { setWidth(0); return }
    const elapsed = Date.now() - createdAt
    const remaining = Math.max(0, duration - elapsed)
    setWidth((remaining / duration) * 100)
    const start = performance.now()
    const tick = (now) => {
      const pct = Math.max(0, ((remaining - (now - start)) / duration) * 100)
      setWidth(pct)
      if (pct > 0) frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [duration, createdAt, removing])

  const barColor = removing ? '' : 'bg-emerald-500 dark:bg-emerald-400'
  return (
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cream-200 dark:bg-gray-700 rounded-b-xl overflow-hidden">
      <div
        className={`h-full rounded-b-xl transition-none ${barColor}`}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

function ToastItem({ toast }) {
  const { removeToast } = useToast()
  const soundDoneRef = useRef(false)

  useEffect(() => {
    if (soundDoneRef.current) return
    soundDoneRef.current = true
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      ctx.resume()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = toast.type === 'error' ? 'sawtooth' : 'sine'
      osc.frequency.value = toast.type === 'error' ? 220 : 880
      gain.gain.value = 0.08
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
      osc.start()
      osc.stop(ctx.currentTime + 0.15)
    } catch {}
    try {
      if (navigator.vibrate) {
        navigator.vibrate(toast.type === 'error' ? [30, 50, 30] : 15)
      }
    } catch {}
  }, [toast.type])

  const accentColors = {
    success: 'border-l-emerald-500',
    error: 'border-l-red-500',
    info: 'border-l-blue-500',
  }

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3 pr-3 rounded-xl shadow-lg shadow-black/10
        bg-white dark:bg-gray-800 border border-cream-200 dark:border-gray-700 border-l-4
        backdrop-blur-sm
        transition-all duration-400 ease-out
        ${accentColors[toast.type] || accentColors.success}
        ${toast.removing
          ? 'opacity-0 translate-x-4 scale-95'
          : 'opacity-100 translate-x-0 scale-100'
        }
      `}
    >
      <ToastIcon type={toast.type} />
      <span className="flex-1 text-sm font-body font-medium text-[#1C1C1C] dark:text-gray-200 pt-0.5 leading-snug">
        {toast.message}
      </span>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-cream-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
        aria-label="Dismiss"
      >
        <HiX className="w-3.5 h-3.5 text-[#6B6B6B] dark:text-gray-400" />
      </button>
      <ProgressBar
        duration={toast.duration}
        createdAt={toast.createdAt}
        removing={toast.removing}
      />
    </div>
  )
}

export default function Toasts() {
  const toasts = useToast((s) => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-[360px] z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  )
}
