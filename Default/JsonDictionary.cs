using Bridge;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections;

namespace JSONDictionary
{
    [Namespace(false)]
    [External]
    public class JsonDictionary : IDictionary<string, object>
    {

#pragma warning disable CS0824 // Constructor is marked external
        public extern JsonDictionary ();
#pragma warning restore CS0824 // Constructor is marked external

        [Template("Bridge.merge(new JsonDictionary(), {0})")]
        public extern JsonDictionary (dynamic value);

        public extern int Count
        {
            [Template("Object.keys({this}).length")]
            get;
        }

        public extern ICollection<object> Values
        {
            [Template("Object.keys({this}).map(function (v){return {this}[v];})")]
            get;
        }

        extern ICollection<string> IDictionary<string, object>.Keys
        {
            [Template("Object.keys({this})")]
            get;
        }

        [Template("{this}[{key}] = {value}")]
        public extern void Add(string key, object value);

        [Template("{this}.hasOwnProperty({key})")]
        public extern bool ContainsKey(string key);
        
        const string getEnumerator = "Bridge.getEnumerator(Object.keys({this}).map(function (v){return new Bridge.KeyValuePair$2(String,Object)(v, {this}[v])}))";

        [Template(getEnumerator)]
        public extern IEnumerator<KeyValuePair<string, object>> GetEnumerator();

        [Template("delete {this}[{key}]")]
        public extern bool Remove(string key);

#pragma warning disable CS0626 // Method, operator, or accessor is marked external and has no attributes on it

        public extern bool TryGetValue(string key, out object value);
#pragma warning restore CS0626 // Method, operator, or accessor is marked external and has no attributes on it

        [Template(getEnumerator)]
        extern IEnumerator IEnumerable.GetEnumerator();
    }
}
