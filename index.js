var seneca = require("seneca");

seneca().use("seneca-nservicebus-transport").add({bar: "test"}, function(a, b) {b();}).listen({type: 'nservicebus'});
var client = seneca().use("seneca-nservicebus-transport").client({type: "nservicebus"});
client.act({bar: "test"}, function(err, result){
    console.log("-------------------");
    console.log(result);
    console.log("-------------------");
});
