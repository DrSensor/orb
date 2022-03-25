#!bundle $0 $(dirname $0)/html-runtime/expose/bind.js
import bind from "../../bind.js";
Object.defineProperty(window, "bind", { get: () => bind });
