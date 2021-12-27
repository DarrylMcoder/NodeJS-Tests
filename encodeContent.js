"use strict";

const Transform = require("stream").Transform;

const caesarShift = require('./caesarShift.js').caesarShift;

module.exports = function(config) {
  function encodeContent(data) {
    if (config.processContentTypes.includes(data.contentType)) {
      data.stream = data.stream.pipe(
        new Transform({
          decodeStrings: false,
          transform: function (chunk, encoding, next) {
            var updated = caesarShift(chunk.toString(), 1);
            this.push(updated);
            next();
          },
        })
      );
    }
  }
  
  return encodeContent;
};