
var http = require("http");
var proxy = require("http-proxy").createProxyServer();
var caesarShift = require("./caesarShift.js").caesarShift;

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
    res.statusCode = 200;
    res.end(caesarShift(body,1));
  }).on('error', (e,req,res) => {
    res.writeHead(500,'Internal server error',{});
    res.end('Something went wrong. \n<br> Error: ' + e);
  });
}).on('error', (e,req,res) => {
  res.writeHead(500,'Internal server error',{});
  res.end('Something went wrong. \n<br> Error: ' + e);
});*/

http.createServer((req, res) => {
  req.on('error',(e) => {
    console.log(e);
    res.statusCode = 400;
    res.end("Request error");
  });
  res.on('error',(e) => {
    console.log(e);
    res.statusCode = 500;
    res.end('Internal server error');
  });
  //if not complete URL
  //not starting with http
  if(!req.url.match(/^\/http/g)) {
    res.statusCode = 400;
    res.end("Incomplete request");
    console.log("Incomplete request:" + req.url);
  }else{
    proxy.web(req, res, {
      target: path2Proxy(req.url),
      ignorePath: true,
      changeOrigin: true,
      //selfHandleResponse: true,
      //autoRewrite: true,
      followRedirects: true
    });
  }
}).listen(process.env.PORT || 80);
  
  function path2Proxy(url) {
    return url.replace(/^\//g, '');
  }