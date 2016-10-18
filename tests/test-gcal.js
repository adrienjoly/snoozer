var gcal = require('../lib/gcal');
var mappings = require('../lib/gcal-mappings');

gcal.init(function(err, auth) {
  if (err) {
    console.error('Error: ', err);
  } else {
    gcal.listEvents(auth, function(err, events) {
      console.log(err || ('displaying ' + events.length + ' events:'));
      var translatedEvents = events.map(mappings.eventFromGcal);
      console.log('translated events:', translatedEvents);
      var eventId = translatedEvents[0].id;
      console.log('first event id:', eventId);
      gcal.getEvent(auth, eventId, function() {
        console.log('=>', arguments);
      });
    });
  }
});
