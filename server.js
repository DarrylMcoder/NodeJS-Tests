var express = require("express"),
    unblocker = require("unblocker"),
    encodeContent = require('./encodeContent.js'),
    origin = require('./origin.js'),
    accessControlAllowOrigin = require('./access-control-allow-origin.js'),
    serveStatic = require('serve-static'),
    port = process.env.PORT || 80,
    app = express();

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