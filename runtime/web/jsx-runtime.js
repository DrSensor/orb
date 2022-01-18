import "./syntax.js";
import pipeline, { AUTOMATIC, TOPLEVEL } from "../core/jsx/pipeline.js";
import defaultLazyCreatePipeline from "./pipeline/lazy-create.js";

export const jsxs = pipeline(TOPLEVEL, defaultLazyCreatePipeline);

export const jsx = pipeline(AUTOMATIC, defaultLazyCreatePipeline);
