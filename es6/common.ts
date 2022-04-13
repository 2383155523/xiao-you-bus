interface eventStack_interface {
  value: any
  callBacks: []
}
class EventBus<T> {
  private eventStack: eventStack_interface | {} = {}
  public state: null | T = null
  constructor(stateMap: T | any) {
    Object.keys(stateMap).forEach(key => {
      this.eventStack[key] = {
        value: stateMap[key],
        callBacks: [],
      }
    })
    this.state = new Proxy(stateMap, {
      get: (target: any, props: string | symbol) => {
        return target[props]
      },
      set: (target: any, props: string | symbol, value: any): boolean => {
        target[props] = value
        this.eventStack[props].value = value
        if (this.eventStack[props].callBacks.length) {
          this.eventStack[props].callBacks.forEach(callBack => {
            callBack(value)
          })
        }
        return true
      },
    })
  }
  public on(eventName: string | symbol, callBack: (value: any) => void): void {
    this.eventStack[eventName].callBacks.push(callBack)
    callBack(this.eventStack[eventName].value)
  }
  public commit(eventName: string | symbol, value: any): void {
    this.state[eventName] = value
  }
}

const createEventBus = <T>(stateMap: T) => new EventBus<T>(stateMap)
module.exports = {
  createEventBus,
}
