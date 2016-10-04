var gcal = require('../lib/gcal');
var mappings = require('../lib/gcal-mappings');

gcal.init(function(err, auth) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
  } else {
    gcal.listEvents(auth, function(err, events) {
      console.log(err || ('displaying ' + events.length + ' events:'));
      /*
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var start = event.start.dateTime || event.start.date;
        console.log('%s - %s', start, event.summary);
      }
      */
      console.log(events.map(mappings.eventFromGcal));
    });
  }
});
