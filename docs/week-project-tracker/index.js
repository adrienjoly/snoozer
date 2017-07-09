// Google API credentials, cf https://console.developers.google.com
var CLIENT_ID = '607551437730-mikge9rtaacql2b3mb793v8mai34ebg2.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

// Force HTTPS, except on localhost

if (window.location.href.match(/^http\:\/\/(?!localhost).*$/)) {
  window.location.href = window.location.href.replace('http:', 'https:');
}

// API Helpers (cf https://developers.google.com/apis-explorer/#s/calendar/v3/)

// fetch the next ten events in the authorized user's calendar.
function getCalendars(params, callback) {
  gapi.client.calendar.calendarList.list(Object.assign({
    'showHidden': false,
    'showDeleted': false,
  }, params)).execute(callback);
}

// fetch the next ten events in the authorized user's calendar.
function getEvents(params, callback) {
  gapi.client.calendar.events.list(Object.assign({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  }, params)).execute(callback);
}

// Date Helpers

function getMondayMorning(d) {
  d = new Date(d);
  var day = d.getDay();
  d.setDate(d.getDate() - day + (day == 0 ? -6 : 1)); // adjust when day is sunday
  d.setHours(5); // 5am
  d.setMinutes(0);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return new Date(d);
}

// UI Helpers

// Append a pre element to the body containing the given message
function appendPre(message) {
  var pre = document.getElementById('output');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

function appendHTML(html) {
  var p = document.createElement('p');
  p.innerHTML = html;
  document.getElementById('content').appendChild(p);
}

// Print the next ten events in the authorized user's calendar.
function printWeekEvents(calId) {
  appendPre('Cal id: [' + calId + ']');
  appendPre('');
  var monday = getMondayMorning(new Date());
  var nextMonday = new Date(monday.getTime() + 7 * 24 * 60 * 60 * 1000);
  appendPre('Week: ' + monday + ' -> ' + nextMonday);
  appendPre('');
  var params = {
    calendarId: calId,
    timeMin: monday.toISOString(),
    timeMax: nextMonday.toISOString(),
    maxResults: 100,
  };
  getEvents(params, function(resp) {
    console.log(resp);
    var hoursPerProject = {};
    [ 'Week events:' ].concat((resp.items || []).map(function(event) {
      var startDate = new Date(event.start.dateTime || event.start.date);
      var endDate = new Date(event.end.dateTime || event.end.date);
      var duration = new Date(endDate.getTime() - startDate.getTime());
      var hours = duration.getUTCHours() + duration.getUTCMinutes() / 60;
      var proj = event.summary.split(':')[0];
      hoursPerProject[proj] = (hoursPerProject[proj] || 0) + hours;
      return event.summary + ' (' + hours + ')';
    })).forEach(appendPre);

    var total = 0;

    appendPre('');
    appendPre('Hours per project:');
    const sorted = Object.keys(hoursPerProject)
      .sort((a, b) => hoursPerProject[b] - hoursPerProject[a])
    sorted.forEach((proj) => {
      appendPre(proj + ' : ' + hoursPerProject[proj] + ' hours');
      total += hoursPerProject[proj];
    })

    appendPre('');
    appendPre('Total hours: ' + total);
  });
}

function printCalendars() {
  getCalendars({}, function(resp) {
    [ 'Calendars:' ].concat((resp.items || []).map(function(cal) {
      return '<a href="#/calendar/' + encodeURIComponent(cal.id) + '">' + cal.summary + '</a>';
    })).forEach(appendHTML);
  });
}

// Main App / UI logic

function applyRoute() {
  var hash = window.location.href.split('#')[1] || '';
  if (prevHash === hash) return;
  prevHash = hash;
  console.log('applyRoute, hash:', hash);
  document.getElementById('content').innerHTML = '';
  document.getElementById('output').innerHTML = '';
  var calId = (/\/calendar\/(.*)/.exec(hash) || []).pop();
  if (calId) {
    gapi.client.load('calendar', 'v3', printWeekEvents(decodeURIComponent(calId)));
  } else {
    gapi.client.load('calendar', 'v3', printCalendars);
  }
}

// Handle response from authorization server.
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    applyRoute();
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

var prevHash = null;
//window.onhashchange = window.onpopstate = window.history.onpushstate = window.history.replaceState = applyRoute;
window.addEventListener('hashchange', applyRoute);
