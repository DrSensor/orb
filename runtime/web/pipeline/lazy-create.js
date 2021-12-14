import { bindElementNS, hasNamespace } from "./_internal.js";
import * as create from "./create-element.js";

const attach = (element, attach, children, namespaceURI) =>
  element[attach](
    ...children.map((create) =>
      create?.(namespaceURI ?? element.namespaceURI) ?? create
    ),
  ); //👆 batched but doesn't work with decorator
// children.forEach((create) =>
//   element[attach](create?.(namespaceURI ?? element.namespaceURI) ?? create)
// );//👆 works with decorator but not batched

const append = (element, children) => attach(element, "append", children);

export { HTML, SVG } from "./create-element.js";

export const build = (element, props, children) =>
  !hasNamespace(element) &&
  ((namespaceURI) => (
    element = bindElementNS(namespaceURI, element, props),
      append(element, children),
      element
  ));

export const createOnNamespace = create.ifHasNamespace(append);

export const createOnElement = create.ifElement(
  (element, children, directives) =>
    directives.forEach((directive) => attach(element, directive, children)),
);

export const createOnDocumentFragment = create.ifDocumentFragment(
  (fragment, children, directives, namespaceURIs) =>
    namespaceURIs.forEach((namespaceURI) =>
      directives.forEach((directive) =>
        attach(fragment, directive, children, namespaceURI)
      )
    ),
);
