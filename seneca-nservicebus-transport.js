'use strict';

var _ = require('lodash');
var amqp = require('amqplib');
var when = require("when");
module.exports = function(options) {
    
    var seneca = this;
    var plugin = "nservicebus-transport";
    
    var so = seneca.options();
    
    var tu = seneca.export('transport/utils');
    
    options = seneca.util.deepextend({
            nservicebus: {
                timeout: so.timeout ? so.timeout - 555 : 22222,
                type: 'nservicebus',
                // TODO David: this needs to change at some point.
                alivetime: 111,
                priority: 100,
                delay: 0,
                port: 11300,
                host: 'localhost'
            }
    },
    so.transport,
    options);
    
    /**
     * Add the handlers for listen and client.
     */
    seneca.add({role: "transport", hook: "listen", type: "nservicebus"}, hook_listen_nservicebus);
    seneca.add({role: "transport", hook: "client", type: "nservicebus"}, hook_client_nservicebus);
    
    /**
     * Add the legacy handlers to avoid breaking backwards compatibility.
     */
    function hook_listen_nservicebus(args, done) {
        var seneca = this
        var type = args.type
        var listen_options = seneca.util.clean(_.extend({}, options[type], args))
        
        amqp.connect("amqp://localhost", function(error, connection){
            if (error) {
                return done(error);
            }
            connection.createChannel(function(err, channel) {
                if (error) {
                    return done(error);
                }
                channel.on("error", done);
                
                tu.listen_topics(seneca, args, listen_options, function (out) {
                    var q = "SenecaNServiceBus"; // TODO: We might need two endpoints.
                    seneca.log.debug("listen", "subscribe", q, listen_options, seneca);
                    channel.assertQueue(q);
                    channe.consume(q, on_message);
                }); // tu.listen_topics
                
                function on_message (message) {
                  var content = message.content ? message.content.toString() : undefined;
                  var data = tu.parseJSON(seneca, 'listen-' + type, content);

                  channel.ack(message);

                  // Publish
                    tu.handle_request(seneca, data, listen_options, function (out) {
                        if (out == null) {
                            return
                        }
                        var outstr = tu.stringifyJSON(seneca, 'listen-' + type, out);
                        var options = {};
                        options.messageId = "bananas";
                        options.headers = {
                            "NServiceBus.EnclosedMessageTypes": "SenecaNServiceBus.MyMessage"
                        };
                        var messageContent = "<MyMessage><Payload>Bananas!</Payload></MyMessage>";
                        ch.sendToQueue(q, new Buffer(messageContent), options); // TODO Format the message. JSON.
                    });
                }
                seneca.add('role:seneca,cmd:close', function (close_args, done) {
                    var closer = this;
                    channel.close();
                    connection.close();
                    closer.prior(close_args, done);
                });
                seneca.log.info('listen', 'open', listen_options, seneca);
                done();
            }); // createChannel.
        }); // amqp.connect
    }
    
    function hook_client_nservicebus(args, client_done) {
        var seneca = this;
        var type = args.type;
        var client_options = seneca.util.clean(_.extend({}, options[type], args));
        tu.make_client(seneca, make_send, client_options, client_done);
        
        function make_send(spec, topic, send_done) {
            // TODO David: More to come.
        }
    }
    
    return {
        name: plugin
    }
}
