import Orb from "../../data/reactive/reactive.js";
import { enableCascading, override } from "../../data/reactive/utils.js";

[Number, String, BigInt].forEach(({ prototype: $ }) =>
  enableCascading($, (self) => override(Orb(self), { configurable: false }))
);
