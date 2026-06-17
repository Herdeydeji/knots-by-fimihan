const CACHE_NAME = 'kbf-v2'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
]

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      ),
      clients.claim(),
    ])
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)

  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      fetch(event.request).then((response) => {
        const clone = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        return response
      }).catch(() => caches.match(event.request))
    )
    return
  }

  event.respondWith(
    fetch(event.request).then((response) => {
      if (response.ok) {
        const clone = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
      }
      return response
    }).catch(() => caches.match(event.request))
  )
})
