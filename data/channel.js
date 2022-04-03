const O = Object, A = Array, M = Math, S = Symbol,
  { is, seal, defineProperties } = O, { sign, abs } = M, { asyncIterator } = S,
  type = ($) => typeof $, isFunction = ($) => type($) == "function", identity = ($) => $,
  isNonZero = ($) => $ && isFinite($), isNegative = ($) => sign($) == -1 || is($, -0),
  sleep = (ms) => new Promise(resolve => setTimeout(resolve), ms),
  push = ($, value) => $.push(value), pop = ($) => $.pop($), shift = ($) => $.shift(),
  length = "length";//, macrotask = setTimeout;

export default (size, label) => {
  const isSealed = isNonZero(size), isFIFO = !isNegative(size),
    buffer = isSealed ? seal([...A(abs(size))]) : [],
    occupied = () => isSealed ? size : buffer[length],
    set = (value) => isSealed ? buffer[size++] = value : push(buffer, value);

  size = 0;
  return defineProperties({
    async *[asyncIterator]() { while (occupied()) yield await this; },
    async then(resolve) {
      while (!occupied()) await (isFunction(resolve) || sleep(resolve)); // block until channel receive value via `set`
      return (isFunction(resolve) ? resolve : identity)(
        isSealed ? buffer[isFIFO ? --size : buffer[length] - size--] : (isFIFO ? shift : pop)()
      );
    }, set
  }, { let: { set }, [length]: { get: occupied } });
};
