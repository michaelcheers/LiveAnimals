using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Default
{
    public abstract class Requirement : IRequirement
    {
        public abstract int Denominator { get; }
        public abstract int Numerator { get; }
        public abstract string Text { get; }

        public Animal value;
        public event Action numeratorChanged;
    }
}
