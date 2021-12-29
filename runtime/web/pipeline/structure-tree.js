import { bindElementNS, hasNamespace } from "./_internal.js";
import * as create from "./create-element.js";

export const build = (element, props, children) =>
  !hasNamespace(element) && [
    element,
    children,
    ...props.reduce((partition, prop) => (
      partition[+(typeof prop == "function")].push(prop), partition
    ), [[], []]),
  ];

// TODO: add high-order-function to override dynamicProps binding for used in consumer worker
const attach = (element, children) => {
  for (let child of children) {
    if (Array.isArray(child)) {
      const [tag, children, staticProps, dynamicProps] = child;
      attach(
        child = bindElementNS(
          element.namespaceURI,
          tag,
          staticProps.concat(dynamicProps),
        ),
        children,
      );
    }
    element.append(child);
  }
};

export const createOnNamespace = create.ifHasNamespace(attach);

export const createOnElement = create.ifElement(attach);

export const createOnDocumentFragment = create.ifDocumentFragment(attach);
