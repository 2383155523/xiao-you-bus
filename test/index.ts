// import { createEventBus } from "../src/index"
import { createEventBus } from "xiao-you-bus"

interface State {
  name: string
  theme: "dark" | "light"
  num: number
}

const bus = createEventBus<State>({
  name: "",
  theme: "light",
  num: 1,
})

bus.on("num", (newVal, oldVal) => {})

bus.commit("num", 1)
