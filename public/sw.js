self.importScripts('caesarShift.js');

self.addEventListener('install', function(event){
      // Skip over the "waiting" lifecycle state, to ensure that our
  // new service worker is activated immediately, even if there's
  // another tab open controlled by our older service worker code.
    self.skipWaiting();
	console.log(event);
});

self.addEventListener('activate', function(event){
    console.log(event);
});

self.addEventListener('fetch', event => {
  if(!event.request.url.includes('proxy/http')) {
    return;
  }
  event.respondWith(async function() {
    return fetch(event.request)
    .then(response => {
      return response.text()
      .then(text => caesarShift(text, -1))
      .then(text => {
        return new Response(text, response);
      }).catch(e => {
        return new Response("Error: " + e);
      });
    })
    .catch(e => {
      return new Response("Error: " + e);
    });
  }());
});
    


