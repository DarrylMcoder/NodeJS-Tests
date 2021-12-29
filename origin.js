"use strict";

var URL = require("url");

module.exports = function (/*config*/) {
  return function originHeader(data) {
    let url = URL.parse(data.url);
    data.headers.origin = url.origin;
  };
};