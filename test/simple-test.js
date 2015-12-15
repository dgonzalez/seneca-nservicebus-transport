var seneca = require("seneca");
var senecaNServiceBus = require("../seneca-nservicebus-transport");
seneca().use(senecaNServiceBus)
.add({bar: "test"}, function(a, b) {
    b(null, {ping: "pong!"});
}).listen({type: 'nservicebus'});

var client = seneca().use(senecaNServiceBus).client({type: "nservicebus"});
client.act({bar: "test"}, function(err, result){
    console.log(result);
});
