var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var TOKEN_PATH = './user_token.json';
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// If modifying these scopes, delete your previously saved credentials

var GCAL_CLIENT_ID = process.env.GCAL_CLIENT_ID.substr();
var GCAL_CLIENT_SECRET = process.env.GCAL_CLIENT_SECRET.substr();
var GCAL_REDIRECT_URL = process.env.GCAL_REDIRECT_URL.substr();

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(callback) {
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(GCAL_CLIENT_ID, GCAL_CLIENT_SECRET, GCAL_REDIRECT_URL);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback.bind(null, null));
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(null, oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth, callback) {
  var calendar = google.calendar('v3');
  calendar.events.list({
    auth: auth,
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  }, function(err, response) {
    if (err) {
      callback(err);
    } else {
      var events = response.items;
      callback(null, response.items);
    }
  });
}

/**
 * Get an event by id
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {string} id the of event to get.
 */
function getEvent(auth, eventId, callback) {
  var calendar = google.calendar('v3');
  calendar.events.get({
    auth: auth,
    calendarId: 'primary',
    eventId: eventId,
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 10
  }, function(err, response) {
    if (err) {
      callback(err);
    } else {
      callback(null, response);
    }
  });
}

exports.init = authorize;
exports.listEvents = listEvents;
exports.getEvent = getEvent;
