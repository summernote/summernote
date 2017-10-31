var finalhandler = require('finalhandler');
var http = require('http');
var serveStatic = require('serve-static');

var serve = serveStatic('./', {'index': ['index.html']});

// Create server
var server = http.createServer(function onRequest(req, res) {
  serve(req, res, finalhandler(req, res));
});

// Listen
server.listen(3000, function() {
  console.log('Launched static-server on 3000 port');
});

process.on('SIGTERM', function() {
  console.log('static-server terminated');
  process.exit(0);
});
