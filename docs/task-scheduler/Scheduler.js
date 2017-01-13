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

// CLASS

function Scheduler(props) {
  Object.assign(this, {
    today: getToday(),
    dayStartTime: 10 * HOUR, // default: 10 am (milliseconds from midnight)
    dayStopTime: 18 * HOUR, // default: 6 pm (milliseconds from midnight)
  }, props);
}

Scheduler.prototype.combineEventsAndTasks = function(events, tasks, options) {
  // events and tasks must be sorted chronologically
  // events must tasks after today's daily start time
  // => plans tasks within working hours only (10am and 6pm), or overflows to next day
  options = options || {};
  var combined = [];
  var today = this.today;
  var startTimeCandidate = today + this.dayStartTime;
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
  return combined.concat(nextEvents);
}

try{
  module.exports = Scheduler;
} catch(e) {}
