const CACHE='biolab-colmayor-v14-interactive';
const ASSETS=['/','/index.html','/favicon.svg','/manifest.webmanifest','/assets/simulation-models.js','/assets/fermentart-ui.js','/assets/learning.js','/assets/fermentart.css','/assets/fermentart-hero.webp','/assets/fermentart-hero-small.webp','/assets/colmayor-shield.svg','/assets/montserrat-variable.woff2'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('/index.html'))));});
