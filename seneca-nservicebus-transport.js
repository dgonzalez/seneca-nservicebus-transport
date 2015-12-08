'use strict';

var _ = require('lodash');

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
    seneca.add({role: "transport", hook: "client", type: "nservicebus"}, hook_listen_nservicebus);
    /**
     * Add the legacy handlers to avoid breaking backwards compatibility.
     */
    
    function hook_listen_nservicebus(args, done) {
        var seneca = this
        var type = args.type
        var listen_options = seneca.util.clean(_.extend({}, options[type], args))
        tu.listen_topics(seneca, args, listen_options, function (topic) {
            console.log(topic);
        });
    }
    
    function hook_client_nservicebus(args, done) {
        var seneca = this
        var type = args.type
        var client_options = seneca.util.clean(_.extend({}, options[type], args))
        // TODO David: More to come.
    }
    
    return {
        name: plugin
    }
}
