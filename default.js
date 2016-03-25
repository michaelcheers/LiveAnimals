(function (globals) {
    "use strict";

    Bridge.define('Default.Animal', {
        name: null,
        appear: null,
        resident: null,
        eat: function (value) {
            value.eat(this);
        }
    });
    
    Bridge.define('Default.App', {
        statics: {
            garden: null,
            config: {
                init: function () {
                    this.garden = [];
                    Bridge.ready(this.main);
                }
            },
            main: function () {
                var plant = Bridge.merge(new Default.Plant(), {
                    name: "Turnip",
                    garden: Bridge.get(Default.App).garden,
                    id: "turnip"
                } );
                Bridge.get(Default.App).garden.push(plant);
                plant.gardenPosition = new Default.Vector2("constructor$1", 1, 1);
                plant.eat(null);
                console.log(Bridge.get(Default.App).garden);
                Bridge.global.setInterval(Bridge.get(Default.App).interval, 4000);
            },
            interval: function () {
    
            }
        }
    });
    
    Bridge.define('Default.PositionedObject', {
        gardenPosition: null,
        garden: null
    });
    
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
        eat: function (eatenBy) {
            Bridge.Linq.Enumerable.from(this.garden).forEach(Bridge.fn.bind(this, $_.Default.Eatable.f1));
        }
    });
    
    var $_ = {};
    
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
    
    Bridge.define('Default.Requirement', {
        inherits: [Default.IRequirement],
        value: null,
        config: {
            events: {
                numeratorChanged: null
            }
        }
    });
    
    Bridge.define('Default.EatRequirement', {
        inherits: [Default.Requirement],
        eatNumNeeded: 0,
        getDenominator: function () {
            return this.eatNumNeeded;
        },
        getNumerator: function () {
            throw new Bridge.NotImplementedException();
        },
        getText: function () {
            throw new Bridge.NotImplementedException();
        }
    });
    
    Bridge.define('Default.Plant', {
        inherits: [Default.Eatable],
        name: null,
        id: null,
        eat: function (eatenBy) {
            Default.Eatable.prototype.eat.call(this, eatenBy);
        }
    });
    
    Bridge.init();
})(this);
