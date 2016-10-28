const appendRenderedDate = (evt) => Object.assign(evt, {
  date: new Date(evt.start).toLocaleString('en')
});

const byAscStartDate = (e1, e2) => {
  return Math.sign(new Date(e1.start).getTime() - new Date(e2.start).getTime());
};

const displayError = (response) => {
  alert('Error: ' + JSON.stringify(response));
};

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
