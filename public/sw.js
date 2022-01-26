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
  if(!event.request.url.includes('proxy')) {
    return;
  }
  event.respondWith(async function() {
    try {
    var url = encodeUrl(event.request.url);
      //return new Response("Event.req.Url: " + event.request.url + " <br>Url: " + url);
    var req = event.request;
    var init =     {
      method: req.method,
      headers: req.headers,
      credentials: req.credentials,
      cache: req.cache,
      //redirect: req.redirect,
      referrer: req.referrer,
      integrity: req.integrity
    };
    
    if(req.method === 'GET' ||
       req.method === 'HEAD' ||
       !req.method) {
      
    }else{
      init.body = req.body;
    }
    
    if(req.mode !== 'navigate') {
      init.mode = req.mode;
    }
  } catch(e) {
    return new Response("Request Error: " + e);
  }
    return fetch(url, init)
    .then(response => {
      var tstream = new TransformStream({
        transform(chunk, controller){
          if(["text/html", "text/javascript", "text/css"].includes(response.headers['content-type'])) {
            var updated = caesarShift(chunk, -1);
            controller.enqueue(updated);
          }else{
            controller.enqueue(chunk);
          }
        },
      });
      
      var stream = response.body.pipeThrough(new TextDecoderStream())
        .pipeThrough(tstream)
        .pipeThrough(new TextEncoderStream());
      let status = response.status,
          statusText = response.statusText,
          headers = response.headers;
      return new Response(stream, {
        status: status,
        statusText: statusText,
        headers: headers
      });
    })
    .catch(e => {
      return new Response("Error: " + e);
    });
  }());
});
    


function encodeUrl(url) {
  let separator = 'proxy/';
  if(!url.includes(separator)) {
    return;
  }
  let proxyUrl = url.slice(url.indexOf(separator) + separator.length);
  let enc = caesarShift(proxyUrl, 1);
  return url.replace(proxyUrl, enc);
}