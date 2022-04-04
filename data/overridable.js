import {
  $data,
  defineProperties,
  isFunction,
  isObject,
  toPrimitive,
} from "./_internal.js";

export default (self) => {
  const isFn = isFunction(self),
    orb = isFn || isObject(self) ? self : {},
    get = () => orb[$data],
    set = (value) => orb[$data] = value;

  if (!isFn) orb[$data] = self;

  return defineProperties(orb, {
    let: { set, get },
    set: { value: set },
    [toPrimitive]: { value: get },
  });
};

export { default as override } from "./utils/override.js";

export const setInitialValue = (orb, value) =>
  defineProperties(orb, { initial: { value } });

export const enableStoringEffect = (
  orb,
  SetLike,
  set = (effect) => SetLike.add(effect),
) => defineProperties(orb, { effect: { get: () => SetLike, set } });
