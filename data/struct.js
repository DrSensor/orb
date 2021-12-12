import Orb from "./primitive.js";
const O = Object, map = (o, to) => O.fromEntries(O.entries(o).map(to));

export default function (struct, depth = 1) {
  const transform = (level) =>
    ([key, value]) => [ // TODO: refactor into property descriptor { get: () => orb, set: orb.set }
      key,
      typeof value == "object" && level < depth
        ? map(value, transform(++level))
        : value[Symbol.iterator] || typeof value == "function"
        ? value
        : Orb.call(this, value),
    ];
  return map(struct, transform(1));
}
