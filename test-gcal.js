var gcal = require('./gcal');

gcal.init(function(err, auth) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
  } else {
    gcal.listEvents(auth);
  }
});
