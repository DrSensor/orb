export const hasNamespace = (element) => element.includes(":");

// export const hasNamespaces = (element, ...namespaces) =>
//   namespaces.some((namespace) => element.startsWith(`${namespace}:`));

// export const hasDefaultNamespace = (element) =>
//   hasNamespaces(element, "html", "svg");

export const effectAttr = (element, name) =>
  (value) => element.setAttribute(name, value);

export const bindElementNS = (namespaceURI, element, props) => {
  element = document.createElementNS(namespaceURI, element);

  for (const [name, value] of props) {
    name.startsWith("on")
      ? element[name] = value
      : (value.effect?.add(effectAttr(element, name)),
        element.setAttribute(name, value));
  }

  return element;
};
