import Orb, { enableCascading, override } from "../data/primitive.js";

[Number, String, BigInt].forEach(({ prototype: $ }) =>
  enableCascading($, (self) => override(Orb(self), { configurable: false }))
);
