import * as K from "./keywords.js"
export const { hasOwn, fromEntries, entries, setPrototypeOf, getPrototypeOf
  , assign, defineProperty, defineProperties, is: sameValue } = Object
  , { isArray, from: arrayFrom } = Array
  , generateArray = (length, fn) => arrayFrom({ length }, fn)
  , instanceOf = ($, C) => $ instanceof C
  , typeOf = $ => typeof $ // for use in `switch…case` statement
  , isType = ($, t) => typeOf($) === t
  , del = ($, p) => delete $[p]
  , bind = (fn, ...$) => fn.bind(...$)
  , bindArgs = (fn, ...$) => bind(fn, K.VOID, ...$)
  , bindThis = (self, key, ...$) => bind(self[key], self, ...$) // WARNING: V8 can't optimize this, just use `bind(self[key],self)`
  , objLen = $ => values($)[K.LEN]
  , splice = ($, ...a) => $.splice(...a)
  , indexOf = ($, ...a) => $.indexOf(...a)
  , removeItem = ($, n, c = 1) => splice($, indexOf($, n), c)
  , tail = ($, n = 1) => splice($, n)
  , head = ($, n = 1) => splice($, 0, K.LEN - n)
  , at = ($, i, len = $[K.LEN]) => $.at(i >= len ? i % len : i)
  , map = ($, fn) => $.map(fn)
  , flatMap = ($, fn) => $.flatMap(fn)
  , flat = ($, depth) => $.flat(depth)
  , push = ($, ...n) => $.push(...n)
  , concat = ($, ...n) => $.concat(...n)
  , add = ($, n) => $.add(n)
  , forEach = ($, fn) => $.forEach(fn)
  , forEachGroup = ($, g, fn) => forEach(arrayFrom($).groupToMap(isType(g), K.STR) ? it => it[g] : g, fn)
  , noop = () => {}
  , identity = $ => $
  , proxy = (...$) => new Proxy(...$)
  , microtask = queueMicrotask
