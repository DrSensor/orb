import { effectAttr, hasNamespace } from "./_internal.js";
import * as create from "./create-element.js";

const at = (n) => (t) => t[n];

let id = 0n;
export const build = (element, props, children) =>
  !hasNamespace(element) && [
    [id].concat(children.map(at(0))),

    `<${element} _="${id++}" ${
      props.map(([attr, value]) => `${attr}="${value}"`)
    }>` + children.map(at(1)).join("") + `</${element}>`,

    [props.filter(([, value]) => typeof value == "function")] // only pass reactive props and event handler
      .concat(children.map(at(2))), // 👆 orb passed to JSX props is always a function (to support "cascading transformed orb" syntax)
  ];

const attach = (element, children) => {
  for (const child of children) {
    if (Array.isArray(child)) {
      let [prop, template, orbs] = child;
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
    } else element.append(child);
  }
};

export const createOnNamespace = create.ifHasNamespace(attach);

export const createOnElement = create.ifElement(attach);

export const createOnDocumentFragment = create.ifDocumentFragment(attach);
