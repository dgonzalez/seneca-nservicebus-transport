'use strict';

var _ = require('lodash');
var amqp = require('amqplib/callback_api');

function extractPayload(message) {
    // TODO: For some reason, parseJSON returns an Unknown Token error when reading from a queue. This fixes the problem but we need a better approach.
    return message.substring(message.indexOf('":"') + 3, message.indexOf('"}'));
}


module.exports = function(options) {
    
    var seneca = this;
    var plugin = "nservicebus-transport";
    
    var so = seneca.options();
    
    var tu = seneca.export('transport/utils');
    
    options = seneca.util.deepextend({
            nservicebus: {
                timeout: so.timeout ? so.timeout - 555 : 22222,
                type: 'nservicebus',
                user: 'test',
                password: 'test',
                host: 'localhost',
                actqueuename: 'SenecaActQueue',
                resqueuename: 'SenecaResQueue'
            }
    },
    so.transport,
    options);
    
    /**
     * Add the handlers for listen and client
     */
    seneca.add({role: "transport", hook: "listen", type: "nservicebus"}, hook_listen_nservicebus);
    seneca.add({role: "transport", hook: "client", type: "nservicebus"}, hook_client_nservicebus);
    
    /**
     * Build the connection string
     */
    var connectionString = "amqp://"+options.nservicebus.user+ ":" + options.nservicebus.password + "@";
    connectionString += options.nservicebus.host;

    function hook_listen_nservicebus(args, done) {
        var seneca = this
        var type = args.type
        var listen_options = seneca.util.clean(_.extend({}, options[type], args));
        amqp.connect(connectionString, function(error, connection) {
            if (error) {
                return done(error);
            }
            connection.createChannel(function(err, channel) {
                if (error) {
                    return done(error);
                }
                channel.on("error", done);
                
                tu.listen_topics(seneca, args, listen_options, function (out) {
                    var actRecQueue = options.nservicebus.actqueuename;
                    seneca.log.debug("listen", "subscribe", actRecQueue, listen_options, seneca);
                    channel.assertQueue(actRecQueue);
                    channel.consume(actRecQueue, on_message);
                });
                
                function on_message (message) {
                  var messageJson = message.content ? message.content.toString() : undefined;
                  var base64String = extractPayload(messageJson);
                  var data = tu.parseJSON(seneca, 'listen-' + type, new Buffer(base64String, "base64").toString());
                  channel.ack(message);
                  tu.handle_request(seneca, data, listen_options, function(out) {
                      if (out == null) {
                          return;
                      }
                     var outstr = new Buffer(tu.stringifyJSON(seneca, 'listen-' + type, out)).toString("base64");
                     var options = {};
                     options.messageId = data.id;
                     options.headers = {
                         "NServiceBus.EnclosedMessageTypes": "SenecaResMessages.SenecaRes"
                     };
                     var message = {};
                     message.Payload = outstr;
                     channel.sendToQueue("SenecaNServiceBus", new Buffer(JSON.stringify(message)), options);
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
            });
        });
    }
    
    function hook_client_nservicebus(args, client_done) {
        var seneca = this;
        var type = args.type;
        var client_options = seneca.util.clean(_.extend({}, options[type], args));
        
        amqp.connect(connectionString, function(error, connection) {
            if (error) {
                return client_done(error);
            }
            connection.createChannel(function(error, channel) {
                if (error) {
                    return client_done(error);
                }
                tu.make_client(seneca, make_send, client_options, client_done);
                
                function make_send(spec, topic, send_done) {
                    var q = "SenecaNServiceBus";
                    
                    channel.on("error", send_done);
                    
                    channel.assertQueue(q);
                    
                    seneca.log.debug('client', 'subscribe', q, client_options, seneca);
                    
                    // Consume message and handle the response:
                    channel.consume(options.nservicebus.resqueuename, function(message) {
                        var content = message.content ? message.content.toString() : undefined;
                        var base64String = extractPayload(content);
                        var input = tu.parseJSON(seneca, "client-" + type, new Buffer(base64String, "base64").toString());
                        channel.ack(message);
                        tu.handle_response(seneca, input, client_options);
                    });
                    
                    send_done(null, function(args, done) {
                        var outmsg = tu.prepare_request(this, args, done);
                        var outstr = new Buffer(tu.stringifyJSON(seneca, 'client-' + type, outmsg)).toString("base64");
                        var options = {};
                        options.messageId = args.meta$.id;
                        options.headers = {
                            "NServiceBus.EnclosedMessageTypes": "SenecaActMessages.SenecaAct"
                        };
                        var message = {};
                        message.Payload = outstr;
                        channel.sendToQueue(q, new Buffer(JSON.stringify(message)), options);
                    });
                }
            });
        });          
    }
    
    return {
        name: plugin
    }
}
