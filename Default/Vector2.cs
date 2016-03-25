using System;

namespace Default
{
    public struct Vector2
    {
        public int x;
        public int y;

        public Vector2(int x, int y)
        {
            this.x = x;
            this.y = y;
        }

        public void Execute (Converter<int, int> action)
        {
            x = action(x);
            y = action(y);
        }

        public static bool operator < (Vector2 a, Vector2 b)
        {
            return a.x < b.x && a.y < b.y;
        }

        public static bool operator >(Vector2 a, Vector2 b)
        {
            return a.x > b.x && a.y > b.y;
        }

        public static bool operator <=(Vector2 a, Vector2 b)
        {
            return a.x <= b.x && a.y <= b.y;
        }

        public static bool operator >=(Vector2 a, Vector2 b)
        {
            return a.x >= b.x && a.y >= b.y;
        }

        public static Vector2 operator + (Vector2 a, Vector2 b)
        {
            a.x += b.x;
            a.y += b.y;
            return a;
        }

        public static Vector2 operator - (Vector2 a, Vector2 b)
        {
            a.x -= b.x;
            a.y -= b.y;
            return a;
        }

        public static Vector2 operator *(Vector2 a, int b)
        {
            a.x *= b;
            a.y *= b;
            return a;
        }

        public static Vector2 operator *(int a, Vector2 b)
        {
            b.x *= a;
            b.y *= a;
            return b;
        }

        public static Vector2 operator /(Vector2 a, int b)
        {
            a.x /= b;
            a.y /= b;
            return a;
        }
    }
}