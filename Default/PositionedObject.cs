using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Default
{
    public class PositionedObject : ICloneable
    {
        public Vector2? gardenPosition;
        public PositionedObject[] garden;
        public string id;
        public string name;

        public object Clone()
        {
            return App.BridgeMerge(App.New(GetType()), Keys(this).Map(v => new KeyValuePair<string, object>(v, this[v])));
        }
    }
}
