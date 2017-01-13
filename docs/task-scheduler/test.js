var diff = require('diff'); // for ios: https://github.com/jflinter/Dwifft or https://github.com/khanlou/NSArray-LongestCommonSubsequence
var Scheduler = require('./Scheduler');

// CONSTANTS

var TODAY; // will be set from scheduler, in instanciation
var HOUR = 3600000;
var DAY = 24 * HOUR;

// HELPERS

function renderUTCTime(date) {
  return date ? new Date(date).toUTCString().match(/(\d+\:\d+)\:/).pop() : 'XX:XX';
}

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
  return (t, i) => Object.assign({}, t, {
    id: i,
    title: '[' + prefix + i + '] ' + t.title
  });
}

const getId = (schedItem) => schedItem.title.match(/\[(.*)\] .*/).pop();

function renderDiff(arr1, arr2) {
  return diff.diffArrays(arr1, arr2).map(function(action) {
    if (action.added) {
      return '(+) ' + action.value.join(', ');
    } else if (action.removed) {
      return '(-) ' + action.value.join(', ');
    } else {
      return '(=) ' + action.value.join(', ');
    }
  }).join('\n');
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

console.log('\n Sample user preferences:\n');
Object.keys(scheduler).forEach(function(key) {
  var convert = {
    today: (t) => new Date(t).toString(),
    dayStartTime: renderUTCTime,
    dayStopTime: renderUTCTime,
  };
  console.log(key, ':', convert[key](scheduler[key]));
});

// TEST DATA

var tasks = [
  { duration: HOUR, title: 'déclarer impots' },
  { duration: HOUR, title: 'lessive' },
  { duration: 2 * HOUR, title: 'coder feature 1' },
  { duration: 3 * HOUR, title: 'coder feature 2' },
  { duration: 4 * HOUR, title: 'coder feature 3' },
].map(prefixTitle('TSK'));

var events = [
  { startDate: TODAY + 12.5 * HOUR, endDate: TODAY + 14 * HOUR, title: 'dej avec yann' }, // duration = 1.5 hours
  { startDate: TODAY + 24 * HOUR, endDate: TODAY + 25 * HOUR, title: 'film a la tv' }, // minuit -> 1am le lendemain
].map(prefixTitle('EVT'));

// TESTS

console.log('\n Sample events:\n');
printSchedule(events);

var testSteps = tasks.map(function(_dummy, i) {
  var tasksClone = tasks.slice();
  if (i > 0) {
    var from = tasks.length - 1;
    var to = tasks.length  - i - 1;
    var task = tasksClone.splice(from, 1)[0];
    tasksClone.splice(to, 0, task); // insert before previous task
  }
  var sched = scheduler.combineEventsAndTasks(events, tasksClone, { log: false });
  return {
    tasks: tasksClone,
    sched: sched,
    tasksIds: tasksClone.map(getId),
    schedIds: sched.map(getId),
  };
});

testSteps.forEach(function(step, i) {
  console.log('\n === TEST ITERATION #' + i + ' ===');
  console.log('\n Sample tasks:\n');
  printSchedule(step.tasks);
  console.log('\n Resulting schedule:\n');
  printSchedule(step.sched);
  if (i < testSteps.length - 1) {
    console.log('\n => Diff of schedule, between this step and the next:\n');
    //console.log(renderDiff(step.tasksIds, testSteps[i + 1].tasksIds));
    console.log(renderDiff(step.schedIds, testSteps[i + 1].schedIds));
  }
});
