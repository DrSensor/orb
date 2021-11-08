import orb from "../factory.js";

[Boolean, Number, String, BigInt].forEach(({ prototype: $ }) =>
  Object.defineProperty($, Symbol.iterator, {
    *value() {
      yield orb(this);
    },
  })
);
