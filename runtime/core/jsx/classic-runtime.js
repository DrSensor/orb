/// A jsx-runtime baseline which instantiate any function component
import pipeline, { CLASSIC } from "./pipeline.js";
import call from "../pipeline/function.js";

export const createElement = pipeline(CLASSIC, call);
