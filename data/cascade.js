import * as S from "../_internal/symbols.js"
import * as U from "../_internal/utils.js"
import { chain, get, Over } from "./overridable.js"

class Inherit extends Over {
  constructor(o) {
    super(get(o))
    chain(o, { set: a => this.set(...a) })
  }
}

class Derive {
  constructor(o) {
    U.isFunction(o)
      ? this[S.toPrimitive] = o
      : this[S.parent] = o
  } [S.parent]
  [S.toPrimitive]() { return get(this[S.parent]) }
}

const inherit = o => new Inherit(o), derive = o => new Derive(o)

inherit[S.species] = Inherit
derive[S.species] = Derive

export { inherit, derive, Inherit, Derive }
