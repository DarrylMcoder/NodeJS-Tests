var http = require('http'),
    serveStatic = require('serve-static'),
    finalhandler = require('finalhandler'),
    connect = require('connect'),
    app = connect(),
    httpProxy = require('http-proxy'),
    caesarShift = require('./caesarShift.js');

var serve = serveStatic('public', { index: ['index.html', 'index.htm'] });

//
// Basic Connect App
//

app.use(serve);

app.use(function (req, res, next) {
  var _write = res.write;

  res.write = function (data) {
    _write.call(res, caesarShift(data.toString()));
  }
  next();
});

app.use(function (req, res, next) {
  proxy.web(req, res, {
    target: path2Proxy(req.url)
  });
  next();
});

app.use(finalhandler);

http.createServer(app).listen(process.env.PORT || 80);

//
// Basic Http Proxy Server
//
var proxy = httpProxy.createProxyServer();
