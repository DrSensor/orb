import {
  $data,
  defineProperties,
  isFunction,
  isObject,
  toPrimitive,
} from "./_internal.js";

export default (self) => {
  const isFn = isFunction(self),
    orb = isObject(self) || isFn ? self : {},
    get = () => orb[$data],
    set = (value) => orb[$data] = value;

  if (!isFn) orb[$data] = self;

  return defineProperties(orb, {
    let: { set, get },
    set: { value: set },
    [toPrimitive]: { value: get },
  });
};

export * from "./utils.js";
export const setInitialValue = (orb, value) =>
  defineProperties(orb, { initial: { value } });
