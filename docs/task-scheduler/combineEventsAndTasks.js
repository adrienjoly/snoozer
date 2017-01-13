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

// USER PREFERENCES

var DAILY_START_TIME = 10 * HOUR; // 10 am
var DAILY_STOP_TIME = 18 * HOUR; // 6 pm

// ALGO

function combine(events, tasks, options) {
  // events and tasks must be sorted chronologically
  // events must tasks after today's daily start time
  // => plans tasks within working hours only (10am and 6pm), or overflows to next day
  options = options || {};
  var combined = [];
  var today = TODAY;
  var startTimeCandidate = today + DAILY_START_TIME;
  var nextEvents = events.slice(); // clone array
  var nextTasks = tasks.slice(); // clone
  var nextEvt = nextEvents.shift();
  var nextTask = nextTasks.shift();
  var log = function(){};
  if (options.log === true) {
    log = console.log;
  } else if (typeof options.log === 'function'){
    log = options.log;
  }
  log('nextEvt:', nextEvt);
  log('nextTask:', nextTask);
  while (nextTask) {
    var endTimeCandidate = startTimeCandidate + nextTask.duration;
    log('endTimeCandidate:', new Date(endTimeCandidate).toString());
    if (endTimeCandidate > today + DAILY_STOP_TIME) {
      log('=> next day!');
      today += DAY;
      startTimeCandidate = today + DAILY_START_TIME;
      log('=> startTimeCandidate:', new Date(startTimeCandidate).toString());
      endTimeCandidate = startTimeCandidate + nextTask.duration;
      log('=> endTimeCandidate:', new Date(endTimeCandidate).toString());
    }
    log('event first?', nextEvt && new Date(nextEvt.startDate).toString());
    if (nextEvt && endTimeCandidate > nextEvt.startDate) {
      log('PUSH EVENT');
      combined.push(nextEvt);
      startTimeCandidate = Math.max(nextEvt.endDate, startTimeCandidate);
      nextEvt = nextEvents.shift();
      log('nextEvt:', nextEvt);
    } else {
      log('PUSH TASK');
      nextTask.startDate = startTimeCandidate;
      nextTask.endDate = endTimeCandidate;
      combined.push(nextTask);
      startTimeCandidate = startTimeCandidate + nextTask.duration;
      nextTask = nextTasks.shift();
      log('nextTask:', nextTask);
    }
  }
  return combined
    .concat(nextEvents);
}

try{
  module.exports = {
    combine: combine,
  };
} catch(e) {}
