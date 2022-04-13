var EventBus = /** @class */ (function () {
    function EventBus(stateMap) {
        var _this = this;
        this.eventStack = {};
        this.state = null;
        Object.keys(stateMap).forEach(function (key) {
            _this.eventStack[key] = {
                value: stateMap[key],
                callBacks: []
            };
        });
        this.state = new Proxy(stateMap, {
            get: function (target, props) {
                return target[props];
            },
            set: function (target, props, value) {
                target[props] = value;
                _this.eventStack[props].value = value;
                if (_this.eventStack[props].callBacks.length) {
                    _this.eventStack[props].callBacks.forEach(function (callBack) {
                        callBack(value);
                    });
                }
                return true;
            }
        });
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
