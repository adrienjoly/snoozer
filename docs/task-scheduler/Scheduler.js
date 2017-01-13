// CONSTANTS

var HOUR = 3600000;
var DAY = 24 * HOUR;

// HELPERS

function getToday() {
  var now = new Date();
  now.setHours(0);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);
  return now.getTime(); // new Date('Mon, 2 Jan 2017 00:00:00 GMT').getTime();
}

function makeLogger(providedLog) {
  var log = function(){};
  if (providedLog === true) {
    log = console.log;
  } else if (typeof providedLog === 'function'){
    log = providedLog;
  }
  return log;
}

// CLASS

function Scheduler(props) {
  Object.assign(this, {
    today: getToday(), // default: today, midnight (milliseconds from midnight)
    dayStartTime: 10 * HOUR, // default: 10 am (milliseconds from midnight)
    dayStopTime: 18 * HOUR, // default: 6 pm (milliseconds from midnight)
  }, props);
}

Scheduler.prototype.combineEventsAndTasks = function(events, tasks, options) {
  // events and tasks must be sorted chronologically
  // events must tasks after today's daily start time
  // => plans tasks within working hours only (10am and 6pm), or overflows to next day
  var combined = [];
  // setup
  options = options || {};
  var log = makeLogger(options.log);
  // clone input arrays
  var nextEvents = events.slice(); // clone array
  var nextTasks = tasks.slice(); // clone
  // init variables (initial values)
  var today = this.today;
  var startTimeCandidate = today + this.dayStartTime;
  var nextEvt = nextEvents.shift();
  var nextTask = nextTasks.shift();
  while (nextTask) {
    log('nextEvt:', nextEvt);
    log('nextTask:', nextTask);
    var endTimeCandidate = startTimeCandidate + nextTask.duration;
    log('endTimeCandidate:', new Date(endTimeCandidate).toString());
    if (endTimeCandidate > today + this.dayStopTime) {
      log('=> next day!');
      today += DAY;
      startTimeCandidate = today + this.dayStartTime;
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
    } else {
      log('PUSH TASK');
      combined.push(Object.assign({}, nextTask, {
        startDate: startTimeCandidate,
        endDate: endTimeCandidate,
      }));
      startTimeCandidate = startTimeCandidate + nextTask.duration;
      nextTask = nextTasks.shift();
    }
  }
  return combined.concat(nextEvents);
}

try{
  module.exports = Scheduler;
} catch(e) {}
