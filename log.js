var logger = function() {
  function log(data) {
    console.log(JSON.stringify(data.headers));
  }
  return log;
}

module.exports = logger;