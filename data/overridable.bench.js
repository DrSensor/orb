import { bench, group, warmup } from "../_internal/benchmark.js"

warmup()

import { over, cover, Over, Cover } from "./overridable.js"; {
  const as = group("create"), value = over(0)
  bench("create via factory (not exported)", as, () => { _over(0) })
  bench("create via `new Cover()` (inherited)", as, () => { new CoverOver(0) })
  bench("create via `new Cover(new Over(value))`", as, () => { new Cover(value) })
  bench("create via `new Cover()`", as, () => { new Cover() })
  bench("create via `new Over()`", as, () => { new Over(0) })
  bench("create via `over()`", as.standard, () => { over(0) })
  bench("create via `cover()`", as, () => { cover() })
  bench("create via `cover(over(value))`", as, () => { cover(value) })
  bench("create via `cover()` (factory-ed)", as, () => { coverOver(0) })

  const _over = v => ({
    [Symbol.toPrimitive]: _ => v, set($) { v = $ },
    get let() { return this[Symbol.toPrimitive]() },
    set let(v) { this.set(v) },
  })
  const coverOver = v => cover({ get: () => v, set: $ => v = $ })
  class CoverOver extends Cover {
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
