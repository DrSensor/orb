export { plugin } from "./jsx.js";
import orb from "orb.value";

[Number, String, BigInt].forEach(({ prototype: $ }) =>
  Object.defineProperty($, Symbol.iterator, {
    *value() {
      yield orb(this);
    },
  })
);
