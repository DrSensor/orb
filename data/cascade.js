import * as S from "../_internal/symbols.js"
import * as U from "../_internal/utils.js"
import * as K from "../_internal/keywords.js"
import { chain, get, Over, Cover } from "./overridable.js"

class Inherit extends Over {
  constructor(o) {
    super(get(o))
    chain(o, { set: (...$) => this.set(...$) })
  }
}

class Derive extends Cover {
  #m = new Map
  #v; #c
  constructor(derive) {
    let isCached
    const track = o => {
      const m = this.#m
      if (!m.has(o)) {
        const r = new WeakRef(m) // or maybe `new WeakRef(U.bind(m.get, m, o))` 🤔
        chain(o, {
          set: v => { // accessing `this` here could prevent gc() for cleaning instance of Derive
            const m = r.deref()
            if (m) isCached = m.get(o) === v
          }
        })
      }
      isCached = K.TRUE
      m.set(o, get(o))
      return o
    }
    derive = U.bind(derive, this)
    super({ get: () => isCached ? this.#v : this.#v = derive(track, ...$) })
    this.#c = cond => isCached = cond
  }
  #s(value) {
    this.#m.has(value)
      ? (...$) => value.set(...$)
      : (this.#c(K.TRUE), this.#v = value)
  } get set() { return this.#s }
  //                                      ⌄⌄⌄ BEWARE
  // override(derived, { set(...$) { this.set(...$) } })
  //    t = cover(derived) ------------------------------------------------------------------+
  //                                                                                         |
  //        this.set = derived.set.bind(derived)                                             |
  //                           ⌃⌃⌃ get set() { return value =>? (...$) => value.set(...$) }  |
  //                                                                                         |
  //    derived.set = set.bind(t) <----------------------------------------------------------+
  //            ⌃⌃⌃ set set(fn = set.bind(cover(derived))) { ... }
  //                                      ⌃⌃⌃⌃⌃ this.set = derived.set.bind(derived)
  set set(set) { // `set` arg already bounded
    const s = set.name, t = this.#s.name
      , isOverride = `bound ${t}` === s || s === t // [[BoundFunction]].name consistent according to ecma262 spec
    for (const [o] of reg) o.set =
      chain(o, { set: isOverride ? set(o) : set })
  }
}

const inherit = o => new Inherit(o), derive = fn => new Derive(fn)

inherit[S.species] = Inherit
derive[S.species] = Derive

export { inherit, derive, memo, Inherit, Derive }
