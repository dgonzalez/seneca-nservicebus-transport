
namespace SenecaNServiceBus
{
    using NServiceBus;
    using System;

    /*
		This class configures this endpoint as a Server. More information about how to configure the NServiceBus host
		can be found here: http://particular.net/articles/the-nservicebus-host
	*/
    public class EndpointConfig : IConfigureThisEndpoint
    {
        public static IBus Bus { get; private set; }
        private static readonly object BusLock = new object();
        public void Customize(BusConfiguration configuration)
        {
            lock(BusLock) { 
                configuration.UsePersistence<InMemoryPersistence>();
                configuration.EndpointName("SenecaNServiceBus");
                configuration.UseSerialization<JsonSerializer>();
                // TODO: Needs to be extracted.
                configuration.UseTransport<RabbitMQTransport>().ConnectionString("host=192.168.1.5;username=test;password=test");
                configuration.EnableInstallers();
            }
        }
    }
}
