import * as S from "../../../_internal/symbols.js"
import * as K from "../../../_internal/keywords.js"

const ArrayU16 = Uint16Array
  , id = /* @__PURE__ */ S.Symbol()
  , ptr = x => isWeak(x) ? weakptr : strongptr
  , vtab = /* @__PURE__ */ new Map
  , strongptr = /* @__PURE__ */ new Map
  , weakptr = /* @__PURE__ */ new WeakMap
  , { isExtensible } = /* @__PURE__ */ Object
  , { isView } = /* @__PURE__ */ ArrayBuffer
  , isNumber = x => typeof x === "number"
  , isWeak = (x, t = typeof x) => t === "object" || "function" === t
  , uint = x => isNumber(x) ? x : isExtensible(x) ? x[id] : ptr(x).get(x)
  , collect = (x, gc, i, p) => isNumber(x) ? x : (
    i = uint(x), vacant.push(i),
    x[id] !== K.VOID
      ? x[id] = K.VOID
      : (p = ptr(x), p.has(x) && gc.unregister(p.get(x)), p.delete(x)),
    i)
  , addr = (x, gc, p = ptr(x)) => p.get(x) ?? (
    p.set(x, p = { _: unique() }),
    isWeak(x) && gc.register(x, p._, p),
    p._)
  , init = (...$) => { for (const x of $) addr(x) }
  , unique = () => vacant.pop() ?? nonce++, vacant = []
let nonce = 0

// TODO: refactor to only support extensible object then compare the performance (only when ECS is fully implemented)
class SparseSet extends ArrayU16 { // SparseSet that support any type of value, not just number
  static init = init
  #gc = new FinalizationRegistry(id => { vacant.push(id); vtab.delete(id); this.#i-- })

  #t; #$; constructor(a) {
    const { buffer, byteLength, byteOffset, [K.LEN]: length } = this.#$ = a;
    (this.#t = !!buffer) ? super(
      ...buffer.byteLength < byteLength * 2
        ? [length]
        : [buffer, byteOffset + byteLength, length])
      : super(length ?? [...a][K.LEN])
  } #i = 0

  has(x) {
    const self = this.#$, xid = uint(x)
    return self[super[xid]] === (isView(self) ? xid : x)
  }

  add(x) { // BUG: https://github.com/tc39/proposal-destructuring-private (still stage 2 😂)
    let { has, #$: self, #i: index, #gc: gc, #at: isTypedArray } = this
    has(x) || (
      super[has = isNumber(x) ? x : isExtensible(x)
        ? x[id] ??= unique() : addr(x, gc)
      ] = index,
      self[index] = isTypedArray ? (vtab.set(has, new WeakRef(x)), has) : x,
      this.#i++
    ); return this
  }

  delete(x) {
    let { has, #$: self, #i: index, #gc: gc, #at: at } = this
      , get = o => collect(o, gc)
      , last = at(--index), last_ = self[index];
    (has = x !== last && has(x)) && (
      super[get(last)] = index = super[get(x)],
      self[index] = last_,
      this.#i--
    ); return has
  }

  #at(index) {
    let value = this.#$[index], ref
    return isTypedArray ? (ref = vtab.get(value), ref?.deref(), ref) ?? value : value
  }

  at(k) { return this.#$(super[k]) }
  *keys() { yield* super[S.iterator]() }

  *values() { yield* this.#$ }
  *[S.iterator]() {
    let { #i: index, #at: at } = this
    while (index--) yield at(index)
  }

  *entries() {
    const { #i: index, #$: self, keys } = this
    for (const k of keys()) if (k < index) yield [k, self[k]]
  }

  get size() { return this.#i }
  clear() { this.#i = 0; strongptr.clear() }
}

class BitSet extends ArrayU16 {} // TODO: implement BitSet

export { SparseSet, BitSet, isNumber, isView as isBufferView }
