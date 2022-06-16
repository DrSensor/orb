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
    super(); if (d) {
      const move = U.instanceOf(d, Let)
      this.set = move ? U.bind(d.set, d) : d.set
      this[S.toPrimitive] = move ? U.bind(d[S.toPrimitive], d) : d.get
    }
  } [S.toPrimitive]
}

class Over extends Let {
  #v; constructor(v) {
    super(); this.#v = v
    this[S.toPrimitive] = function () { return this.#v } // workaround for v8 bug
  } set(v) { this.#v = v }
  // [S.toPrimitive]() { return this.#v } // BUG(V8): cause ~90x slower on `self[Symbol.toPrimitive].bind(self)`
  // ["get"]() { return this.#v } <<<<<<<<<<<<<<<<<<: cause slow down too  `self.get.bind(self)`
}

const cover = d => new Cover(d), over = v => new Over(v)

  , override = (o, { set, get }) => {
    const t = cover(o)
    if (get) o[S.toPrimitive] = U.bind(get, t)
    if (set) o.set = U.bind(set, t)
  }

  , chain = (o, c) => {
    const d = {}, { get, set } = c

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

over[S.species] = Let
cover[S.species] = Let

export { get, is } from "./_public.js"
export { over, cover, override, chain, Over, Cover }
