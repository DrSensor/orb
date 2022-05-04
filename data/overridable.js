/// <reference types="./overridable" />

import * as U from "../_internal/utils.js"
import * as K from "../_internal/keywords.js"
import * as S from "../_internal/symbols.js"

class Cover { // mainly for ECS data preparation
  constructor({ get, set }) {
    this[S.toPrimitive] = get
    this.set = set
  }
  get let() { return this.get() }
  set let(v) { this.set(v) }
  [S.toPrimitive]; set
}
// class Over extends Cover { constructor(v) { super({ get: _ => v, set: $ => v = $ }) } }
class Over { // faster creation than `over()` but allocate more memory cuz this.get !== get this.let && set this.let !== this.set
  #v; constructor(v) { this.#v = v }
  [S.toPrimitive]() { return this.#v }
  set(v) { this.#v = v }
  get let() { return this.#v }
  set let(v) { this.#v = v }
}

const
  over = (v
    , get = _ => v
    , set = $ => v = $
  ) => U.defineProperty({ [S.toPrimitive]: get, set }
    , K.LET, { get, set, [K.CONF]: true, [K.ENUM]: true })

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

export { get } from "./_public.js"
export { over as default, override, chain, Over, Cover }
