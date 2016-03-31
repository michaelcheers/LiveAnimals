using Bridge;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Default
{
    [Namespace(false)]
    [External]
    public class Random
    {
#pragma warning disable CS0824 // Constructor is marked external
        public extern Random ();
#pragma warning restore CS0824 // Constructor is marked external

        [Name("bool")]
        public extern bool Bool(int numerator, int denominator);

        [Name("integer")]
        public extern void Next(int minValue = 0, int maxValue = int.MaxValue);
    }
}
