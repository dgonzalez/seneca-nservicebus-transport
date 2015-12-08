var seneca = require("seneca");

seneca().use("seneca-nservicebus-transport").listen({type: "nservicebus"});
var client = seneca().use("seneca-nservicebus-transport").client({type: "nservicebus"})
client.act({bar: "test"}, function(err, result){
    console.log(result);
});
