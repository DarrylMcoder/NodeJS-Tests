var caesarShift = require('./caesarShift.js').caesarShift,
    stream = require('stream'),
    Transform = stream.Transform;

class Caesar extends Transform{
  constructor(){
    super();
  }
  
  _transform(chunk, enc, done){
    console.log('Decoded: ' + chunk);
    chunk = chunk.toString();
    var text = caesarShift(chunk,1);
    this.push(text);
    console.log('Encoded: ' + text);
    done();
  }
}

exports.caesarShift = caesarShift;
exports.createStream = function() {
    return new Caesar();
}
