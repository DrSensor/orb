/// A jsx-runtime baseline which instantiate any function component
import pipeline, { CLASSIC } from "./pipeline.js";
import { create } from "../pipeline/default.js";

export const createElement = pipeline(CLASSIC, create);
