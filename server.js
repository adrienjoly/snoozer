var PROTO_PATH = __dirname + '/snoozer.proto';
var HOST = '0.0.0.0:50051';

var moment = require('moment');
var gcal = require('./lib/gcal');
var mappings = require('./lib/gcal-mappings');
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
  authToGoogleCalendar: wrapMethod(function authToGoogleCalendar(call, callback) {
    callback(null, { url: 'http://localhost' }); // TODO
  }),
  listEvents: wrapMethod(function listEvents(call, callback) {
    gcal.listEvents(globalAuth, function(err, events) {
      if (err) console.error(err);
      var translated = events.map(mappings.eventFromGcal);
      //console.log('=> events:', translated);
      callback(err, { events: translated });    
    })
  }),
  swipeEvent: wrapMethod(function swipeEvent(call, callback) {
    gcal.getEvent(globalAuth, call.request.eventId, function(err, initialEvent) {
      if (err) console.error(err);
      var translatedEvent = mappings.eventFromGcal(initialEvent);
      var finalEvent = Object.assign(translatedEvent, {
        start: moment(translatedEvent.start).add(1, 'day').toISOString(),
        end: moment(translatedEvent.end).add(1, 'day').toISOString(),
      });
      // TODO: update calendar event
      callback(err, { event: finalEvent });
    });
  }),
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
    //console.log('AUTH:', auth);
    startSever();
  }
});
