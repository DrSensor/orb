import $data from "./utils.js";
export * from "./utils.js";

const { defineProperties } = Object, S = Symbol;

export default (self) => {
  const isFn = typeof self == "function";
  const orb = typeof self == "object" || isFn ? self : {};
  const get = () => orb[$data], set = (value) => orb[$data] = value;
  if (!isFn) orb[$data] = self;
  return defineProperties(orb, {
    let: { set, get },
    set: { value: set },
    [S.toPrimitive]: { value: get },
  });
};

export const setInitialValue = (orb, value) =>
  defineProperties(orb, { initial: { value } });