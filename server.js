var PROTO_PATH = __dirname + '/snoozer.proto';
var HOST = '0.0.0.0:50051';

var grpc = require('grpc');
var protocol = grpc.load(PROTO_PATH).snoozer;
var serverMethods = require('./server-methods');

function wrapMethod(fct){
  return function(call, callback) {
    console.log('received call to', fct.name, ':', call.request);
    return fct.apply(this, arguments);
  };
}

var methods = {};

Object.keys(serverMethods).forEach(function(name){
  console.log(' - /' + name);
  methods[name] = wrapMethod(serverMethods[name]);
});

function startServer() {
  console.log('start RPC server...');
  var server = new grpc.Server();
  server.addProtoService(protocol.Snoozer.service, methods);
  server.bind(HOST, grpc.ServerCredentials.createInsecure());
  server.start();
  console.log('server running on', HOST);
}

startServer();
