using JSONDictionary;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Default
{
    public class PositionedObject : ICloneable
    {
        public Vector2? gardenPosition = new Vector2();
        public PositionedObject[] garden;
        public string id;
        public string name;
        
        public object Clone()
        {
            return App.BridgeMerge(App.New(GetType()), new JsonDictionary(Keys(this).Map(v => new object[] { v, this[v] })).ExportToJSON());
        }
    }
}
