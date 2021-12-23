var http = require('http'),
    serveStatic = require('serve-static'),
    finalhandler = require('finalhandler'),
    connect = require('connect'),
    app = connect(),
    httpProxy = require('http-proxy'),
    caesarShift = require('./caesarShift.js').caesarShift;

var serve = serveStatic('public', { index: ['index.html', 'index.htm'] });

//
// Basic Connect App
//

//app.use(serve);

app.use((req, res, next) => {
  req.on('error', (err) => console.log('Request error: ' + err));
  res.on('error', (err) => console.log('Response error: ' + err));
  next();
});

app.use(function (req, res, next) {
  var _write = res.write;

  res.write = function (data) {
    _write.call(res, caesarShift(data.toString(),1));
  }
  next();
});

app.use(function (req, res) {
  proxy.web(req, res, {
    target: path2Proxy(req.url),
    ignorePath: true,
    changeOrigin: true
  });
});

//app.use(finalhandler);

http.createServer(app).listen(process.env.PORT || 80);

//
// Basic Http Proxy Server
//
var proxy = httpProxy.createProxyServer();

proxy.on('error', (err, req, res) => {
  console.log("Proxy error: " + err);
});

proxy.on('proxyRes' (proxyRes, req, res) =>  console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, true, 2)));

  function path2Proxy(url) {
    return url.replace(/^\//g, '');
  }