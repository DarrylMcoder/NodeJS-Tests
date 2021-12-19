
var http = require("http");
var proxy = require("http-proxy").createProxyServer();

// Listen for the `error` event on `proxy`.
proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end('Something went wrong. And we are reporting a custom error message.');
});

/*proxy.on('proxyRes', function (proxyRes, req, res) {
  let body = [];
  proxyRes.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    res.writeHead(200,{
      Test: "Test"
    });
    res.write(body);
    res.end('Test');
  }).on('error', (e,req,res) => {
    res.writeHead(500,'Internal server error',{});
    res.end('Something went wrong. \n<br> Error: ' + e);
  });
}).on('error', (e,req,res) => {
  res.writeHead(500,'Internal server error',{});
  res.end('Something went wrong. \n<br> Error: ' + e);
});*/

http.createServer((req, res) => {
  proxy.web(req, res, {
    target: path2Proxy(req.url),
    ignorePath: true,
    changeOrigin: true,
    //selfHandleResponse: true,
    autoRewrite: true
  });
}).listen(process.env.PORT || 80);
  
  function path2Proxy(url) {
    return url.replace(/^\//g, '');
  }