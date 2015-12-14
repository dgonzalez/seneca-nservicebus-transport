using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NServiceBus;

namespace SenecaResMessages
{
    class SenecaRes : ICommand
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
