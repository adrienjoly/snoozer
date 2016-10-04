var PROTO_PATH = __dirname + '/snoozer.proto';
var HOST = '0.0.0.0:50051';

var gcal = require('./gcal');
var grpc = require('grpc');
var protocol = grpc.load(PROTO_PATH).snoozer;

var globalAuth;

function wrapMethod(fct){
  return function(call, callback) {
    console.log('received call to', fct.name, ':', call.request);
    return fct.apply(this, arguments);
  };
}

var methods = {
  sayHello: wrapMethod(function sayHello (call, callback) {
    callback(null, {message: 'Hello ' + call.request.name});
  }),
  authToGoogleCalendar: wrapMethod(function authToGoogleCalendar(call, callback) {
    callback(null, { url: 'http://localhost' }); // TODO
  }),
  listEvents: wrapMethod(function listEvents(call, callback) {
    gcal.listEvents(globalAuth, function(err, events) {
      if (err) console.error(err);
      console.log('=> events:', events.map((event) => event.summary));
      callback(err, {
        events: events.map((event) => event.summary)
      });    
    })
  })
};

function startSever() {
  console.log('start RPC server...');
  var server = new grpc.Server();
  server.addProtoService(protocol.Snoozer.service, methods);
  server.bind(HOST, grpc.ServerCredentials.createInsecure());
  server.start();
  console.log('server running on', HOST);
}

console.log('init google calendar...');
gcal.init(function(err, auth) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
  } else {
    globalAuth = auth;
    console.log('AUTH:', auth);
    startSever();
  }
});
