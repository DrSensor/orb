const { bench } = Deno, group = group => ({
  get standard() { return { group, baseline: true } },
  group,
})

bench(" ", () => {})
bench("no operation", () => {})

import { over, over_, Over } from "./overridable.js"; {
  const as = group("create")
  bench("create via factory", as, () => { over_() })
  bench("create via class (call)", as.standard, () => { over() })
  bench("create via class (new)", as, () => { new Over() })
}

import { get, is } from "./overridable.js"
const count = over(0); {
  const as = group("increment")
  bench("increment via .let", as.standard, () => { count.let++ })
  bench("increment via get() and .set()", as, () => { count.set(1 + get(count)) })
  bench("increment via autocast and .set()", as, () => { count.set(1 + count) })
} {
  const as = group("mutate")
  bench("mutate via .let", as.standard, () => { count.let = 0 })
  bench("mutate via .set()", as, () => { count.set(0) })
} {
  const as = group("read")
  bench("read via autocast", as, () => { +count })
  bench("read via get()", as, () => { get(count) })
} {
  const as = group("condition"), doSomething = () => {}
  bench("condition via is()", as.standard, () => { if (!is(count)) doSomething() })
  bench("condition via autocast", as, () => { if (count == false) doSomething() })
  bench("condition via get()", as, () => { if (!get(count)) doSomething() })
}
