const appendRenderedDate = (evt) => Object.assign(evt, {
  date: new Date(evt.start).toLocaleString('en')
});

const byAscStartDate = (e1, e2) => {
  return Math.sign(new Date(e1.start).getTime() - new Date(e2.start).getTime());
};

const displayError = (response) => {
  alert('Error: ' + JSON.stringify(response));
};

function updated() {
  console.log('updated');
  var itemsElement = document.getElementsByTagName('ol')[0];
  Array.prototype.forEach.call(itemsElement.children, function(item, i) {
    SnoozeSwiper(item, function onSnooze() {
      console.log('snoozed!', item);
      item.classList.add('collapsed');
      setTimeout(function() {
        itemsElement.removeChild(item);
        // TODO: update Vue's data instead of messing with DOM
      }, 500);
    });
  });
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
  updated: updated,
  methods: {
    login: login,
    submitCode: submitCode,
    snooze: function(evt) {
      snoozeEvent.call(this, evt.srcElement.parentElement.parentElement.id);
    }
  }
})
