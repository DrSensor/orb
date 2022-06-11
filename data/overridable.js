/// <reference types="./overridable" />

import * as U from "../_internal/utils.js"
import * as K from "./_internal/keywords.js"
import * as S from "../_internal/symbols.js"

/** @abstract */
class Let {
  get let() { return this[S.toPrimitive]() }
  set let(v) { this.set(v) }
}

class Cover extends Let { // mainly for ECS data preparation
  set; constructor(d) {
    super(); this.set = d.set
    this[S.toPrimitive] = d.get
  } [S.toPrimitive]
}

class Over extends Let { // faster creation than `_over()` but allocate more memory (maybe)
  #v; constructor(v) { super(); this.#v = v }
  [S.toPrimitive]() { return this.#v }
  set(v) { this.#v = v }
}

const cover = d => new Cover(d), over = v => new Over(v)

  , override = (o, { set, get }) => {
    if (get) o[S.toPrimitive] = get
    if (set) o.set = set
  }

  , chain = (o, c) => {
    let d = {}, { get, set } = c
    if (get) {
      get = U.bind(o[S.toPrimitive], o)
      d.get = (...a) => c.get[K.LEN] > 1
        ? c.get(a, get)
        : c.get([get(...a), ...U.tail(a)])  // value ◀ last chain ◀ … ◀ 1st chain
    }
    if (set) {
      set = U.bind(o.set, o)
      d.set = (...a) => c.set[K.LEN] > 1
        ? c.set(a, set)
        : (c.set(a), set(...a))             // value ▶ last chain ▶ … ▶ 1st chain
    }
    override(o, d)
  }

over[S.species] = Over
cover[S.species] = Cover

export { get, is } from "./_public.js"
export { over, cover, override, chain, Over, Cover }
