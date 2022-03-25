#!bundle $0 $(dirname $0)/html-runtime/expose/render.js
import render from "../../render.js";
Object.defineProperty(window, "render", { get: () => render });
