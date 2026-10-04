const V='rs-shell-v3';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png',
'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'];
self.addEventListener('install',e=>{self.skipWaiting();
 e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))))});
self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n.startsWith('rs-shell')&&n!==V).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.hostname==='tile.openstreetmap.org'){
  e.respondWith(caches.open('tiles').then(async c=>{
   const hit=await c.match(u.href);if(hit)return hit;
   try{const r=await fetch(u.href,{mode:'cors'});if(r.ok)c.put(u.href,r.clone());return r}
   catch(x){return fetch(e.request)}}));
  return}
 if(u.origin===location.origin||u.hostname==='cdnjs.cloudflare.com'){
  e.respondWith(caches.match(e.request).then(h=>{
   const n=fetch(e.request).then(r=>{const cl=r.clone();caches.open(V).then(c=>c.put(e.request,cl));return r}).catch(()=>h);
   return h||n}))}
});
