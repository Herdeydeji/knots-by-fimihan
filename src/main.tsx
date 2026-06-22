import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}

window.OneSignalDeferred = window.OneSignalDeferred || []
window.OneSignalDeferred.push(async function (OneSignal: any) {
  await OneSignal.init({
    appId: import.meta.env.VITE_ONESIGNAL_APP_ID as string,
    serviceWorkerPath: '/sw.js',
  })
})

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
