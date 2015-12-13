
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://test:test@localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'Particular.ServiceControl';

    ch.assertQueue(q, {durable: true});
	
    var message = {};
    message.bananas = "hola";

    var options = {};
    options["messageId"] = "the-very-unique-id-2";
    ch.sendToQueue(q, new Buffer('{"pepe": "bananas"}'), options);
    console.log(" [x] Sent 'Hello World!'");
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
