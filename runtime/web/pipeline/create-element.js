import { bindElementNS, hasNamespace } from "./_internal.js";

const W3C = "http://www.w3.org/";
export const HTML = `${W3C}1999/xhtml`, SVG = `${W3C}2000/svg`;

const URI = { html: HTML, svg: SVG };
export const ifHasNamespace = (handleChildren) =>
  (element, props, children) =>
    hasNamespace(element) && (([namespace, element]) => {
      element = bindElementNS(URI[namespace], element, props);
      handleChildren(element, children);
      return element;
    })(element.split(":"));
