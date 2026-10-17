// Service worker: network-first (zawsze świeże pliki online), cache jako zapas offline.
// Po zmianie listy plików podbij numer wersji.
const CACHE = 'study-cards-v8';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './ai-import.js',
  './config.js',
  './vocabulary.json',
  './data/biology.json',
  './data/angielski-7.json',
  './data/biologia-7.json',
  './data/matematyka-7.json',
  './data/niemiecki-7.json',
  './data/geography.json',
  './data/informatyka-7.json',
  './data/historia-polski.json',
  './data/english.json',
  './data/chemia-7.json',
  './data/polski-7.json',
  './data/computer-science.json',
  './data/history.json',
  './data/physics.json',
  './data/mathematics.json',
  './data/fizyka-7.json',
  './data/polski.json',
  './data/chemistry.json',
  './data/psychology.json',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];
// Biblioteki z CDN (wersja przypięta w URL, więc cache-first jest bezpieczny).
const CDN_HOSTS = ['cdn.jsdelivr.net'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })));
    return;
  }
  // Supabase API i inne zewnętrzne adresy — bez pośrednictwa.
  if (url.origin !== location.origin) return;

  // no-cache: zawsze pytaj serwer o nowszą wersję (inaczej przeglądarka/GitHub Pages podają stare pliki)
  const fresh = req.mode === 'navigate' ? fetch(req) : fetch(req, { cache: 'no-cache' });
  event.respondWith(
    fresh
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('./index.html'))));
});
