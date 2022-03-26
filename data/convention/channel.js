const O = Object, A = Array, go = queueMicrotask,
  { seal, defineProperties } = O,
  push = ($, value) => $.push(value), pop = ($) => $.pop($),
  shift = ($) => $.shift(), unshift = ($, value) => $.unshift(value);

export default (buffer, label) => {
  let isSealed = !!buffer, isFastSend = buffer > 0, index = 0,
    set = (value) => isSealed ? buffer[index++] = value
      : (isFastSend ? push : unshift)(buffer, value);

  buffer = buffer ? seal([...A(buffer)]) : []; // WARNING: error early on send instead of recv since it's sealed

  return defineProperties({
    then: (resolve) => go(() => resolve(
      isSealed ? buffer[index--] : (isFastSend ? shift : pop)()
    )), set
  }, { let: { set } });
};
