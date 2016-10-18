var URL_PREFIX = 'http://localhost:3000';

const appendRenderedDate = (evt) => Object.assign(evt, {
  date: new Date(evt.start).toLocaleString('en')
});

const byAscStartDate = (e1, e2) => {
  return Math.sign(new Date(e1.start).getTime() - new Date(e2.start).getTime());
};

const displayError = (response) => {
  alert('Error: ' + JSON.stringify(response));
};

function login() {
  console.log('login...');
  var w = window.open();
  this.$http.get(URL_PREFIX + '/authToGoogleCalendar').then((response) => {
    w.location.href = response.body.url;
  }, displayError);
}

function submitCode() {
  var code = document.getElementById('authcode').value; 
  console.log('submitting auth code...', code);
  this.$http.get(URL_PREFIX + '/getSessionFromCode?code=' + encodeURIComponent(code)).then((response) => {
    console.log('=>', response.body);
    this.sesId = response.body;
    refresh.call(this);
  }, displayError);
}

function refresh() {
  console.log('loading events...');
  this.$http.get(URL_PREFIX + '/listEvents?sesId=' + this.sesId).then((response) => {
    this.events = response.body.events;
  }, displayError);
}

function updateEventById(eventId, event) {
  for (var i in this.events) {
    if (this.events[i].id == eventId) {
      this.events[i].start = event.start;
    }
  }
}

function snoozeEvent(eventId) {
  console.log('snoozing', eventId);
  this.$http.get(URL_PREFIX + '/swipeEvent?sesId=' + this.sesId + '&eventId=' + eventId).then((response) => {
    updateEventById.call(this, eventId, response.body.event);
  }, displayError);
}

new Vue({
  el: '#snoozer-web-client',
  data: {
    sesId: null,
    events: [ { name: '(loading...)' } ]
  },
  computed: {
    orderedEvents: function() {
      return this.events
        .sort(byAscStartDate)
        .map(appendRenderedDate)
    }
  },
  methods: {
    login: login,
    submitCode: submitCode,
    snooze: function(evt) {
      snoozeEvent.call(this, evt.srcElement.parentElement.parentElement.id);
    }
  }
})
