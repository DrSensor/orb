import Orb, { $data } from "../object.js";
const { defineProperty } = Object;

[Number, String, BigInt].forEach(({ prototype: $ }) =>
  defineProperty($, Symbol.iterator, {
    *value() {
      yield defineProperty(Orb(this), $data, { configurable: false });
    },
  })
);
