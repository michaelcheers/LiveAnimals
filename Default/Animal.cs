using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Default
{
    public class Animal
    {
        public string name;
        public Requirement[] appear;
        public Requirement[] resident;

        public void Eat (Eatable value)
        {
            value.Eat(this);
        }

    }
}
