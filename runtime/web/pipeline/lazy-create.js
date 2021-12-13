import { bindElementNS, hasNamespace } from "./_internal.js";
import { ifHasNamespace } from "./create-element.js";

const attachChildren = (element, children) =>
  element.append(...children.map((create) => create(element.namespaceURI)));

export { HTML, SVG } from "./create-element.js";
export const build = (
  element,
  props, // props always be entries of [string, obj][], not Object literal
  children,
) =>
  !hasNamespace(element) && ((namespaceURI) => {
    element = bindElementNS(namespaceURI, element, props);
    attachChildren(element, children);
    return element;
  });

export const create = ifHasNamespace(attachChildren);
