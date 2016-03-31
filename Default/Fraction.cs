using Bridge;

namespace Default
{
    [Namespace(false)]
    public class Fraction
    {
        public int numerator;
        public int denominator;

        public Fraction(int numerator, int denominator)
        {
            this.numerator = numerator;
            this.denominator = denominator;
        }
    }
}