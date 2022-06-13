import * as U from "../_internal/utils.js"
import * as K from "../_internal/keywords.js"
import * as S from "../_internal/symbols.js"
import { over, get, cover } from "./overridable.js"

/** @abstract */
class Struct {}

/** @abstract */
class CStruct extends Struct {
  constructor(scope) {
    super()
    return U.setPrototypeOf(
      U.bind(_access, scope, K.FALSE, K.VOID),
      new.target.prototype
    )
  }
}

const _proxy = S.Symbol(), _revoke = S.Symbol(), {
  [S.toPrimitive]: getter, _access } = {

  _access(notClass, desc, k) {
    const r = notClass ? this[S.unscopables] : this
      , descLen = notClass ? U.objLen(desc) : K.VOID
      , rGet = k => notClass ? k in desc ? r[k] ??= cover(desc[k]) : K.VOID : this[k]
    return U.isType(k, K.OBJ) ? U.assign(this, k) :
      U.isType(k, K.STR) ? rGet(k) :
        k === K.VOID
          ? notClass && U.objLen(r) !== descLen
            ? (this[_proxy] ?? ( // welcome to optimization hell 😂XD
              { proxy: this[_proxy], revoke: this[_revoke] } = Proxy
                .revocable(r, {
                  get: (_, p) => (p = rGet(p), U.objLen(r) === descLen && (
                    this[_revoke](),
                    U.del(this, _proxy),
                    U.del(this, _revoke)
                  ), p)
                })
            ), this[_proxy])
            : r
          : K.VOID
  },

  [S.toPrimitive](scope) {
    const a = {}
    for (const k in scope) a[k] = this[k]
    return a // the ^^^^^ must NOT contain methods
  },

},

  declare = o => {
    class Struct extends CStruct {
      [S.toPrimitive]; constructor(v) {
        const scope = {}; super(scope)
        for (const k in o) U.isType(o[k], K.FUNC)
          ? this[k] = U.bind(o[k], this) // desctructuring instance only return bounded methods… (same as struct/create)
          : scope[k] = over(v?.[k] ?? o[k]) // …and no real value returned
        U.assign(this, {
          [S.toPrimitive]: U.bind(getter, this, scope),
          [S.unscopables]: scope,
        })
      } [S.unscopables]
    } create(o, Struct[K.PROTO])
    Struct[S.species] = CStruct
    return Struct
  },

  create = (o, ret = K.VOID) => {
    const desc = {}, notClass = !ret

    if (notClass) U.assign(ret =
      k => _access.call(ret, notClass, desc, k), {
      [S.unscopables]: {},
      [S.species]: Struct,
      [S.toPrimitive]: U.bind(getter, ret, desc)
    })

    for (const k in o) {
      U.isType(o[k], K.FUNC)
        ? notClass && (ret[k] = U.bind(o[k], ret))
        : desc[k] = notClass ? {
          get: () => o[k],
          set: v => o[k] = v,
        } : {
          get() { return get(this[S.unscopables][k]) },
          set(v) { this[S.unscopables][k].let = v },
          [K.ENUM]: true,
        }
    }

    return U.defineProperties(ret, desc)
  },

  struct = /* @__PURE__ */ U.bind(create)
struct.class = /* @__PURE__ */ U.bind(declare)
struct.class[S.species] = CStruct
struct[S.species] = Struct
struct[S.toPrimitive] = () => S.unscopables

export * from "./_public.js"
export { create, declare }
export default struct
