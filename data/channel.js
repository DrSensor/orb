const O = Object, A = Array, M = Math,
  { is, seal, defineProperties } = O, { sign, abs } = M,
  isNonZero = ($) => $ && isFinite($), isNegative = ($) => sign($) == -1 || is($, -0),
  push = ($, value) => $.push(value), pop = ($) => $.pop($),
  shift = ($) => $.shift(), unshift = ($, value) => $.unshift(value),
  length = "length", microtask = queueMicrotask;//, macrotask = setTimeout;

export default (buffer, label) => {
  const isSealed = isNonZero(buffer), isFIFO = !isNegative(buffer),
    occupied = () => isSealed ? index : buffer[length],
    set = (value) => isSealed ? buffer[index++] = value : push(buffer, value);

  buffer = isSealed ? seal([...A(abs(buffer))]) : []; // WARNING: error early on send instead error on recv since it's sealed
  let index = 0;

  return defineProperties({
    async *[Symbol.asyncIterator]() { while (occupied()) yield await this; },
    then(resolve) {
      microtask(() => {
        while (!occupied()); // block until channel receive value via `set`
        resolve(isSealed ? buffer[isFIFO ? --index : buffer[length] - index--] : (isFIFO ? shift : pop)());
      });
    }, set
  }, { let: { set }, [length]: { get: occupied } });
};
