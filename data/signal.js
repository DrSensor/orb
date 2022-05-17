import * as U from "../_internal/utils.js"
import * as K from "./_internal/keywords.js"

// WARNING: it's impossible inherit AbortSignal without using Object.setPrototypeOf(/*very slow*/)
class Signal extends EventTarget {
  #s; #v
  constructor(v, s = isAbortSignal(v)) {
    super(); U.microtask(() => this.let = v)
    if (s) this.#s = s
    else {
      const { abort, signal } = new AbortCtl
      this.abort = abort; this.#s = signal
    } this.#s.onabort = e => { this.onabort?.(e); this.dispatchEvent(e) }
  }
  set(v) { this.#v = v; this.dispatchEvent(e) }
  then(resolve = U.identity) { this.addEventListener(e.type, e => resolve(v, e), { signal: this.#s }) }
  get let() { return this.#v }
}

const AbortCtl = AbortController, AbortSig = AbortSignal,
  isAbortSignal = $ => $ instanceof AbortSig ? $ : K.VOID,
  e = /* @__PURE__ */ new Event("change")

  , sig = (v, s = isAbortSignal(v)
    , { abort, signal = s } = s ? {} : new AbortCtl
  ) => (U.microtask(() => signal.let = v), U.defineProperty(U.assign(signal, {
    [K.THEN](resolve) { signal.addEventListener(e.type, e => resolve(v, e), { signal }) },
    set($) { v = $; signal.dispatchEvent(e) },
    ...abort && { abort }
  }), K.LET, {
    get: () => v, set: signal.set, ...K.desc
  }))

  , { timeout } = AbortSig

  , proto = /* @__PURE__ */ Signal[K.PROTO]
  , Sig = /* @__PURE__ */ (U.defineProperty(proto, K.LET, { set: proto.set }), Signal)

export { sig as signal, timeout, Sig as Signal }
