import * as U from "../_internal/utils.js"
import * as K from "../_internal/keywords.js"
import * as S from "../_internal/symbols.js"

export default (v
  , get = _ => v
  , set = c => v = c
) => U.defineProperty({ [S.toPrimitive]: get, set }      // WARNING: if cause bottleneck in ECS data preparation,
  , K.LET, { get, set, [K.CONF]: true, [K.ENUM]: true }) // replace Object.defineProperty with { get let(), set let(v) }

export { get } from "./_public.js"
export const

  override = (o, { set, get, ...d }) => U.defineProperties(o, {
    ...U.hasOwn(o, K.LET) || set && { let: { ...get && { get }, ...set && { set }, ...d } }
    , set: set ? { value: set, ...d } : {}
    , [S.toPrimitive]: get ? { value: get, ...d } : {}
  }),

  chain = (o, { get, set, ...d }
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
