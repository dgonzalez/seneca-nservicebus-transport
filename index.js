var seneca = require("seneca");

seneca().use("seneca-nservicebus-transport")
.add({bar: "test"}, function(a, b) {
    b(null, {ping: "pong!"});
}).listen({type: 'nservicebus'});

var client = seneca().use("seneca-nservicebus-transport").client({type: "nservicebus"});
client.act({bar: "test"}, function(err, result){
    console.log(result);
});
