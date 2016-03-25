using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Default
{
    public class Animal : Eatable
    {
        public string name;
        public Requirement[] appear;
        public Requirement[] visit;
        public Requirement[] resident;
        public AnimalState state;
        public IAnimalEvent[] events = new IAnimalEvent[] { };

        public Requirement[] currentRequirements
        {
            get
            {
                switch (state)
                {
                    case AnimalState.Appear:
                        return visit;
                    case AnimalState.Visiting:
                        return resident;
                    case AnimalState.Resident:
                    default:
                        throw new NotImplementedException();
                }
            }
            internal set
            {
                var pointer = currentRequirements;
                pointer = value;
            }
        }

        public void Eat (Eatable value)
        {
            value.GetEatenBy(this);
        }

        public enum AnimalState
        {
            Appear,
            Visiting,
            Resident
        }
    }
}
