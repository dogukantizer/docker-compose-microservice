
// ------- Setup Faye for IPC --------- //
// TODO we should run this as a separate service
var http = require('http'),
    Faye = require('faye'),
    fayeRedis = require('faye-redis');

var bayeux = new Faye.NodeAdapter({
  mount:    '/',
  timeout:  45,
  engine:   {
    type:   fayeRedis,
    host:   process.env.REDIS_HOST,
    port:   process.env.REDIS_PORT
  }
});

var server = http.createServer();

bayeux.on('handshake', function(clientId) {
  console.log('handshake:', clientId);
});

bayeux.on('subscribe', function(clientId, channel) {
  console.log('subscribe:', clientId, channel);
});

bayeux.on('publish', function(clientId, channel) {
  console.log('publish:', clientId, channel);
});

bayeux.attach(server);
server.listen(8080);
console.log('Faye Server running on http://localhost:8080/');
