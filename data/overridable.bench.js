const { bench } = Deno, group = group => ({
  get standard() { return this.criterion },
  get criterion() { return { group, baseline: true } },
  group,
})

bench(" ", () => {})
bench("no operation", () => {})

import { over, cover, Over, Cover } from "./overridable.js"; {
  const as = group("create")
  bench("create via factory (not exported)", as, () => { _over() })
  bench("create via `new Cover()` (inherited)", as, () => { new Over_() })
  bench("create via `new Over()`", as, () => { new Over() })
  bench("create via `over()`", as.standard, () => { over() })
  bench("create via `cover()` (factory-ed)", as, () => { over_() })

  const _over = v => ({
    [Symbol.toPrimitive]: _ => v, set($) { v = $ },
    get let() { return this[Symbol.toPrimitive]() },
    set let(v) { this.set(v) },
  })
  const over_ = v => cover({ get: () => v, set: $ => v = $ })
  class Over_ extends Cover {
    constructor(v) {
      super({ get: () => v, set: $ => v = $ })
    }
  }
}

import { get, is } from "./overridable.js"; {
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
}

import { chain, override } from "./overridable.js"; {
  const as = group("override")
    , effect = new Set()
    , arreff = []
  let number = 0

  bench("Set.prototype.add", as.criterion, () => {
    const onchange = value => { number += value }
    effect.add(onchange)
    effect.delete(onchange)
  })
  bench("Array.prototype.push", as.criterion, () => {
    arreff.push(value => { number += value })
    arreff.pop()
  })

  bench("override both", as, () => {
    let count = number++
    override(over(), {
      set(value) { count += value },
      get: () => count,
    })
  })
  bench("chain both", as, () => {
    let count = number++
    chain(over(), {
      set(value) { count += value },
      get: () => count,
    })
  })

  bench("override setter", as, () => {
    let count = number++
    override(over(), {
      set(value) { count += value },
    })
  })
  bench("chain setter", as, () => {
    let count = number++
    chain(over(), {
      set(value) { count += value },
    })
  })

  bench("override getter", as, () => {
    const count = number++
    override(over(), {
      get: () => count,
    })
  })
  bench("chain getter", as, () => {
    const count = number++
    chain(over(), {
      get: () => count,
    })
  })
}
