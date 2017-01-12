// Google API credentials, cf https://console.developers.google.com
var CLIENT_ID = '607551437730-mikge9rtaacql2b3mb793v8mai34ebg2.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

// API Helpers (cf https://developers.google.com/apis-explorer/#s/calendar/v3/)

// fetch the next ten events in the authorized user's calendar.
function getCalendars(params, callback) {
  gapi.client.calendar.calendarList.list(Object.assign({
    'showHidden': false,
    'showDeleted': false,
  }, params)).execute(callback);
}

// fetch the next ten events in the authorized user's calendar.
function getUpcomingEvents(params, callback) {
  gapi.client.calendar.events.list(Object.assign({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  }, params)).execute(callback);
}

// UI Helpers

// Append a pre element to the body containing the given message
function appendPre(message) {
  var pre = document.getElementById('output');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

// Print the next ten events in the authorized user's calendar.
function printUpcomingEvents() {
  getCalendars({}, function(resp) {
    [ 'Calendars:' ].concat((resp.items || []).map(function(cal) {
      return cal.summary;
    })).forEach(appendPre);
  });
  getUpcomingEvents({'calendarId': 'primary'}, function(resp) {
    [ 'Upcoming events:' ].concat((resp.items || []).map(function(event) {
      return event.summary + ' (' + (event.start.dateTime || event.start.date) + ')';
    })).forEach(appendPre);
  });
}

// Main App / UI logic

// Handle response from authorization server.
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    gapi.client.load('calendar', 'v3', printUpcomingEvents);
  } else {
    // Show auth UI (authorize button).
    authorizeDiv.style.display = 'inline';
  }
}

// Initiate auth flow in response to user clicking authorize button.
function handleAuthClick(event) {
  gapi.auth.authorize({
    client_id: CLIENT_ID,
    scope: SCOPES,
    immediate: false
  }, handleAuthResult);
  return false;
}

// Check if current user has authorized this application. Run on app startup.
function checkAuth() {
  gapi.auth.authorize({
    'client_id': CLIENT_ID,
    'scope': SCOPES.join(' '),
    'immediate': true
  }, handleAuthResult);
}
