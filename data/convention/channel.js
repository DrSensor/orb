const O = Object, A = Array,
  { seal, defineProperties } = O,
  push = ($, value) => $.push(value), pop = ($) => $.pop($),
  shift = ($) => $.shift(), unshift = ($, value) => $.unshift(value),
  microtask = queueMicrotask;//, macrotask = setTimeout;

export default (buffer, label) => {
  let isSealed = !!buffer, isFastSend = buffer > 0, index = 0,
    set = (value) => isSealed ? buffer[index++] = value
      : (isFastSend ? push : unshift)(buffer, value);

  buffer = buffer ? seal([...A(buffer)]) : []; // WARNING: error early on send instead error on recv since it's sealed

  return defineProperties({
    then: (resolve) => microtask(() => {
      while (index == 0); // block until channel receive value via `set`
      resolve(isSealed ? buffer[--index] : (isFastSend ? shift : pop)());
    }), set
  }, { let: { set } });
};
