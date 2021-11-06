import { isFunction } from "./internal.js";

export const bindProperties = (orb, obj, ...props) => {
  const effect = (value) => props.forEach((prop) => obj[prop] = value);
  orb.effect.add(effect);
  return effect;
};

export const unbind = (orb, ...effects) =>
  effects.every((effect) => orb.effect.delete(effect));

const queue$ = [];

export const queue = (cb) =>
  isFunction(cb)
    ? function () {
      const defer = () => cb.apply(this, arguments);
      queue$.unshift(defer);
      return defer;
    }
    : cb;

export const flush = () => {
  while (queue$.length) queue$.pop()();
};
