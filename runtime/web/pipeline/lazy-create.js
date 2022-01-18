import { bindElementNS, hasNamespace } from "./_internal.js";
import * as create from "./create-element.js";

const attach = (
  element,
  attach,
  children,
  namespaceURI = element.namespaceURI,
) => (
  element[attach](
    ...children.map((create) =>
      typeof create == "function" ? create(namespaceURI) : create
    ),
  ), //👆 batched but doesn't work with decorator
    // children.forEach((create) =>
    //   element[attach](typeof create == "function" ? create(namespaceURI) : create)
    // ), //👆 works with decorator but not batched
    children.forEach(({ flush }) => flush?.())
);

const append = (element, children, namespaceURI = element.namespaceURI) =>
  attach(element, "append", children, namespaceURI);

export { HTML, SVG } from "./create-element.js";

export const build = (element, props, children) =>
  !hasNamespace(element) &&
  ((namespaceURI) => (
    element = bindElementNS(namespaceURI, element, props),
      append(element, children),
      element
  ));

export const createOnNamespace = create.ifHasNamespace(append);

export const createOnInstance = create.ifInstance(
  (element, children, directives) =>
    directives.forEach((directive) => attach(element, directive, children)),
);

export const createOnConstructor = create.ifConstructor(
  (fragment, children, namespaceURI) =>
    append(fragment, children, namespaceURI),
);

import { only } from "../../core/jsx/pipeline.js";
import callFunctionComponent from "../../core/pipeline/function.js";
export default [
  only(
    (element) => typeof element == "string",
    build,
    createOnNamespace,
  ),
  createOnConstructor,
  createOnInstance,
  callFunctionComponent,
];

/*
// example
<document.body $:append>
  {message}: <button>{count}</button>
</document.body>

<!--[description]
element = instanceof HTMLBodyElement
directives = ["append"]
children = vnodeof[HTMLButtonElement]
-->

// same as
let $0, $1;
document.body.append(
  ($0 = new Text(message),
   message.effect.add(value => $0.nodeValue = value),
  $0),
  ": ",
  (button = document.createElement("button"),
   button.append($1 = new Text(count)),
   count.effect.add(value => $1.nodeValue = value),
  button)
)
*/
