(function (globals) {
    "use strict";

    Bridge.define('Default.PositionedObject', {
        gardenPosition: null,
        garden: null,
        id: null
    });
    
    Bridge.define('Default.Animal.AnimalState', {
        statics: {
            appear: 0,
            visiting: 1,
            resident: 2
        },
        $enum: true
    });
    
    Bridge.define('Game', {
        statics: {
            garden: null,
            animals: null,
            config: {
                init: function () {
                    this.garden = [];
                    this.animals = [];
                    Bridge.ready(this.main);
                }
            },
            main: function () {
                var $t;
                $t = Bridge.getEnumerator(Bridge.merge(new JsonDictionary(), gamedata.animals));
                while ($t.moveNext()) {
                    var item = $t.getCurrent();
                    Bridge.get(Game).animals.push(Bridge.get(Game).loadAnimal(item.key, item.value));
                }
                Bridge.global.setInterval(Bridge.get(Game).interval, 4000);
            },
            loadAnimal: function (key, valueInput) {
                var $t;
                var result = new Default.Animal();
                var value = Bridge.merge(new JsonDictionary(), valueInput);
                result.id = key;
                $t = Bridge.getEnumerator(value);
                while ($t.moveNext()) {
                    var item = $t.getCurrent();
                    switch (item.key) {
                        case "name": 
                            {
                                result[item.key] = item.value;
                                break;
                            }
                        case "appear": 
                        case "resident": 
                            {
                                result[item.key] = (Bridge.as(item.value, Array)).map(Bridge.get(Game).loadRequirement);
                                break;
                            }
                        default: 
                            throw new Bridge.ArgumentException("Unknown property: " + key);
                    }
                }
                return result;
            },
            getEatableById: function (value) {
                var index1 = Bridge.get(Game).animals.indexOf(value);
                if (index1 !== -1) {
                    return Bridge.get(Game).animals[index1];
                }
                throw new Bridge.ArgumentException("Unknown id: " + value);
            },
            loadRequirement: function (input) {
                switch (Bridge.cast(input.type, String)) {
                    case "EatRequirement": 
                        {
                            return Bridge.merge(new Default.EatRequirement(), input);
                        }
                    default: 
                        throw new Bridge.ArgumentException("Requirement type: " + input.type);
                }
            },
            httpGet: function (value) {
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("GET", value, false); // false for synchronous request
                xmlHttp.send(null);
                return xmlHttp.responseText;
            },
            interval: function () {
                var $t, $t1, $t2;
                $t = Bridge.getEnumerator(Bridge.get(Game).animals);
                while ($t.moveNext()) {
                    var item = $t.getCurrent();
                    if (Bridge.Linq.Enumerable.from(item.appear).all($_.Game.f1)) {
                        item.state = Default.Animal.AnimalState.appear;
                    }
    
                }
                $t1 = Bridge.getEnumerator(Bridge.get(Game).garden);
                while ($t1.moveNext()) {
                    var item1 = $t1.getCurrent();
                    if (Bridge.is(item1, Default.Animal)) {
                        var itemAnimalAs = Bridge.as(item1, Default.Animal);
                        var wants = [];
                        $t2 = Bridge.getEnumerator(itemAnimalAs.getcurrentRequirements());
                        while ($t2.moveNext()) {
                            var item2 = $t2.getCurrent();
                            wants = Bridge.cast(wants.concat.apply(wants, item2.getWantsAdd()), Array);
                        }
                        itemAnimalAs.events = wants.map($_.Game.f2);
                    }
                }
            }
        }
    });
    
    var $_ = {};
    
    Bridge.ns("Game", $_)
    
    Bridge.apply($_.Game, {
        f1: function (v) {
            return v.getNumerator() === v.getDenominator();
        },
        f2: function (v) {
            return new EatEvent(v);
        }
    });
    
    Bridge.define('Default.IAnimalEvent');
    
    Bridge.define('Default.IRequirement');
    
    Bridge.define('Default.Vector2', {
        statics: {
            op_LessThan: function (a, b) {
                return a.x < b.x && a.y < b.y;
            },
            op_GreaterThan: function (a, b) {
                return a.x > b.x && a.y > b.y;
            },
            op_LessThanOrEqual: function (a, b) {
                return a.x <= b.x && a.y <= b.y;
            },
            op_GreaterThanOrEqual: function (a, b) {
                return a.x >= b.x && a.y >= b.y;
            },
            op_Addition: function (a, b) {
                a.x += b.x;
                a.y += b.y;
                return a.$clone();
            },
            op_Subtraction: function (a, b) {
                a.x -= b.x;
                a.y -= b.y;
                return a.$clone();
            },
            op_Multiply: function (a, b) {
                a.x *= b;
                a.y *= b;
                return a.$clone();
            },
            op_Multiply$1: function (a, b) {
                b.x *= a;
                b.y *= a;
                return b.$clone();
            },
            op_Division: function (a, b) {
                a.x = Bridge.Int.div(a.x, b);
                a.y = Bridge.Int.div(a.y, b);
                return a.$clone();
            },
            getDefaultValue: function () { return new Default.Vector2(); }
        },
        x: 0,
        y: 0,
        constructor$1: function (x, y) {
            this.x = x;
            this.y = y;
        },
        constructor: function () {
        },
        execute: function (action) {
            this.x = action(this.x);
            this.y = action(this.y);
        },
        getHashCode: function () {
            var hash = 17;
            hash = hash * 23 + (this.x == null ? 0 : Bridge.getHashCode(this.x));
            hash = hash * 23 + (this.y == null ? 0 : Bridge.getHashCode(this.y));
            return hash;
        },
        equals: function (o) {
            if (!Bridge.is(o,Default.Vector2)) {
                return false;
            }
            return Bridge.equals(this.x, o.x) && Bridge.equals(this.y, o.y);
        },
        $clone: function (to) {
            var s = to || new Default.Vector2();
            s.x = this.x;
            s.y = this.y;
            return s;
        }
    });
    
    Bridge.define('Default.Eatable', {
        inherits: [Default.PositionedObject],
        getEatenBy: function (eatenBy) {
            Bridge.Linq.Enumerable.from(this.garden).forEach(Bridge.fn.bind(this, $_.Default.Eatable.f1));
        }
    });
    
    Bridge.ns("Default.Eatable", $_)
    
    Bridge.apply($_.Default.Eatable, {
        f1: function (v, pos) {
            if (v === this) {
                this.garden.splice(pos, 1);
                return false;
            }
            return true;
        }
    });
    
    Bridge.define('EatEvent', {
        inherits: [Default.IAnimalEvent],
        eating: null,
        constructor: function (eating) {
            this.eating = eating;
        }
    });
    
    Bridge.define('Default.Requirement', {
        inherits: [Default.IRequirement],
        animalRuntime: null,
        config: {
            events: {
                numeratorChanged: null
            }
        },
        getWantsAdd: function () {
            return [];
        }
    });
    
    Bridge.define('Default.Animal', {
        inherits: [Default.Eatable],
        name: null,
        appear: null,
        visit: null,
        resident: null,
        state: 0,
        events: null,
        config: {
            init: function () {
                this.events = [];
            }
        },
        getcurrentRequirements: function () {
            switch (this.state) {
                case Default.Animal.AnimalState.appear: 
                    return this.visit;
                case Default.Animal.AnimalState.visiting: 
                    return this.resident;
                case Default.Animal.AnimalState.resident: 
                default: 
                    throw new Bridge.NotImplementedException();
            }
        },
        setcurrentRequirements: function (value) {
            var pointer = this.getcurrentRequirements();
            pointer = value;
        },
        eat: function (value) {
            value.getEatenBy(this);
        }
    });
    
    Bridge.define('Default.EatRequirement', {
        inherits: [Default.Requirement],
        eatNumNeeded: 0,
        value: null,
        getDenominator: function () {
            return this.eatNumNeeded;
        },
        getNumerator: function () {
            throw new Bridge.NotImplementedException();
        },
        getText: function () {
            throw new Bridge.NotImplementedException();
        },
        getWantsAdd: function () {
            return [Bridge.get(Game).getEatableById(this.value)];
        }
    });
    
    Bridge.define('Default.Plant', {
        inherits: [Default.Eatable],
        name: null,
        getEatenBy: function (eatenBy) {
            Default.Eatable.prototype.getEatenBy.call(this, eatenBy);
        }
    });
    
    Bridge.init();
})(this);
