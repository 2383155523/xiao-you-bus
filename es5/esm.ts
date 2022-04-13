interface eventStack_interface {
  value: any
  callBacks: []
}

class EventBus<T> {
  private eventStack: eventStack_interface | {} = {}
  public state: null | T = null
  constructor(stateMap: T | any) {
    this.state = stateMap
    let copyState = JSON.parse(JSON.stringify(this.state))
    Object.keys(stateMap).forEach(key => {
      this.eventStack[key] = {
        value: stateMap[key],
        callBacks: [],
      }
    })
    const createProxyOptions = (_this): any => {
      const options = {}
      Object.keys(_this.state).forEach(prop => {
        options[prop] = {
          get() {
            return copyState[prop]
          },
          set(newVal) {
            copyState[prop] = newVal
            _this.eventStack[prop].value = newVal
            if (_this.eventStack[prop].callBacks.length) {
              _this.eventStack[prop].callBacks.forEach(callBack => {
                callBack(newVal)
              })
            }
          },
        }
      })
      return options
    }

    Object.defineProperties(this.state, createProxyOptions(this))
  }
  public on(eventName: string | symbol, callBack: (value: any) => void): void {
    this.eventStack[eventName].callBacks.push(callBack)
    callBack(this.eventStack[eventName].value)
  }
  public commit(eventName: string | symbol, value: any): void {
    this.state[eventName] = value
  }
}

export const createEventBus = <T>(stateMap: T) => new EventBus<T>(stateMap)
