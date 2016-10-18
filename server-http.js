var PORT = process.env.PORT || 3000;

var express = require('express');
var serverMethods = require('./server-methods');

var app = express();
app.get('/', function (req, res) {
  res.send('Hello World!');
});

function wrapMethod(fct){
  return function(call, callback) {
    console.log('received call to', fct.name, ':', call.request);
    return fct.apply(this, arguments);
  };
}

Object.keys(serverMethods).forEach(function(name){
  console.log(' - /' + name);
  app.get('/' + name, function(req, res) {
    var call = {
      request: req.query,
    };
    serverMethods[name](call, function(err, data) {
      res.json(err || data);
    });
  });
});

function startSever() {
  console.log('start HTTP server...');  
  app.listen(PORT, function () {
    console.log('HTTP server running on', PORT);
  });
}

serverMethods.init(startSever);
