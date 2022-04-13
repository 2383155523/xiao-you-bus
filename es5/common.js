var EventBus = /** @class */ (function () {
    function EventBus(stateMap) {
        var _this_1 = this;
        this.eventStack = {};
        this.state = null;
        this.state = stateMap;
        var copyState = JSON.parse(JSON.stringify(this.state));
        Object.keys(stateMap).forEach(function (key) {
            _this_1.eventStack[key] = {
                value: stateMap[key],
                callBacks: []
            };
        });
        var createProxyOptions = function (_this) {
            var options = {};
            Object.keys(_this.state).forEach(function (prop) {
                options[prop] = {
                    get: function () {
                        return copyState[prop];
                    },
                    set: function (newVal) {
                        copyState[prop] = newVal;
                        _this.eventStack[prop].value = newVal;
                        if (_this.eventStack[prop].callBacks.length) {
                            _this.eventStack[prop].callBacks.forEach(function (callBack) {
                                callBack(newVal);
                            });
                        }
                    }
                };
            });
            return options;
        };
        Object.defineProperties(this.state, createProxyOptions(this));
    }
    EventBus.prototype.on = function (eventName, callBack) {
        this.eventStack[eventName].callBacks.push(callBack);
        callBack(this.eventStack[eventName].value);
    };
    EventBus.prototype.commit = function (eventName, value) {
        this.state[eventName] = value;
    };
    return EventBus;
}());
var createEventBus = function (stateMap) { return new EventBus(stateMap); };
module.exports = {
    createEventBus: createEventBus
};
