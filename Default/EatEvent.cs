using Bridge;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Default
{
    [Namespace(false)]
    public class EatEvent : IAnimalEvent
    {
        public Eatable eating;

        public EatEvent (Eatable eating)
        {
            this.eating = eating;
        }
    }
}
