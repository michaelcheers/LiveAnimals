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
                return animalRuntime.eaten.Count(v => v.id == value);
            }
        }

        public override string Text
        {
            get
            {
                return animalRuntime.name + " eats " + App.GetEatableById(value).name;
            }
        }

        public override Eatable[] WantsAdd
        {
            get
            {
                return new[] { App.GetEatableById(value) };
            }
        }

        public int eatNumNeeded;
        public string value;
    }
}
