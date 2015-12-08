'use strict';

module.exports = function(options) {
    
    console.log("HEEEEERE I AM");
    var seneca = this;
    var plugin = "nservicebus-transport";
    
    var so = seneca.options();
    
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
    
    function hook_listen_nservicebus(args, done) {
        console.log("----------------------------");
    }
    
    function hook_client_nservicebus(args, done) {
        console.log("-----------------------------");
    }
    
    return {
        name: plugin
    }
}
