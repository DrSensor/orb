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
  constructor(derive) {
    let isCached, value
    const track = o => {
      if (!this.#m.has(o)) {
        const r = new WeakRef(this.#m) // or maybe `new WeakRef(U.bind(this.#reg.get, reg, o))` 🤔
        chain(o, {
          set: v => {
            const m = r.deref()
            if (m) isCached = m.get(o) === v
          }
        })
      }
      isCached = K.TRUE
      this.#m.set(o, get(o))
      return o
    }
    derive = U.bind(derive, this)
    super({ get() { return isCached ? value : value = derive(track, ...$) } })
  }
  get set() {
    const m = this.#m
    return (self, ...$) => m.has(self)
      ? self.set(...$)
      : m.forEach(([o]) => o.set(self, ...$))
  }
  //                                      ⌄⌄⌄ BEWARE
  // override(derived, { set(...$) { this.set(...$) } })
  //    t = cover(derived) -----------------------------------------------------------+
  //                                                                                  |
  //        this.set = derived.set.bind(derived)                                      |
  //                           ⌃⌃⌃ { get set() { return (self, ...$) => ... } }       |
  //                                                                                  |
  //    derived.set = set.bind(t) <---------------------------------------------------+
  //            ⌃⌃⌃ { set set(fn = set.bind(cover(derived))) { ... } }
  //                                        ⌃⌃⌃⌃⌃ this.set = derived.set.bind(derived)
  set set(set) { // `set` arg already bounded
    for (const [o] of reg) {
      o.set = chain(o, { set: U.bind(set, K.VOID, o) })
    }
  }
}

const inherit = o => new Inherit(o), derive = fn => new Derive(fn)

inherit[S.species] = Inherit
derive[S.species] = Derive

export { inherit, derive, memo, Inherit, Derive }
