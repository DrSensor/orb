import pipeline, { CLASSIC, select } from "../core/jsx/pipeline.js";
import defaultCorePipeline from "../core/pipeline/default.js";
import lazyCreatePipeline from "./pipeline/lazy-create.js";

export * from "../../data.js";
export const createElement = pipeline(
  CLASSIC,
  select(lazyCreatePipeline, defaultCorePipeline),
);
