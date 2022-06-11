import * as K from "./keywords.js"
export const { hasOwn, values
  , assign, defineProperty, defineProperties } = Object
  , isType = ($, t) => typeof $ === t
  , bind = (fn, ...$) => fn.bind(...$)
  , objLen = $ => values($)[K.LEN]
  , splice = ($, ...a) => $.splice(...a)
  , tail = ($, n = 1) => splice($, n)
  , head = ($, n = 1) => splice($, 0, K.LEN - n)
  , at = ($, n) => $.at(n)
  , identity = $ => $
  , noop = () => {}
  , microtask = queueMicrotask
