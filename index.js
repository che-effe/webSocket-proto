var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();
var http = require('http');
var url = require('url');

client.on('connectFailed', function(error) {
  console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
  connection.sendUTF('listen');
  console.log('WebSocket Client Connected');
  connection.on('error', function(error) {
    console.log('Connection Error: ' + error.toString());
  });
  connection.on('close', function() {
    console.log('echo-protocol Connection Closed');
  });
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log('Received: ' + message.utf8Data);
    }
  });

  function sendRequest() {
    if (connection.connected) {
      connection.sendUTF('listen');
    }
  }
  sendRequest();
});

http.createServer(function(request, response) {
  var urlParts = url.parse(request.url).path.substring(1).split('/');
  console.log(urlParts);
  if (urlParts[0] === 'listen') {
    client.connect('ws://10.0.0.12:8080/', 'echo-protocol');
  }
  response.writeHead(200, {'content-type': 'text/html'});
  response.write('<!DOCTYPE "html">');
  response.write('<html>');
  response.write('<head>');
  response.write('<title>Hello World Page</title>');
  response.write('</head>');
  response.write('<body>');
  response.write('<a href="/listen"> Press here </button>');
  response.write('</body>');
  response.write('</html>');
  response.end();
}).listen(1337, '127.0.0.1');
