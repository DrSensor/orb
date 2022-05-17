import * as S from "./_internal/symbols.js"
import * as U from "../_internal/utils.js"
import * as K from "./_internal/keywords.js"

class Signal {
  #id = ID++
  #e = Event(this.#id)
  #v; constructor(v) { U.microtask(() => this.let = v) }
  set(v) { this.#v = v; t.dispatchEvent(this.#e) }
  then(resolve = U.identity) { t.addEventListener(this.#id, this[S.value] ??= () => resolve(v)) } // BUG: only have 1 listener
  get let() { return this.#v }
}

const t = new EventTarget, ID = /* @__PURE__ */ U.random(), proto = /* @__PURE__ */ Signal[K.PROTO]

  , signal = (v, id = ID++, e = Event(id),
    s = {
      [S.id]: id,
      set($) { v = $; t.dispatchEvent(e) },
      then(resolve = U.identity) { t.addEventListener(id, s[S.value] ??= () => resolve(v)) } // BUG: only have 1 listener
    }) => (U.microtask(() => s.let = v), U.defineProperty(s, K.LET, {
      get: () => v,
      set: s.set, ...K.desc
    }))

  , close = s => (t.removeEventListener(s[S.id], s[S.value]), s[S.value] = K.VOID) // TODO: refactor to use AbortSignal

  , Sig = /* @__PURE__ */ (U.defineProperty(proto, K.LET, { set: proto.set }), Signal)

export { signal, close, Sig as Signal }
