import orb from "../factory.js";

[Number, String, BigInt].forEach(({ prototype: $ }) =>
  Object.defineProperty($, Symbol.iterator, {
    *value() {
      yield orb(this);
    },
  })
);
