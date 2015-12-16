# seneca-nservicebus-transport
Seneca micro-services message transport over NServiceBus using RabbitMQ as client.
# How does it work?
NServiceBus is an ESB designed for .NET. However, it supports RabbitMQ as a transport which enables frameworks like Seneca to use NServiceBus as a transport layer for the messaging.

NServiceBus uses exchanges and queues in RabbitMQ in order to orchestrate the communication. In the subfolder SenecaNserviceBus there is a .NET project with an example of the simplest configuration for NServiceBus with [NServiceBus Host](http://docs.particular.net/nservicebus/hosting/nservicebus-host/) to be used by Seneca. It is configured to use an in-memory database for storing the commands.

NServiceBus will listen on a exchange Called SenecaNServiceBus and forward the messages sent from the `act` part of seneca into a exchange called `SenecaActExchange` and and the response from those messages into a exchange called `SenecaResExchange`. Those exchanges can be bound to queues in RabbitMQ and the name of the queues can be configured in seneca-nservicebus-transport through the parameters `actqueuename` and `resqueuename` in the options.

# How can I run it?
Compile the .NET project. Please be aware that you might need to change the RabbitMQ URL to point to the right host (extracting it into configuration is work in progress). An application called NServiceBus.Host.exe will be generated. Just run it and NServiceBus will be ready to process the messages. It is configured to create the needed queues but you will need to add two extra: `SenecaActExchange` and `SenecaResExchange`. If there is any queue missing the logs will point it out.

# Details
It was successfully tested in Node 4.2.3 LTS and .NET 4.5.x. If you have any query please contact us or create an issue in this project. Suggestions are more than welcome (as well as PRs with proposed changes).
