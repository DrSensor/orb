/// A jsx-runtime baseline which instantiate any function component
import pipeline, { AUTOMATIC } from "./pipeline.js";
import { create } from "../pipeline/default.js";

export const jsxs = pipeline(AUTOMATIC + 1, create); // toplevel jsx

export const jsx = pipeline(AUTOMATIC, create);
