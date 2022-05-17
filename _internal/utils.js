import * as K from "./keywords.js"
export const { hasOwn
  , assign, defineProperty, defineProperties } = Object
  , { random } = Math
  , splice = ($, ...a) => $.splice(...a)
  , tail = ($, n = 1) => $.splice(n)
  , head = ($, n = 1) => $.splice(0, K.LEN - n)
  , identity = ($) => $
  , noop = () => {}
  , promise = executor => new Promise(executor)
  , microtask = queueMicrotask
