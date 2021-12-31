import pipeline, { CLASSIC } from "../core/jsx/pipeline.js";
import * as lazy from "./pipeline/lazy-create.js";

export * from "../../data.js";
export const createElement = pipeline(
  CLASSIC,
  lazy.build,
  lazy.createOnNamespace,
  lazy.createOnDocumentFragment,
  lazy.createOnElement,
);
