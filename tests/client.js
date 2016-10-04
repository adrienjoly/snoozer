var PROTO_PATH = __dirname + '/../snoozer.proto';
var HOST = 'localhost:50051'; // or something like '0.tcp.ngrok.io:17802'

var grpc = require('grpc');
var protocol = grpc.load(PROTO_PATH).snoozer;

function main() {
  console.log('host:', HOST);
  var client = new protocol.Snoozer(HOST, grpc.credentials.createInsecure());

  for (var i in client) {
    console.log('- found method:', i);
  }

  var params = {
    name: process.argv[2] || 'world'
  };

  console.log('calling sayHello with params:', params, '...');
  client.sayHello(params, function(err, response) {
    if (err) throw err;
    console.log('=> Greeting:', response.message);
  });
  /*
  console.log('calling authToGoogleCalendar ...');
  client.authToGoogleCalendar({}, function(err, response) {
    if (err) throw err;
    console.log('=> response:', response.url);
  });
  */

  console.log('calling listEvents ...');
  client.listEvents({}, function(err, response) {
    if (err) throw err;
    console.log('=> response:', response);
  });
}

main();