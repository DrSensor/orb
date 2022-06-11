/// <reference types="./overridable" />

import * as U from "../_internal/utils.js"
import * as K from "./_internal/keywords.js"
import * as S from "../_internal/symbols.js"

/** @abstract */
class Let {
  get let() { return this[S.toPrimitive]() }
  set let(v) { this.set(v) }
}

class Cover extends Let {
  set; constructor(d) {
    super()
    this.set = d?.set
    this[S.toPrimitive] = d?.get
  } [S.toPrimitive]
}

class Over extends Let {
  #v; constructor(v) { super(); this.#v = v }
  [S.toPrimitive]() { return this.#v }
  set(v) { this.#v = v }
}

const cover = d => new Cover(d), over = v => new Over(v)

  , override = (o, { set, get }) => {
    const t = new Cover()

    if (get) {
      t[S.toPrimitive] = U.bind(o[S.toPrimitive], o)
      o[S.toPrimitive] = get.bind(t)
    }

    if (set) {
      t.set = U.bind(o.set, o)
      o.set = set.bind(t)
    }
  }

  , chain = (o, c) => {
    let d = {}, { get, set } = c

    if (get) d.get = function (...$) {
      const get = value => c.get(value, ...U.tail($))
        , value = this[S.toPrimitive](...$)
        , async = value?.[K.THEN]
      return async ? async(get) : get(value)
    } // value ◀ last chain ◀ … ◀ 1st chain

    if (set) d.set = function (...$) {
      const async = c.set(...$)?.[K.THEN], set = U.bind(this.set, this)
      async ? async(() => set(...$)) : set(...$)
    } // value ▶ last chain ▶ … ▶ 1st chain

    override(o, d)
  }

over[S.species] = Over
cover[S.species] = Cover

export { get, is } from "./_public.js"
export { over, cover, override, chain, Over, Cover }
