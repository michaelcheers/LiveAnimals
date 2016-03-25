using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge.Linq;
using Bridge;
using Bridge.Html5;

namespace Default
{
    public abstract class Eatable : PositionedObject
    {
        public virtual void Eat (Animal eatenBy)
        {
            garden.ForEach((v, pos) => { if (v == this) { garden.Splice(pos, 1); return false; } return true; });
        }
    }
}
