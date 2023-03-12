type GetPropertyType<T, K extends keyof T> = T extends { [P in K]: infer U } ? U : never

type CallBack<T> = (newVal: T, oldVal: T) => void

type EventStackItem<T> = {
  value: T
  callBacks: Array<CallBack<T>>
}

type EventStack<T> = {
  [K in keyof T]: EventStackItem<GetPropertyType<T, K>>
}

class EventBus<T extends object> {
  private eventStack = {} as EventStack<T>

  public state: T

  constructor(stateMap: T) {
    //Init State Map
    Object.keys(stateMap).forEach((key: string) => {
      this.eventStack[key] = {
        value: stateMap[key],
        callBacks: [],
      }
    })

    //Init Proxy State Map
    this.state = new Proxy<T>(stateMap, {
      get: (target: T, props: string) => {
        return target[props]
      },
      set: (target: T, props: string, value: unknown): boolean => {
        const oldVal = target[props]
        target[props] = value
        this.eventStack[props].value = value
        if (this.eventStack[props].callBacks.length) {
          this.eventStack[props].callBacks.forEach((callBack: CallBack<unknown>) => {
            callBack(value, oldVal)
          })
        }
        return true
      },
    })
  }

  public on<K extends keyof T>(
    eventName: K,
    callBack: (newVal: GetPropertyType<T, K>, oldVal: GetPropertyType<T, K>) => void
  ): void {
    this.eventStack[eventName].callBacks.push(callBack)
    callBack(this.eventStack[eventName].value, this.eventStack[eventName].value)
  }

  public commit<K extends keyof T>(eventName: K, value: GetPropertyType<T, K>): void {
    this.state[eventName as string] = value
  }
}

export const createEventBus = <T extends object>(stateMap: T) => new EventBus<T>(stateMap)