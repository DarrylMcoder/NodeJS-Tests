"use strict";

module.exports = function (/*config*/) {
  return function accessControlAllowOriginHeader(data) {
    if(true) {
      let url = new URL(data.url);
      data.headers['access-control-allow-origin'] = process.env.HOSTNAME || null;
    }
  };
};