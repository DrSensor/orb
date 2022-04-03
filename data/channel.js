const O = Object, A = Array, M = Math,
  { is, seal, defineProperties } = O, { sign, abs } = M,
  isNonZero = ($) => $ && isFinite($), isNegative = ($) => sign($) == -1 || is($, -0),
  push = ($, value) => $.push(value), pop = ($) => $.pop($),
  shift = ($) => $.shift(), unshift = ($, value) => $.unshift(value),
  length = "length", microtask = queueMicrotask;//, macrotask = setTimeout;

export default (buffer, label) => {
  let isSealed = isNonZero(buffer), index = isSealed - 1,
    isFIFO = !isNegative(buffer),
    set = (value) => isSealed ?
      buffer[index++] = value : push(buffer, value);

  buffer = isSealed ? seal([...A(abs(buffer))]) : []; // WARNING: error early on send instead error on recv since it's sealed

  return defineProperties({
    then: (resolve) => microtask(() => {
      while (!index || !buffer[length]); // block until channel receive value via `set`
      resolve(isSealed ? buffer[isFIFO ? --index : buffer[length] - index--] : (isFIFO ? shift : pop)());
    }), set
  }, { let: { set } });
};
