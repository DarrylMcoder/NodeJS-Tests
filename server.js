var express = require("express"),
    unblocker = require("unblocker"),
    encodeContent = require('./encodeContent.js'),
    caesarShift = require('./caesarShift.js').caesarShift,
    origin = require('./origin.js'),
    accessControlAllowOrigin = require('./access-control-allow-origin.js'),
    serveStatic = require('serve-static'),
    port = process.env.PORT || 80,
    app = express();
/*
app.use(function(req, res, next) {
  req.url = decodeUrl(req.url);
  next();
});*/

app.use(
  unblocker({
    requestMiddleware: [
      origin(),
    ],
    responseMiddleware: [
      encodeContent({
        processContentTypes: [
          "text/html",
          "text/javascript",
          "text/css",
        ],
      }),
      accessControlAllowOrigin(),
    ],
  })
);

app.use("/",serveStatic("public", {
  index: [
    "index.html",
    "index.htm"
  ],
}));

app.listen(port);

console.log("app listening on port "+ port);

function decodeUrl(url) {
  let separator = 'proxy/';
  if(!url.includes(separator)) {
    console.log('No separator ');
    return;
  }
  let proxyUrl = url.slice(url.indexOf(separator) + separator.length);
  let enc = caesarShift(proxyUrl, -1);
  return url.replace(proxyUrl, enc);
}