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

        public override void GetEatenBy(Animal eatenBy)
        {
            base.GetEatenBy(eatenBy);
        }
    }
}
