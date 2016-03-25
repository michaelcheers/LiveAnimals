using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Default
{
    public class EatRequirement : Requirement
    {
        public override int Denominator
        {
            get
            {
                return eatNumNeeded;
            }
        }

        public override int Numerator
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public override string Text
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public int eatNumNeeded;
    }
}
