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

  , override = (o, { set, get, ...d }) => U.defineProperties(o, {
    ...U.hasOwn(o, K.LET) || set && { let: { ...get && { get }, ...set && { set }, ...d } }
    , set: set ? { value: set, ...d } : {}
    , [S.toPrimitive]: get ? { value: get, ...d } : {}
  })

  , chain = (o, { get, set, ...d }
    , { [S.toPrimitive]: $get, set: $set } = o
  ) => override(o, {
    ...get && {
      get: (...a) => get[K.LEN] == 1
        ? get([$get(...a), ...U.tail(a)])  // value ◀ last chain ◀ … ◀ 1st chain
        : get(a, $get)
    },
    ...set && {
      set: (...a) => set[K.LEN] == 1
        ? (set(a), $set(...a))             // value ▶ last chain ▶ … ▶ 1st chain
        : set(a, $set)
    },
    ...d
  })

over[S.species] = Over
cover[S.species] = Cover

export { get, is } from "./_public.js"
export { over, cover, override, chain, Over, Cover }
