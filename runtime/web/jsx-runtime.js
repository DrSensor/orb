import "./syntax.js";
import pipeline, { AUTOMATIC, TOPLEVEL } from "../core/jsx/pipeline.js";
import * as lazy from "./pipeline/lazy-create.js";

const sequence = [
  lazy.build,
  lazy.createOnNamespace,
  lazy.createOnDocumentFragment,
  lazy.createOnElement,
];

export const jsxs = pipeline(TOPLEVEL, ...sequence);

export const jsx = pipeline(AUTOMATIC, ...sequence);
