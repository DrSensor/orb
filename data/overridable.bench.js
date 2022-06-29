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

import { watch, chain, override } from "./overridable.js"; {
  const as = group("create then override")
  let number = 0n

  bench("Set.prototype.add", as, () => {
    let count = number++
    new Set().add(value => { count += value })
  })
  bench("Array.prototype.push", as, () => {
    let count = number++
    [].push(value => { count += value })
  })

  bench("override setter", as, () => {
    let count = number++
    override(over(), value => { count += value })
  })
  bench("chain setter", as, () => {
    let count = number++
    chain(over(), value => count += value)
  })
  bench("watch setter", as, () => {
    let count = number++
    watch(over(), value => { count += value })
  })

  bench("override getter", as, () => {
    let count = number++
    override(over(), {
      get: () => count++,
    })
  })
  bench("chain getter", as, () => {
    let count = number++
    chain(over(), {
      get: () => count++,
    })
  })
  bench("watch getter", as, () => {
    let count = number++
    watch(over(), {
      get: () => count++,
    })
  })

  bench("override both", as, () => {
    let count = number++
    override(over(), {
      set(value) { count += value },
      get: () => count++,
    })
  })
  bench("chain both", as, () => {
    let count = number++
    chain(over(), {
      set: value => count += value,
      get: () => count++,
    })
  })
  bench("watch both", as, () => {
    let count = number++
    watch(over(), {
      set(value) { count += value },
      get: () => count++,
    })
  })
} { // Somehow the benchmarks is skewed 😂 (try fiddle with the benchmark order and `max` constant)
  const max = 7, as = group(`propagate ${max} side-effects`)
  let number = 0

  bench("propagate via iterating Array", as, () => { for (const set of $01) set(1) })
  const $01 = []; for (let n = max; n--;)
    $01.push(value => { number += value * n })

  bench("propagate via iterating Set", as, () => { for (const set of $02) set(1) })
  const $02 = new Set(); for (let n = max; n--;)
    $02.add(value => { number += value * n })

  bench("propagate via override()", as.standard, () => { $1.set(1) })
  const $1 = over(); for (let n = max; n--;)
    override($1, (set, _, value) => { number += value * n; set(value) })

  bench("propagate via chain()", as, () => { $2.set(1) })
  const $2 = over(); for (let n = max; n--;)
    chain($2, value => (value *= n, number += value, value))

  bench("propagate via watch()", as, () => { $3.set(1) })
  const $3 = over(); for (let n = max; n--;)
    watch($3, value => { number += value * n })
}
