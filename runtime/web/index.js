import pipeline, { CLASSIC } from "../core/jsx/pipeline.js";
import defaultLazyCreatePipeline from "./pipeline/lazy-create.js";

export * from "../../data.js";
export const createElement = pipeline(CLASSIC, ...defaultLazyCreatePipeline);
