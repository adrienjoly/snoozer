# Snoozer

[Jérémie](https://github.com/jeremiegirault) and [I](https://www.pitchcard.io/c/B1Ykjbg3) expressed our frustration of not being able to "snooze" our scheduled tasks, similarly to Google Inbox. So we prototyped a snoozable Google Calendar for iOS:

![Snoozer swipe animation on ios](https://s3.amazonaws.com/revue/items/images/001/507/063/original/snoozer.gif?1475601251)

This codebase was written thanks to the following resources:
- [gRPC Basics: Node.js](http://www.grpc.io/docs/tutorials/basic/node.html)
- [Google Calendar Quickstart with Node.js](https://developers.google.com/google-apps/calendar/quickstart/nodejs)

You can find the [iOS app on Jérémie's repo](https://github.com/jeremiegirault/snoozer-client).

We crafted this in one day. You can read our story [here](https://www.getrevue.co/profile/aj-sideprojects/issues/day-10-snooze-your-calendar-events-on-ios-32185), and subscribe to my side-projects [there](https://www.getrevue.co/profile/aj-sideprojects).

## Prerequisites

- `node`: This requires Node 0.12.x or greater.

## Setup

```sh
$ npm install
$ npm start
```

## Run tests

```sh
$ npm test        # => tests the google calendar API
$ npm run client  # => tests the snoozer API
```
