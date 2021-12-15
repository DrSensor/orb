import Orb from "../data/reactive.js";
import { enableCascading, override } from "../data/utils.js";

[Number, String, BigInt].forEach(({ prototype: $ }) =>
  enableCascading($, (self) => override(Orb(self), { configurable: false }))
);
