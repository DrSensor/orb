const at = (n) => (t) => t[n];

const hasNamespace = (element, ...namespaces) =>
  namespaces.some((namespace) => element.startsWith(`${namespace}:`));

let id = 0n;
export const build = (
  element,
  props, // props always be entries of [string, obj][], not Object literal
  children,
) =>
  !hasNamespace(element, "html", "svg") && [
    [id].concat(children.map(at(0))),

    `<${element} _="${id++}" ${
      props.map(([attr, value]) => `${attr}="${value}"`)
    }>` + children.map(at(1)).join("") + `</${element}>`,

    [props.filter(([, value]) => typeof value == "function")] // only pass reactive props or event handler
      .concat(children.map(at(2))), // 👆 orb passed to JSX props is always a function (to support "cascading transformed orb" syntax)
  ];

const W3C = "http://www.w3.org/",
  HTML = `${W3C}1999/xhtml`,
  SVG = `${W3C}2000/svg`;

const URI = { html: HTML, svg: SVG };
export const render = (element, props, children) =>
  hasNamespace(element, "html", "svg") && (([namespace, element]) => {
    element = document.createElementNS(URI[namespace], element);

    for (const [name, value] of props) {
      name.startsWith("on")
        ? element[name] = value
        : (value.effect?.add(effectAttr(element, name)),
          element.setAttribute(name, value));
    }

    for (let [prop, template, orbs] of children) {
      element.innerHTML = template;
      for (
        let [i, child] of element.querySelectorAll(
          prop
            .reduce((result, id) => `${result}[_="${id}"],`, "")
            .slice(0, -1),
        ).entries()
      ) {
        [prop, i] = orbs[i];
        i.effect?.add(effectAttr(child, prop)) ?? (element[prop] = i); // bind orb or attach event handler
        child.removeAttribute("_");
      }
    }

    return element;
  })(element.split(":"));

const effectAttr = (element, name) =>
  (value) => element.setAttribute(name, value);
