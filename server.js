var http = require('http'),
    zlib = require('zlib'),
    gunzip = zlib.createGunzip(),
    gzip = zlib.createGzip(),
    inflate = zlib.createInflate(),
    deflate = zlib.createDeflate(),
    serveStatic = require('serve-static'),
    finalhandler = require('finalhandler'),
    connect = require('connect'),
    app = connect(),
    httpProxy = require('http-proxy'),
    proxy = httpProxy.createProxyServer(),
    caesar = require('./caesar.js'),
    port = process.env.PORT || 80;


app.use((req, res, next) => {
  req.on('error', (err) => console.log('Request error: ' + err));
  res.on('error', (err) => console.log('Response error: ' + err));
  next();
});


app.use(function (req, res) {
  proxy.web(req, res, {
    target: path2Proxy(req.url),
    ignorePath: true,
    changeOrigin: true,
    selfHandleResponse: true
  });
});

http.createServer(app).listen(port);

proxy.on('error', (err, req, res) => console.log("Proxy error: " + err));


proxy.on('proxyRes', (proxyRes, req, res) => {
  console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2));
  switch(proxyRes.headers['content-encoding']){
    case 'gzip':
      proxyRes.pipe(gunzip).pipe(caesar).pipe(gzip).pipe(res);
      break;
    
    case 'deflate':
      proxyRes.pipe(inflate).pipe(caesar).pipe(deflate).pipe(res);
      break;
    
    default:
      proxyRes.pipe(res);
  }
});


function path2Proxy(url) {
  return url.replace(/^\//g, '');
}