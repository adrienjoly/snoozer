var combine = require('./combineEventsAndTasks');

// CONSTANTS

var TODAY = new Date('Mon, 2 Jan 2017 00:00:00 GMT').getTime(); // TODO: really use today's date, and keep in sync between scripts
var HOUR = 3600000;
var DAY = 24 * HOUR;

console.log('today:', new Date(TODAY).toUTCString());

// TESTS

var tasks = [
  { duration: HOUR, title: 'déclarer impots' },
  { duration: HOUR, title: 'lessive' },
  { duration: 2 * HOUR, title: 'coder feature 1' },
  { duration: 3 * HOUR, title: 'coder feature 2' },
  { duration: 4 * HOUR, title: 'coder feature 3' },
];

var events = [
  { startDate: TODAY + 12.5 * HOUR, endDate: TODAY + 14 * HOUR, title: 'dej avec yann' }, // duration = 1.5 hours
  { startDate: TODAY + 24 * HOUR, endDate: TODAY + 25 * HOUR, title: 'film a la tv' }, // minuit -> 1am le lendemain
];

console.log(combine(events, tasks).map((i) => new Date(i.startDate).toUTCString() + ' : ' + i.title));
