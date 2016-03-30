using System;
using Bridge;
using Bridge.Html5;
using Bridge.Linq;
using System.Linq;
using JSONDictionary;

namespace Default
{
    [Namespace(false)]
    [Name("Game")]
    public static class App
    {
        public static Animal[] gardenAppear = new Animal[] { };
        public static PositionedObject[] garden = new PositionedObject[] { };
        public static Animal[] animals = new Animal[] { };

        [Template("new {0}()")]
        public static extern object New(Type value);

        [Template("gamedata")]
        public static extern dynamic gamedata();

        [Template("{0}.map({1})")]
        public static extern TOutput[] Map<T, TOutput>(this T[] value, Converter<T, TOutput> action);

        [Ready]
        public static void Main()
        {
            foreach (var item in new JsonDictionary(gamedata().animals))
            {
                Console.Log("Loading " + item.Key + "...");
                Console.Log(item.Value);
                animals.Push(LoadAnimal(item.Key, item.Value));
                Console.Log("Loaded " + item.Key + ".");
                Console.Log(animals.Last());
            }
            Global.ToDynamic().initGraphics();
            Global.SetInterval(Interval, 4000);
        }

        private static Animal LoadAnimal(string key, dynamic valueInput)
        {
            var result = new Animal();
            var value = new JsonDictionary(valueInput);
            result.id = key;
            foreach (var item in value)
            {
                switch (item.Key)
                {
                    case "name":
                        {
                            result[item.Key] = item.Value;
                            break;
                        }
                    case "appear":
                    case "resident":
                    case "visit":
                        {
                            result[item.Key] = (item.Value as object[]).Map(v => LoadRequirement(v, result));
                            break;
                        }
                    default:
                        throw new ArgumentException("Unknown property: " + item.Key);
                }
            }
            return result;
        }

        public static Eatable GetEatableById(string value)
        {
            var index1 = animals.IndexOf(value);
            if (index1 != -1)
                return animals[index1];
            throw new ArgumentException("Unknown id: " + value);
        }

        private static Requirement LoadRequirement(dynamic input, Animal value)
        {
            var type = (string)input.type;
            Script.Delete(input.type);
            switch (type)
            {
                case "EatRequirement":
                    {
                        return BridgeMerge(new EatRequirement(), BridgeMerge(input, new { animalRuntime = value }));
                    }
                default:
                    throw new ArgumentException("Requirement type: " + type);
            }
        }

        [Template("Bridge.merge({0}, {1})")]
        public static extern T BridgeMerge<T>(T from, dynamic to);

        public static string HttpGet(string value)
        {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.Open("GET", value, false); // false for synchronous request
            xmlHttp.ToDynamic().send(null);
            return xmlHttp.ResponseText;
        }

        [Template("{0}[Math.floor(Math.random() * {0}.length)]")]
        public static extern T RandomElement<T>(this T[] value);

        public static bool BaseAreEqual(PositionedObject a, PositionedObject b)
        {
            return a.id == b.id;
        }

        [Template("{0}?{1}():undefined")]
        public static extern void If(bool value, Action action);

        [Template("{0}?{1}():undefined")]
        public static extern T If<T>(bool value, Func<T> action);

        [Template("{0}?{1}():{2}()")]
        public static extern void If(bool value, Action action, Action @else);

        [Template("{0}?{1}():{2}()")]
        public static extern T If<T>(bool value, Func<T> action, Func<T> @else);

        public static void AnimalInterval(PositionableObjectLocation location, Animal item)
        {
            object[] arrayToAddTo;
            switch (item.state)
            {
                case Animal.AnimalState.None:
                    {
                        if (gardenAppear.Count(v => v.id == item.id) >= 1 || garden.Count(v => v.id == item.id) >= 2)
                            return;
                        arrayToAddTo = gardenAppear;
                        break;
                    }
                case Animal.AnimalState.Appear:
                case Animal.AnimalState.Visiting:
                    {
                        arrayToAddTo = garden;
                        break;
                    }
                case Animal.AnimalState.Resident:
                    {
                        return;
                    }
                default:
                    throw new NotImplementedException();
            }
            if (item.currentRequirements.All(v => v.Numerator == v.Denominator))
            {
                var itemClone = item.state == Animal.AnimalState.None ? (Animal)item.Clone() : item;
                Console.Log("All " + Enum.GetName(typeof(Animal.AnimalState), ++itemClone.state) + " requirements of the " + item.name + " have been met.");
                arrayToAddTo.Push(itemClone);
            }
        }

        private static void Interval()
        {
            animals.ForEach(v => AnimalInterval(PositionableObjectLocation.Wild, v));
            gardenAppear.ForEach(v => AnimalInterval(PositionableObjectLocation.Appear, v));
            garden.ForEach(v => If(v is Animal, () => AnimalInterval(PositionableObjectLocation.Garden, (Animal)v)));
            foreach (var item in garden)
            {
                if (item is Animal)
                {
                    var itemAnimalAs = item as Animal;
                    var wants = new Eatable[] { };
                    foreach (var item2 in itemAnimalAs.currentRequirements)
                        wants = (Eatable[])wants.Concat(item2.WantsAdd);
                    itemAnimalAs.events = wants.Map(v => new EatEvent(v));
                }
            }
        }

        public enum PositionableObjectLocation
        {
            Wild,
            Appear,
            Garden
        }
    }
}