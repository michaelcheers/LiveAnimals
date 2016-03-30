//<include

JsonDictionary = function () { };
JsonDictionary.prototype.add = function (key, value) {
        this[key] = value;
};
JsonDictionary.prototype.tryGetValue = function (key, value) {
    var _hasOwnProperty = this.hasOwnProperty(key);
    value.v = _hasOwnProperty ? this[key] : null;
    return _hasOwnProperty;
};
JsonDictionary.prototype.getCount = function () {
    return Object.keys(this).length;
};
JsonDictionary.prototype.getValues = function () {
    return Object.keys(this).map(function () {})
};
JsonDictionary.prototype.getEnumerator = function () {
    var self = this;return Bridge.getEnumerator(Object.keys(this).map(function (v){return new Bridge.KeyValuePair$2(String,Object)(v, self[v])}));
};
JsonDictionary.prototype.export = function () {
    var result = {};
    var keys = Object.keys(this);
    for (var n = 0; n < keys.length; n++) {
        var v = keys[n];
        result[v] = this[v];
    }
    return result;
}