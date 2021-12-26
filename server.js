var http = require('http'),
    zlib = require('zlib'),
    gunzip = zlib.createGunzip(),
    gzip = zlib.createGzip(),
    inflate = zlib.createInflate(),
    deflate = zlib.createDeflate(),
    connect = require('connect'),
    app = connect(),
    httpProxy = require('http-proxy'),
    proxy = httpProxy.createServer(),
    Caesar = require('./caesar.js'),
    //caesar = Caesar.createStream(),
    port = process.env.PORT || 80;

proxy.on('proxyRes', processRes);

proxy.on('error', (e,req,res) => {
  res.writeHead(500,'Internal server error',{});
  res.end('Something went wrong. \n<br> Error: ' + e);
});//*/

app.use((req, res, next) => {
  if(!req.url.match(/^\/http/g)) {
    res.statusCode = 400;
    res.end("Incomplete request URL \n");
    console.log("Incomplete request:" + req.url);
  }else{
    next();
  }
});

app.use((req, res) => {
  proxy.web(req, res, {
      target: path2Proxy(req.url),
      ignorePath: true,
      changeOrigin: true,
      //selfHandleResponse: true,
      autoRewrite: true,
      followRedirects: true
  });
});
http.createServer(app).listen(port);
  
  function path2Proxy(url) {
    return url.replace(/^\//g, '');
  }

function processRes(proxyRes, req, res) {
  if (proxyRes && proxyRes.headers) {
    contentEncoding = proxyRes.headers['content-encoding'];
    // Delete the content-length if it exists. Otherwise, an exception will occur
    if ('content-length' in proxyRes.headers) {
      delete proxyRes.headers['content-length'];
    }
  }
  
  let unzip, zip;
  // Now only deal with the gzip/deflate/undefined content-encoding.
  switch (contentEncoding) {
    case 'gzip':
      unzip = zlib.Gunzip();
      zip = zlib.Gzip();
      break;
    case 'deflate':
      unzip = zlib.Inflate();
      zip = zlib.Deflate();
      break;
    case 'br':
      unzip = zlib.BrotliDecompress && zlib.BrotliDecompress();
      zip = zlib.BrotliCompress && zlib.BrotliCompress();
      break;
  }
  
  let _write = res.write;
  let _end = res.end;
  let _res = res;
  let caesar = Caesar.createStream();
  
  
    if (unzip) {
    unzip.on('error', function (e) {
      console.log('Unzip error: ', e);
      _end.call(res);
    });
    handleCompressed(res, _res, caesar, unzip, zip);
  } else if (!contentEncoding) {
    handleUncompressed(res, _res, caesar);
  } else {
    console.log('Not supported content-encoding: ' + contentEncoding);
  }
}

function handleCompressed(res, _res, caesar, unzip, zip) {

  res.write = data => { unzip.write(data) };

  res.end = () => unzip.end();
  
  unzip.pipe(caesar).pipe(zip).pipe(_res);
}



function handleUncompressed(res, _res, caesar) {

  res.write = data => { caesar.write(data) };

  res.end = () => caesar.end();
  
  caesar.pipe(_res);
}
