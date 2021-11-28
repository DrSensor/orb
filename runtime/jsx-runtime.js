/// A jsx-runtime baseline which instantiate any function component
import { create, pipeline } from "./jsx.js";
import * as mode from "./jsx.js";

export const jsxs = pipeline(mode.TOPLEVEL, create); // runtime: "automatic"

export const jsx = pipeline(mode.AUTOMATIC, create);
