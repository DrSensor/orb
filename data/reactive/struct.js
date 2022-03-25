import Orb, { sequential } from "./reactive.js";
import {
  defineProperties,
  isFunction,
  isObject,
  iterator,
  O,
} from "./_internal.js";

export default function (struct, { depth = 1, mode = sequential, ...p } = {}) {
  if (!mode[iterator]) mode = [mode, mode];
  const transform = (struct, result = final, level = 1) => {
      const orb = {}, desc = {};
      for (const key in struct) {
        const value = struct[key],
          get = () => orb[key] ??= Orb.call(this, value, ...mode),
          isObject$ = isObject(value),
          isIterable$ = isObject$ && iterator in value;

        !isIterable$ && level < depth
          ? transform(value, result[key] = {}, ++level)
          : isObject$ || isIterable$ || isFunction(value)
          ? result[key] = value
          : desc[key] = { get, set: (value) => get().set(value), ...p };
      }
      defineProperties(result, desc);
    },
    final = {};
  return transform(struct), final;
}

// TODO: export reactiveSetter = () => {} as struct mode
