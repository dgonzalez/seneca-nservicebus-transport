
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://test:test@localhost', function(err, conn) {
    var q = "TestQueue";
  var ok = conn.createChannel(on_open);
  function on_open(err, ch) {
    if (err != null) bail(err);
    ch.assertQueue(q);
    ch.consume(q, function(msg) {
      if (msg !== null) {
        console.log(msg.content.toString());
        ch.ack(msg);
      }
    });
  }
});
