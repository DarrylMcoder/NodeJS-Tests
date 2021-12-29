"use strict";

module.exports = function (/*config*/) {
  return function accessControlAllowOriginHeader(data) {
    if(data.headers['access-control-allow-origin']) {
      data.headers['access-control-allow-origin'] = process.env.HOSTNAME || null;
    }
  };
};