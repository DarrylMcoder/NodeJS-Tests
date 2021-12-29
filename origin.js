"use strict";

//var URL = require("url");

module.exports = function (/*config*/) {
  return function originHeader(data) {
    let url = new URL(data.url);
    data.headers.origin = url.origin;
  };
};