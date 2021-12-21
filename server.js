var http = require('http'),
    serveStatic = require('serve-static'),
    finalhandler = require('finalhandler'),
    caesarShift = require('./caesarShift.js');
    connect = require('connect'),
    app = connect(),
    httpProxy = require('http-proxy');

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

app.use(function (req, res) {
  proxy.web(req, res, {
    target: path2Proxy(req.url)
  });
});

http.createServer(app).listen(8013);

//
// Basic Http Proxy Server
//
var proxy = httpProxy.createProxyServer();
