using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Default
{
    public class Plant : Eatable
    {
        public string name;
        public string id;

        public override void Eat(Animal eatenBy)
        {
            base.Eat(eatenBy);
        }
    }
}
