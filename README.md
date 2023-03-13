# xiao-you-bus

> 适用于任意环境进行状态传递触发响应式

## Install

```shell
npm i xiao-you-bus
```

## Use

```typescript
//像使用 vuex 一样创建一个文件夹 然后里面创建一个文件--> eventBus/index.ts
import { createEventBus } from "xiao-you-bus"

interface State {
  name: string
  age: number
}

const bus = createEventBus<State>({
  name: "微若蜉蝣",
  age: 21,
})

export default bus
```

```javascript
import bus from "@/eventBus"
//监听数据的改变
bus.on("name", (newVal, oldVal) => {
  console.log("newVal:", newVal)
  console.log("oldVal:", oldVal)
})
//以下两种方式都可以改变数据
//效果是一致的，就是API风格不同，自己喜爱哪种风格就用哪个即可
bus.commit("name", "小蝣")
//----------- or ------------
bus.state.name = "小蝣"
```
