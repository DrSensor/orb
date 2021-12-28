export const S = Symbol,
  O = Object,
  { defineProperties } = O,
  { iterator, toPrimitive } = S,
  isFunction = ($) => typeof $ == "function",
  isAsync = ($) => $ instanceof Promise,
  isObject = ($) => typeof $ == "object",
  $data = S();

// tryAwait<T>(value: T): T extends Promise ? Promise<T> : T
