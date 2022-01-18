const W3C = "http://www.w3.org/";
export const HTML = `${W3C}1999/xhtml`, SVG = `${W3C}2000/svg`;

/*@internal*/ export const URI = { html: HTML, svg: SVG };

/*@internal*/ export const filterDefined = (children) =>
  children.filter((child) => child !== undefined);

/*@internal*/ export const hasNamespace = (element) =>
  element.includes(":") || element in URI;

// export const hasNamespaces = (element, ...namespaces) =>
//   namespaces.some((namespace) => element.startsWith(`${namespace}:`));

// export const hasDefaultNamespace = (element) =>
//   hasNamespaces(element, "html", "svg");

/*@internal*/ export const effectAttr = (element, name) =>
  (value) => element.setAttribute(name, value);

/*@internal*/ export const bind = (element, props) => {
  for (const [name, value] of props) {
    value !== undefined && (
      name.startsWith("on")
        ? element[name] = value
        : (value.effect?.add(effectAttr(element, name)),
          element.setAttribute(name, value))
    );
  }
};

/*@internal*/ export const bindElementNS = (namespaceURI, element, props) => (
  element = document.createElementNS(namespaceURI, element),
    bind(element, props),
    element
);
