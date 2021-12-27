var express = require("express"),
    unblocker = require("unblocker"),
    encodeContent = require('./encodeContent.js'),
    port = process.env.PORT || 80,
    app = express();

app.use(
  unblocker({
    responseMiddleware: [
      encodeContent({
        processContentTypes: [
          "text/html",
          "text/javascript",
          "text/css",
        ],
      }),
    ],
  })
);

app.get("/", (req, res) =>
  res.redirect("/proxy/https://en.wikipedia.org/wiki/Main_Page")
);

app.listen(port);

console.log("app listening on port 8080. Test at http://localhost:8080/");