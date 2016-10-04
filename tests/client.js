var PROTO_PATH = __dirname + '/../snoozer.proto';
var HOST = 'localhost:50051'; // or something like '0.tcp.ngrok.io:17802'

var grpc = require('grpc');
var protocol = grpc.load(PROTO_PATH).snoozer;

function main() {
  console.log('host:', HOST);
  var client = new protocol.Snoozer(HOST, grpc.credentials.createInsecure());

  console.log('calling listEvents ...');
  client.listEvents({}, function(err, response) {
    if (err) throw err;
    console.log('=> events:', response.events);
    var lastEventId = response.events.pop().id;
    client.swipeEvent({ eventId: lastEventId }, function(err, response) {
      console.log('swiped last event =>', arguments);
    })
  });
}

main();
