const O = Object, A = Array, M = Math, S = Symbol,
  { is, seal, defineProperties } = O, { sign, abs } = M, { asyncIterator } = S,
  type = ($) => typeof $, isFunction = ($) => type($) == "function", identity = ($) => $,
  isNonZero = ($) => $ && isFinite($), isNegative = ($) => sign($) == -1 || is($, -0),
  sleep = (ms) => new Promise(resolve => setTimeout(resolve), ms),
  push = ($, value) => $.push(value), pop = ($) => $.pop($), shift = ($) => $.shift(),
  length = "length";//, macrotask = setTimeout;

export default (buffer, label) => {
  const isSealed = isNonZero(buffer), isFIFO = !isNegative(buffer),
    occupied = () => isSealed ? index : buffer[length],
    set = (value) => isSealed ? buffer[index++] = value : push(buffer, value);

  buffer = isSealed ? seal([...A(abs(buffer))]) : []; // WARNING: error early on send instead error on recv since it's sealed
  let index = 0;

  return defineProperties({
    async *[asyncIterator]() { while (occupied()) yield await this; },
    async then(resolve) {
      while (!occupied()) await (isFunction(resolve) || sleep(resolve)); // block until channel receive value via `set`
      return (isFunction(resolve) ? resolve : identity)(
        isSealed ? buffer[isFIFO ? --index : buffer[length] - index--] : (isFIFO ? shift : pop)()
      );
    }, set
  }, { let: { set }, [length]: { get: occupied } });
};
