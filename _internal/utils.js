import * as K from "./keywords.js"
export const { hasOwn
  , defineProperty, defineProperties } = Object
  , splice = ($, ...a) => $.splice(...a)
  , tail = ($, n = 1) => $.splice(n)
  , head = ($, n = 1) => $.splice(0, K.LEN - n)
