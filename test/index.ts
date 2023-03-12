import { createEventBus } from "../src/index"

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

bus.on("num", () => {})

bus.commit("theme", "dark")
