var express = require("express"),
    unblocker = require("unblocker"),
    encodeContent = require('./encodeContent.js'),
    caesarShift = require('./caesarShift.js').caesarShift,
    origin = require('./origin.js'),
    accessControlAllowOrigin = require('./access-control-allow-origin.js'),
    serveStatic = require('serve-static'),
    port = process.env.PORT || 80,
    app = express();
///*
app.use("/proxy/", function(req, res, next) {
  req.url = decodeUrl(req.url);
  //res.end(req.url);
  console.log("1: " + req.url);
  next();
});//*/

app.use(function(req, res, next) {
   console.log("2: " + req.url);
  next();
});

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
  //must be mounted on /proxy/ to work
  return caesarShift(url, -1);
}