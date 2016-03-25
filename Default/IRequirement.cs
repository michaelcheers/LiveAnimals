namespace Default
{
    public interface IRequirement
    {
        int Denominator { get; }
        int Numerator   { get; }
        string Text     { get; }
    }
}