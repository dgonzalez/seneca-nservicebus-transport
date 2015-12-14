using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NServiceBus;
using SenecaActMessages;

namespace SenecaNServiceBus
{
    class SenecaActHandler : IHandleMessages<ICommand>
    {
        IBus bus;

        public SenecaActHandler(IBus bus)
        {
            this.bus = bus;
        }

        public void Handle(ICommand command)
        {
           bus.Send(command);
        }
    }
}
