import { isFunction } from "./internal.js";

export const bindProperties = (orb, obj, ...props) =>
  orb.onchange((value) => props.forEach((prop) => obj[prop] = value));

const queue$ = [];

export const queue = (cb) =>
  isFunction(cb)
    ? function () {
      const defer = () => cb.apply(this, arguments);
      queue$.push(defer);
      return defer;
    }
    : cb;

export const flush = () => {
  while (queue$.length) queue$.pop()();
};
