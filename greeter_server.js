var PROTO_PATH = __dirname + '/helloworld.proto';
var HOST = '0.0.0.0:50051';

var grpc = require('grpc');
var hello_proto = grpc.load(PROTO_PATH).helloworld;

// gcal init: https://developers.google.com/google-apps/calendar/quickstart/nodejs

var methods = {
  sayHello: function (call, callback) {
    console.log('received call to sayHello', call.request);
    callback(null, {message: 'Hello ' + call.request.name});
  },
  sayHelloAgain: function (call, callback) {
    console.log('received call to sayHelloAgain', call.request);
    callback(null, {message: 'Hello again, ' + call.request.name});
  }
};

// Starts an RPC server that receives requests for the Greeter service
function main() {
  var server = new grpc.Server();
  server.addProtoService(hello_proto.Greeter.service, methods);
  server.bind(HOST, grpc.ServerCredentials.createInsecure());
  server.start();
  console.log('server running on', HOST);
}

main();
