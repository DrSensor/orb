/// A jsx-runtime baseline which instantiate any function component
import pipeline, { AUTOMATIC } from "./pipeline.js";
import call from "../pipeline/function.js";

export const jsxs = pipeline(AUTOMATIC + 1, call); // toplevel jsx

export const jsx = pipeline(AUTOMATIC, call);
