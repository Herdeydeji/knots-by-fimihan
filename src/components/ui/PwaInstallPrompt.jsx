import { useState, useEffect } from 'react'
import { HiOutlineX, HiOutlineDownload } from 'react-icons/hi'

const DISMISSED_KEY = 'kbf_pwa_ignored'

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return
    if (window.matchMedia('(display-mode: standalone)').matches) return

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)

    const timer = setTimeout(() => {
      setVisible(true)
    }, 30000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      clearTimeout(timer)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setVisible(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true')
    setVisible(false)
  }

  if (!visible || !deferredPrompt) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] p-4 pb-20 lg:pb-4 pointer-events-none">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-cream-200 dark:border-gray-700 p-5 pointer-events-auto animate-slide-up">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg className="w-7 h-7 text-gold-400" viewBox="0 0 60 60" fill="none">
              <rect x="2" y="2" width="56" height="56" rx="14" fill="#1A5C3A" stroke="rgba(201,150,58,0.3)" strokeWidth="1"/>
              <text x="30" y="42" textAnchor="middle" fontFamily="'Playfair Display',Georgia,serif" fontSize="28" fontWeight="700" fill="#C9963A" letterSpacing="0.5">K</text>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-sm text-[#1C1C1C] dark:text-gray-200">Install KBF Store</h3>
            <p className="text-xs text-[#6B6B6B] dark:text-gray-400 mt-0.5 font-body leading-relaxed">
              Get the best experience with offline access, faster loading, and real-time order updates.
            </p>
          </div>
          <button onClick={handleDismiss} className="p-1 rounded-lg hover:bg-cream-100 dark:hover:bg-gray-700 transition-colors text-[#6B6B6B] dark:text-gray-400 flex-shrink-0" aria-label="Dismiss">
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button onClick={handleInstall} className="flex-1 bg-emerald-600 text-white text-sm font-semibold font-body py-2.5 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
            <HiOutlineDownload className="w-4 h-4" /> Install
          </button>
          <button onClick={handleDismiss} className="flex-1 border border-cream-200 dark:border-gray-600 text-[#6B6B6B] dark:text-gray-300 text-sm font-medium font-body py-2.5 rounded-xl hover:bg-cream-50 dark:hover:bg-gray-700 transition-colors">
            Not Now
          </button>
        </div>
      </div>
    </div>
  )
}
