﻿using System;
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
        public static PositionedObject[] garden = new PositionedObject[] { };
        public static Animal[] animals = new Animal[] { };
        [Template("gamedata")]
        public static extern dynamic gamedata();

        [Template("{0}.map({1})")]
        public static extern TOutput[] Map<T, TOutput>(this T[] value, Converter<T, TOutput> action);

        [Ready]
        public static void Main()
        {
            foreach (var item in new JsonDictionary(gamedata().animals))
            {
                animals.Push(LoadAnimal(item.Key, item.Value));
            }
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
                        {
                            result[item.Key] = (item.Value as object[]).Map(LoadRequirement);
                            break;
                        }
                    default:
                        throw new ArgumentException("Unknown property: " + key);
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

        private static Requirement LoadRequirement(dynamic input)
        {
            switch ((string)input.type)
            {
                case "EatRequirement":
                    {
                        return BridgeMerge(new EatRequirement(), input);
                    }
                default:
                    throw new ArgumentException("Requirement type: " + input.type);
            }
        }

        [Template("Bridge.merge({0}, {1})")]
        private static extern T BridgeMerge<T>(T from, dynamic to);

        public static string HttpGet(string value)
        {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.Open("GET", value, false); // false for synchronous request
            xmlHttp.ToDynamic().send(null);
            return xmlHttp.ResponseText;
        }

        [Template("{0}[Math.floor(Math.random() * {0}.length)]")]
        public static extern T RandomElement<T>(this T[] value);

        private static void Interval()
        {
            foreach (var item in animals)
            {
                if (item.appear.All(v => v.Numerator == v.Denominator))
                    item.state = Animal.AnimalState.Appear;
                
            }
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
    }
}