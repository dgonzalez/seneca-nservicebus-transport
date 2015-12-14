using NServiceBus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SenecaActMessages
{
    
    public class SenecaAct : ICommand
    {
        private string payload;

        public string Payload
        {
            get
            {
                return payload;
            }

            set
            {
                payload = value;
            }
        }
    }
}
