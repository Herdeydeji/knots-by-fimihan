import { useEffect, useRef } from 'react'
import { HiCheck, HiX } from 'react-icons/hi'
import { useToast } from '../../stores/useToast'

function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type === 'success' ? 'sine' : 'sawtooth'
    osc.frequency.value = type === 'success' ? 880 : 220
    gain.gain.value = 0.15
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (type === 'success' ? 0.1 : 0.15))
    osc.start()
    osc.stop(ctx.currentTime + (type === 'success' ? 0.1 : 0.15))
  } catch {
  }
}

function playHaptic(type) {
  try {
    if (navigator.vibrate) {
      navigator.vibrate(type === 'success' ? 15 : [30, 50, 30])
    }
  } catch {
  }
}

function ToastItem({ toast }) {
  const { removeToast } = useToast()
  const doneRef = useRef(false)

  useEffect(() => {
    if (doneRef.current) return
    doneRef.current = true
    playSound(toast.type)
    playHaptic(toast.type)
  }, [toast.type])

  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium transition-all duration-300 ${
        toast.removing ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      } ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'}`}
    >
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
        {toast.type === 'success' ? (
          <HiCheck className="w-3.5 h-3.5 text-white" />
        ) : (
          <HiX className="w-3.5 h-3.5 text-white" />
        )}
      </span>
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 w-5 h-5 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
        aria-label="Dismiss"
      >
        <HiX className="w-3 h-3 text-white/70" />
      </button>
    </div>
  )
}

export default function Toasts() {
  const toasts = useToast((s) => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm sm:left-auto sm:right-4 sm:translate-x-0 sm:w-auto sm:min-w-[320px]">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}
