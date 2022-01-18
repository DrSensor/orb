import { chainIf, selectAfter } from "../jsx/pipeline.js";

import hook from "./runtime/hook.js";
import injectEffect from "./runtime/effect.js";

import FC from "./function.js"; // WARNING: must be put in the last sequence

export default chainIf(
  (element) => typeof element == "function",
  selectAfter(hook, FC), // <Component />
  injectEffect,
);
