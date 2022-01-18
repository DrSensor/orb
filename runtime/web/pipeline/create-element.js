import {
  bind,
  bindElementNS,
  filterDefined,
  hasNamespace,
} from "./_internal.js";

const W3C = "http://www.w3.org/";
export const HTML = `${W3C}1999/xhtml`, SVG = `${W3C}2000/svg`;
const URI = { html: HTML, svg: SVG };

export const ifHasNamespace = (handleChildren) =>
  (element, props, children) =>
    hasNamespace(element) &&
    (([namespace, element]) => (
      element = bindElementNS(URI[namespace], element ?? namespace, props),
        handleChildren(element, filterDefined(children)),
        element
    ))(element.split(":"));

// condition: [Element, DocumentFragment, Document].some(it => element instanceof it) <|or|> (t => t(Element) || t(DocumentFragment) || t(Document))(Type => element instanceof Type)
export const ifInstance = (handleChildren) =>
  (element, props, children) =>
    element instanceof Node &&
    (() => (bind(element, props.filter(([name]) => !name.startsWith("$:"))),
      handleChildren(
        element,
        filterDefined(children),
        getBuiltinsDirectives(props, element),
      ),
      element))();

// same behaviour as create.ifHasNamespace which *always* do .append operation but still require namespace props (e.g <DocumentFragment html>)
// condition: [DocumentFragment, Document].some(it => element instanceof it) <|or|> (t => t(DocumentFragment) || t(Document))(Type => element instanceof Type) <|or|> element === DocumentFragment || element === Document
export const ifConstructor = (handleChildren) =>
  (element, props, children) =>
    element.prototype instanceof Node &&
    (() => (element = new element(),
      handleChildren(element, filterDefined(children), URI[props[0]?.[0]]),
      element))();

// NOTE: attaching children of Element instance should be implmented by handleChildren, not in this file
// this is to preserve the children order

/** Handle built-ins props like $:append, $:prepend, $:replaceChildren */
const getBuiltinsDirectives = (props, element) =>
  props.flatMap(([name]) =>
    typeof element[name = name.split("$:")[1]] == "function" ? [name] : []
  );
