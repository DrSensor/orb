import * as U from "../_internal/utils.js"
import * as K from "../_internal/keywords.js"
import * as S from "../_internal/symbols.js"
import { cover } from "./overridable.js"

const species = S.Symbol()

  , create = (o, ret) => {
    const desc = {}, bind = ret ? U.identity : U.bind

    let proxy
    ret ??= k =>
      U.isType(k, K.OBJ) ? U.assign(ret, k) :
        U.isType(k, K.STR) ? rGet(k) :
          k === K.VOID
            ? U.objLen(r) !== U.objLen(o) ? proxy ??= new Proxy(r,
              { get: (_, p) => rGet(p) }) : (proxy = K.VOID, r)
            : K.VOID
    const r = {}, rGet = k => r[k] ??= cover(desc[k])

    for (const k in o) U.isType(o[k], K.FUNC)
      ? ret[k] = bind(o[k], ret)
      : desc[k] = {
        get: () => o[k],
        set: v => o[k] = v,
      }

    ret[S.species] = species
    return U.defineProperties(ret, desc)
  }

  , declare = (o,
    Struct = class {}) => (
    create(o, Struct[K.PROTO]),
    Struct
  ),

  struct = /* @__PURE__ */ U.bind(create)
struct.class = declare
struct[S.species] = species

export { create, declare }
export default struct
