// CONSTANTS

var TODAY = new Date('Mon, 2 Jan 2017 00:00:00 GMT').getTime(); // TODO: really use today's date, and keep in sync between scripts
var HOUR = 3600000;
var DAY = 24 * HOUR;

console.log('today:', new Date(TODAY).toUTCString());

// USER PREFERENCES

var DAILY_START_TIME = 10 * HOUR; // 10 am
var DAILY_STOP_TIME = 18 * HOUR; // 6 pm

// ALGO

function combine(events, tasks) {
  // events and tasks must be sorted chronologically
  // events must tasks after today's daily start time
  // => plans tasks within working hours only (10am and 6pm), or overflows to next day
  var combined = [];
  var today = TODAY;
  var startTimeCandidate = today + DAILY_START_TIME;
  var nextEvents = events.slice(); // clone array
  var nextTasks = tasks.slice(); // clone
  var nextEvt = nextEvents.shift();
  var nextTask = nextTasks.shift();
  console.log('nextEvt:', nextEvt);
  console.log('nextTask:', nextTask);
  while (nextTask) {
    var endTimeCandidate = startTimeCandidate + nextTask.duration;
    console.log('endTimeCandidate:', new Date(endTimeCandidate).toUTCString());
    if (endTimeCandidate > today + DAILY_STOP_TIME) {
      console.log('=> next day!');
      today += DAY;
      startTimeCandidate = today + DAILY_START_TIME;
      console.log('=> startTimeCandidate:', new Date(startTimeCandidate).toUTCString());
      endTimeCandidate = startTimeCandidate + nextTask.duration;
      console.log('=> endTimeCandidate:', new Date(endTimeCandidate).toUTCString());
    }
    console.log('event first?', nextEvt && new Date(nextEvt.startDate).toUTCString());
    if (nextEvt && endTimeCandidate > nextEvt.startDate) {
      console.log('PUSH EVENT');
      combined.push(nextEvt);
      startTimeCandidate = Math.max(nextEvt.endDate, startTimeCandidate);
      nextEvt = nextEvents.shift();
      console.log('nextEvt:', nextEvt);
    } else {
      console.log('PUSH TASK');
      nextTask.startDate = startTimeCandidate;
      nextTask.endDate = endTimeCandidate;
      combined.push(nextTask);
      startTimeCandidate = startTimeCandidate + nextTask.duration;
      nextTask = nextTasks.shift();
      console.log('nextTask:', nextTask);
    }
  }
  return combined
    .concat(nextEvents);
}

try{
  module.exports = combine;
} catch(e) {}
