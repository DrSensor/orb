import { bind, bindElementNS, hasNamespace } from "./_internal.js";

const W3C = "http://www.w3.org/";
export const HTML = `${W3C}1999/xhtml`, SVG = `${W3C}2000/svg`;
const URI = { html: HTML, svg: SVG };

export const ifHasNamespace = (handleChildren) =>
  (element, props, children) =>
    hasNamespace(element) &&
    (([namespace, element]) => (
      element = bindElementNS(URI[namespace], element, props),
        handleChildren(element, children),
        element
    ))(element.split(":"));

// TODO:refactor(rename to .ifInstance): [Element, DocumentFragment, Document].some(ctor => element instanceof ctor)
export const ifElement = (handleChildren) =>
  (element, props, children) =>
    element instanceof Element &&
    (() => (bind(element, props.filter(([name]) => !name.startsWith("$:"))),
      handleChildren(element, children, getBuiltinsDirectives(props, element)),
      element))();

// TODO:refactor(rename to .ifConstructor which works on both DocumentFragment and Document): same behaviour as create.ifHasNamespace which *always* do .append operation
export const ifDocumentFragment = (handleChildren) =>
  (element, props, children) =>
    element === DocumentFragment &&
    (() => (element = new element(),
      handleChildren(
        element,
        children,
        getBuiltinsDirectives(props, element),
        props.flatMap(([name]) => name.startsWith("$:") ? [] : [URI[name]]),
      ),
      element))();

// NOTE: attaching children of Element instance should be implmented by handleChildren, not in this file
// this is to preserve the children order

/** Handle built-ins props like $:append, $:prepend, $:replaceChildren */
const getBuiltinsDirectives = (props, element) =>
  props.flatMap(([name]) =>
    typeof element[name = name.split("$:")[1]] == "function" ? [name] : []
  );
