const O = Object, A = Array, M = Math, S = Symbol, P = Promise,
  { is, seal, defineProperties } = O,
  { sign, abs } = M,
  { asyncIterator, iterator } = S,
  { resolve } = P, promise = (executor) => new P(executor),
  macrotask = setTimeout, microtask = queueMicrotask,
  type = ($) => typeof $, isFunction = ($) => type($) == "function",
  identity = ($) => $, noop = () => {},
  isNonZero = ($) => $ && isFinite($), isNegative = ($) => sign($) == -1 || is($, -0),
  push = ($, value) => $.push(value), pop = ($) => $.pop($), shift = ($) => $.shift(),
  slice = ($, start, end) => $.slice(start, end),
  first = ($, n) => slice($, 0, n), last = ($, n) => slice($, -n),
  // TODO: move `sleep,interval` to utils/std/
  sleep = (ms) => promise(resolve => setTimeout(resolve), ms),
  interval = (ms, executor = (resolve) => resolve()) => promise(
    (resolve, reject) => setInterval(() => executor(resolve, reject), ms)),
  length = "length", enumerable = "enumerable", configurable = "configurable"

export default (size, label) => {
  const isSealed = isNonZero(size), isFIFO = !isNegative(size),
    buffer = isSealed ? seal([...A(abs(size))]) : [],
    occupied = () => isSealed ? size : buffer[length],
    set = (value) => isSealed ? buffer[size++] = value : push(buffer, value),
    get = (resolv) => (isFunction(resolv) ? resolv : identity)(isSealed
      ? buffer[isFIFO ? --size : buffer[length] - size--]
      : (isFIFO ? shift : pop)())

  size = 0
  return defineProperties({
    *[iterator]() { yield* (isSealed ? (isFIFO ? first : last)(buffer, size) : buffer) },
    async *[asyncIterator]() { while (occupied()) yield await resolve(this) },
    async ms(t) {
      await interval(t, (resolv) => occupied() || resolv())
      return promise(get)
    },
    async then(resolv = identity) {
      while (!occupied()) await resolve() // block until channel receive value via `set`
      return get(resolv)
    }, set
  }, {
    let: { set, get: () => buffer.at(-1), [enumerable]: true, [configurable]: true },
    [length]: { get: occupied }
  })
};
