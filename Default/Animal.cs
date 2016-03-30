using Bridge;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Default
{
    [Namespace(false)]
    public class Animal : Eatable
    {
        public Requirement[] appear;
        public Requirement[] visit;
        public Requirement[] resident;
        public Requirement[] romance = null;
        public AnimalState state;
        public Eatable[] eaten = new Eatable[] { };
        public IAnimalEvent[] events = new IAnimalEvent[] { };

        public Requirement[] currentRequirements
        {
            get
            {
                switch (state)
                {
                    case AnimalState.None:
                        return appear;
                    case AnimalState.Appear:
                        return visit;
                    case AnimalState.Visiting:
                        return resident;
                    case AnimalState.Resident:
                        return new Requirement[] { };
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
            eaten.Push(value);
            value.GetEatenBy(this);
        }

        public enum AnimalState
        {
            None,
            Appear,
            Visiting,
            Resident
        }
    }
}
