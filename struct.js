import Orb from "./object.js";
const O = Object, map = (o, cb) => O.fromEntries(O.entries(o).map(cb));

export default function (struct, depth = 1) {
  const transform = (level) =>
    ([key, value]) => [
      key,
      typeof value == "object" && level < depth
        ? map(value, transform(++level))
        : value[Symbol.iterator] || typeof value == "function"
        ? value
        : Orb.call(this, value),
    ];
  return map(struct, transform(1));
}
