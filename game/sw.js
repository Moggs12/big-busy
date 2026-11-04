// Offline helper for Big Busy.
// Saves the whole game on the device the first time it's opened, so it works with no internet.
// When you change the game: bump VERSION so devices pick up the new files straight away.
const VERSION = 'bigbusy-2026-11-04e';
const FONT_CACHE = 'bigbusy-fonts';

const FILES = [
  './', 'index.html', 'manifest.webmanifest',
  'assets/app-icons/icon-180.png', 'assets/app-icons/icon-192.png', 'assets/app-icons/icon-512.png',
  'assets/art/egg.webp', 'assets/art/egg_cracked.webp', 'assets/art/garden_day.webp', 'assets/art/garden_night.webp',
  'assets/Sprites/busy_idle.webp', 'assets/Sprites/busy_munch.webp', 'assets/Sprites/busy_sad.webp', 'assets/Sprites/busy_sleep.webp',
  'assets/Sprites/fluff_idle.webp', 'assets/Sprites/fluff_sleep.webp', 'assets/Sprites/fuzz_idle.webp', 'assets/Sprites/fuzz_sleep.webp',
  ...['apple', 'berries', 'broccoli', 'clean', 'cupcake', 'energy', 'fun', 'happy', 'lamp', 'moon', 'sponge', 'star', 'tummy', 'wand']
    .map(n => 'assets/icons/' + n + '.webp'),
  ...['boing', 'coo', 'flutter', 'giggle', 'poof', 'shimmer', 'sparkle', 'splash', 'squeak', 'squish']
    .map(n => 'assets/sounds/' + n + '.mp3'),
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== FONT_CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: use the saved copy, refresh it in the background.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONT_CACHE).then(async c => {
      const hit = await c.match(req);
      const fresh = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || fresh;
    }));
    return;
  }
  if (url.origin !== location.origin) return;

  // The page itself: try the internet first (to get updates), fall back to the saved copy.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => {
      if (r.ok) caches.open(VERSION).then(c => c.put('index.html', r.clone()));
      return r;
    }).catch(() => caches.match('index.html', { ignoreSearch: true })));
    return;
  }

  // Pictures and sounds: saved copy first (fast + offline), refresh in the background.
  e.respondWith(caches.open(VERSION).then(async c => {
    const hit = await c.match(req.url, { ignoreSearch: true });
    const fresh = fetch(new Request(req.url)).then(r => { if (r.ok) c.put(req.url, r.clone()); return r; });
    if (!hit) return fresh.then(r => rangeReply(req, r));
    fresh.catch(() => {});
    return rangeReply(req, hit);
  }));
});

// Safari asks for sounds in pieces ("Range" requests) and won't play them from a full reply,
// so cut the requested piece out of the saved file.
async function rangeReply(req, res) {
  const range = req.headers.get('range');
  if (!range || res.status !== 200) return res;
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  if (!m) return res;
  const buf = await res.clone().arrayBuffer();
  const size = buf.byteLength;
  let start = m[1] === '' ? size - Number(m[2]) : Number(m[1]);
  let end = m[1] !== '' && m[2] !== '' ? Number(m[2]) : size - 1;
  start = Math.max(0, start); end = Math.min(end, size - 1);
  if (start > end) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
    },
  });
}
