/// <reference types="./overridable" />

import * as U from "../_internal/utils.js"
import * as K from "./_internal/keywords.js"
import * as S from "./_internal/symbols.js"

/** @abstract */
class Let {
  get let() { return this[S.toPrimitive]() }
  set let(v) { this.set(v) }
}

class Cover extends Let {
  set; constructor(d) {
    super(); if (d) {
      const move = U.instanceOf(d, Let)
      if (d.set) this.set = move ? U.bind(d.set, d) : d.set
      if (d.get) this[S.toPrimitive] = move ? U.bind(d[S.toPrimitive], d) : d.get
    }
  } [S.toPrimitive]
}

class Over extends Let {
  #v; constructor(v) {
    super(); this.#v = v
    this[S.toPrimitive] = function () { return this.#v } // workaround for v8 bug
  } set(v) { this.#v = v }
  // [S.toPrimitive]() { return this.#v } // BUG(V8): cause ~90x slower on `self[Symbol.toPrimitive].bind(self)`
  // ["get"]() { return this.#v } // <<<<<<<<<<<<<<<: cause slow down too on `self.get.bind(self)`
  // get() { return this.#v } // <<<<<<<<<<<<<<<<<<<: no slow down
}

const cover = d => new Cover(d), over = v => new Over(v)

  , _setFn = (target, key, source) => {
    source[S.prevFunc] = target[key]
    target[key] = source
  }
  , _resetFn = (o, isSet, isGet) => () => {
    if (isGet) o[S.toPrimitive] = o[S.toPrimitive][S.prevFunc]
    if (isSet) o.set = o.set[S.prevFunc]
  }

  , override = (o, $) => {
    const get = $.get
      , set = U.isType($, K.OBJ) ? $.set : $
      , setPrev = U.bind(o.set, o)
      , getPrev = U.bind(o[S.toPrimitive], o)
    if (get) _setFn(o, S.toPrimitive, (...$) => get(getPrev, setPrev, ...$))
    if (set) _setFn(o, "set", (...$) => set(setPrev, getPrev, ...$))
    return _resetFn(o, set, get)
  }

  , chain = (o, $) => {
    const get = $.get
      , set = U.isType($, K.OBJ) ? $.set : $
      , setPrev = U.bind(o.set, o)
      , getPrev = U.bind(o[S.toPrimitive], o)
    if (get) _setFn(o, S.toPrimitive, (...$) => {
      const value = getPrev(...$), async = value?.[K.THEN]
      return async
        ? async(value => get(value, ...$))
        : get(value, ...$)
    }) // value ◀ last chain ◀ … ◀ 1st chain
    if (set) _setFn(o, "set", (...$) => {
      const ret = set(...$), async = ret?.[K.THEN]
      return async
        ? async(() => setPrev(...$))
        : (setPrev(...$), ret)
    }) // value ▶ last chain ▶ … ▶ 1st chain
    return _resetFn(o, set, get)
  }

over[S.species] = Let
cover[S.species] = Let

export { get, is } from "./_public.js"
export { over, cover, override, chain, Over, Cover }
