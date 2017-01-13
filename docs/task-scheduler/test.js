var Scheduler = require('./Scheduler');

// CONSTANTS

var TODAY; // will be set from scheduler, in instanciation
var HOUR = 3600000;
var DAY = 24 * HOUR;

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

// USER PREFERENCES

var userPrefs = {
  today: new Date('Mon, 2 Jan 2017 00:00:00').getTime(),
/*
  dayStartTime: 10 * HOUR, // default: 10 am (milliseconds from midnight)
  dayStopTime: 18 * HOUR, // default: 6 pm (milliseconds from midnight)
*/
};

var scheduler = new Scheduler(userPrefs);

TODAY = scheduler.today;
console.log('today:', new Date(TODAY).toString());

console.log('\n Sample user preferences:\n');
console.log(scheduler);

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

for (var i = tasks.length - 1; i >= 0; --i) {

  console.log('\n Sample tasks:\n');
  printSchedule(tasks);

  console.log('\n Resulting schedule:\n');
  printSchedule(scheduler.combineEventsAndTasks(events, tasks, { log: false }));

  if (i > 0) {
    console.log('\n Moving last task up!\n');
    var task = tasks.splice(i, 1)[0];
    tasks.splice(i - 1, 0, task); // insert before previous task
  }
}

