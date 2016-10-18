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

function refresh() {
  console.log('loading events...');
  this.$http.get(URL_PREFIX + '/listEvents').then((response) => {
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
  this.$http.get(URL_PREFIX + '/swipeEvent?eventId=' + eventId).then((response) => {
    updateEventById.call(this, eventId, response.body.event);
  }, (response) => {
    alert('Error: ' + JSON.stringify(response));
  });
}

new Vue({
  el: '#snoozer-web-client',
  created: function() {
    refresh.call(this);
  },
  data: {
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
    snooze: function(evt) {
      snoozeEvent.call(this, evt.srcElement.parentElement.parentElement.id);
    }
  }
})
