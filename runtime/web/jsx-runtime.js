import "./syntax.js";
import pipeline, { AUTOMATIC, select, TOPLEVEL } from "../core/jsx/pipeline.js";
import defaultCorePipeline from "../core/pipeline/default.js";
import lazyCreatePipeline from "./pipeline/lazy-create.js";

const defaultPipeline = select(lazyCreatePipeline, defaultCorePipeline);

export const jsxs = pipeline(TOPLEVEL, defaultPipeline);

export const jsx = pipeline(AUTOMATIC, defaultPipeline);
