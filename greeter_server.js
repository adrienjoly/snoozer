var PROTO_PATH = __dirname + '/snoozer.proto';
var HOST = '0.0.0.0:50051';

var grpc = require('grpc');
var hello_proto = grpc.load(PROTO_PATH).helloworld;

function wrapMethod(fct){
  return function(call, callback) {
    console.log('received call to', fct.name, ':', call.request);
    return fct.apply(this, arguments);
  };
}

var methods = {
  sayHello: wrapMethod(function sayHello (call, callback) {
    callback(null, {message: 'Hello ' + call.request.name});
  }),
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
