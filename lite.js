import $data from "./utils.js";
export * from "./utils.js";

const { defineProperties } = Object, S = Symbol;

export default (self) => {
  const orb = {}, get = () => orb[$data], set = (value) => orb[$data] = value;

  orb[$data] = self;
  return defineProperties(orb, {
    value: { set, get },
    set: { value: set },
    [S.toPrimitive]: { value: get },
  });
};

export const setInitialValue = (orb, value) =>
  defineProperties(orb, { initial: { value } });
