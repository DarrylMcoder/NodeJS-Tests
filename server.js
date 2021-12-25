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
    Caesar = require('./caesar.js'),
    caesar = Caesar.createStream(),
    port = process.env.PORT || 80;


app.use((req, res, next) => {
  req.on('error', (err) => console.log('Request error: ' + err));
  res.on('error', (err) => console.log('Response error: ' + err));
  next();
});


app.use(function (req, res) {
  if(!req.url.match(/^\/http/g)) {
    res.statusCode = 400;
    res.end("Incomplete request URL \n");
    console.log("Incomplete request:" + req.url);
    return;
  }
  proxy.web(req, res, {
    target: path2Proxy(req.url),
    ignorePath: true,
    changeOrigin: true,
    selfHandleResponse: true,
    secure: false,
    followRedirects: true
  });
});

http.createServer(app).listen(port);

var proxy = httpProxy.createProxyServer({});

proxy.on('error', (err, req, res) => console.log("Proxy error: " + err));


proxy.on('proxyRes', (proxyRes, req, res) => {
  console.log(proxyRes.headers['content-encoding']);
  proxyRes.pipe(res);
  
  /*
  switch(proxyRes.headers['content-encoding']){
    case 'gzip':
      proxyRes.pipe(gunzip).pipe(caesar).pipe(gzip).pipe(res).on('error', (e) => console.log(e)).on('finish', () => console.log('Finish'));
      break;
    
    case 'deflate':
      proxyRes.pipe(inflate).pipe(caesar).pipe(deflate).pipe(res).on('error', (e) => console.log(e)).on('finish', () => console.log('Finish'));
      break;
    
    default:
      proxyRes.pipe(caesar).pipe(res).on('error', (e) => console.log(e)).on('finish', () => console.log('Finish'));
      break;
  }
//*/
});

process.on('warning', e => console.warn(e.stack));

function path2Proxy(url) {
  return url.replace(/^\//g, '');
}