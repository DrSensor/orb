import Orb from "./primitive.js";
import { isFunction, isObject, iterator, O } from "./_internal.js";
const map = ($, to) => O.fromEntries(O.entries($).map(to));

export default function (struct, depth = 1) {
  const transform = (level) =>
    ([key, value]) => [ // TODO: refactor into property descriptor { get: () => orb, set: orb.set }
      key,
      isObject(value) && level < depth
        ? map(value, transform(++level))
        : value[iterator] || isFunction(value)
        ? value
        : Orb.call(this, value),
    ];
  return map(struct, transform(1));
}
