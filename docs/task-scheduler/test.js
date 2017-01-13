var scheduler = require('./combineEventsAndTasks');

// CONSTANTS

var TODAY = (function(){ //new Date('Mon, 2 Jan 2017 00:00:00 GMT').getTime();
  var now = new Date();
  now.setHours(0);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);
  return now.getTime();
})();
var HOUR = 3600000;
var DAY = 24 * HOUR;

console.log('today:', new Date(TODAY).toString());

// HELPERS

function renderTime(date) {
  return date ? new Date(date).toString().match(/(\d+\:\d+)\:/).pop() : 'XX:XX';
}

function renderSchedule(combined) {
  return combined.map(function(i) {
    var hours = (i.duration / HOUR) || new Date(i.endDate - i.startDate).getHours();
    return [i.startDate, i.endDate].map(renderTime).join(' -> ')
      + ' : ' + i.title + ' (' + hours + ')';
  })
}

const printSchedule = (combined) => console.log(renderSchedule(combined).join('\n'));

const prefixTitle = (prefix) => {
  return (t) => Object.assign({}, t, { title: prefix + t.title });
}

// TEST DATA

var tasks = [
  { duration: HOUR, title: 'déclarer impots' },
  { duration: HOUR, title: 'lessive' },
  { duration: 2 * HOUR, title: 'coder feature 1' },
  { duration: 3 * HOUR, title: 'coder feature 2' },
  { duration: 4 * HOUR, title: 'coder feature 3' },
].map(prefixTitle('[TSK] '));

var events = [
  { startDate: TODAY + 12.5 * HOUR, endDate: TODAY + 14 * HOUR, title: 'dej avec yann' }, // duration = 1.5 hours
  { startDate: TODAY + 24 * HOUR, endDate: TODAY + 25 * HOUR, title: 'film a la tv' }, // minuit -> 1am le lendemain
].map(prefixTitle('[EVT] '));

// TESTS

console.log('\n Sample events:\n');
printSchedule(events);

console.log('\n Sample tasks:\n');
printSchedule(tasks);

console.log('\n Combining events and tasks...\n');
var combined = scheduler.combine(events, tasks, { log: false });

console.log('\n Resulting schedule:\n');
printSchedule(combined);
