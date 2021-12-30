"use strict";

module.exports = function (/*config*/) {
  return function accessControlAllowOriginHeader(data) {
    delete data.headers['access-control-allow-origin'];
  };
};