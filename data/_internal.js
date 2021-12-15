export const S = Symbol,
  O = Object,
  { defineProperties } = O,
  { iterator, toPrimitive } = S,
  isFunction = ($) => typeof $ == "function",
  isObject = ($) => typeof $ == "object",
  $data = S();
