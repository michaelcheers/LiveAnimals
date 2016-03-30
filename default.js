(function (globals) {
    "use strict";

    Bridge.define('Default.PositionedObject', {
        inherits: [Bridge.ICloneable],
        gardenPosition: null,
        garden: null,
        id: null,
        name: null,
        clone: function () {
            return Bridge.merge(new Bridge.getType(this)(), Bridge.merge(new JsonDictionary(), Object.keys(this).map(Bridge.fn.bind(this, $_.Default.PositionedObject.f1))).export());
        }
    });
    
    var $_ = {};
    
    Bridge.ns("Default.PositionedObject", $_)
    
    Bridge.apply($_.Default.PositionedObject, {
        f1: function (v) {
            return [v, this[v]];
        }
    });
    
    Bridge.define('Animal.AnimalState', {
        statics: {
            none: 0,
            appear: 1,
            visiting: 2,
            resident: 3
        },
        $enum: true
    });
    
    Bridge.define('Game', {
        statics: {
            gardenAppear: null,
            garden: null,
            animals: null,
            config: {
                init: function () {
                    this.gardenAppear = [];
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
                    console.log("Loading " + item.key + "...");
                    console.log(item.value);
                    Bridge.get(Game).animals.push(Bridge.get(Game).loadAnimal(item.key, item.value));
                    console.log("Loaded " + item.key + ".");
                    console.log(Bridge.Linq.Enumerable.from(Bridge.get(Game).animals).last());
                }
                Bridge.global.setInterval(Bridge.get(Game).interval, 4000);
            },
            loadAnimal: function (key, valueInput) {
                var $t;
                var result = new Animal();
                var value = Bridge.merge(new JsonDictionary(), valueInput);
                result.id = key;
                $t = Bridge.getEnumerator(value);
                while ($t.moveNext()) {
                    (function () {
                        var item = $t.getCurrent();
                        switch (item.key) {
                            case "name": 
                                {
                                    result[item.key] = item.value;
                                    break;
                                }
                            case "appear": 
                            case "resident": 
                            case "visit": 
                                {
                                    result[item.key] = (Bridge.as(item.value, Array)).map(function (v) {
                                        return Bridge.get(Game).loadRequirement(v, result);
                                    });
                                    break;
                                }
                            default: 
                                throw new Bridge.ArgumentException("Unknown property: " + item.key);
                        }
                    }).call(this);
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
            loadRequirement: function (input, value) {
                var type = Bridge.cast(input.type, String);
                delete input.type;
                switch (type) {
                    case "EatRequirement": 
                        {
                            return Bridge.merge(new Default.EatRequirement(), Bridge.merge(input, { animalRuntime: value }));
                        }
                    default: 
                        throw new Bridge.ArgumentException("Requirement type: " + type);
                }
            },
            httpGet: function (value) {
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("GET", value, false); // false for synchronous request
                xmlHttp.send(null);
                return xmlHttp.responseText;
            },
            baseAreEqual: function (a, b) {
                return a.id === b.id;
            },
            animalInterval: function (location, item) {
                var arrayToAddTo;
                switch (item.state) {
                    case Animal.AnimalState.none: 
                        {
                            if (Bridge.Linq.Enumerable.from(Bridge.get(Game).gardenAppear).count(function (v) {
                                return v.id === item.id;
                            }) >= 1 || Bridge.Linq.Enumerable.from(Bridge.get(Game).garden).count(function (v) {
                                return v.id === item.id;
                            }) >= 2) {
                                return;
                            }
                            arrayToAddTo = Bridge.get(Game).gardenAppear;
                            break;
                        }
                    case Animal.AnimalState.visiting: 
                        {
                            arrayToAddTo = Bridge.get(Game).garden;
                            break;
                        }
                    case Animal.AnimalState.appear: 
                        {
                            break;
                        }
                    case Animal.AnimalState.resident: 
                        {
                            return;
                        }
                    default: 
                        throw new Bridge.NotImplementedException();
                }
                if (Bridge.Linq.Enumerable.from(item.getcurrentRequirements()).all($_.Game.f1)) {
                    var itemClone = item.state === Animal.AnimalState.none ? Bridge.cast(item.clone(), Animal) : item;
                    console.log("All " + Bridge.Enum.getName(Animal.AnimalState, ++itemClone.state) + " requirements of the " + item.name + " have been met.");
                    Bridge.get(Game).gardenAppear.push(itemClone);
                }
            },
            interval: function () {
                var $t, $t1;
                Bridge.Linq.Enumerable.from(Bridge.get(Game).animals).forEach($_.Game.f2);
                Bridge.Linq.Enumerable.from(Bridge.get(Game).gardenAppear).forEach($_.Game.f3);
                Bridge.Linq.Enumerable.from(Bridge.get(Game).garden).forEach($_.Game.f4);
                $t = Bridge.getEnumerator(Bridge.get(Game).garden);
                while ($t.moveNext()) {
                    var item = $t.getCurrent();
                    if (Bridge.is(item, Animal)) {
                        var itemAnimalAs = Bridge.as(item, Animal);
                        var wants = [];
                        $t1 = Bridge.getEnumerator(itemAnimalAs.getcurrentRequirements());
                        while ($t1.moveNext()) {
                            var item2 = $t1.getCurrent();
                            wants = Bridge.cast(wants.concat.apply(wants, item2.getWantsAdd()), Array);
                        }
                        itemAnimalAs.events = wants.map($_.Game.f5);
                    }
                }
            }
        }
    });
    
    Bridge.ns("Game", $_)
    
    Bridge.apply($_.Game, {
        f1: function (v) {
            return v.getNumerator() === v.getDenominator();
        },
        f2: function (v) {
            Bridge.get(Game).animalInterval(App.PositionableObjectLocation.wild, v);
        },
        f3: function (v) {
            Bridge.get(Game).animalInterval(App.PositionableObjectLocation.appear, v);
        },
        f4: function (v) {
            Bridge.is(v, Animal)?function () {
                Bridge.get(Game).animalInterval(App.PositionableObjectLocation.garden, Bridge.cast(v, Animal));
            }():undefined;
        },
        f5: function (v) {
            return new EatEvent(v);
        }
    });
    
    Bridge.define('App.PositionableObjectLocation', {
        statics: {
            wild: 0,
            appear: 1,
            garden: 2
        },
        $enum: true
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
    
    Bridge.define('VisitEvent', {
        inherits: [Default.IAnimalEvent]
    });
    
    Bridge.define('Animal', {
        inherits: [Default.Eatable],
        appear: null,
        visit: null,
        resident: null,
        romance: null,
        state: 0,
        eaten: null,
        events: null,
        config: {
            init: function () {
                this.eaten = [];
                this.events = [];
            }
        },
        getcurrentRequirements: function () {
            switch (this.state) {
                case Animal.AnimalState.none: 
                    return this.appear;
                case Animal.AnimalState.appear: 
                    return this.visit;
                case Animal.AnimalState.visiting: 
                    return this.resident;
                case Animal.AnimalState.resident: 
                    return [];
                default: 
                    throw new Bridge.NotImplementedException();
            }
        },
        setcurrentRequirements: function (value) {
            var pointer = this.getcurrentRequirements();
            pointer = value;
        },
        eat: function (value) {
            this.eaten.push(value);
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
            return Bridge.Linq.Enumerable.from(this.animalRuntime.eaten).count(Bridge.fn.bind(this, $_.Default.EatRequirement.f1));
        },
        getText: function () {
            return this.animalRuntime.name + " eats " + Bridge.get(Game).getEatableById(this.value).name;
        },
        getWantsAdd: function () {
            return [Bridge.get(Game).getEatableById(this.value)];
        }
    });
    
    Bridge.ns("Default.EatRequirement", $_)
    
    Bridge.apply($_.Default.EatRequirement, {
        f1: function (v) {
            return v.id === this.value;
        }
    });
    
    Bridge.define('Default.Plant', {
        inherits: [Default.Eatable],
        getEatenBy: function (eatenBy) {
            Default.Eatable.prototype.getEatenBy.call(this, eatenBy);
        }
    });
    
    Bridge.init();
})(this);
