using System;
using Bridge;
using Bridge.Html5;

namespace Default
{
    public static class App
    {
        public static PositionedObject[] garden = new PositionedObject[] { };

        [Ready]
        public static void Main()
        {
            var plant = new Plant
            {
                name = "Turnip",
                garden = garden,
                id = "turnip"
            };
            garden.Push(plant);
            plant.gardenPosition = new Vector2(1, 1);
            plant.Eat(null);
            Console.Log(garden);
            Global.SetInterval(Interval, 4000);
        }

        private static void Interval()
        {

        }
    }
}