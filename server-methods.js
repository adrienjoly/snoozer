var moment = require('moment');
var gcal = require('./lib/gcal');
var mappings = require('./lib/gcal-mappings');

var globalAuth;

exports.init = function(callback) {
  console.log('init google calendar...');
  gcal.init(function(err, auth) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
    } else {
      globalAuth = auth;
      //console.log('AUTH:', auth);
      callback();
    }
  });
}

exports.authToGoogleCalendar = function authToGoogleCalendar(call, callback) {
  callback(null, { url: 'http://localhost' }); // TODO
};

exports.listEvents = function listEvents(call, callback) {
  gcal.listEvents(globalAuth, function(err, events) {
    if (err) console.error(err);
    var translated = events.map(mappings.eventFromGcal);
    //console.log('=> events:', translated);
    callback(err, { events: translated });    
  })
};

exports.swipeEvent = function swipeEvent(call, callback) {
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
};
