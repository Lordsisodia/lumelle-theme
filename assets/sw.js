// Bump version to invalidate old bundles (free-shipping threshold fix)
const CACHE_NAME = 'lumelle-static-v2'
const OFFLINE_URL = '/offline.html'
const ASSETS = [
  '/',
  '/index.html',
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png',
  '/l-icon.svg'
]

const IS_LOCALHOST =
  self.location.hostname === 'localhost' ||
  self.location.hostname === '127.0.0.1'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  )
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key === CACHE_NAME ? null : caches.delete(key))))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  const isDocument = request.mode === 'navigate' || request.destination === 'document'

  // Avoid stale caches during local development (breaks HMR and UI iteration).
  if (IS_LOCALHOST) {
    event.respondWith(
      fetch(request).catch(() => (isDocument ? caches.match(OFFLINE_URL) : Response.error()))
    )
    return
  }

  // Only handle same-origin requests. Let the browser manage cross-origin caching.
  if (url.origin !== self.location.origin) return

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME)

      // HTML/documents: network-first so deploys update immediately without cache bumps.
      if (isDocument) {
        try {
          const resp = await fetch(request)
          cache.put(request, resp.clone())
          return resp
        } catch {
          return (await cache.match(request)) || (await cache.match(OFFLINE_URL))
        }
      }

      // Static assets: cache-first for speed, update opportunistically.
      const cached = await cache.match(request)
      if (cached) return cached

      try {
        const resp = await fetch(request)
        cache.put(request, resp.clone())
        return resp
      } catch {
        // Never return an HTML document for failed asset requests (it breaks images/JS/CSS).
        // If the asset isn't cached, fail the request and let the app handle it.
        return Response.error()
      }
    })()
  )
})
