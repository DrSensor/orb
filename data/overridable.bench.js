const { bench } = Deno, group = group => ({
  get standard() { return { group, baseline: true } },
  group,
})

bench(" ", () => {})
bench("no operation", () => {})

import { over, Over } from "./overridable.js"; {
  const as = group("create")
  bench("create via factory (not exported)", as, () => { _over() })
  bench("create via `new Over()`", as, () => { new Over() })
  bench("create via `over()`", as.standard, () => { over() })

  const _over = v => ({
    [Symbol.toPrimitive]: _ => v, set($) { v = $ },
    get let() { return this[Symbol.toPrimitive]() },
    set let(v) { this.set(v) },
  })
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
  const as = group("key"), object = {}
  bench("use as key via autocast", as, () => { object[count] })
  bench("use as key via get()", as, () => { object[get(count)] })
} {
  const as = group("condition"), doSomething = () => {}
  bench("use as condition via is()", as.standard, () => { if (!is(count)) doSomething() })
  bench("use as condition via autocast", as, () => { if (count == false) doSomething() })
  bench("use as condition via get()", as, () => { if (!get(count)) doSomething() })

}
