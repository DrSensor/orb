/// <reference types="./overridable" />

import * as U from "../_internal/utils.js"
import * as K from "./_internal/keywords.js"
import * as S from "../_internal/symbols.js"

class Cover { // mainly for ECS data preparation
  [S.toPrimitive]; constructor(d) {
    this[S.toPrimitive] = d.get
    this.set = d.set
    letis(this)
  } set; let
}

class Overridable { // faster creation than `over()` but allocate more memory (maybe)
  #v; constructor(v) { this.#v = v }
  [S.toPrimitive]() { return this.#v }
  set(v) { this.#v = v }
}

const letis = o => U.defineProperty(o, K.LET, { get: o[S.toPrimitive], set: o.set, ...K.desc })

  , cover = ({ get, set }) => letis({ [S.toPrimitive]: get, set })

  , over = (v, get = _ => v, set = $ => v = $) => letis({ [S.toPrimitive]: get, set })

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

  , Over = /* @__PURE__ */ (letis(Overridable[K.PROTO]), Overridable)

export { get } from "./_public.js"
export { over, cover, override, chain, Over, Cover }
