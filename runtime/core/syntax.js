import Orb from "../../data/reactive/reactive.js";
import override from "../../data/reactive/utils/override.js";
import { enableCascading } from "../../data/reactive/utils.js";

[Number, String, BigInt].forEach(({ prototype: $ }) =>
  enableCascading($, (self) => override(Orb(self), { configurable: false }))
);
